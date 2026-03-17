import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

const ActionButton = ({ label, accent = "bg-main-pink" }) => {
    return (
        <button className={`rounded-full p-px ${accent}`}>
            <span className={`block ${accent} rounded-full p-px pl-2`}>
                <span className="block rounded-full bg-black text-white text-[30px] leading-none px-6 py-2.25">
                    {label}
                </span>
            </span>
        </button>
    );
};

const LisaTegevus = () => {
    return (
        <div className="bg-[#efefef] min-h-screen">
            <Navbar />

            <main>
                <section className="max-w-7xl mx-auto px-6 py-14">
                    <h1 className="text-center text-[72px] font-bold text-black">Lisage uus tegevus</h1>
                    <div className="h-0.5 bg-[#9b9b9b] mt-14" />
                </section>

                <section className="bg-black text-white">
                    <div className="max-w-7xl mx-auto px-8 pt-16 pb-28">
                        <div className="grid grid-cols-12 gap-x-8 gap-y-10">
                            <div className="col-span-12 md:col-span-5">
                                <label className="block text-[28px] mb-3">Tegevuse nimi</label>
                                <input type="text" className="w-full h-13 rounded-[10px] bg-[#ebebeb] text-black px-4 text-[24px] outline-none" />
                            </div>

                            <div className="col-span-12 md:col-span-3">
                                <label className="block text-[28px] mb-3">Kuupäev</label>
                                <input type="date" className="w-full h-13 rounded-[10px] bg-[#ebebeb] text-black px-4 text-[24px] outline-none" />
                            </div>

                            <div className="col-span-12 md:col-span-4">
                                <label className="block text-[28px] mb-3">Tüüp</label>
                                <div className="relative">
                                    <select className="w-full h-13 rounded-[10px] bg-[#ebebeb] text-black px-4 pr-10 text-[24px] outline-none appearance-none">
                                        <option></option>
                                        <option>Projekt</option>
                                        <option>Koolitus</option>
                                        <option>Vabatahtlik töö</option>
                                        <option>Muu</option>
                                    </select>
                                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="20" height="12" viewBox="0 0 20 12" fill="none">
                                        <path d="M2 2L10 10L18 2" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>

                            <div className="col-span-12 md:col-span-5">
                                <label className="block text-[28px] mb-3">Kirjeldus</label>
                                <textarea className="w-full h-80 rounded-[10px] bg-[#ebebeb] text-black px-4 py-3 text-[24px] outline-none resize-none" />
                            </div>

                            <div className="col-span-12 md:col-span-7 space-y-5">
                                <div>
                                    <label className="block text-[28px] mb-3">Reflektsiooniküsimus</label>
                                    <textarea className="w-full h-46 rounded-[10px] bg-[#ebebeb] text-black px-4 py-3 text-[24px] outline-none resize-none" />
                                </div>

                                <div>
                                    <label className="block text-[28px] mb-3">Saaja email</label>
                                    <input type="email" className="w-full h-13 rounded-[10px] bg-[#ebebeb] text-black px-4 text-[24px] outline-none" />
                                </div>

                                <div>
                                    <label className="block text-[28px] mb-3">Lisage fail/pilt/link</label>
                                    <input type="file" className="w-full h-13 rounded-[10px] bg-[#ebebeb] text-black px-2 text-[20px] outline-none file:mr-3 file:rounded-full file:border-0 file:bg-main-cyan file:text-black file:px-4 file:py-1.5 file:text-[18px]" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex flex-wrap items-center gap-4">
                            <ActionButton label="Salvesta ja saada" accent="bg-main-pink" />
                            <ActionButton label="Salvesta mustand ja välju" accent="bg-main-green" />
                            <div className="ml-auto">
                                <ActionButton label="Kustuta" accent="bg-main-pink" />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default LisaTegevus;