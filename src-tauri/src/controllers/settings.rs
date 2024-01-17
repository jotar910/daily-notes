use tauri::Manager;

use crate::services;

#[tauri::command]
pub fn open_settings(app_handle: tauri::AppHandle) -> tauri::Result<()> {
    if let Some(window) = app_handle.get_window("settings") {
        return window.set_focus();
    }
    services::settings::spawn_window(app_handle);
    Ok(())
}

#[tauri::command]
pub fn set_keymap(
    app_handle: tauri::AppHandle,
    state: tauri::State<crate::state::AppState>,
    keymap: String,
) -> Result<(), tauri::Error> {
    services::settings::set_keymap(app_handle, state.store.as_ref(), &keymap)
}

#[tauri::command]
pub fn close_settings(app_handle: tauri::AppHandle) -> tauri::Result<()> {
    app_handle
        .get_window("settings")
        .map_or(Ok(()), |window| window.close())
}
