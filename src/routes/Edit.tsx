import {SubmitHandler} from 'react-hook-form';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {Note} from '@/libs/models/note.models.ts';
import {useContext, useEffect, useState} from 'react';
import {useToast} from '@/components/ui/use-toast.ts';
import NotesForm, {Inputs as NotesFormInputs} from '@/components/common/NotesForm.tsx';
import {NotesServiceContext} from "@/libs/services/notes.tsx";
import {NotesStoreContext, NotesStoreDispatchContext} from "@/libs/stores/notes.tsx";

const baseUrl = '/';

function Edit() {
    const NotesService = useContext(NotesServiceContext);
    const [note, setNote] = useState<Note | null>(null);

    const navigate = useNavigate();
    const {id} = useParams();

    useEffect(() => {
        if (!id || isNaN(+id)) {
            navigate('/');
            return;
        }

        const fetch = async (id: number) => {
            try {
                setNote(await NotesService.getNote(id));
            } catch (err) {
                console.error(`Getting note with id ${id}`, err);
                navigate('/');
            }
        };
        fetch(+id);
    }, [id]);

    return (
        <article className="flex-1 p-4 overflow-y-auto">
            <EditHeader id={id ? +id : 0}/>
            {note && <EditDetails key={note.id} note={note}/>}
        </article>
    );
}

interface EditHeaderProps {
    id?: number;
}

function EditHeader({id}: EditHeaderProps) {
    return (
        <nav className="flex justify-between items-center mb-4">
            <Link className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:underline"
                  to={baseUrl + (id || '')}>
                ◀︎ Back to {id ? 'View' : 'List'}
            </Link>
        </nav>
    );
}

interface EditDetailsProps {
    note: Note;
}

function EditDetails({note}: EditDetailsProps) {
    const NotesService = useContext(NotesServiceContext);
    const {editing} = useContext(NotesStoreContext);
    const dispatch = useContext(NotesStoreDispatchContext);

    const {toast} = useToast();
    const navigate = useNavigate();

    const [block, setBlock] = useState(true);

    const onSubmit: SubmitHandler<NotesFormInputs> = (data) => {
        const submit = async () => {
            dispatch({type: 'editing'});
            try {
                dispatch({type: 'edited', note: await NotesService.editNote({id: note.id, ...data})});
                setBlock(false);
                setTimeout(() => navigate('..'), 200); // unblock the navigation blocker first.
            } catch (err) {
                console.error('Editing new note', err);

                dispatch({type: 'edit_failed', err});
                toast({
                    title: 'Oops, something went wrong!',
                    description: 'Could not edit the note, please try again later or contact service.'
                });
            }
        };
        submit();
    };
    const onCancel = () => navigate(baseUrl + note.id);

    return (
        <NotesForm note={note} loading={editing} routePrompt={block} onSubmit={onSubmit} onCancel={onCancel}/>
    );
}

export default Edit;
