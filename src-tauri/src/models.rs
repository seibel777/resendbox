use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum ThemeMode {
    Light,
    Dark,
}

impl Default for ThemeMode {
    fn default() -> Self {
        Self::Dark
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum LanguageCode {
    En,
    Pt,
    Es,
}

impl Default for LanguageCode {
    fn default() -> Self {
        Self::En
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum KeyPersistence {
    Device,
    Session,
    None,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum ConnectionState {
    Connected,
    Unauthorized,
    MissingKey,
    Offline,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppSettings {
    pub has_api_key: bool,
    pub api_key_preview: Option<String>,
    pub key_persistence: KeyPersistence,
    pub remember_api_key: bool,
    pub default_sender: Option<String>,
    pub theme: ThemeMode,
    pub language: LanguageCode,
    pub notifications_enabled: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct StoredSettings {
    pub api_key: Option<String>,
    pub remember_api_key: bool,
    pub default_sender: Option<String>,
    pub theme: ThemeMode,
    pub language: LanguageCode,
    pub notifications_enabled: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SaveApiKeyPayload {
    pub api_key: String,
    pub remember: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct UpdatePreferencesPayload {
    pub default_sender: Option<String>,
    pub theme: Option<ThemeMode>,
    pub language: Option<LanguageCode>,
    pub notifications_enabled: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ComposeEmailPayload {
    pub from: String,
    pub to: String,
    pub subject: String,
    pub text: String,
    #[serde(default)]
    pub attachments: Vec<ComposeAttachment>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ComposeAttachment {
    pub filename: String,
    pub content: String,
    pub content_type: String,
    pub size: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SendEmailResult {
    pub id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EmailAttachment {
    pub id: String,
    pub filename: String,
    pub content_type: String,
    pub content_disposition: Option<String>,
    pub content_id: Option<String>,
    pub size: Option<usize>,
    pub download_url: Option<String>,
    pub expires_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SentEmail {
    pub id: String,
    pub subject: String,
    pub to: Vec<String>,
    pub from: String,
    pub created_at: String,
    pub status: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SentEmailDetail {
    pub id: String,
    pub subject: String,
    pub to: Vec<String>,
    pub from: String,
    pub created_at: String,
    pub status: String,
    pub html: Option<String>,
    pub text: Option<String>,
    pub cc: Vec<String>,
    pub bcc: Vec<String>,
    pub reply_to: Vec<String>,
    pub scheduled_at: Option<String>,
    pub attachments: Vec<EmailAttachment>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReceivedEmail {
    pub id: String,
    pub subject: String,
    pub to: Vec<String>,
    pub from: String,
    pub created_at: String,
    pub message_id: Option<String>,
    pub attachments_count: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReceivedEmailAttachment {
    pub id: String,
    pub filename: String,
    pub content_type: String,
    pub content_disposition: Option<String>,
    pub content_id: Option<String>,
    pub size: Option<usize>,
    pub download_url: Option<String>,
    pub expires_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RawEmailDownload {
    pub download_url: String,
    pub expires_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReceivedEmailDetail {
    pub id: String,
    pub subject: String,
    pub to: Vec<String>,
    pub from: String,
    pub created_at: String,
    pub message_id: Option<String>,
    pub attachments_count: usize,
    pub attachments: Vec<ReceivedEmailAttachment>,
    pub html: Option<String>,
    pub text: Option<String>,
    pub headers: HashMap<String, String>,
    pub cc: Vec<String>,
    pub bcc: Vec<String>,
    pub reply_to: Vec<String>,
    pub raw: Option<RawEmailDownload>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConnectionStatus {
    pub state: ConnectionState,
    pub message: String,
}
