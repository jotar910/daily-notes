import { startOfTheDay, subDays } from '@/libs/utils/dates.utils';
import { Note } from '@/libs/models/note.models.ts';

export type NotesGroup = { [key: number]: Note[] };

export function groupNotesByDate(notes: Note[] | null): NotesGroup {
    if (!notes) {
        return {};
    }
    return notes.reduce((groups, note) => {
        const date = startOfTheDay(note.modifiedTimestamp);
        if (!(date in groups)) {
            groups[date] = [];
        }
        groups[date].push(note);
        return groups;
    }, {} as NotesGroup);
}

export function computeDateLabel(timestamp: number): string {
    const today = startOfTheDay(new Date());
    if (timestamp >= today) {
        return 'Today';
    }
    if (timestamp >= subDays(today, 1)) {
        return 'Yesterday';
    }
    for (let i = 2; i < 7; i++) {
        if (timestamp >= subDays(today, i)) {
            return i + ' days ago';
        }
    }
    const date = new Date(timestamp);
    return date.toLocaleDateString();
}
