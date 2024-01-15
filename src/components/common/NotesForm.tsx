import Prompt from '@/components/common/Prompt.tsx';
import { validationMessage } from '@/libs/utils/validation.utils.ts';
import { Button } from '@/components/ui/button.tsx';
import { useBlocker, useNavigate } from 'react-router-dom';
import { RegisterOptions, SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Note } from '@/libs/models/note.models.ts';

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

function NotesForm({ note, loading, routePrompt = true, onSubmit, onCancel }: NotesFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields, isValid },
    } = useForm<Inputs>();

    const validations: Record<keyof Inputs, RegisterOptions> = {
        title: { required: true, minLength: 3, maxLength: 256 },
        description: { required: true, maxLength: 4096 }
    };
    const isTouched = Object.keys(touchedFields).length > 0;

    const { blocking, unblock, setConfirmed } = useFormPrompt(isTouched && routePrompt);

    useEffect(() => {
        !routePrompt && unblock();
    }, [routePrompt]);

    return (
        <>
            {blocking && <Prompt
                title="Are you sure?"
                message="By leaving, all the changes will be lost!"
                onOk={() => setConfirmed(true)}
                onCancel={() => setConfirmed(false)}
            ></Prompt>}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                <input
                    defaultValue={note.title}
                    placeholder="Enter title"
                    className="text-lg font-semibold text-gray-900 dark:text-gray-100 w-full p-2"
                    {...register('title', validations.title)}
                />
                {errors.title && <p className="my-1 muted">{validationMessage(errors.title, validations.title)}</p>}
                <div className="flex justify-between items-center">
                    <div>
                        <Button
                            disabled={!isValid || !isTouched || loading}
                            type="submit"
                            className="text-sm text-blue-500 dark:text-blue-400 mr-2 px-0"
                            variant="link"
                        >
                            Save
                        </Button>
                        <Button
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
                    className="text-gray-700 dark:text-gray-200 w-full p-2" rows={20}
                    {...register('description', validations.description)}
                ></textarea>
                {errors.description && <p className="my-1 muted">{validationMessage(errors.description, validations.description)}</p>}
            </form>
        </>
    );
}

function useFormPrompt(when: boolean) {
    const [nextLocation, setNextLocation] = useState<string | null>(null);
    const [blocking, setBlocking] = useState<boolean>(false);
    const [confirmed, setConfirmed] = useState<boolean>(false);

    const blocker = useBlocker(({ nextLocation }) => {
        setNextLocation(nextLocation.pathname);
        if (!when || confirmed || blocking) {
            return false;
        }
        !blocking && setBlocking(true);
        return true;
    });

    const navigate = useNavigate();
    useEffect(() => {
        if (!nextLocation || !confirmed) {
            return;
        }
        setNextLocation(null);
        navigate(nextLocation);
    }, [nextLocation, confirmed]);

    return {
        blocking,
        unblock: () => {
            blocker.state === 'blocked' && blocker.reset();
        },
        setConfirmed: (confirm: boolean) => {
            setConfirmed(confirm);
            setBlocking(false);
        }
    };
}

export default NotesForm;
