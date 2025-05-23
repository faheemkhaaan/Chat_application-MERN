
import Button from "../components/Button";
import Input from "../components/authComponents/Input";
import { colors } from "../utility/colors";
import RedirectMessage from "../components/RedirectMessage";
import useAuthForm from "../hooks/userAuthForm";
import { useEffect } from "react";
import { loginUser } from "../features/authSlice/authThunks";

function Login() {
    const { userData, submitForm, handleUserData, error, loading } = useAuthForm({ authFunction: loginUser, onSuccessRedirect: "/chat" })

    useEffect(() => {
        console.log(error)
    }, [error])
    return (
        <section
            className="w-screen h-screen flex justify-center items-center p-4"
            style={{ backgroundColor: colors.Eerie_Black }}
        >
            <div
                className="w-96 h-auto rounded-2xl p-6 shadow-lg transform transition duration-300"
                style={{ backgroundColor: colors.Isabelline, boxShadow: `0 4px 10px ${colors.Wenge}` }}
            >
                <h2
                    className="text-3xl text-center font-semibold mb-6"
                    style={{ color: colors.Cordovan }}
                >
                    Welcome Back
                </h2>
                <form onSubmit={submitForm} className="flex flex-col space-y-4">
                    <Input
                        label="Email:"
                        id="email"
                        type="email"
                        name="email"
                        error={error?.errors["email"]}
                        className=" focus:outline-none p-2"
                        style={{ borderColor: colors.Wenge }}
                        value={userData.email}
                        onChange={handleUserData}
                    />
                    <Input
                        label="Password:"
                        id="password"
                        type="password"
                        name="password"
                        className=" focus:outline-none p-2"
                        error={error?.errors["password"]}
                        style={{ borderColor: colors.Wenge }}
                        value={userData.password}
                        onChange={handleUserData}
                    />
                    {/* {
                        error && !error.includes("email") && !error.includes("password") && <p>{error}</p>
                    } */}
                    <Button disabled={loading} className="mt-6" type="submit" onClick={() => { }} >Login</Button>
                    <RedirectMessage message="Don't have an account?" linkText="Signup" linkTo="/signup" />
                </form>
            </div>
        </section>
    );
}

export default Login