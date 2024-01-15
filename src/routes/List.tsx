import { Button } from '@/components/ui/button.tsx';
import { Note } from '@/libs/models/note.models.ts';
import { computeDateLabel, groupNotesByDate, NotesGroup } from '@/libs/utils/notes.utils.ts';
import { useNavigate } from 'react-router-dom';

const baseUrl = '';

function List() {
    const notes: Note[] = [
        {
            id: 1,
            title: 'Note 1',
            description: 'This is a preview of the note content in markdown format',
            createdTimestamp: 1705236761037,
            modifiedTimestamp: 1705026761037
        },
        {
            id: 2,
            title: 'Note 2',
            description: 'This is a preview of the note content in markdown format',
            createdTimestamp: 1705236761037,
            modifiedTimestamp: 1705236761038
        },
        {
            id: 3,
            title: 'Note 3',
            description: 'This is a preview of the note content in markdown format',
            createdTimestamp: 1705236761037,
            modifiedTimestamp: 1705216761038
        },
        {
            id: 4,
            title: 'Note 1',
            description: 'This is a preview of the note content in markdown format',
            createdTimestamp: 1705236761037,
            modifiedTimestamp: 1705026761037
        },
        {
            id: 5,
            title: 'Note 2',
            description: 'This is a preview of the note content in markdown format',
            createdTimestamp: 1705236761037,
            modifiedTimestamp: 1705236761038
        },
        {
            id: 6,
            title: 'Note 3',
            description: 'This is a preview of the note content in markdown format',
            createdTimestamp: 1705236761037,
            modifiedTimestamp: 1705216761038
        }
    ];
    const notesByDate: NotesGroup = groupNotesByDate(notes);
    const sortedDates = Object.keys(notesByDate).map(Number).sort((a, b) => b - a);

    return (
        <main className="flex-1 p-4 overflow-y-auto">
            <ListHeader/>
            {
                sortedDates.map((timestamp) => (
                    <ListGroup key={timestamp} timestamp={timestamp} notes={notesByDate[timestamp]}/>
                ))
            }
        </main>
    );
}

function ListHeader() {
    return (
        <nav className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">All Notes</h1>
        </nav>
    );
}

interface ListGroupProps {
    timestamp: number;
    notes: Note[];
}

function ListGroup({ timestamp, notes }: ListGroupProps) {
    const label = computeDateLabel(timestamp);
    const sortedNotes = [...notes].sort((a, b) => b.modifiedTimestamp - a.modifiedTimestamp);

    return (
        <div className="mt-4">
            <h2 className="muted font-semibold text-gray-900 dark:text-gray-100 mb-2">{label}</h2>
            {
                sortedNotes.map((note) => (
                    <ListItem key={note.id} note={note}/>
                ))
            }
        </div>
    );
}

interface ListItemProps {
    note: Note;
}

function ListItem({ note }: ListItemProps) {
    const navigate = useNavigate();
    const onEdit = () => navigate(baseUrl + note.id + '/edit');

    return (
        <div className="flex flex-col gap-2 mb-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{note.title}</h3>
                <div>
                    <Button className="text-sm text-blue-500 dark:text-blue-400 mr-2 px-0" variant="link" onClick={onEdit}>
                        Edit
                    </Button>
                    <Button className="text-sm text-red-500 dark:text-red-400 px-0" variant="link">
                        Delete
                    </Button>
                </div>
            </div>
            <div className="prose prose-gray dark:prose-invert">
                <p>{note.description}</p>
            </div>
        </div>
    );
}

export default List;
