use serde_json::json;
use std::sync::Mutex;
use tauri::{AppHandle, GlobalShortcutManager, Wry};
use tauri_plugin_store::Store;

use crate::services;

pub fn set_keymap(
    app_handle: AppHandle,
    store: &Mutex<Store<Wry>>,
    keymap: &str,
) -> tauri::Result<()> {
    {
        let mut store = store.lock().expect("must lock store");
        store
            .insert(String::from("keymap"), json!(keymap.to_string()))
            .map_err(|err| {
                eprintln!("failed to insert keymap to store: {err}");
                return tauri::Error::UnknownApi(None);
            })?;
        store.save().map_err(|err| {
            eprintln!("failed to save store to memory: {err}");
            return tauri::Error::UnknownApi(None);
        })?;
    }
    register_keymap(app_handle, keymap)?;
    Ok(())
}

pub fn register_keymap(app_handle: tauri::AppHandle, keymap: &str) -> tauri::Result<()> {
    app_handle
        .global_shortcut_manager()
        .register(keymap, move || {
            services::creation::spawn_window(app_handle.clone());
        })?;
    Ok(())
}

pub fn spawn_window(app_handle: tauri::AppHandle) {
    std::thread::spawn(move || {
        tauri::WindowBuilder::new(
            &app_handle,
            "settings",
            tauri::WindowUrl::App("/settings".into()),
        )
        .decorations(false)
        .center()
        .max_inner_size(320.0, 120.0)
        .hidden_title(true)
        .skip_taskbar(true)
        .focused(true)
        .visible(true)
        .always_on_top(true)
        .build()
        .expect("settings window should open");
    });
}
