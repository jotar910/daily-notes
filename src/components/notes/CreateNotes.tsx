import {Note} from "@/libs/models/note.models.ts";
import {useContext, useState} from "react";
import {NotesServiceContext} from "@/libs/services/notes.tsx";
import {NotesStoreContext, NotesStoreDispatchContext} from "@/libs/stores/notes.tsx";
import {useToast} from "@/components/ui/use-toast.ts";
import {SubmitHandler} from "react-hook-form";
import NotesForm, {Inputs as NotesFormInputs} from "@/components/common/NotesForm.tsx";

interface CreateNotesProps {
    onAfterSubmit: (note: Note) => void,
    onAfterCancel: () => void
}

function CreateNotes({onAfterSubmit, onAfterCancel}: CreateNotesProps) {
    const emptyNote: Note = {id: 0, title: '', description: '', createdTimestamp: 0, modifiedTimestamp: 0};
    const NotesService = useContext(NotesServiceContext);
    const {adding} = useContext(NotesStoreContext);
    const dispatch = useContext(NotesStoreDispatchContext);

    const {toast} = useToast();

    const [block, setBlock] = useState(true);

    const onSubmit: SubmitHandler<NotesFormInputs> = (data) => {
        const submit = async () => {
            dispatch({type: 'adding'});
            try {
                const note = await NotesService.addNote(data);
                dispatch({type: 'added', note });
                setBlock(false);
                setTimeout(() => onAfterSubmit(note), 200); // unblock the navigation blocker first.
            } catch (err) {
                console.error('Adding new note', err);

                dispatch({type: 'add_failed', err});
                toast({
                    title: 'Oops, something went wrong!',
                    description: 'Could not create the note, please try again later or contact service.'
                });
            }
        };
        submit();
    };
    const onCancel = () => onAfterCancel();

    return (
        <NotesForm note={emptyNote} loading={adding} routePrompt={block} onSubmit={onSubmit} onCancel={onCancel}/>
    );
}

export default CreateNotes;
