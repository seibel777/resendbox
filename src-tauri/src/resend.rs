use std::collections::HashMap;

use reqwest::{Client, StatusCode};
use serde::Deserialize;
use serde_json::json;
use thiserror::Error;

use crate::models::{
    ComposeEmailPayload, EmailAttachment, RawEmailDownload, ReceivedEmail, ReceivedEmailAttachment,
    ReceivedEmailDetail, SendEmailResult, SentEmail, SentEmailDetail,
};

const RESEND_API_BASE_URL: &str = "https://api.resend.com";

#[derive(Debug, Error)]
pub enum ResendClientError {
    #[error("{message}")]
    Unauthorized { message: String },
    #[error("{message}")]
    Request { message: String },
    #[error("{message}")]
    Response { message: String },
}

#[derive(Debug, Deserialize)]
struct ApiListResponse<T> {
    data: Vec<T>,
}

#[derive(Debug, Deserialize)]
struct ResendEmailRecord {
    id: String,
    to: Vec<String>,
    from: String,
    created_at: String,
    subject: String,
    last_event: Option<String>,
}

#[derive(Debug, Deserialize)]
struct ResendSendResponse {
    id: String,
}

#[derive(Debug, Deserialize)]
struct ResendSentEmailDetailRecord {
    id: String,
    to: Vec<String>,
    from: String,
    created_at: String,
    subject: String,
    html: Option<String>,
    text: Option<String>,
    bcc: Option<Vec<String>>,
    cc: Option<Vec<String>>,
    reply_to: Option<Vec<String>>,
    last_event: Option<String>,
    scheduled_at: Option<String>,
}

#[derive(Debug, Deserialize)]
struct ResendReceivedEmailRecord {
    id: String,
    to: Vec<String>,
    from: String,
    created_at: String,
    subject: String,
    message_id: Option<String>,
    attachments: Option<Vec<ResendAttachment>>,
}

#[derive(Debug, Deserialize)]
struct ResendAttachment {
    id: String,
    filename: Option<String>,
    content_type: Option<String>,
    content_disposition: Option<String>,
    content_id: Option<String>,
    size: Option<usize>,
}

#[derive(Debug, Deserialize)]
struct ResendRawEmail {
    download_url: String,
    expires_at: String,
}

#[derive(Debug, Deserialize)]
struct ResendEmailAttachmentRecord {
    id: String,
    filename: Option<String>,
    size: Option<usize>,
    content_type: Option<String>,
    content_disposition: Option<String>,
    content_id: Option<String>,
    download_url: Option<String>,
    expires_at: Option<String>,
}

#[derive(Debug, Deserialize)]
struct ResendReceivedEmailDetailRecord {
    id: String,
    to: Vec<String>,
    from: String,
    created_at: String,
    subject: String,
    html: Option<String>,
    text: Option<String>,
    headers: Option<HashMap<String, String>>,
    bcc: Option<Vec<String>>,
    cc: Option<Vec<String>>,
    reply_to: Option<Vec<String>>,
    message_id: Option<String>,
    raw: Option<ResendRawEmail>,
    attachments: Option<Vec<ResendAttachment>>,
}

#[derive(Debug, Deserialize)]
struct ResendErrorPayload {
    message: Option<String>,
    error: Option<String>,
    name: Option<String>,
    #[serde(alias = "statusCode")]
    status_code: Option<u16>,
}

fn client() -> Client {
    Client::new()
}

fn to_email_attachment(attachment: ResendEmailAttachmentRecord) -> EmailAttachment {
    EmailAttachment {
        id: attachment.id,
        filename: attachment.filename.unwrap_or_else(|| "attachment".to_string()),
        content_type: attachment
            .content_type
            .unwrap_or_else(|| "application/octet-stream".to_string()),
        content_disposition: attachment.content_disposition,
        content_id: attachment.content_id,
        size: attachment.size,
        download_url: attachment.download_url,
        expires_at: attachment.expires_at,
    }
}

