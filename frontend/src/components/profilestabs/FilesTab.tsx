function FilesTab() {
    const files = [
        { name: 'Resume.pdf', size: '200 KB' },
        { name: 'Project.zip', size: '1.2 MB' },
    ];
    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-3">📁 Files</h2>
            <ul className="space-y-2">
                {files.map((file, idx) => (
                    <li key={idx} className="flex justify-between items-center bg-white p-3 shadow rounded-md">
                        <span>{file.name}</span>
                        <span className="text-sm text-gray-500">{file.size}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default FilesTab