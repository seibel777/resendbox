use std::{
    fs,
    path::{Path, PathBuf},
};

use tauri::{AppHandle, Manager};

use crate::models::{AppSettings, KeyPersistence, StoredSettings};

const SETTINGS_FILE: &str = "settings.json";

fn ensure_parent(path: &Path) -> Result<(), String> {
    match path.parent() {
        Some(parent) => fs::create_dir_all(parent).map_err(|error| error.to_string()),
        None => Ok(()),
    }
}

pub fn settings_path(app: &AppHandle) -> Result<PathBuf, String> {
    let mut path = app
        .path()
        .app_config_dir()
        .map_err(|error| format!("Could not resolve the app config directory: {error}"))?;

    path.push(SETTINGS_FILE);
    Ok(path)
}

pub fn load_stored_settings(app: &AppHandle) -> Result<StoredSettings, String> {
    let path = settings_path(app)?;

    if !path.exists() {
        return Ok(StoredSettings::default());
    }

    let contents = fs::read_to_string(path).map_err(|error| error.to_string())?;
    serde_json::from_str::<StoredSettings>(&contents).map_err(|error| error.to_string())
}

pub fn save_stored_settings(app: &AppHandle, settings: &StoredSettings) -> Result<(), String> {
    let path = settings_path(app)?;
    ensure_parent(&path)?;
    let contents = serde_json::to_string_pretty(settings).map_err(|error| error.to_string())?;
    fs::write(path, contents).map_err(|error| error.to_string())
}

pub fn delete_stored_settings(app: &AppHandle) -> Result<(), String> {
    let path = settings_path(app)?;

    if path.exists() {
        fs::remove_file(path).map_err(|error| error.to_string())?;
    }

    Ok(())
}

pub fn sanitize_option(value: Option<String>) -> Option<String> {
    value.and_then(|candidate| {
        let trimmed = candidate.trim();
        if trimmed.is_empty() {
            None
        } else {
            Some(trimmed.to_string())
        }
    })
}

pub fn mask_api_key(value: &str) -> String {
    if value.len() <= 8 {
        return "••••••••".to_string();
    }

    format!("{}••••{}", &value[..4], &value[value.len() - 4..])
}

pub fn to_public_settings(stored: &StoredSettings, effective_api_key: Option<&str>, persisted: bool) -> AppSettings {
    let has_api_key = effective_api_key.is_some();
    let key_persistence = if has_api_key {
        if persisted {
            KeyPersistence::Device
        } else {
            KeyPersistence::Session
        }
    } else {
        KeyPersistence::None
    };

    AppSettings {
        has_api_key,
        api_key_preview: effective_api_key.map(mask_api_key),
        key_persistence,
        remember_api_key: persisted,
        default_sender: stored.default_sender.clone(),
        theme: stored.theme.clone(),
        language: stored.language.clone(),
        notifications_enabled: stored.notifications_enabled,
    }
}
