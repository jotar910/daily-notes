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