async fn parse_error(response: reqwest::Response) -> ResendClientError {
    let status = response.status();
    let body = response.text().await.unwrap_or_default();

    let parsed = serde_json::from_str::<ResendErrorPayload>(&body).ok();
    let message = parsed
        .and_then(|payload| payload.message.or(payload.error).or(payload.name).or(payload.status_code.map(|code| format!("Request failed with status {code}"))))
        .filter(|message| !message.trim().is_empty())
        .unwrap_or_else(|| format!("Resend request failed with status {status}."));

    match status {
        StatusCode::UNAUTHORIZED | StatusCode::FORBIDDEN => ResendClientError::Unauthorized { message },
        _ => ResendClientError::Response { message },
    }
}

fn split_recipients(value: &str) -> Vec<String> {
    value.split(',')
        .map(str::trim)
        .filter(|item| !item.is_empty())
        .map(ToOwned::to_owned)
        .collect()
}

pub async fn list_sent_emails(api_key: &str, limit: u16) -> Result<Vec<SentEmail>, ResendClientError> {
    let response = client()
        .get(format!("{RESEND_API_BASE_URL}/emails"))
        .bearer_auth(api_key)
        .query(&[("limit", limit.clamp(1, 100))])
        .send()
        .await
        .map_err(|error| ResendClientError::Request {
            message: format!("Could not reach Resend: {error}"),
        })?;

    if !response.status().is_success() {
        return Err(parse_error(response).await);
    }

    let payload = response
        .json::<ApiListResponse<ResendEmailRecord>>()
        .await
        .map_err(|error| ResendClientError::Response {
            message: format!("Could not decode the Resend response: {error}"),
        })?;

    Ok(payload
        .data
        .into_iter()
        .map(|email| SentEmail {
            id: email.id,
            subject: email.subject,
            to: email.to,
            from: email.from,
            created_at: email.created_at,
            status: email.last_event.unwrap_or_else(|| "queued".to_string()),
        })
        .collect())
}

pub async fn send_email(api_key: &str, payload: &ComposeEmailPayload) -> Result<SendEmailResult, ResendClientError> {
    let recipients = split_recipients(&payload.to);

    if recipients.is_empty() {
        return Err(ResendClientError::Request {
            message: "At least one valid recipient is required.".to_string(),
        });
    }

    let response = client()
        .post(format!("{RESEND_API_BASE_URL}/emails"))
        .bearer_auth(api_key)
        .json(&json!({
            "from": payload.from.trim(),
            "to": recipients,
            "subject": payload.subject.trim(),
            "text": payload.text.trim(),
            "attachments": payload.attachments.iter().map(|attachment| {
                json!({
                    "filename": attachment.filename,
                    "content": attachment.content,
                })
            }).collect::<Vec<_>>(),
        }))
        .send()
        .await
        .map_err(|error| ResendClientError::Request {
            message: format!("Could not reach Resend: {error}"),
        })?;

    if !response.status().is_success() {
        return Err(parse_error(response).await);
    }

    let payload = response
        .json::<ResendSendResponse>()
        .await
        .map_err(|error| ResendClientError::Response {
            message: format!("Could not decode the Resend response: {error}"),
        })?;

    Ok(SendEmailResult { id: payload.id })
}

pub async fn list_received_emails(api_key: &str, limit: u16) -> Result<Vec<ReceivedEmail>, ResendClientError> {
    let response = client()
        .get(format!("{RESEND_API_BASE_URL}/emails/receiving"))
        .bearer_auth(api_key)
        .query(&[("limit", limit.clamp(1, 100))])
        .send()
        .await
        .map_err(|error| ResendClientError::Request {
            message: format!("Could not reach Resend: {error}"),
        })?;

    if !response.status().is_success() {
        return Err(parse_error(response).await);
    }

    let payload = response
        .json::<ApiListResponse<ResendReceivedEmailRecord>>()
        .await
        .map_err(|error| ResendClientError::Response {
            message: format!("Could not decode the Resend response: {error}"),
        })?;

    Ok(payload
        .data
        .into_iter()
        .map(|email| ReceivedEmail {
            id: email.id,
            subject: email.subject,
            to: email.to,
            from: email.from,
            created_at: email.created_at,
            message_id: email.message_id,
            attachments_count: email.attachments.unwrap_or_default().len(),
        })
        .collect())
}

