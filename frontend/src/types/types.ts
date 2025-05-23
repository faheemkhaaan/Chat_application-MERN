import { AsyncThunk } from "@reduxjs/toolkit";

export type Colors = {
    Ecru: string,
    Wenge: string,
    Cordovan: string,
    Isabelline: string,
    Eerie_Black: string,
}
export type ButtonProps = {
    type?: "button" | "submit" | "reset";
    onClick?: (e: React.MouseEvent) => void;
    className?: string;
    children: React.ReactNode;
    disabled?: boolean;
    style?: React.CSSProperties;
    variant?: "primary" | "secondary" | "danger" | "neutral" | "send" | "outline" | "ghost",
    size?: "sm" | "md" | "lg"
};

export interface RedirectMessageProps {
    message: string;
    linkText: string;
    linkTo: string;
}
export type UserData = {
    username?: string;
    email: string;
    password: string;
}
export type AuthFormProps = {
    authFunction: AsyncThunk<any, any, any>;
    onSuccessRedirect: string
}

export type ProfileUpdateField = {
    status: boolean;
    value: string;
};

export type ProfileTab =
    | 'Overview'
    | 'Media'
    | 'Files'
    | 'Link'
    | 'Events'
    | 'Groups'
    | 'Games'
    | 'Blocked list';

// In your component
export type AuthUserProfileProps = {
    toggleUserInfo: string;
};

export type ProfileLeftSidebarTabs = ['Overview', 'Media', 'Link', 'Groups', "Blocked list"]