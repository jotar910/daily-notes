import {validationMessage} from '@/libs/utils/validation.utils.ts';
import {Button} from '@/components/ui/button.tsx';
import {useBlocker} from 'react-router-dom';
import {RegisterOptions, SubmitHandler, useForm} from 'react-hook-form';
import {KeyboardEvent, useEffect, useState} from 'react';
import {Note} from '@/libs/models/note.models.ts';
import {dialog, window as tauriWindow} from "@tauri-apps/api";

export type Inputs = {
    title: string
    description: string
}

interface NotesFormProps {
    note: Note;
    loading: boolean;
    routePrompt?: boolean;
    onSubmit: SubmitHandler<Inputs>;
    onCancel: () => void;
}

function NotesForm({note, loading, routePrompt = true, onSubmit, onCancel}: NotesFormProps) {
    const {
        register,
        handleSubmit,
        formState: {errors, touchedFields, isValid},
    } = useForm<Inputs>();

    const onSubmitWrapper = handleSubmit(onSubmit);
    const validations: Record<keyof Inputs, RegisterOptions> = {
        title: {required: true, minLength: 3, maxLength: 256},
        description: {required: true, maxLength: 4096}
    };
    const isTouched = Object.keys(touchedFields).length > 0;

    useFormPrompt(isTouched && routePrompt);

    const onKeyDown = (evt: KeyboardEvent<HTMLElement>) => {
        if (evt.key === 'Enter' && (evt.altKey || evt.metaKey)) {
            evt.preventDefault();
            onSubmitWrapper(evt);
        }
    }

    return (
        <>
            <form onSubmit={onSubmitWrapper} className="mt-4">
                <input
                    autoFocus={true}
                    defaultValue={note.title}
                    placeholder="Enter title"
                    className="text-lg font-semibold text-gray-900 dark:text-gray-100 w-full p-2"
                    {...register('title', validations.title)}
                />
                {errors.title && <p className="my-1 muted">{validationMessage(errors.title, validations.title)}</p>}
                <div className="flex justify-between items-center">
                    <div>
                        <Button
                            tabIndex={-1}
                            disabled={!isValid || !isTouched || loading}
                            type="submit"
                            className="text-sm text-blue-500 dark:text-blue-400 mr-2 px-0"
                            variant="link"
                        >
                            Save
                        </Button>
                        <Button
                            tabIndex={-1}
                            disabled={loading}
                            type="button"
                            className="text-sm text-red-500 dark:text-red-400 px-0"
                            variant="link"
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
                <textarea
                    defaultValue={note.description}
                    placeholder="Enter description here..."
                    className="text-gray-700 dark:text-gray-200 w-full p-2"
                    rows={20}
                    onKeyDown={onKeyDown}
                    {...register('description', validations.description)}
                ></textarea>
                {errors.description &&
                    <p className="my-1 muted">{validationMessage(errors.description, validations.description)}</p>}
            </form>
        </>
    );
}

function useFormPrompt(when: boolean) {
    const [blocking, setBlocking] = useState<boolean>(false);

    const blocker = useBlocker(() => {
        if (!when) {
            return false;
        }
        !blocking && setBlocking(true);
        return true;
    });

    useEffect(() => {
        const confirm = async () => {
            if (!blocking) {
                return;
            }
            const confirm = await dialog.confirm('Are you sure?');
            confirm && blocker.state === 'blocked' && blocker.proceed();
            setBlocking(false);
        };
        confirm();
    }, [blocking, blocker]);

    useEffect(() => {
        const currentWindow = tauriWindow.getCurrent();
        const listen = currentWindow.listen("tauri://close-requested", async () => {
            if (!when || await dialog.confirm('Are you sure?')) {
                await currentWindow.close();
            }
        });
        return () => {
            listen.then((unlisten) => unlisten());
        };
    }, [when]);

    return blocking;
}

export default NotesForm;
