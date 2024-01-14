export function startOfTheDay(date: number | string | Date): number {
    return new Date(date).setUTCHours(0, 0, 0, 0);
}

export function subDays(date: number | string | Date, days: number): number {
    date = new Date(date);
    return new Date(date.setUTCDate(date.getUTCDate() - days)).getTime();
}
