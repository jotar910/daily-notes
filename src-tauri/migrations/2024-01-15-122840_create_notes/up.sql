create table if not exists notes
(
    id                 integer primary key autoincrement not null,
    title              varchar(256)                      not null,
    description        varchar(4096)                     not null,
    created_timestamp  bigint                            not null,
    modified_timestamp bigint                            not null
);
create index if not exists idx_notes_title on notes (title);
