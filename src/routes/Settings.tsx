import {FormEvent, useEffect, useState} from "react";
import {Store} from "tauri-plugin-store-api";
import {WebviewWindow} from "@tauri-apps/api/window";
import {invoke} from "@tauri-apps/api";

function Settings() {
    const settings = import.meta.env.VITE_SETTINGS_PATH;
    const [keymap, setKeymap] = useState('');
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const load = async () => {
            const store = new Store(settings);
            setKeymap(await store.get("keymap") || '');
        };
        load();
    }, [settings]);

    useEffect(() => {
        const window = new WebviewWindow('settings');
        const listen = async () => {
            return window.listen('tauri://blur', () => {
                window.close();
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
