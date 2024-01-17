import {Button} from '@/components/ui/button.tsx';
import {Note} from '@/libs/models/note.models.ts';
import {computeDateLabel, groupNotesByDate, NotesGroup} from '@/libs/utils/notes.utils.ts';
import {useNavigate} from 'react-router-dom';
import {useContext} from "react";
import {NotesStoreContext} from "@/libs/stores/notes.tsx";
import {invoke} from "@tauri-apps/api";

const baseUrl = '';

function List() {
    const { notes } = useContext(NotesStoreContext);
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
    const onSettingsClick = async () => {
        await invoke('open_settings');
    };

    return (
        <nav className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">All Notes</h1>
            <Button variant="ghost" onClick={onSettingsClick}>Set keymap</Button>
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
