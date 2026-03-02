import Navbar from "../../components/Navbar";

const Abi = () => {
    return (
        <div>
            <Navbar></Navbar>

            <div class="flex items-center flex-col ">
                <h1 class="text-6xl bg-black text-white rounded-4xl mt-12 px-4 w-96 py-4 text-center">Hankige abi</h1>
                <div class="flex mt-12 gap-6">
                    <button class="btn-border-pink rounded-full bg-black text-white w-64">
                        <h1>Loe KKK</h1>
                    </button>
                    <button class="btn-border-cyan rounded-full bg-black text-white w-64">
                        <h1>Võtke ühendust <br></br> kasutajatoega</h1>
                    </button>
                    <button class="btn-border-green rounded-full bg-black text-white w-64">
                        <h1>Kasutusjuhend</h1>
                    </button>
                </div>

            </div>
            <div class="flex flex-col justify-center absolute bottom-0 bg-black w-full text-white h-96">
                <h1 class="text-center text-4xl mb-24">KONTAKT</h1>

                <div class="flex ">
                    <div class="w-1/3 flex flex-col items-center justify-center">
                        <h1>E-mail</h1>
                        <h1>info@ettevotlikkus.ee</h1>
                    </div>
                    <div class="w-1/3 flex flex-col items-center justify-center">
                        <h1>Telefoni number</h1>
                        <h1>+372 735 0500</h1>
                    </div>
                    <div class="w-1/3 flex flex-col items-center justify-center">
                        <h1>Facebook</h1>
                        <h1>facebook.com/ettevotlikkus</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Abi;