import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { AuthFormProps, UserData } from "../types/types";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/store";
import { loginUser } from "../features/authSlice/authThunks";

const useAuthForm = ({ authFunction, onSuccessRedirect }: AuthFormProps) => {
    const [userData, setUserData] = useState<UserData>({
        username: "",
        email: "",
        password: ""
    });
    const { error, loading, authenticated } = useAppSelector(state => state.auth)
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const handleUserData = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    }
    const submitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const resultAction = await dispatch(authFunction(userData));
        if (loginUser.fulfilled.match(resultAction)) {
            setUserData({
                username: "",
                email: "",
                password: ""
            })
        }
    }
    useEffect(() => {
        if (authenticated) {
            navigate(onSuccessRedirect)
        }
    }, [authenticated])
    return {
        userData,
        handleUserData,
        submitForm,
        error,
        loading
    }
}
export default useAuthForm