function GroupsTab() {
    const groups = ['Frontend Developers', 'Gaming Squad', 'College Friends'];
    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-3">👥 Groups</h2>
            <ul className="space-y-2">
                {groups.map((group, idx) => (
                    <li key={idx} className="bg-white p-3 shadow rounded-md">{group}</li>
                ))}
            </ul>
        </div>
    );
}

export default GroupsTab