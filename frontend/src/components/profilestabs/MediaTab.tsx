function MediaTab() {
    const media = [
        { id: 1, url: 'https://via.placeholder.com/150', type: 'Image' },
        { id: 2, url: 'https://via.placeholder.com/150', type: 'Video' },
    ];
    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-3">📷 Media</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {media.map(item => (
                    <div key={item.id} className="rounded overflow-hidden shadow-md">
                        <img src={item.url} alt={item.type} className="w-full h-32 object-cover" />
                        <div className="p-2 text-center text-sm text-gray-600">{item.type}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default MediaTab