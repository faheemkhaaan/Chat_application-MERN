import { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';
import { updateProfile } from '../../features/authSlice/authThunks';
import { useAppDispatch, useAppSelector } from '../../store/store';

interface Link {
    url: string;
    title: string;
}

function LinkTab() {
    const links = useAppSelector(state => state.auth?.user?.links);
    // const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [newLink, setNewLink] = useState<Link>({ title: '', url: '' });
    const [isAdding, setIsAdding] = useState(false);
    const dispatch = useAppDispatch()

    const handleSaveLink = () => {
        if (!newLink.url || !newLink.title) return;
        const formData = new FormData();
        console.log(newLink)
        formData.append("link", JSON.stringify(newLink));
        dispatch(updateProfile(formData));
        setIsAdding(false);
    };



    const handleUpdateLink = () => {
        if (!editId || !newLink.url) return;
        setEditId(null);
        setNewLink({ title: '', url: '' });
    };



    // const startEditing = (link: Link) => {
    //     setEditId(link.id);
    //     setNewLink({ title: link.title, url: link.url });
    // };

    const cancelEditing = () => {
        setEditId(null);
        setNewLink({ title: '', url: '' });
    };

    const cancelAdding = () => {
        setIsAdding(false);
        setNewLink({ title: '', url: '' });
    };

    return (
        <div className="p-4  h-full relative  w-full box-border">
            <div className="flex justify-center items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span className="text-blue-500">🔗</span> My Links
                </h2>

            </div>

            {/* Add Link Form */}
            {(isAdding || editId) && (
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <div className="flex flex-wrap justify-center items-center gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                URL *
                            </label>
                            <input
                                type="url"
                                placeholder="https://example.com"
                                value={newLink.url}
                                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title (optional)
                            </label>
                            <input
                                type="text"
                                placeholder="My Portfolio"
                                value={newLink.title}
                                onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex justify-center gap-2">
                        <button
                            onClick={editId ? cancelEditing : cancelAdding}
                            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition"
                        >
                            <FaTimes className="inline mr-1" /> Cancel
                        </button>
                        <button
                            onClick={editId ? handleUpdateLink : handleSaveLink}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center"
                            disabled={!newLink.url}
                        >
                            <FaCheck className="inline mr-1" /> {editId ? 'Update' : 'Save'}
                        </button>
                    </div>
                </div>
            )}

            {/* Links List */}
            <div className=" overflow-y-auto">
                {links && links.length === 0 && !isAdding ? (
                    <div className="text-center py-8 bg-white rounded-lg shadow w-full max-w-2xl mx-auto">
                        <p className="text-gray-500">No links added yet</p>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="mt-4 text-blue-500 hover:text-blue-700 font-medium"
                        >
                            Add your first link
                        </button>
                    </div>
                ) : (
                    <div className="w-full max-w-2xl mx-auto space-y-3">
                        {links && links.map((link) => (
                            <div
                                key={link._id}
                                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition relative group w-full"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium block truncate"
                                            title={link.title || link.url}
                                        >
                                            {link.title || link.url.substring(0, 20)}
                                        </a>
                                        {link.title && (
                                            <p className="text-sm text-gray-500 mt-1 truncate" title={link.url}>
                                                {link.url.substring(0, 20)}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition">
                                        <button
                                            // onClick={() => startEditing(link)}
                                            className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full"
                                            title="Edit"
                                        >
                                            <FaEdit size={14} />
                                        </button>
                                        <button
                                            // onClick={() => handleDeleteLink(link.id)}
                                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full"
                                            title="Delete"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {!isAdding && (
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex absolute justify-center bottom-8 left-1/2 -translate-x-1/2 w-2/3 items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                >
                    <FaPlus /> Add Link
                </button>
            )}
        </div>
    );
}

export default LinkTab;