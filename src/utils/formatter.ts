export const dateFormatter = (date: string, type: number) => {
    if (!date) return '';

    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    const day = date.substring(8, 10);

    if (type === 0) return `${year}년 ${month}월 ${day}일`
    if (type === 1) return `${year}. ${month}. ${day}.`


    return null;
}