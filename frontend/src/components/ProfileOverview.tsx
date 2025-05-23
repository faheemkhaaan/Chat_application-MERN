import { useRef, useState } from "react";
import useClickOutSide from "../hooks/useClickOutSide";
import ProfileAbout from "./ProfileAbout";
import { useAppDispatch, useAppSelector } from "../store/store";
import { ProfileUpdateField } from "../types/types";
import { FaPencil } from "react-icons/fa6";
import { updateProfile } from "../features/authSlice/authThunks";

function ProfileOverview() {
    const dispatch = useAppDispatch()
    const authUser = useAppSelector(state => state.auth.user);
    const profilePic = authUser?.picture || '/default-profile.png'
    const [updateUsername, setUpdateUsername] = useState<ProfileUpdateField>({ status: false, value: authUser?.username || "username" });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const usernameBtnRef = useRef<HTMLButtonElement>(null);
    const usernameInputRef = useRef<HTMLHeadingElement>(null);
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };
    useClickOutSide([usernameBtnRef, usernameInputRef], () => {
        setUpdateUsername(prev => ({ ...prev, status: false }))
    }, [usernameBtnRef])

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append("picture", file);
            dispatch(updateProfile(formData));
        }
    };
    const handleUsernameUpdate = () => {
        if (!updateUsername.value) return;
        const formData = new FormData();
        formData.append("username", updateUsername.value)
        dispatch(updateProfile(formData))
    }

    return (
        <div className='bg-[#f2efe9] py-4 px-3 overflow-y-auto'>
            <div className='max-w-md mx-auto'>
                {/* Profile Image and Name */}
                <div className='text-center  relative group'>
                    <div className='relative inline-block'>
                        <img
                            loading='lazy'
                            src={profilePic}
                            alt="profile"
                            className='size-32 rounded-full mx-auto mb-4 border-4 border-[#904e55] object-cover shadow-lg'
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '/default-profile.png';
                            }}
                        />
                        <div
                            className='absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer'
                            onClick={triggerFileInput}
                        >
                            <span className='text-white font-medium'>Change Photo</span>
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className='hidden'
                    />

                </div>

                <div className='flex justify-center items-center flex-col'>
                    <h2 ref={usernameInputRef} className='text-3xl font-bold text-[#252627] flex justify-center items-center gap-2 w-max'>
                        {
                            updateUsername.status
                                ? <input onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleUsernameUpdate()
                                        setUpdateUsername(prev => ({ ...prev, status: false }))
                                    }
                                }} className='border px-2 py-0.5 w-44 flex-1 max-w-max outline-none rounded' type='text' value={updateUsername.value} onChange={(e) => setUpdateUsername(prev => ({ ...prev, value: e.target.value }))}></input>
                                : <span>{authUser?.username || 'User'}</span>

                        }
                        <button ref={usernameBtnRef} onClick={() => setUpdateUsername(prev => ({ ...prev, status: !prev.status }))} className='cursor-pointer text-lg'><FaPencil color='blue' /></button> </h2>
                    <p className='text-[#564E58] mt-1'>Member since {new Date(authUser?.createdAt!).toLocaleDateString()}</p>
                </div>
                {/* About and Email */}
                <ProfileAbout />


            </div>
        </div>
    )
}

export default ProfileOverview