// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{
    fs,
    path::Path,
    sync::{Arc, Mutex},
};

use serde_json::json;
use state::AppState;
use tauri::{
    CustomMenuItem, Manager, Menu, MenuEntry, MenuItem, Submenu, SystemTray, SystemTrayEvent,
    SystemTrayMenu, SystemTrayMenuItem, WindowEvent, Wry,
};
use tauri_plugin_store::{Store, StoreBuilder};

mod controllers;
mod db;
mod models;
mod schema;
mod services;
mod state;
mod utils;

fn main() {
    let app_context = tauri::generate_context!();

    let create_new = CustomMenuItem::new("create_new".to_string(), "Create New");
    let open_settings = CustomMenuItem::new("open_settings".to_string(), "Settings");
    let open = CustomMenuItem::new("open".to_string(), "Open Daily Notes");
    let close = CustomMenuItem::new("close".to_string(), "Close Daily Notes");
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");

    let mut default_menu = Menu::os_default(&app_context.package_info().name);
    for ele in default_menu.items.iter_mut() {
        if let MenuEntry::Submenu(item) = ele {
            if item.title == "File" {
                *item = Submenu::new(
                    "File",
                    Menu::new()
                        .add_item(create_new.clone())
                        .add_item(close.clone())
                        .add_native_item(MenuItem::Separator)
                        .add_item(open_settings.clone())
                        .add_item(quit.clone()),
                );
            }
        }
    }

    let tray_menu = SystemTrayMenu::new()
        .add_item(create_new)
        .add_item(open)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(open_settings)
        .add_item(quit);
    let system_tray = SystemTray::new().with_menu(tray_menu);

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
        .on_window_event(|event| match event.event() {
            WindowEvent::CloseRequested { api, .. } => {
                event
                    .window()
                    .hide()
                    .expect("window shold hide on close request event");
                api.prevent_close();
            }
            _ => {}
        })
        .menu(default_menu)
        .on_menu_event(|event| match event.menu_item_id() {
            "close" => {
                let window = event.window();
                if !window
                    .is_visible()
                    .map_err(|err| eprintln!("main window is visible check failed: {err}"))
                    .unwrap_or(false)
                {
                    window
                        .hide()
                        .expect("main window should hide on menu");
                }
            }
            "create_new" => {
                services::creation::spawn_window(event.window().app_handle());
            }
            "open_settings" => {
                services::settings::spawn_window(event.window().app_handle());
            }
            "quit" => {
                std::process::exit(0);
            }
            _ => {}
        })
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "open" => {
                    let window = app.get_window("main").expect("main window should exist");
                    if !window
                        .is_visible()
                        .map_err(|err| eprintln!("main window is visible check failed: {err}"))
                        .unwrap_or(true)
                    {
                        window
                            .show()
                            .expect("main window should show on system tray event");
                    }
                }
                "create_new" => {
                    services::creation::spawn_window(app.app_handle());
                }
                "open_settings" => {
                    services::settings::spawn_window(app.app_handle());
                }
                "quit" => {
                    std::process::exit(0);
                }
                _ => {}
            },
            _ => {}
        })
        .plugin(tauri_plugin_store::Builder::default().build())
        .run(app_context)
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
