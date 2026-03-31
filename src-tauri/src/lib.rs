mod commands;
mod models;
mod resend;
mod storage;

use commands::{
    clear_local_data, get_received_email, get_sent_email, list_received_emails, list_sent_emails, load_settings,
    remove_api_key, save_api_key, send_email, update_preferences, verify_connection, SessionState,
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(SessionState::default())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            load_settings,
            save_api_key,
            update_preferences,
            remove_api_key,
            clear_local_data,
            verify_connection,
            list_sent_emails,
            get_sent_email,
            list_received_emails,
            get_received_email,
            send_email,
        ])
        .run(tauri::generate_context!())
        .expect("error while running ResendBox");
}
