import {createContext, PropsWithChildren, useReducer} from "react";
import {Note} from "@/libs/models/note.models.ts";

export interface State {
    loading: boolean;
    loaded: boolean;
    adding: boolean;
    editing: boolean;
    notes: Note[];
}

export type Action =
    {
        type: 'loading';
    } |
    {
        type: 'loaded';
        notes: Note[];
    } |
    {
        type: 'adding';
    } |
    {
        type: 'added';
        note: Note;
    } |
    {
        type: 'add_failed';
        err: any;
    } |
    {
        type: 'editing';
    } |
    {
        type: 'edited';
        note: Note;
    } |
    {
        type: 'edit_failed';
        err: any;
    };

export const NotesStoreContext = createContext<State>(null as any);
export const NotesStoreDispatchContext = createContext<((action: Action) => void)>(null as any);


export function NotesStoreProvider({children}: PropsWithChildren) {
    const [state, dispatch] = useReducer(
        notesReducer,
        initialState
    );
    return (
        <NotesStoreContext.Provider value={state}>
            <NotesStoreDispatchContext.Provider value={dispatch}>
                {children}
            </NotesStoreDispatchContext.Provider>
        </NotesStoreContext.Provider>
    );
}

function notesReducer(state: State, action: Action): State {
    switch (action.type) {
        case 'loading': {
            return {...state, loading: true, loaded: false};
        }
        case 'loaded': {
            return {...state, loading: false, loaded: true, notes: action.notes};
        }
        case 'adding': {
            return {...state, adding: true};
        }
        case 'added': {
            return {...state, adding: false, notes: [action.note, ...state.notes]};
        }
        case 'add_failed': {
            return {...state, adding: false};
        }
        case 'editing': {
            return {...state, editing: true};
        }
        case 'edited': {
            return {...state, editing: false, notes: state.notes.map((note) => note.id === action.note.id ? action.note : note)};
        }
        case 'edit_failed': {
            return {...state, editing: false};
        }
        default: {
            throw Error('Unknown action');
        }
    }
}

const initialState: State = {
    loading: false,
    loaded: false,
    adding: false,
    editing: false,
    notes: []
};

