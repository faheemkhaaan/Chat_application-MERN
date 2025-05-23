import { forwardRef } from "react";
import { ButtonProps } from "../types/types";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    variant = "primary",
    type = "button",
    onClick,
    className = "",
    children,
    disabled = false,
    size,
    style,
    ...props
}, ref) => {
    const baseStyles = "font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const sizeStyles = {
        sm: "py-1 px-3 text-sm",
        md: "py-2 px-4 text-base",
        lg: "py-3 px-6 text-lg"
    };

    const variantStyles = {
        neutral: "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-300",
        primary: "bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-500 shadow-sm",
        secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300",
        danger: "bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-300 shadow-sm",
        send: "text-blue-500 bg-transparent hover:bg-blue-50 focus:ring-blue-300",
        outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-300",
        ghost: "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-200"
    };

    const selectedSize = size ? sizeStyles[size] : sizeStyles.md;

    return (
        <button
            disabled={disabled}
            ref={ref}
            onClick={onClick}
            type={type}
            className={`${baseStyles} ${selectedSize} ${variantStyles[variant]} ${className}`}
            style={{ ...style }}
            {...props}
        >
            {children}
        </button>
    )
});

Button.displayName = "Button";

export default Button;