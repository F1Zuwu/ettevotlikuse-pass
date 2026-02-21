import Navbar from "../../components/Navbar";
import homeImg from "../../assets/images/banner.png"
import opieestissections from "../../assets/images/opi_eestis_section.png"
import tooleidminesection from "../../assets/images/tooleidmine_section.png"
import faq from "../../assets/icons/faq.png"
import kasutus from "../../assets/icons/kasutus.png"
import juhend from "../../assets/icons/juhend.png"
import leenmuster from "../../assets/images/LEEN_muster.png"
import Footer from "../../components/Footer";
const Home = () => {
    return (
        <div>
            <Navbar></Navbar>

            {/* WELCOME */}
            <div class="p-9 flex h-593">
                <div class="bg-black px-8 py-9 w-1/2">
                    <h1 class="text-white text-6xl">Ettevõtlikkuse Pass</h1>
                    <h2 class="text-white text-4xl">Sinu idee, meie tugi!</h2>
                    <p class="text-white text-base mt-5">Sinu personaalne tööriist enesearengu<br></br>jälgimiseks ja tööturule kandideerimiseks</p>
                    <button>
                        Loo Ettevõtlikkuse passi kasutaja
                    </button>
                    <button>
                        Ettevõtlikkuse passi tööriistad
                    </button>
                    <a>Halda oma passi {">"} </a>
                    <a>Halda oma tegevusi {">"} </a>
                </div>
                <div class="w-1/2">
                    <img class="w-full h-full object-cover " src={homeImg}></img>
                </div>

            </div>

            {/* SECTION 1 */}
            <div class="flex bg-black py-4">
                <div class="w-1/2 flex items-center justify-center">
                    <img src={opieestissections}></img>
                </div>
                <div class="w-1/2 text-white flex flex-col justify-center text-2xl">
                    <h1 class="pb-4 text-4xl">Õpi Eestis</h1>
                    <h2 class="pb-4 ">Avasta oma võimalused ja arenda ettevõtlikkust Eestis!</h2>
                    <p class="pb-4">Siit leiad:
                        <br></br>• info ettevõtlikkust toetavate õppekavade ja kursuste kohta,
                        <br></br>• õpetajate ja mentorite soovitusi,
                        <br></br>• linke koolide ja projektide juurde, mis aitavad sul oma ideid ellu viia.</p>

                    <h2>Õppimine Eestis tähendab rohkemat kui teadmiste omandamine - see on ka julgus tegutseda!</h2>
                </div>
            </div>

            {/* SECTION 2 */}
            <div class="flex  py-4">
                <div class="w-1/2 text-black flex flex-col justify-center text-2xl px-16">
                    <h1 class="pb-4 text-4xl">Eestis töö leidmine</h1>
                    <h2 class="pb-4">Tee oma ettevõtlikkus nähtavaks tööandjatele!</h2>
                    <p>
                        Ettevõtlikkuse pass aitab sul tõendada oskusi, mida tööandjad otsivad: algatusvõime, vastutus, probleemilahendus ja meeskonnatöö
                    </p>
                    <p class="pb-4">Selle lehelt saad teada:
                        <br></br>• kuidas siduda oma Ettevõtlikkuse pass ja CV,
                        <br></br>• kuidas lisada oma saavutusi LinkedInis,
                        <br></br>• millised ettevõtted ja praktikakohad väärtustavad ettevõtlikke noori.</p>

                    <h2>Samuti leiad siit nõuandeid tööintervjuuks valmistumiseks ja näiteid, kuidas ettevõtlikud oskused aitavad tööelus edasi.</h2>
                </div>
                <div class="w-1/2 flex items-center justify-center">
                    <img src={tooleidminesection}></img>
                </div>
            </div>

            {/* FAQ */}
            <div class="bg-black text-white py-16">
                <h1 class="text-center text-4xl">Hankige abi</h1>
                <div class="flex justify-center mt-16 gap-6 px-24">
                    <div class="bg-main-pink h-80 w-1/3 flex flex-col justify-center items-center">
                        <img src={faq}></img>
                        <h2 class="text-2xl mt-4 px-3.5">Korduma kippuvad küsimused</h2>
                        <p class="px-12">See jaotis sisaldab vastuseid korduvalt esitatud küsimustele.</p>
                        <button class="border-4 rounded-4xl px-8 py-2 mt-4"><h1>Loe rohkem</h1></button>
                    </div>
                    <div class="bg-main-cyan h-80 w-1/3 flex flex-col justify-center items-center">
                        <img src={kasutus}></img>
                        <h2 class="text-2xl mt-4 px-3.5">Võtke ühendust kasutajatoega</h2>
                        <p class="px-12">Kasutajatugi aitab teid personaalse lähenemisega.</p>
                        <button class="border-4 rounded-4xl px-8 py-2 mt-4"><h1>Loe rohkem</h1></button>
                    </div>
                    <div class="bg-main-green w-1/3 h-80 flex flex-col justify-center items-center">
                        <img src={juhend}></img>
                        <h2 class="text-2xl mt-4 px-3.5">Kasutusjuhend</h2>
                        <p class="px-12">Raskuste esinemisel kasutatav juhend.</p>
                        <button class="border-4 rounded-4xl px-8 py-2 mt-4"><h1>Loe rohkem</h1></button>
                    </div>
                </div>
            </div>

            {/* LEEN muster for god who know what reason? */}

            <div class="w-full h-668 ">
                <img class="w-full object-cover" src={leenmuster}></img>
                <Footer></Footer>
            </div>
        </div>
    )
}

export default Home;