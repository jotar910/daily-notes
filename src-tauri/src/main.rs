// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{
    fs,
    path::Path,
    sync::{Arc, Mutex},
};

use serde_json::json;
use state::AppState;
use tauri::{Manager, Wry};
use tauri_plugin_store::{Store, StoreBuilder};

mod controllers;
mod db;
mod models;
mod schema;
mod services;
mod state;
mod utils;

fn main() {
    tauri::Builder::default()
        .setup(|app| setup(app))
        .invoke_handler(tauri::generate_handler![
            controllers::notes::list_notes,
            controllers::notes::get_note,
            controllers::notes::store_new_note,
            controllers::notes::update_note,
            controllers::settings::open_settings,
            controllers::settings::close_settings,
            controllers::settings::set_keymap,
        ])
        .plugin(tauri_plugin_store::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn setup(app: &tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    // Initialize the environment variables.
    dotenvy::dotenv_override()?;

    // Initialize the database.
    db::init();

    // Customize window.
    customize_window(app)?;

    // Load store.
    let store = load_store(app)?;

    // Register keymap.
    if let Some(serde_json::Value::String(keymap)) = store.get("keymap") {
        services::settings::register_keymap(app.handle(), keymap)?;
    }

    // Make tauri manage the app state.
    app.manage(AppState {
        store: Arc::new(Mutex::new(store)),
    });

    Ok(())
}

fn load_store(app: &tauri::App) -> Result<Store<Wry>, Box<dyn std::error::Error>> {
    let path = dotenvy::var("VITE_SETTINGS_PATH")?;

    if Path::new(&path).exists() {
        let mut store = StoreBuilder::new(app.handle(), path.parse()?).build();
        store.load()?;
        return Ok(store);
    }

    let file_dir = Path::new(&path).parent().unwrap();

    // If the parent directory does not exist, create it.
    if !file_dir.exists() {
        fs::create_dir_all(file_dir).unwrap();
    }

    // Create the file.
    fs::File::create(path.clone())?;

    let mut store = StoreBuilder::new(app.handle(), path.parse()?).build();
    store.insert(String::from("keymap"), json!(""))?;
    store.save()?;

    Ok(store)
}

fn customize_window(app: &tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    let window = app.get_window("main").expect("main window must exist");
    if let Some((window_size, window_pos)) = utils::window::placement(&window, 0.7, 800, 600) {
        window.set_size(window_size)?;
        window.set_position(window_pos)?;
    }
    Ok(())
}
