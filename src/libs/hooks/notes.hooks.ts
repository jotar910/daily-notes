import {Note} from "@/libs/models/note.models.ts";
import {useContext} from "react";
import {NotesStoreDispatchContext} from "@/libs/stores/notes.tsx";
import {NotesServiceContext} from "@/libs/services/notes.tsx";
import {dialog} from "@tauri-apps/api";

type HandleDeletionArgsFn = () => HandleDeletionArgs;

interface HandleDeletionArgs {
    id: number;
    cancelled?: () => void;
    afterSuccess?: (note: Note) => void;
    afterError?: (err: any) => void;
}

export function handleDeletion(argsFn: HandleDeletionArgsFn) {
    const notesService = useContext(NotesServiceContext);
    const dispatch = useContext(NotesStoreDispatchContext);
    return async () => {
        const {id, cancelled, afterSuccess, afterError} = argsFn();

        if (!(await dialog.confirm('Are you sure?'))) {
            cancelled?.();
            return;
        }

        dispatch({type: 'deleting'});
        try {
            const note = await notesService.deleteNote(id);
            dispatch({type: 'deleted', note});
            afterSuccess?.(note);
        } catch (err) {
            console.error('Deleting note', err);

            dispatch({type: 'delete_failed', err});
            afterError?.(err);
        }
    };
}
