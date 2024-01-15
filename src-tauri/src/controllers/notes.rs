use crate::models;
use crate::services;

#[tauri::command]
pub fn list_notes() -> Vec<models::NoteDTO> {
    services::notes::list_notes()
        .into_iter()
        .map(models::NoteDTO::from)
        .collect()
}

#[tauri::command]
pub fn get_note(id: i32) -> Option<models::NoteDTO> {
    services::notes::get_note(id).map(models::NoteDTO::from)
}

#[tauri::command]
pub fn store_new_note(note: models::NewNoteDTO) -> Option<models::NoteDTO> {
    services::notes::store_new_note(&note.into()).map(models::NoteDTO::from)
}

#[tauri::command]
pub fn update_note(note: models::EditNoteDTO) -> Option<models::NoteDTO> {
    services::notes::update_note(&note.into()).map(models::NoteDTO::from)
}