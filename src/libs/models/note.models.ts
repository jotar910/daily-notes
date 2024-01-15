export interface Note {
    id: number;
    title: string;
    description: string;
    createdTimestamp: number;
    modifiedTimestamp: number;
}

export interface NewNote {
    title: string;
    description: string;
}

export type EditNote = { id: number } & NewNote;
