import searchIcon from '@/assets/search.svg';
import {KeyboardEvent, useRef} from "react";
import {invoke} from "@tauri-apps/api";
import {Note} from '@/libs/models/note.models';

interface SearchNotesProps {
    className: string;
    onChangeResults: (ids: number[] | null) => void;
}

function SearchNotes({className, onChangeResults}: SearchNotesProps) {
    let timeout = useRef<number | undefined>(undefined);
    const onSearch = async (evt: KeyboardEvent<HTMLInputElement>) => {
        const searchTerm = evt.currentTarget.value;
        clearTimeout(timeout.current);
        timeout.current = setTimeout(async () => {
            if (!searchTerm) {
                onChangeResults(null);
                return;
            }
            const notes: Note[] = await invoke('search_notes', {searchTerm});
            onChangeResults(notes.map((note) => note.id));
            timeout.current = undefined;
        }, 200) as unknown as number;
    }
    return (
        <div className={'relative ' + className}>
            <input
                className="border rounded-md p-2 dark:bg-gray-800 dark:text-gray-100 text-sm w-full"
                placeholder="Search notes..."
                type="text"
                onKeyUp={onSearch}
            />
            <img src={searchIcon} alt="search"
                 className="h-5 w-5 absolute right-2 top-2 text-gray-500 dark:text-gray-400 cursor-pointer"/>
        </div>
    );
}

export default SearchNotes;
