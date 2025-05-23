function EventsTab() {
    const events = [
        { name: 'Team Meeting', date: '2025-04-25' },
        { name: 'Project Deadline', date: '2025-05-01' },
    ];
    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-3">📅 Events</h2>
            <ul className="space-y-2">
                {events.map((event, idx) => (
                    <li key={idx} className="bg-white p-3 shadow rounded-md flex justify-between">
                        <span>{event.name}</span>
                        <span className="text-sm text-gray-500">{event.date}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default EventsTab