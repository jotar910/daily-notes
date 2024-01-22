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

#[tauri::command]
pub fn delete_note(id: i32) -> Option<models::NoteDTO> {
    services::notes::delete_note(id).map(models::NoteDTO::from)
}

#[tauri::command]
pub fn search_notes(search_term: String) -> Vec<models::NoteDTO> {
    if search_term.len() < 2 {
        return list_notes();
    }
    services::notes::search_notes(search_term + "*")
        .into_iter()
        .map(models::NoteDTO::from)
        .collect()
}
