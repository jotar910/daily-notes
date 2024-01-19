use crate::{db, models, schema::notes::dsl};
use diesel::prelude::*;

pub fn list_notes() -> Vec<models::Note> {
    let conn = &mut db::establish_db_connection();

    dsl::notes
        .order_by(dsl::modified_timestamp.desc())
        .load::<models::Note>(conn)
        .map_err(|err| eprintln!("Error loading notes: {}", err))
        .unwrap_or(vec![])
}

pub fn get_note(id: i32) -> Option<models::Note> {
    let conn = &mut db::establish_db_connection();

    dsl::notes
        .filter(dsl::id.eq(id))
        .first::<models::Note>(conn)
        .map_err(|err| eprintln!("Error getting note by id {}: {}", id, err))
        .ok()
}

pub fn store_new_note(note: &models::NewNote) -> Option<models::Note> {
    let conn = &mut db::establish_db_connection();

    diesel::insert_into(dsl::notes)
        .values(note)
        .returning(models::Note::as_returning())
        .get_result(conn)
        .map_err(|err| eprintln!("Error saving new note: {}", err))
        .ok()
}

pub fn update_note(note: &models::EditNote) -> Option<models::Note> {
    let conn = &mut db::establish_db_connection();

    diesel::update(dsl::notes.filter(dsl::id.eq(note.id)))
        .set((
            dsl::title.eq(&note.title),
            dsl::description.eq(&note.description),
            dsl::modified_timestamp.eq(&note.modified_timestamp),
        ))
        .returning(models::Note::as_returning())
        .get_result(conn)
        .map_err(|err| eprintln!("Error updating note: {}", err))
        .ok()
}

pub fn delete_note(id: i32) -> Option<models::Note> {
    let conn = &mut db::establish_db_connection();

    diesel::delete(dsl::notes.filter(dsl::id.eq(id)))
        .returning(models::Note::as_returning())
        .get_result(conn)
        .map_err(|err| eprintln!("Error deleting note: {}", err))
        .ok()
}

