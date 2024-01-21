create table if not exists notes
(
    id                 integer primary key autoincrement not null,
    title              varchar(256)                      not null,
    description        varchar(4096)                     not null,
    created_timestamp  bigint                            not null,
    modified_timestamp bigint                            not null
);
create index if not exists idx_notes_title on notes (title);

create virtual table notes_fts
    using fts5
(
    note_id,
    title,
    description
);

create trigger insert_note_fts
    after insert
    on notes
begin
    insert into notes_fts (note_id, title, description)
    values (new.id, new.title, new.description);
end;

create trigger update_note_fts
    after update
    on notes
begin
    update notes_fts
    set note_id=new.id,
        title=new.title,
        description=new.description;
end;

create trigger delete_note_fts
    after delete
    on notes
begin
    delete
    from notes_fts
    where note_id = old.id;
end;
