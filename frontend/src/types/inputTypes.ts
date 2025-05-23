import { ChangeEventHandler } from "react"

export type InputProps = {
    type: string
    id: string
    name: string
    label: string
    className?: string,
    style?: React.CSSProperties;
    value: string;
    hasError?: boolean;
    error?: string | null;
    onChange: ChangeEventHandler<HTMLInputElement>;
    placeholder?: string;
    required?: boolean;
    accept?: string;
}
