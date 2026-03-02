import Navbar from "../../components/Navbar";
import deco_register_0 from "../../assets/images/deco_register_0.png";
import deco_register_1 from "../../assets/images/deco_register_1.png";
import passihaldamine from "../../assets/icons/passi_haldamine.png"
import tegevuste_lisamine from "../../assets/icons/tegevuste_lisamine.png"
import leen_element from "../../assets/images/LEEN_element_17 3.png"
import Footer from "../../components/Footer";

const Funktsioonid = () => {
    return(
        <div>
            <Navbar></Navbar>

            {/* Intro text */}
            <div class="h-593 bg-black w-full flex items-center justify-center text-white relative">
                <img class="absolute right-0 top-0" src={deco_register_0} alt="Deco Register 0" />
                <img class="absolute left-0 bottom-0" src={deco_register_1} alt="Deco Register 1" />
                <h1 class="text-6xl">Funktsioonid</h1>
            </div>

            {/* Passi haldamine */}
            <div class="flex py-16">
                <div class="w-1/2 justify-center items-center flex ">
                    <img src={passihaldamine} alt="Passi haldamine" />
                </div>
                <div class="w-1/2 flex flex-col justify-center items-center pr-32">
                    <h1 class="text-4xl mb-4">Passi haldamine</h1>
                    <p class="text-2xl">Ettevõtlikkuse pass võimaldab dokumenteerida oma oskusi, arengut ja ettevõtlikkuse kogemusi. Lisage oma projektid, õpikogemused ja vabatahtlik tegevus, et jälgida oma arengut ajas. Jagage oma passis sisalduvaid kogemusi teistega, et saada väärtuslikku tagasisidet ja soovitusi.</p>
                </div>
            </div>

            {/* Tegevuste lisamine */}
            <div class="flex py-32 bg-black text-white relative">
                <div class="w-1/2 flex flex-col justify-center items-center pl-32">
                    <h1 class="text-4xl mb-4">Tegevuste lisamine</h1>
                    <p class="text-2xl">Lisage oma ettevõtlikkuse tegevusi ja projekte, määrake tähtaegu ning jälgige oma edusamme. Valige tegevuse tüüp (nt projekt, õppeülesanne, vabatahtlik töö), määrake tähtpäev ja jälgige oma tegevuste staatust. Saate luua visuaalse tabeli, et planeerida oma tegevusi ja hoida kõike korras.</p>
                </div>
                <div class="w-1/2 justify-center items-center flex ">
                    <img src={tegevuste_lisamine} alt="Tegevuste lisamine" />
                </div>
                <img class="absolute left-0 -bottom-0.5" src={leen_element} alt="LEEN element"></img>
            </div>

            {/* Oskuste lisamine */}
            <div class="flex py-16">
                <div class="w-1/2 justify-center items-center flex ">
                    <img src={passihaldamine} alt="Passi haldamine" />
                </div>
                <div class="w-1/2 flex flex-col justify-center items-center pr-32">
                    <h1 class="text-4xl mb-4">Oskuste ja arengu jälgimine</h1>
                    <p class="text-2xl">Jälgige oma arengut ja kasvu Ettevõtlikkuse passis, et näha, milliseid oskusi olete arendanud. Dokumenteerige kõik oma tegevused ja saavutused ning vaadake, kuidas teie oskused ajas kasvanud on. Jagage oma arengut mentorite ja õpetajatega, et saada tagasisidet ja kinnitust.</p>
                </div>
            </div>

            {/* Soovitused ja tagasisde */}
            <div class="flex py-36 bg-black text-white relative">
                <div class="w-1/2 flex flex-col justify-center items-center pl-32">
                    <h1 class="text-4xl mb-4">Soovitused ja tagasiside</h1>
                    <p class="text-2xl">Kasutajad saavad lisada juhendajate, õpetajate ja tööandjate soovitusi oma tegevuste kohta. Soovitused võivad sisaldada kirjalikke hinnanguid, lühikesi tagasiside vorme või oskuste kinnitust. See annab teie passile täiendavat väärtust ja ametlikkust.</p>
                </div>
                <div class="w-1/2 justify-center items-center flex ">
                    <img src={tegevuste_lisamine} alt="Tegevuste lisamine" />
                </div>
                <img class="absolute left-0 -bottom-0.5" src={leen_element} alt="LEEN element"></img>
            </div>

            {/* Administreerimine */}
            <div class="flex py-16">
                <div class="w-1/2 justify-center items-center flex ">
                    <img src={passihaldamine} alt="Passi haldamine" />
                </div>
                <div class="w-1/2 flex flex-col justify-center items-center pr-32">
                    <h1 class="text-4xl mb-4">Administreerimine</h1>
                    <p class="text-2xl">Administraatoritel on täiendavad õigused kasutajate ja kategooriate haldamiseks. Nad saavad jälgida statistikat, hallata kasutajate õigusi ja kohandada veebilehe disaini vastavalt vajadusele. Kõik see aitab tagada, et platvorm toimiks sujuvalt ja vastaks kasutajate vajadustele.</p>
                </div>
            </div>

            <Footer></Footer>
        </div>
    )
}

export default Funktsioonid;