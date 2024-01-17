use std::sync::{Arc, Mutex};

use tauri::Wry;
use tauri_plugin_store::Store;

#[derive(Clone)]
pub struct AppState {
    pub store: Arc<Mutex<Store<Wry>>>,
}
