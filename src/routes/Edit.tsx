import { SubmitHandler } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Note } from '@/libs/models/note.models.ts';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast.ts';
import NotesForm, { Inputs as NotesFormInputs } from '@/components/common/NotesForm.tsx';

function Edit() {
    const [note, setNote] = useState<Note | null>(null);

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        console.log('Checking params', id);
        if (!id || isNaN(+id)) {
            navigate('/');
            return;
        }

        setNote({
            id: +id,
            title: 'Note ' + id,
            description: 'This is a preview of the note content in markdown format',
            createdTimestamp: 1705236761037,
            modifiedTimestamp: 1705026761037
        });
    }, [id]);

    return (
        <article className="flex-1 p-4 overflow-y-auto">
            <EditHeader/>
            {note && <EditDetails key={note.id} note={note}/>}
        </article>
    );
}

function EditHeader() {
    return (
        <nav className="flex justify-between items-center mb-4">
            <Link className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:underline" to="..">
                ◀︎ Back to View
            </Link>
        </nav>
    );
}

interface EditDetailsProps {
    note: Note;
}

function EditDetails({ note }: EditDetailsProps) {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onSubmit: SubmitHandler<NotesFormInputs> = (data) => {
        console.log(data);
        setLoading(true);
        setTimeout(() => {
            toast({
                title: 'Oops, something went wrong!',
                description: 'Could not edit the note, please try again later or contact service.'
            });
            // navigate('..');
            setLoading(false);
        }, 2000);
    };
    const onCancel = () => navigate('..');

    return (
        <NotesForm note={note} loading={loading} onSubmit={onSubmit} onCancel={onCancel}/>
    );
}

export default Edit;
