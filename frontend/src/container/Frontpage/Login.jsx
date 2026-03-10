import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import leen_logo_valge from "../../assets/images/LEEN_logo_valge.png";
import deco_register_0 from "../../assets/images/deco_register_0.png";
import deco_register_1 from "../../assets/images/deco_register_1.png";

import user from "../../assets/icons/user.png";
import email from "../../assets/icons/mail.png";
import password from "../../assets/icons/password.png";

import google_ico from "../../assets/icons/google.png"
import { API_BASE_URL } from "../../API";

const Login = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setError("");
            setLoading(true);

            try {
                // Get user info from Google using the access token
                const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                });

                const userInfo = await userInfoResponse.json();

                // Send to backend
                const response = await fetch("http://localhost:3005/api/google", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        accessToken: tokenResponse.access_token,
                        userInfo: userInfo,
                    }),
                });

                const data = await response.json();

                if (data.success) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    window.location.href = "/";
                } else {
                    setError(data.message || "Google login failed");
                }
            } catch (err) {
                setError("An error occurred with Google login. Please try again.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        },
        onError: () => {
            setError("Google login failed. Please try again.");
        },
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const emailValue = document.getElementById("email").value;
        const passwordValue = document.getElementById("parool").value;

        try {
            const response = await fetch(API_BASE_URL +"/api/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: emailValue,
                    password: passwordValue,
                }),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                window.location.href = "/"; // Redirect to home or dashboard
            } else {
                setError(data.error || "Login failed");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex">
            <div className="w-1/2 h-screen bg-black text-white items-center justify-center flex flex-col relative">
                <img className="absolute left-4 top-4 w-36" src={leen_logo_valge} alt="LEEN Logo" />
                <img className="absolute right-0 top-0" src={deco_register_0} alt="Deco Register 0" />
                <img className="absolute left-0 bottom-0" src={deco_register_1} alt="Deco Register 1" />
                <h1 className="text-4xl">Tere tulemast!</h1>
                <p className="text-xl px-32 text-center pt-8">Loo konto.</p>
                <button className="border-2 rounded-full px-32 py-4 mt-16 cursor-pointer" onClick={() => window.location.href = "/register"}><h1 className="text-2xl">Registreeru</h1></button>
            </div>
            <div className="w-1/2 h-screen flex items-center justify-center flex-col">
                <div className="w-1/2">
                    <h1 className="text-4xl mb-4 text-center">Sisselogimine</h1>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleLogin}>
                        <div className="flex flex-col gap-6">
                            <div className="form-bg rounded-md h-10 flex">
                                <img className="py-3 px-3" src={email} alt="email icon" />
                                <input className="h-10 w-full" id="email" placeholder="Email" type="email" required />
                            </div>
                            <div className="form-bg rounded-md h-10 flex">
                                <img className="py-3 px-3" src={password} alt="password icon" />
                                <input className="h-10 w-full" id="parool" placeholder="Parool" type="password" required />
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="cursor-pointer w-full bg-black rounded-full py-4 mt-8 disabled:opacity-50"
                        >
                            <h1 className="text-center text-white">{loading ? "Palun oota..." : "Logi sisse"}</h1>
                        </button>
                    </form>

                    <div className="flex justify-center border-t mt-4 border-zinc-200">
                        <button 
                            onClick={() => googleLogin()} 
                            disabled={loading}
                            className="flex items-center py-4 mt-4 w-full relative justify-center border-2 border-zinc-300 rounded-full p-2 cursor-pointer hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <img className="absolute left-3" src={google_ico} alt="Google icon" />
                            <h1>Sisene Google'iga</h1>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Login;