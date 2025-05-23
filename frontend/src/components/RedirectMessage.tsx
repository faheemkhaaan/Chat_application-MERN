import { Link } from "react-router-dom";
import { RedirectMessageProps } from "../types/types";
import { useAppDispatch } from "../store/store";
import { useEffect } from "react";
import { clearErrors } from "../features/authSlice/authSlice";



const RedirectMessage = ({ message, linkText, linkTo }: RedirectMessageProps) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(clearErrors())
    }, [])
    return (
        <p className="text-center mt-4 text-sm text-gray-600">
            {message}{" "}
            <Link to={linkTo} className="text-blue-600 hover:underline">
                {linkText}
            </Link>
        </p>
    );
};

export default RedirectMessage;
