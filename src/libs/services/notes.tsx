import {createContext} from "react";
import {EditNote, NewNote, Note} from "@/libs/models/note.models.ts";
import {invoke} from "@tauri-apps/api";

export class NotesService {

    listNotes(): Promise<Note[]> {
        return invoke('list_notes');
    }

    getNote(id: number): Promise<Note> {
        return invoke('get_note', { id });
    }

    addNote(note: NewNote): Promise<Note> {
        return invoke('store_new_note', { note });
    }

    editNote(note: EditNote): Promise<Note> {
        return invoke('update_note', { note });
    }

    deleteNote(id: number): Promise<Note> {
        return invoke('delete_note', { id });
    }
}

export const NotesServiceInstance = new NotesService();

export const NotesServiceContext = createContext(NotesServiceInstance);
