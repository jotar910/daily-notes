// @generated automatically by Diesel CLI.

diesel::table! {
    notes (id) {
        id -> Integer,
        title -> Text,
        description -> Text,
        created_timestamp -> BigInt,
        modified_timestamp -> BigInt,
    }
}

diesel::table! {
    notes_fts (rowid) {
        rowid -> Integer,
        #[sql_name = "notes_fts"]
        whole_row -> Text,
        rank -> Float,
    }
}

