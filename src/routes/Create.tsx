import {Link, useNavigate} from 'react-router-dom';
import CreateNotes from "@/components/notes/CreateNotes.tsx";

function Create() {
    const navigate = useNavigate();
    const goBack = () => navigate('..');

    return (
        <article className="flex-1 p-4 overflow-y-auto">
            <CreateHeader/>
            <CreateNotes onAfterSubmit={goBack} onAfterCancel={goBack}/>
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

export default Create;
