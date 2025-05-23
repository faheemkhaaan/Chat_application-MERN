import { colors } from "../utility/colors"

function LoginPageLoader() {
    return (
        <div className="w-screen h-screen flex justify-center items-center p-4">
            <div className="w-96 h-96 rounded-2xl p-6 shadow-lg transform transition duration-300" style={{ backgroundColor: colors.Isabelline, boxShadow: `0 4px 10px ${colors.Wenge}` }}></div>
        </div>
    )
}

export default LoginPageLoader