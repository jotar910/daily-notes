// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod controllers;
mod db;
mod models;
mod schema;
mod services;

fn main() {
    tauri::Builder::default()
        .setup(|_app| setup())
        .invoke_handler(tauri::generate_handler![
            controllers::notes::list_notes,
            controllers::notes::get_note,
            controllers::notes::store_new_note,
            controllers::notes::update_note
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn setup() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize the environment variables.
    dotenvy::dotenv_override()?;

    // Initialize the database.
    db::init();

    Ok(())
}
