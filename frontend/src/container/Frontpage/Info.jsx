import Navbar from "../../components/Navbar";
import deco_register_0 from "../../assets/images/deco_register_0.png";
import deco_register_1 from "../../assets/images/deco_register_1.png";
import misonepass from "../../assets/images/misonepass.png"
import misonepass_1 from "../../assets/images/misonepass_1.png"

import deco from "../../assets/images/deco.png";
import deco_1 from "../../assets/images/deco_1.png";
import Footer from "../../components/Footer";
import leenriba from "../../assets/images/LEEN_riba.png";

const Info = () => {
    return (
        <div>
            <Navbar></Navbar>

            {/* Intro text */}
            <div class="h-593 bg-black w-full flex items-center justify-center text-white relative">
                <img class="absolute right-0 top-0" src={deco_register_0} alt="Deco Register 0" />
                <img class="absolute left-0 bottom-0" src={deco_register_1} alt="Deco Register 1" />
                <h1 class="text-6xl">Ettevõtlikkuse pass</h1>
            </div>

            {/* Mis on ettevõtlikkuse pass? */}
            <div class="flex">
                <div class="w-1/2 px-24 flex flex-col justify-center">
                    <h1 class="text-4xl mt-12 mb-4">Mis on ettevõtlikkuse pass?</h1>
                    <p class="text-xl">Ettevõtlikkuse pass on õpilase isiklik dokument (või digitaalne portfoolio), kuhu ta kogub tõendeid oma ettevõtliku käitumise ja kogemuste kohta.</p>
                    <p class="text-xl mt-4">See võib olla näiteks osa õpilasfirma tegevusest, kooliprojektidest, vabatahtlikust tööst, spordist või huvitegevusest.</p>
                </div>
                <div class="w-1/2 relative">
                    <img class="w-full h-447 object-cover" src={misonepass} alt="Mis on ettevõtlikkuse pass?" />
                    <div class="absolute left-0 top-0 h-full w-96 bg-linear-to-r from-white to-transparent"></div>
                </div>
            </div>

            {/* Milleks seda kasutada */}
            <div class="flex flex-col justify-center items-center bg-black relative h-555">
                <div class="w-1/3 text-white">
                    <h1 class="text-4xl mt-12 mb-4 text-center">Milleks seda kasutatakse?</h1>
                    <p class="text-xl mt-4">Ettevõtlikkuse passi kasutatakse selleks, et aidata õpilasel mõtestada oma kogemusi ja märgata, kuidas need kujundavad ettevõtlikkust - näiteks initsiatiivi, vastutustunnet, koostööoskust ja probleemilahendusvõimet.</p>
                    <p class="text-xl mt-4">Passi saab kasutada nii õppimise kui ka karjääritee planeerimisel: tööle või kooli kandideerides on seal talletatud info väärtuslik lisadokument. Koolides toetab ettevõtlikkuse pass ka hindamist ning aitab kujundada ettevõtlikku koolikultuuri.</p>
                </div>
                <img class="absolute left-0 -bottom-1" src={deco} alt="Deco 1" />
                <img class="absolute right-0 top-0" src={deco_1} alt="Deco 1" />
            </div>

            {/* Kuidas see toimib */}
            <div class="flex">
                <div class="w-1/2 px-24 flex flex-col justify-center">
                    <h1 class="text-4xl mt-12 mb-4">Kuidas see toimib?</h1>
                    <p class="text-xl">Kasutaja kogub ettevõtlikkuse passi oma tegevuste kirjelduse, rolli ja vastutuse, õpitu ja omandatud oskused. 
Samuti saab lisada tõendeid, nagu fotod, tunnistused ja õpetajate tagasiside.</p>
                </div>
                <div class="w-1/2 relative">
                    <img class="w-full h-447 object-cover" src={misonepass_1} alt="Mis on ettevõtlikkuse pass?" />
                    <div class="absolute left-0 top-0 h-full w-96 bg-linear-to-r from-white to-transparent"></div>
                </div>
            </div>

            <div class="w-full h-668 ">
                <img class="w-full object-cover" src={leenriba}></img>
                <Footer></Footer>
            </div>
        </div>
    )
}

export default Info;