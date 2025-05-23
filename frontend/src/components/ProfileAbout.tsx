import { FaPencil } from "react-icons/fa6";
import useClickOutSide from "../hooks/useClickOutSide";
import { useAppDispatch, useAppSelector } from "../store/store";
import { useRef, useState } from "react";
import { ProfileUpdateField } from "../types/types";
import { updateProfile } from "../features/authSlice/authThunks";

function ProfileAbout() {
    const authUser = useAppSelector(state => state.auth.user);
    const [updateBio, setUpdateBio] = useState<ProfileUpdateField>({ status: false, value: authUser?.bio || "No bio yet" });
    const [updateDOB, setUpdateDOB] = useState<ProfileUpdateField>({ status: false, value: authUser?.dob as unknown as string || "" });
    const bioBtnRef = useRef<HTMLButtonElement>(null);
    const bioInputRef = useRef<HTMLParagraphElement>(null)
    const dobBtnRef = useRef<HTMLButtonElement>(null);
    const dobInputRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch()
    const hanldleBioUpdate = () => {
        if (!updateBio.value) return;
        const formData = new FormData();
        formData.append('bio', updateBio.value);
        dispatch(updateProfile(formData))
    }
    const handleDOBUpdate = () => {
        if (!updateDOB.value) return;
        const formData = new FormData();
        formData.append('dob', updateDOB.value);
        dispatch(updateProfile(formData));
    };

    useClickOutSide([bioBtnRef, bioInputRef, dobBtnRef, dobInputRef], () => {
        setUpdateBio(prev => ({ ...prev, status: false }))
        setUpdateDOB((prev) => ({ ...prev, status: false }))
    }, [bioBtnRef, bioInputRef, dobBtnRef, dobInputRef])

    return (
        <div className='bg-white rounded-xl p-6 shadow-md mb-6'>
            <h3 className='text-xl font-semibold text-[#904e55] mb-4'>About</h3>
            <p ref={bioInputRef} className='text-[#252627] mb-4 flex justify-center items-center gap-2 w-full'>
                {
                    updateBio.status
                        ? <input onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                hanldleBioUpdate();
                                setUpdateBio(prev => ({ ...prev, status: false }));
                            }
                        }} className='border px-2 w-44 py-0.5 rounded  outline-none' type='text' value={updateBio.value} onChange={(e) => setUpdateBio(prev => ({ ...prev, value: e.target.value }))} ></input>
                        : <span>{authUser?.bio || 'No bio yet'}</span>
                }
                <button ref={bioBtnRef} className='cursor-pointer' onClick={() => setUpdateBio(prev => ({ ...prev, status: !prev.status }))}><FaPencil color='blue' /></button>
            </p>
            <div className='flex items-center text-[#252627]'>
                <svg className="w-5 h-5 mr-2 text-[#904e55]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{authUser?.email || 'No email provided'}</span>
            </div>
            {/* Date of Birth */}
            <div ref={dobInputRef} className='flex items-center text-[#252627]'>
                <svg className="w-5 h-5 mr-2 text-[#904e55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {
                    updateDOB.status
                        ? <input
                            type='date'
                            value={updateDOB.value}
                            onChange={(e) => setUpdateDOB(prev => ({ ...prev, value: e.target.value }))}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleDOBUpdate();
                                    setUpdateDOB(prev => ({ ...prev, status: false }));
                                }
                            }}
                            className='border px-2 py-0.5 rounded outline-none'
                        />
                        : <span>{authUser?.dob
                            ? new Date(authUser.dob).toLocaleDateString()
                            : 'No date of birth provided'}</span>
                }
                <button ref={dobBtnRef} className='ml-2 cursor-pointer' onClick={() => setUpdateDOB(prev => ({ ...prev, status: !prev.status }))}>
                    <FaPencil color='blue' />
                </button>
            </div>
        </div>
    )
}

export default ProfileAbout