use crate::schema::notes;
use diesel::sql_types::{BigInt, Integer, Text};
use diesel::{prelude::QueryableByName, Insertable, Queryable, Selectable};
use serde::{Serialize, Deserialize};

#[derive(Debug, Queryable, Selectable, QueryableByName)]
#[diesel(table_name = notes, sql_type = Nullable<Date>)]
pub struct Note {
    #[diesel(sql_type=Integer)]
    pub id: i32,
    #[diesel(sql_type=Text)]
    pub title: String,
    #[diesel(sql_type=Text)]
    pub description: String,
    #[diesel(sql_type=BigInt)]
    pub created_timestamp: i64,
    #[diesel(sql_type=BigInt)]
    pub modified_timestamp: i64,
}

#[derive(Debug, Serialize)]
pub struct NoteDTO {
    pub id: i32,
    pub title: String,
    pub description: String,
    #[serde(rename = "createdTimestamp")]
    pub created_timestamp: i64,
    #[serde(rename = "modifiedTimestamp")]
    pub modified_timestamp: i64,
}

impl From<Note> for NoteDTO {
    fn from(model: Note) -> Self {
        NoteDTO {
            id: model.id,
            title: model.title,
            description: model.description,
            created_timestamp: model.created_timestamp,
            modified_timestamp: model.modified_timestamp,
        }
    }
}

#[derive(Debug, Insertable)]
#[diesel(table_name = notes)]
pub struct NewNote {
    pub title: String,
    pub description: String,
    pub created_timestamp: i64,
    pub modified_timestamp: i64,
}

impl From<NewNoteDTO> for NewNote {
    fn from(dto: NewNoteDTO) -> Self {
        let now = chrono::offset::Local::now().timestamp_millis();
        NewNote {
            title: dto.title,
            description: dto.description,
            created_timestamp: now,
            modified_timestamp: now,
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct NewNoteDTO {
    pub title: String,
    pub description: String,
}

#[derive(Debug, Insertable)]
#[diesel(table_name = notes)]
pub struct EditNote {
    pub id: i32,
    pub title: String,
    pub description: String,
    pub modified_timestamp: i64,
}

impl From<EditNoteDTO> for EditNote {
    fn from(dto: EditNoteDTO) -> Self {
        EditNote {
            id: dto.id,
            title: dto.title,
            description: dto.description,
            modified_timestamp: chrono::offset::Local::now().timestamp_millis(),
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct EditNoteDTO {
    pub id: i32,
    pub title: String,
    pub description: String,
}
