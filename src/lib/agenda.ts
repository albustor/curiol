export function generateGoogleCalendarLink(title: string, start: Date, end: Date, details: string) {
    const format = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const url = new URL("https://www.google.com/calendar/render");
    url.searchParams.append("action", "TEMPLATE");
    url.searchParams.append("text", title);
    url.searchParams.append("dates", `${format(start)}/${format(end)}`);
    url.searchParams.append("details", details);
    url.searchParams.append("sf", "true");
    url.searchParams.append("output", "xml");
    return url.toString();
}

export function generateAppleCalendarLink(title: string, start: Date, end: Date, details: string) {
    const format = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const startStr = format(start);
    const endStr = format(end);

    const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "BEGIN:VEVENT",
        `DTSTART:${startStr}`,
        `DTEND:${endStr}`,
        `SUMMARY:${title}`,
        `DESCRIPTION:${details}`,
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\n");

    return `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;
}
