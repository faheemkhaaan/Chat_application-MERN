
import Button from "../components/Button"
import { colors } from "../utility/colors"
import RedirectMessage from "../components/RedirectMessage"
import useAuthForm from "../hooks/userAuthForm"
import { useEffect } from "react"
import Input from "../components/authComponents/Input"
import { createAccount } from "../features/authSlice/authThunks"

function SignUp() {
    const { userData, submitForm, handleUserData, error, loading } = useAuthForm({
        authFunction: createAccount, onSuccessRedirect: "/login"
    })
    useEffect(() => {
        if (error) {
            console.log(error)
        }
    }, [error])
    return (
        <section
            className="w-screen h-screen flex justify-center items-center p-4"
            style={{ backgroundColor: colors.Eerie_Black }}
        >
            <div
                className="w-96 h-auto rounded-2xl p-6 shadow-lg transform transition duration-300 "
                style={{ backgroundColor: colors.Isabelline, boxShadow: `0 4px 10px ${colors.Wenge}` }}
            >
                <h2
                    className="text-3xl text-center font-semibold mb-6"
                    style={{ color: colors.Cordovan }}
                >
                    Sign up
                </h2>
                <form onSubmit={submitForm} className="flex flex-col space-y-4">
                    <Input
                        label="Username:"
                        id="username"
                        type="text"
                        name="username"
                        className="focus:outline-none p-2"
                        style={{ borderColor: colors.Wenge }}
                        value={userData.username!}
                        onChange={handleUserData}
                        error={error?.errors["username"]}
                    />
                    <Input
                        label="Email:"
                        id="email"
                        type="email"
                        name="email"
                        className="focus:outline-none p-2"
                        style={{ borderColor: colors.Wenge }}
                        value={userData.email}
                        onChange={handleUserData}
                        error={error?.errors["email"]}
                    />
                    <Input
                        label="Password:"
                        id="password"
                        type="password"
                        name="password"
                        className=" focus:outline-none p-2"
                        style={{ borderColor: colors.Wenge }}
                        value={userData.password}
                        onChange={handleUserData}
                        error={error?.errors["password"]}
                    />
                    {/* {
                        error && <p>{error}</p>
                    } */}
                    <Button disabled={loading} className="mt-6" variant="secondary" type="submit" onClick={() => { }} >Create Account</Button>
                </form>
                <RedirectMessage message="Already have an account?" linkText="Login" linkTo="/login" />
            </div>
        </section>
    )
}

export default SignUp