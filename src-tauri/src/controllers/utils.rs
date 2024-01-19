use crate::utils;

#[tauri::command]
pub fn settings_path() -> String {
    utils::paths::settings()
}
