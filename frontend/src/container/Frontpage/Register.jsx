import leen_logo_valge from "../../assets/images/LEEN_logo_valge.png";
import deco_register_0 from "../../assets/images/deco_register_0.png";
import deco_register_1 from "../../assets/images/deco_register_1.png";

import user from "../../assets/icons/user.png";
import email from "../../assets/icons/mail.png";
import password from "../../assets/icons/password.png";

import google_ico from "../../assets/icons/google.png"

const Register = () => {
    return(
        <div class="h-screen flex">
            <div class="w-1/2 h-screen bg-black text-white items-center justify-center flex flex-col relative">
                <img class="absolute left-4 top-4 w-36" src={leen_logo_valge} alt="LEEN Logo" />
                <img class="absolute right-0 top-0 w-36" src={deco_register_0} alt="Deco Register 0" />
                <img class="absolute left-0 bottom-0 w-36" src={deco_register_1} alt="Deco Register 1" />
                <h1 class=" text-4xl">Tere tulemast tagasi!</h1>
                <p class="text-xl px-32 text-center pt-8">Meiega ühenduses püsimiseks logige sisse oma isikuandmetega</p>
                <button class="border-2 rounded-full px-32 py-4 mt-16 cursor-pointer"><h1 class="text-2xl">Logi sisse</h1></button>
            </div>
            <div class="w-1/2 h-screen flex items-center justify-center flex-col">
            <div class="w-1/2">
                <h1 class="text-4xl mb-4 text-center">Loo kasutaja</h1>
                <div class="flex justify-center">
                    <button class="flex items-center justify-center border-2 border-zinc-300 rounded-full p-2 cursor-pointer">
                        <img class="" src={google_ico}></img>
                    </button>
                </div>
                <p class="text-center mb-2 mt-4">või kasuta emaili registreerimiseks</p>
                <div class="flex flex-col gap-6">
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
                <div class="flex">
                    <input class="cursor-pointer" id="noustun" type="checkbox"></input>
                    <h1>Nõustun tingimustega</h1>
                </div>
                </div>
                <div class="flex">
                    <input class="cursor-pointer" id="värskendused" type="checkbox"></input>
                    <h1>Nõustun saama värskendusi e-posti teel</h1>
                </div>
                <button class="cursor-pointer w-full"><h1 class="text-center">Registreeru</h1></button>
                </div>
            </div>
        </div>
    )
}

export default Register;