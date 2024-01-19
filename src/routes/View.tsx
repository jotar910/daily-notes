import {Note} from '@/libs/models/note.models';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {Button} from '@/components/ui/button.tsx';
import {useContext, useEffect, useState} from "react";
import {NotesServiceContext} from "@/libs/services/notes.tsx";
import {useToast} from "@/components/ui/use-toast.ts";
import {handleDeletion} from "@/libs/hooks/notes.hooks.ts";
import {NotesStoreContext} from "@/libs/stores/notes.tsx";

function View() {
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
            <ViewHeader/>
            {note && <ViewDetails key={note.id} note={note}/>}
        </article>
    );
}

function ViewHeader() {
    return (
        <nav className="flex justify-between items-center mb-4">
            <Link className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:underline" to="..">
                ◀︎ Back to List
            </Link>
        </nav>
    );
}

interface ViewDetailsProps {
    note: Note;
}

function ViewDetails({note}: ViewDetailsProps) {
    const navigate = useNavigate();
    const {toast} = useToast();
    const { deleting } = useContext(NotesStoreContext);

    const onEdit = () => navigate('edit');
    const onDelete = handleDeletion(() => {
        return {
            id: note.id,
            afterSuccess: () => navigate('/'),
            afterError: () => toast({
                title: 'Oops, something went wrong!',
                description: 'Could not delete the note, please try again later or contact service.'
            })
        };
    });

    return (
        <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{note.title}</h2>
            <div className="flex items-center">
                <Button
                    className="text-sm text-blue-500 dark:text-blue-400 mr-2 px-0"
                    variant="link"
                    disabled={deleting}
                    onClick={onEdit}
                >
                    Edit
                </Button>
                <Button
                    className="text-sm text-red-500 dark:text-red-400 px-0"
                    variant="link"
                    disabled={deleting}
                    onClick={onDelete}
                >
                    Delete
                </Button>
            </div>
            <div className="prose prose-gray mt-4 dark:prose-invert">
                <p>{note.description}</p>
            </div>
        </div>
    );
}

export default View;
