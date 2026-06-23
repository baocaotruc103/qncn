export function getTimelineTime(value) {
    const raw = String(value || '').trim();
    if (!raw) return Number.NEGATIVE_INFINITY;

    const isoDate = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (isoDate) {
        const [, year, month, day] = isoDate;
        return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
    }

    const slashDate = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (slashDate) {
        const [, day, month, year] = slashDate;
        return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
    }

    const monthYear = raw.match(/^(\d{1,2})\/(\d{4})$/);
    if (monthYear) {
        const [, month, year] = monthYear;
        return new Date(Number(year), Number(month) - 1, 1).getTime();
    }

    const yearOnly = raw.match(/^(\d{4})$/);
    if (yearOnly) {
        return new Date(Number(yearOnly[1]), 0, 1).getTime();
    }

    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? Number.NEGATIVE_INFINITY : parsed.getTime();
}

export function sortByTimelineDesc(rows, getValue) {
    return [...(rows || [])]
        .map((row, index) => ({ row, index }))
        .sort((a, b) => {
            const diff = getTimelineTime(getValue(b.row)) - getTimelineTime(getValue(a.row));
            return diff || a.index - b.index;
        })
        .map(({ row }) => row);
}
