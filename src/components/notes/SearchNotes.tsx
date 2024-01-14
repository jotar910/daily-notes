import searchIcon from '@/assets/search.svg';

interface SearchNotesProps {
    className: string;
}

function SearchNotes({ className }: SearchNotesProps) {
    return (
        <div className={'relative ' + className}>
            <input
                className="border rounded-md p-2 dark:bg-gray-800 dark:text-gray-100 text-sm w-full"
                placeholder="Search notes..."
                type="text"
            />
            <img src={searchIcon} alt="search"
                 className="h-5 w-5 absolute right-2 top-2 text-gray-500 dark:text-gray-400 cursor-pointer"/>
        </div>
    );
}

export default SearchNotes;
