import { Link } from 'react-router-dom';
import { Note } from '@/libs/models/note.models.ts';
import { Button } from '@/components/ui/button.tsx';
import { computeDateLabel, groupNotesByDate, NotesGroup } from '@/libs/utils/notes.utils.ts';
import SearchNotes from '@/components/notes/SearchNotes.tsx';

const baseUrl = '/';

function Sidebar() {
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
        }
    ];
    const notesByDate: NotesGroup = groupNotesByDate(notes);
    const sortedDates = Object.keys(notesByDate).map(Number).sort((a, b) => b - a);

    return (
        <aside className="w-full bg-white dark:bg-gray-800 border-r dark:border-gray-700 overflow-y-auto">
            <div className="p-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notes</h2>
                    <Link to={baseUrl + '/create'}>
                        <Button className="text-sm text-blue-500 dark:text-blue-400 px-0" variant="link">
                            Create Note
                        </Button>
                    </Link>
                </div>
                <SearchNotes className="my-2" />
                {
                    sortedDates.map((timestamp) => (
                        <SidebarGroup key={timestamp} timestamp={timestamp} notes={notesByDate[timestamp]}/>
                    ))
                }
            </div>
        </aside>
    );
}

interface SidebarGroupProps {
    timestamp: number;
    notes: Note[];
}

function SidebarGroup({ timestamp, notes }: SidebarGroupProps) {
    const label = computeDateLabel(timestamp);
    const sortedNotes = [...notes].sort((a, b) => b.modifiedTimestamp - a.modifiedTimestamp);

    return (
        <div className="mt-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">{label}</h3>
            <div className="space-y-2">
                {
                    sortedNotes.map((note) => (
                        <SidebarItem key={note.id} note={note}/>
                    ))
                }
            </div>
        </div>
    );
}

interface SidebarItemProps {
    note: Note;
}

function SidebarItem({ note }: SidebarItemProps) {
    const onEdit = () => location.assign(baseUrl + note.id + '/edit');

    return (
        <Link className="block" to={baseUrl + note.id}>
            <div className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                <div className="flex justify-between items-center">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{note.title}</h4>
                    <div onClick={(e) => e.preventDefault()}>
                        <Button className="text-sm text-blue-500 dark:text-blue-400 mr-2 px-0" variant="link" onClick={onEdit}>
                            Edit
                        </Button>
                        <Button className="text-sm text-red-500 dark:text-red-400 px-0" variant="link">
                            Delete
                        </Button>
                    </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {note.description}
                </p>
            </div>
        </Link>
    );
}

export default Sidebar;
