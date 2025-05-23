import { InputProps } from "../../types/inputTypes"
import { colors } from "../../utility/colors"


function Input({ id, onChange, value, type, name, label, style, className, hasError, error, accept, ...props }: InputProps) {

    console.log(error);
    return (
        <div
            className={` border-b-2`}
            style={{ borderColor: colors.Wenge }}
        >
            <div className="flex gap-2 w-full justify-between items-center border-b-2">

                <label htmlFor={id}>{label}</label>
                <input accept={accept} {...props} value={value} onChange={onChange} type={type} name={name} id={id} className={`p-2 w-3/4  focus:outline-none ${className}`} style={{ borderColor: colors.Wenge, ...style }} />
            </div>
            {
                error && <p className="text-red-600 py-2 px-1 text-xs">{error}</p>
            }
        </div>)
}
export default Input