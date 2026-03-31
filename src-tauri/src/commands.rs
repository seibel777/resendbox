use std::sync::Mutex;

use tauri::{AppHandle, State};

use crate::{
    models::{
        AppSettings, ComposeEmailPayload, ConnectionState, ConnectionStatus, SaveApiKeyPayload, SendEmailResult,
        ReceivedEmail, ReceivedEmailDetail, SentEmail, SentEmailDetail, StoredSettings,
        UpdatePreferencesPayload,
    },
    resend::{self, ResendClientError},
    storage,
};

#[derive(Default)]
pub struct SessionState {
    pub api_key: Mutex<Option<String>>,
}

fn session_api_key(state: &State<'_, SessionState>) -> Result<Option<String>, String> {
    state
        .api_key
        .lock()
        .map_err(|_| "Could not access the session state.".to_string())
        .map(|value| value.clone())
}

fn set_session_api_key(state: &State<'_, SessionState>, next: Option<String>) -> Result<(), String> {
    let mut guard = state
        .api_key
        .lock()
        .map_err(|_| "Could not access the session state.".to_string())?;

    *guard = next;
    Ok(())
}

fn resolved_api_key(app: &AppHandle, state: &State<'_, SessionState>) -> Result<Option<String>, String> {
    if let Some(session_key) = session_api_key(state)? {
        return Ok(Some(session_key));
    }

    let stored = storage::load_stored_settings(app)?;
    Ok(stored.api_key)
}

fn public_settings(_app: &AppHandle, state: &State<'_, SessionState>, stored: &StoredSettings) -> Result<AppSettings, String> {
    let session_key = session_api_key(state)?;
    let persisted_key = stored.api_key.as_deref();
    let effective = session_key.as_deref().or(persisted_key);

    Ok(storage::to_public_settings(stored, effective, persisted_key.is_some()))
}

fn require_api_key(app: &AppHandle, state: &State<'_, SessionState>) -> Result<String, String> {
    resolved_api_key(app, state)?.ok_or_else(|| "Add a Resend API key before continuing.".to_string())
}

#[tauri::command]
pub fn load_settings(app: AppHandle, state: State<'_, SessionState>) -> Result<AppSettings, String> {
    let stored = storage::load_stored_settings(&app)?;
    public_settings(&app, &state, &stored)
}

#[tauri::command]
pub fn save_api_key(
    payload: SaveApiKeyPayload,
    app: AppHandle,
    state: State<'_, SessionState>,
) -> Result<AppSettings, String> {
    let trimmed = payload.api_key.trim().to_string();

    if trimmed.is_empty() {
        return Err("The API key cannot be empty.".to_string());
    }

    let mut stored = storage::load_stored_settings(&app)?;
    stored.remember_api_key = payload.remember;
    stored.api_key = if payload.remember { Some(trimmed.clone()) } else { None };

    storage::save_stored_settings(&app, &stored)?;
    set_session_api_key(&state, Some(trimmed))?;

    public_settings(&app, &state, &stored)
}

#[tauri::command]
pub fn update_preferences(
    payload: UpdatePreferencesPayload,
    app: AppHandle,
    state: State<'_, SessionState>,
) -> Result<AppSettings, String> {
    let mut stored = storage::load_stored_settings(&app)?;

    if let Some(default_sender) = payload.default_sender {
        stored.default_sender = storage::sanitize_option(Some(default_sender));
    }

    if let Some(theme) = payload.theme {
        stored.theme = theme;
    }

    if let Some(language) = payload.language {
        stored.language = language;
    }

    if let Some(notifications_enabled) = payload.notifications_enabled {
        stored.notifications_enabled = notifications_enabled;
    }

    storage::save_stored_settings(&app, &stored)?;
    public_settings(&app, &state, &stored)
}

#[tauri::command]
pub fn remove_api_key(app: AppHandle, state: State<'_, SessionState>) -> Result<AppSettings, String> {
    let mut stored = storage::load_stored_settings(&app)?;
    stored.api_key = None;
    stored.remember_api_key = false;

    storage::save_stored_settings(&app, &stored)?;
    set_session_api_key(&state, None)?;

    public_settings(&app, &state, &stored)
}

#[tauri::command]
pub fn clear_local_data(app: AppHandle, state: State<'_, SessionState>) -> Result<AppSettings, String> {
    storage::delete_stored_settings(&app)?;
    set_session_api_key(&state, None)?;

    Ok(storage::to_public_settings(
        &StoredSettings::default(),
        None,
        false,
    ))
}

#[tauri::command]
pub async fn verify_connection(app: AppHandle, state: State<'_, SessionState>) -> Result<ConnectionStatus, String> {
    let Some(api_key) = resolved_api_key(&app, &state)? else {
        return Ok(ConnectionStatus {
            state: ConnectionState::MissingKey,
            message: "Add your Resend API key to connect.".to_string(),
        });
    };

    match resend::list_sent_emails(&api_key, 1).await {
        Ok(_) => Ok(ConnectionStatus {
            state: ConnectionState::Connected,
            message: "Connected to the Resend API.".to_string(),
        }),
        Err(ResendClientError::Unauthorized { message }) => Ok(ConnectionStatus {
            state: ConnectionState::Unauthorized,
            message,
        }),
        Err(ResendClientError::Request { message }) | Err(ResendClientError::Response { message }) => {
            Ok(ConnectionStatus {
                state: ConnectionState::Offline,
                message,
            })
        }
    }
}

#[tauri::command]
pub async fn list_sent_emails(
    limit: Option<u16>,
    app: AppHandle,
    state: State<'_, SessionState>,
) -> Result<Vec<SentEmail>, String> {
    let api_key = require_api_key(&app, &state)?;
    resend::list_sent_emails(&api_key, limit.unwrap_or(20))
        .await
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub async fn get_sent_email(
    email_id: String,
    app: AppHandle,
    state: State<'_, SessionState>,
) -> Result<SentEmailDetail, String> {
    let api_key = require_api_key(&app, &state)?;
    resend::get_sent_email(&api_key, &email_id)
        .await
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub async fn list_received_emails(
    limit: Option<u16>,
    app: AppHandle,
    state: State<'_, SessionState>,
) -> Result<Vec<ReceivedEmail>, String> {
    let api_key = require_api_key(&app, &state)?;
    resend::list_received_emails(&api_key, limit.unwrap_or(20))
        .await
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub async fn get_received_email(
    email_id: String,
    app: AppHandle,
    state: State<'_, SessionState>,
) -> Result<ReceivedEmailDetail, String> {
    let api_key = require_api_key(&app, &state)?;
    resend::get_received_email(&api_key, &email_id)
        .await
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub async fn send_email(
    payload: ComposeEmailPayload,
    app: AppHandle,
    state: State<'_, SessionState>,
) -> Result<SendEmailResult, String> {
    let api_key = require_api_key(&app, &state)?;

    if payload.from.trim().is_empty()
        || payload.to.trim().is_empty()
        || payload.subject.trim().is_empty()
        || payload.text.trim().is_empty()
    {
        return Err("All email fields are required.".to_string());
    }

    resend::send_email(&api_key, &payload)
        .await
        .map_err(|error| error.to_string())
}
