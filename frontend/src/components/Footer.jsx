import leen_logo_valge from "../assets/images/LEEN_logo_valge.png";
import ee from "../assets/images/ee.png"
const Footer = () => {
    return (
        <div>
            <div class="bg-black text-white flex py-12">
                <img src={leen_logo_valge}></img>
                <div class="px-14 flex w-full">
                    <div class="w-1/3">
                        <h1>Kontakt</h1>
                        <p>ettevotlikkusepass@gmail.ee</p>
                        <p>+372 59365529</p>
                        <img></img>
                    </div>
                    <div class="w-1/3">
                        <h1>Privaatsuspoliitika</h1>
                        <a>Küpsised</a>
                        <a>Andmekaitse</a>
                    </div>
                    <div class="w-1/3">
                        <h1>Kasutustingimused</h1>
                    </div>
                </div>
            </div>
            <div class="bg-white text-black flex justify-end items-center">
                <div class="mr-4">
                    <h1 class="text-right">© 2026 Ettevõtlikkuse pass</h1>
                    <h1 class="text-right">Loodud koostöös Haridus- ja Noorteameti ning Ettevõtliku Kooli võrgustikuga.</h1>
                </div>
                <img class="mr-8" src={ee}></img>
            </div>
        </div>
    )
}

export default Footer;