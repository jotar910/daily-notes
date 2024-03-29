import {FormEvent, useEffect, useState} from "react";
import {Store} from "tauri-plugin-store-api";
import {invoke, window as tauriWindow} from "@tauri-apps/api";

function Settings() {
    const [keymap, setKeymap] = useState('');
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const load = async () => {
            const settings: string = await invoke('settings_path');
            const store = new Store(settings);
            await store.load();
            setKeymap(await store.get("keymap") || '');
        };
        load();
    }, []);

    useEffect(() => {
        const currentWindow = tauriWindow.getCurrent();
        const listen = async () => {
            return currentWindow.listen('tauri://blur', () => {
                currentWindow.close();
            });
        };
        const result = listen();
        return () => {
            result.then((unlisten) => unlisten());
        }
    }, []);

    const onSubmit = async (evt: FormEvent) => {
        evt.preventDefault();
        try {
            await invoke('set_keymap', {keymap});
            await invoke('close_settings');
        } catch (err) {
            console.error('failed to set keymap', err);
            setError(err);
        }
    };

    const onClose = async () => {
        await invoke('close_settings');
    };

    return (
        <form className="p-4" onSubmit={onSubmit}>
            <label className="muted mb-2" htmlFor="keymap">Keymap shortcut:</label>
            <input
                id="keymap"
                autoFocus={true}
                value={keymap}
                placeholder="Enter keymap"
                className="text-lg font-semibold border-2 border-gray-300 rounded text-gray-900 dark:text-gray-100 w-full mb-2 p-2"
                onChange={(evt) => setKeymap(evt.currentTarget.value)}
                onKeyUp={(evt) => evt.key === 'Escape' && onClose()}
            />
            {error && <p className="muted">{error}</p>}
        </form>
    );
}

export default Settings;
