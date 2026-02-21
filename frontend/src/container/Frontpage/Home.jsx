import Navbar from "../../components/Navbar";
import homeImg from "../../assets/images/banner.png"
const Home = () => {
    return (
        <div>
            <Navbar></Navbar>

            <div class="p-9 flex">
                <div class="bg-black px-8 py-9 w-1/2">
                    <h1 class="text-white text-6xl">Ettevõtlikkuse Pass</h1>
                    <h2 class="text-white text-4xl">Sinu idee, meie tugi!</h2>
                    <p class="text-white text-base mt-5">Sinu personaalne tööriist enesearengu
                        jälgimiseks ja tööturule kandideerimiseks</p>
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
                    <img class="w-full" src={homeImg}></img>
                </div>
            </div>
        </div>
    )
}

export default Home;