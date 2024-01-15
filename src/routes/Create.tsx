import { SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Note } from '@/libs/models/note.models.ts';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast.ts';
import NotesForm, { Inputs as NotesFormInputs } from '@/components/common/NotesForm.tsx';

function Create() {
    const note: Note = { id: 0, title: '', description: '', createdTimestamp: 0, modifiedTimestamp: 0 };

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

function CreateDetails({ note }: CreateDetailsProps) {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onSubmit: SubmitHandler<NotesFormInputs> = (data) => {
        console.log(data);
        setLoading(true);
        setTimeout(() => {
            toast({
                title: 'Oops, something went wrong!',
                description: 'Could not create the note, please try again later or contact service.'
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

export default Create;
