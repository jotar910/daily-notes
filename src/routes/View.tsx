import { Note } from '@/libs/models/note.models';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';

const baseUrl = '';

function View() {
    const { id } = useParams();
    if (!id || isNaN(+id)) {
        useNavigate()('/');
        return <>Redirecting to home</>;
    }
    const note: Note = {
        id: +id,
        title: 'Note ' + id,
        description: 'This is a preview of the note content in markdown format',
        createdTimestamp: 1705236761037,
        modifiedTimestamp: 1705026761037
    };
    return (
        <article className="flex-1 p-4 overflow-y-auto">
            <ViewHeader />
            <ViewDetails note={note} />
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

function ViewDetails({ note }: ViewDetailsProps) {
    const navigate = useNavigate();
    const onEdit = () => navigate(baseUrl + 'edit');

    return (
        <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{ note.title }</h2>
            <div className="flex justify-between items-center">
                <div>
                    <Button className="text-sm text-blue-500 dark:text-blue-400 mr-2 px-0" variant="link" onClick={onEdit}>
                        Edit
                    </Button>
                    <Button className="text-sm text-red-500 dark:text-red-400 px-0" variant="link">
                        Delete
                    </Button>
                </div>
            </div>
            <div className="prose prose-gray mt-4 dark:prose-invert">
                <p>{ note.description }</p>
            </div>
        </div>
    );
}

export default View;
