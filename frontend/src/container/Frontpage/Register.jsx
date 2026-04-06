import leen_logo_valge from "../../assets/images/LEEN_logo_valge.png";
import deco_register_0 from "../../assets/images/deco_register_0.png";
import deco_register_1 from "../../assets/images/deco_register_1.png";

import user from "../../assets/icons/user.png";
import email from "../../assets/icons/mail.png";
import password from "../../assets/icons/password.png";

import google_ico from "../../assets/icons/google.png"
import { API_BASE_URL } from "../../API";
import { useState } from "react";

const Register = () => {

    const [error, setError] = useState("");

    const RegisterAccount = () => {
        const name = document.getElementById("nimi").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("parool").value;
        const confirmPassword = document.getElementById("kinnita_parool").value;
        const termsAccepted = document.getElementById("noustun").checked;
        const updatesAccepted = document.getElementById("värskendused").checked;

        if (!name || !email || !password || !confirmPassword) {
            setError("Palun täida kõik väljad.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Paroolid ei ühti.");
            return;
        }

        if (!termsAccepted) {
            setError("Peate nõustuma tingimustega.");
            return;
        }

        fetch(API_BASE_URL + "/api/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                password,
                updatesAccepted,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    localStorage.setItem("token", data.token);
                    window.location.href = "/"
                } else {
                    setError(data.message || "Registreerimine ebaõnnestus.");
                }
            })
            .catch((err) => {
                setError("Registreerimisel tekkis viga. Palun proovi uuesti.");
                console.error(err);
            })
    }

    return (
        <div class="h-screen flex">
            <div class="hidden w-1/2 h-screen bg-black text-white items-center justify-center md:flex flex-col relative">
            <div className="cursor-pointer" onClick={() => window.location.href = "/"}>
                <img class="absolute left-4 top-4 w-36" src={leen_logo_valge} alt="LEEN Logo" />
                </div>
                <img class="absolute right-0 top-0 " src={deco_register_0} alt="Deco Register 0" />
                <img class="absolute left-0 bottom-0" src={deco_register_1} alt="Deco Register 1" />
                <h1 class=" text-4xl">Tere tulemast tagasi!</h1>
                <p class="text-xl px-32 text-center pt-8">Meiega ühenduses püsimiseks logige sisse oma isikuandmetega</p>
                <button class="border-2 rounded-full px-32 py-4 mt-16 cursor-pointer" onClick={() => window.location.href = "/login"}><h1 class="text-2xl">Logi sisse</h1></button>
            </div>
            <div class="w-full md:w-1/2 h-screen flex items-center justify-center flex-col">
                <div class="w-2/3 md:w-1/2">
                    <h1 class="text-4xl mb-4 text-center">Loo kasutaja</h1>
                    <div class="flex flex-col gap-6">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}
                        <div class="form-bg rounded-md h-10 flex">
                            <img class="py-3 px-3" src={user}></img>
                            <input class="h-10 w-full" id="nimi" placeholder="Nimi" type="name"></input>
                        </div>
                        <div class="form-bg rounded-md h-10 flex">
                            <img class="py-3 px-3" src={email}></img>
                            <input class="h-10 w-full" id="email" placeholder="Email" type="email"></input>
                        </div>
                        <div class="form-bg rounded-md h-10 flex">
                            <img class="py-3 px-3" src={password}></img>
                            <input class="h-10 w-full" id="parool" placeholder="Parool" type="password"></input>
                        </div>
                        <div class="form-bg rounded-md h-10 flex">
                            <img class="py-3 px-3" src={password}></img>
                            <input class="h-10 w-full" id="kinnita_parool" placeholder="Kinnita parool" type="password"></input>
                        </div>
                        <label class="flex items-center gap-3 cursor-pointer select-none py-2">
                            <input
                                id="noustun"
                                type="checkbox"
                                class="appearance-none relative w-5 h-5 rounded-full border-2 border-zinc-400 checked:bg-black checked:border-black focus:outline-none focus:ring-2 focus:ring-black/30 after:content-[''] checked:after:content-['✓'] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-transparent checked:after:text-white after:text-xs after:font-bold"
                            />
                            <span>Nõustun tingimustega</span>
                        </label>
                    </div>
                    <label class="flex items-center gap-3 cursor-pointer select-none py-2">
                        <input
                            id="värskendused"
                            type="checkbox"
                            class="appearance-none relative w-5 h-5 rounded-full border-2 border-zinc-400 checked:bg-black checked:border-black focus:outline-none focus:ring-2 focus:ring-black/30 after:content-[''] checked:after:content-['✓'] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-transparent checked:after:text-white after:text-xs after:font-bold"
                        />
                        <span>Nõustun saama värskendusi e-posti teel</span>
                    </label>
                    <button class="cursor-pointer w-full bg-black rounded-full py-4 mt-8" onClick={() => RegisterAccount()}><h1 class="text-center text-white">Registreeru</h1></button>
                    <div class="flex justify-center border-t mt-4 border-zinc-200">
                        <button class="flex items-center py-4 mt-4 w-full relative justify-center border-2 border-zinc-300 rounded-full p-2 cursor-pointer">
                            <img class="absolute left-3" src={google_ico}></img>
                            <h1>Sisene Google'iga</h1>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;