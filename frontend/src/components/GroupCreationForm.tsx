import { MdClose, MdGroupAdd } from "react-icons/md";
import Button from "./Button";
import Input from "./authComponents/Input";
import { RootState, useAppDispatch, useAppSelector } from "../store/store";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiChevronDown, FiCheck } from "react-icons/fi";
import { createGroup } from "../features/groupSlice/thunks";
import { createSelector } from "@reduxjs/toolkit";
import { closeGroupCreationForm } from "../features/uiSlice/slice";

const groupCreationFormSelector = createSelector(
    [
        (state: RootState) => state.users.users,
        (state: RootState) => state.ui.modals.groupCreationFormOpen,
    ], (users, groupCreationFormOpen) => {
        return {
            users,
            isOpen: groupCreationFormOpen
        }
    }
)
function GroupCreationForm() {
    const { users, isOpen } = useAppSelector(groupCreationFormSelector);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [membersOptionDropdown, setMembersOptionDropDown] = useState(false);
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const user = useAppSelector(state => state.auth.user);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatarFile(e.target.files[0]);
        }
    };

    const handleSelectMembers = (id: string) => {
        setSelectedMembers(prev => {
            if (prev.includes(id)) {
                return prev.filter(userId => userId !== id);
            }
            return [...prev, id];
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !user?._id || !formData.description) return;

        setIsLoading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('creator', user._id);
            formDataToSend.append("members", JSON.stringify(selectedMembers));
            if (avatarFile) {
                formDataToSend.append('avatar', avatarFile);
            }
            dispatch(createGroup({ groupInfo: formDataToSend }));

            // Reset form
            setFormData({ name: '', description: '' });
            setSelectedMembers([]);
            setAvatarFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            dispatch(closeGroupCreationForm())
        } catch (error) {
            console.error('Error creating group:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isOpen && createPortal(
                <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-[1000]">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Create New Group</h2>
                                <button
                                    onClick={() => dispatch(closeGroupCreationForm())}
                                    className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                                    aria-label="Close"
                                >
                                    <MdClose size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-6">
                                    <Input
                                        label="Group Name"
                                        value={formData.name}
                                        type="text"
                                        name="name"
                                        id="name"
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter group name"
                                    />

                                    <Input
                                        label="Description"
                                        value={formData.description}
                                        type="text"
                                        name="description"
                                        id="description"
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter group description"
                                    />

                                    <div className="relative" ref={dropdownRef}>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Add Members
                                        </label>
                                        <div
                                            className="border border-gray-300 rounded-lg p-3 bg-white cursor-pointer flex items-center justify-between"
                                            onClick={() => setMembersOptionDropDown(!membersOptionDropdown)}
                                        >
                                            <div className="flex flex-wrap gap-1">
                                                {selectedMembers.length > 0 ? (
                                                    selectedMembers.map(id => (
                                                        <span key={id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                                                            {users[id]?.username}
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleSelectMembers(id);
                                                                }}
                                                                className="ml-1 text-blue-600 hover:text-blue-800"
                                                            >
                                                                ×
                                                            </button>
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-400">Select members...</span>
                                                )}
                                            </div>
                                            <FiChevronDown className={`transition-transform ${membersOptionDropdown ? 'rotate-180' : ''}`} />
                                        </div>

                                        {membersOptionDropdown && (
                                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg py-1 max-h-60 overflow-auto border border-gray-200">
                                                {Object.entries(users).map(([id, user]) => (
                                                    <div
                                                        key={id}
                                                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center"
                                                        onClick={() => handleSelectMembers(id)}
                                                    >
                                                        <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${selectedMembers.includes(id) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                                                            {selectedMembers.includes(id) && <FiCheck className="text-white" size={14} />}
                                                        </div>
                                                        <img
                                                            src={user.picture || "/default-profile.png"}
                                                            alt={user.username}
                                                            className="w-8 h-8 rounded-full mr-3"
                                                        />
                                                        <span className="text-gray-800">{user.username}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Group Avatar
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-16 h-16 rounded-full bg-gray-200 overflow-hidden border-2 border-gray-300">
                                                {avatarFile ? (
                                                    <img
                                                        src={URL.createObjectURL(avatarFile)}
                                                        alt="Group avatar preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <MdGroupAdd size={24} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    name="avatar"
                                                    id="avatar"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                                <label
                                                    htmlFor="avatar"
                                                    className="block w-full px-4 py-2 text-sm text-gray-700 bg-white rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors"
                                                >
                                                    {avatarFile ? 'Change Image' : 'Choose Image'}
                                                </label>
                                                {avatarFile && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setAvatarFile(null);
                                                            if (fileInputRef.current) fileInputRef.current.value = '';
                                                        }}
                                                        className="mt-2 text-sm text-red-600 hover:text-red-800"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => dispatch(closeGroupCreationForm())}
                                        className="px-6 py-2"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isLoading || !formData.name.trim() || !formData.description.trim() || selectedMembers.length === 0}
                                        className="px-6 py-2"
                                    >
                                        {isLoading ? 'Creating...' : 'Create Group'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}

export default GroupCreationForm;