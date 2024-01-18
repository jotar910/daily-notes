import CreateNotes from "@/components/notes/CreateNotes.tsx";
import {window as tauriWindow} from "@tauri-apps/api";
import {useEffect} from "react";
import {emit} from "@tauri-apps/api/event";

function CreateStandalone() {
    const currentWindow = tauriWindow.getCurrent();
    useEffect(() => {
        const onKeyup = (evt: KeyboardEvent) => evt.key === 'Escape' && close();
        window.addEventListener('keyup', onKeyup);
        return () => window.removeEventListener('keyup', onKeyup);
    }, []);
    const close = () => currentWindow.emit("tauri://close-requested");
    return (
        <article className="flex-1 p-4 overflow-y-auto">
            <CreateNotes
                onAfterSubmit={() => {
                    emit('creation_submit');
                    currentWindow.close();
                }}
                onAfterCancel={() => {
                    emit('creation_cancel');
                    close();
                }}/>
        </article>
    );
}

export default CreateStandalone;