async fn list_sent_attachments(api_key: &str, email_id: &str) -> Result<Vec<EmailAttachment>, ResendClientError> {
    let response = client()
        .get(format!("{RESEND_API_BASE_URL}/emails/{email_id}/attachments"))
        .bearer_auth(api_key)
        .send()
        .await
        .map_err(|error| ResendClientError::Request {
            message: format!("Could not reach Resend: {error}"),
        })?;

    if !response.status().is_success() {
        return Err(parse_error(response).await);
    }

    let payload = response
        .json::<ApiListResponse<ResendEmailAttachmentRecord>>()
        .await
        .map_err(|error| ResendClientError::Response {
            message: format!("Could not decode the Resend response: {error}"),
        })?;

    Ok(payload.data.into_iter().map(to_email_attachment).collect())
}

pub async fn get_sent_email(api_key: &str, email_id: &str) -> Result<SentEmailDetail, ResendClientError> {
    let response = client()
        .get(format!("{RESEND_API_BASE_URL}/emails/{email_id}"))
        .bearer_auth(api_key)
        .send()
        .await
        .map_err(|error| ResendClientError::Request {
            message: format!("Could not reach Resend: {error}"),
        })?;

    if !response.status().is_success() {
        return Err(parse_error(response).await);
    }

    let email = response
        .json::<ResendSentEmailDetailRecord>()
        .await
        .map_err(|error| ResendClientError::Response {
            message: format!("Could not decode the Resend response: {error}"),
        })?;

    let attachments = match list_sent_attachments(api_key, email_id).await {
        Ok(items) => items,
        Err(_) => Vec::new(),
    };

    Ok(SentEmailDetail {
        id: email.id,
        subject: email.subject,
        to: email.to,
        from: email.from,
        created_at: email.created_at,
        status: email.last_event.unwrap_or_else(|| "queued".to_string()),
        html: email.html,
        text: email.text,
        cc: email.cc.unwrap_or_default(),
        bcc: email.bcc.unwrap_or_default(),
        reply_to: email.reply_to.unwrap_or_default(),
        scheduled_at: email.scheduled_at,
        attachments,
    })
}

pub async fn get_received_email(api_key: &str, email_id: &str) -> Result<ReceivedEmailDetail, ResendClientError> {
    let response = client()
        .get(format!("{RESEND_API_BASE_URL}/emails/receiving/{email_id}"))
        .bearer_auth(api_key)
        .send()
        .await
        .map_err(|error| ResendClientError::Request {
            message: format!("Could not reach Resend: {error}"),
        })?;

    if !response.status().is_success() {
        return Err(parse_error(response).await);
    }

    let email = response
        .json::<ResendReceivedEmailDetailRecord>()
        .await
        .map_err(|error| ResendClientError::Response {
            message: format!("Could not decode the Resend response: {error}"),
        })?;

    let attachments = email
        .attachments
        .unwrap_or_default()
        .into_iter()
        .map(|attachment| ReceivedEmailAttachment {
            id: attachment.id,
            filename: attachment.filename.unwrap_or_else(|| "attachment".to_string()),
            content_type: attachment
                .content_type
                .unwrap_or_else(|| "application/octet-stream".to_string()),
            content_disposition: attachment.content_disposition,
            content_id: attachment.content_id,
            size: attachment.size,
            download_url: None,
            expires_at: None,
        })
        .collect::<Vec<_>>();

    Ok(ReceivedEmailDetail {
        id: email.id,
        subject: email.subject,
        to: email.to,
        from: email.from,
        created_at: email.created_at,
        message_id: email.message_id,
        attachments_count: attachments.len(),
        attachments,
        html: email.html,
        text: email.text,
        headers: email.headers.unwrap_or_default(),
        cc: email.cc.unwrap_or_default(),
        bcc: email.bcc.unwrap_or_default(),
        reply_to: email.reply_to.unwrap_or_default(),
        raw: email.raw.map(|raw| RawEmailDownload {
            download_url: raw.download_url,
            expires_at: raw.expires_at,
        }),
    })
}
