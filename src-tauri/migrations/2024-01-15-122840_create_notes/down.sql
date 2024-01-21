drop trigger if exists delete_note_fts;
drop trigger if exists update_note_fts;
drop trigger if exists insert_note_fts;
drop table if exists notes_fts;
drop index if exists idx_notes_title;
drop table if exists notes;
