import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

const tegevused = [
    { nimi: "Bränd", tuup: "Projekt", staatus: "Kinnitatud" },
    { nimi: "Esmaabi", tuup: "Koolitus", staatus: "Kinnitatud" },
    { nimi: "Laulu kirjutamine", tuup: "Projekt", staatus: "Kinnitatud" },
    { nimi: "Esmaabi II", tuup: "Koolitus", staatus: "Kinnitatud" },
    { nimi: "Esmaabi III", tuup: "Koolitus", staatus: "Tagasi lükatud" },
    { nimi: "Kontserti tegemine", tuup: "Projekt", staatus: "Kinnitatud" },
    { nimi: "Koristus", tuup: "Vabatahtlik töö", staatus: "Mustand" },
    { nimi: "Brändi loomine", tuup: "Projekt", staatus: "Kinnitatud" },
    { nimi: "Müüja abi", tuup: "Vabatahtlik töö", staatus: "Ootel" },
    { nimi: "Brändi uuendamine", tuup: "Muu", staatus: "Ootel" }
];

const statusClass = {
    "Kinnitatud": "bg-main-green",
    "Ootel": "bg-[#FFBB00]",
    "Tagasi lükatud": "bg-[#B13838]",
    "Mustand": "bg-[#9D9D9D]"
};

const MinuTegevused = () => {
    return (
        <div className="bg-[#f0f0f0] min-h-screen">
            <Navbar />

            <main className="max-w-288.5 mx-auto pt-14 pb-20 px-4">
                <h1 className="text-center text-6xl font-bold text-black">Minu tegevused</h1>

                <div className="border-b-2 border-[#8a8a8a] mt-14 mb-8" />

                <section className="bg-black rounded-[10px] p-3">
                    <div className="flex flex-wrap items-center gap-6 text-white text-2xl">
                        <div className="flex items-center gap-3">
                            <span>Tüüp</span>
                            <select className="bg-white text-black rounded-[10px] h-12 w-42.5 px-3 outline-none">
                                <option></option>
                            </select>
                        </div>

                        <div className="flex items-center gap-3">
                            <span>Kuupäev</span>
                            <div className="relative">
                                <input type="date" className="bg-white text-black rounded-[10px] h-12 w-42.5 px-3 outline-none" />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 ml-auto">
                            <span>Sorteeri</span>
                            <div className="relative">
                                <select className="bg-white text-black rounded-[10px] h-12 w-82 px-3 pr-10 outline-none appearance-none">
                                    <option></option>
                                </select>
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M6 9L12 15L18 9" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="flex flex-wrap items-center gap-2 mt-3 mb-8">
                    {[
                        { label: "Kinnitatud", accent: "bg-main-green", width: "w-[137px]" },
                        { label: "Ootel", accent: "bg-[#FFBB00]", width: "w-[77px]" },
                        { label: "Tagasi lükatud", accent: "bg-[#B13838]", width: "w-[180px]" },
                        { label: "Mustand", accent: "", width: "w-[106px]" }
                    ].map((filter) => (
                        <button
                            key={filter.label}
                            className={`${filter.width} h-9.5 rounded-[10px] text-white text-[20px] leading-none overflow-hidden pl-2 ${filter.accent ? `${filter.accent} p-0.5` : "bg-black"}`}
                        >
                            <span className="bg-black h-full w-full rounded-lg flex items-center justify-center px-2.75">
                                {filter.label}
                            </span>
                        </button>
                    ))}

                    <div className="ml-auto relative">
                        <input
                            type="text"
                            placeholder="Otsi"
                            className="bg-black text-white placeholder:text-white rounded-[10px] h-9.5 w-full pl-3 pr-10 text-[20px] outline-none"
                        />
                        <svg className="absolute right-2 top-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 30 30" fill="none">
                            <circle cx="13" cy="13" r="8" stroke="white" strokeWidth="2.5" />
                            <path d="M19 19L27 27" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                    </div>
                </section>

                <section className="bg-[#f0f0f0] rounded-[10px] overflow-hidden">
                    <div className="bg-black text-white grid grid-cols-[2.1fr_0.9fr_0.9fr_0.95fr] px-7 h-12 items-center text-[20px]">
                        <span>Tegevuse nimi</span>
                        <span>Tüüp</span>
                        <span>Staatus</span>
                        <span></span>
                    </div>

                    <div className="bg-[#f0f0f0] px-7 py-3 space-y-1 border border-black border-t-0 rounded-b-[10px]">
                        {tegevused.map((tegevus) => (
                            <div key={tegevus.nimi} className="grid grid-cols-[2.1fr_0.9fr_0.9fr_0.95fr] items-center h-11 text-[20px] text-black">
                                <span>{tegevus.nimi}</span>
                                <span>{tegevus.tuup}</span>
                                <span>
                                    <span className={`text-white rounded-[10px] px-3 py-1 text-[20px] ${statusClass[tegevus.staatus]}`}>
                                        {tegevus.staatus}
                                    </span>
                                </span>
                                <button className="bg-black text-white rounded-[10px] h-9.25 text-[20px] px-2 w-37.75 justify-self-end">
                                    Vaata rohkem
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="flex justify-center items-center gap-4 mt-10 text-[32px]">
                    <button className="bg-black text-white rounded-[10px] px-4 py-1">Eelmine</button>
                    <button className="bg-[#7a7a7a] text-white rounded-[10px] w-14 h-14">1</button>
                    <button className="bg-black text-white rounded-[10px] w-14 h-14">2</button>
                    <button className="bg-black text-white rounded-[10px] w-14 h-14">3</button>
                    <button className="bg-black text-white rounded-[10px] w-14 h-14">4</button>
                    <button className="bg-black text-white rounded-[10px] px-4 py-1">Järgmine</button>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default MinuTegevused;