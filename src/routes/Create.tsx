import {SubmitHandler} from 'react-hook-form';
import {Link, useNavigate} from 'react-router-dom';
import {Note} from '@/libs/models/note.models.ts';
import {useContext, useState} from 'react';
import {useToast} from '@/components/ui/use-toast.ts';
import NotesForm, {Inputs as NotesFormInputs} from '@/components/common/NotesForm.tsx';
import {NotesServiceContext} from "@/libs/services/notes.tsx";
import {NotesStoreContext, NotesStoreDispatchContext} from "@/libs/stores/notes.tsx";

const baseUrl = '/';

function Create() {
    const note: Note = {id: 0, title: '', description: '', createdTimestamp: 0, modifiedTimestamp: 0};

    return (
        <article className="flex-1 p-4 overflow-y-auto">
            <CreateHeader/>
            <CreateDetails note={note}/>
        </article>
    );
}

function CreateHeader() {
    return (
        <nav className="flex justify-between items-center mb-4">
            <Link className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:underline" to="..">
                ◀︎ Back to List
            </Link>
        </nav>
    );
}

interface CreateDetailsProps {
    note: Note;
}

function CreateDetails({note}: CreateDetailsProps) {
    const NotesService = useContext(NotesServiceContext);
    const {adding} = useContext(NotesStoreContext);
    const dispatch = useContext(NotesStoreDispatchContext);

    const {toast} = useToast();
    const navigate = useNavigate();

    const [block, setBlock] = useState(true);

    const onSubmit: SubmitHandler<NotesFormInputs> = (data) => {
        const submit = async () => {
            dispatch({type: 'adding'});
            try {
                dispatch({type: 'added', note: await NotesService.addNote(data)});
                setBlock(false);
                setTimeout(() => navigate('..'), 200); // unblock the navigation blocker first.
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
    const onCancel = () => navigate(baseUrl);

    return (
        <NotesForm note={note} loading={adding} routePrompt={block} onSubmit={onSubmit} onCancel={onCancel}/>
    );
}

export default Create;
