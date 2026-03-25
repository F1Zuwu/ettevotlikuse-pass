import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { useParams } from "react-router-dom";
const Kinnita = () => {

    const { id, token } = useParams();

    return (
        <div>
            <Navbar></Navbar>

            <section className="max-w-7xl mx-auto px-6 py-14">
                <h1 className="text-center text-[72px] font-bold text-black">Tegevuse kinnitamine</h1>
                <div className="h-0.5 bg-[#9b9b9b] mt-14" />
            </section>

            <div class="flex bg-black text-white">
                <div className="px-32 py-16 w-1/3">
                    <h1 className="text-xl">Tegevuse nimi:</h1>
                    <h1 className="rounded-md mt-2 text-black px-2 bg-white w-full">Aaaaa</h1>
                </div>
                <div className="px-32 py-16 w-1/3">
                    <h1 className="text-xl">Kuuppäev:</h1>
                    <h1 className="rounded-md mt-2 text-black px-2 bg-white w-full">aJAODjao</h1>
                </div>
            </div>

            <Footer></Footer>
        </div>
    )
}

export default Kinnita;