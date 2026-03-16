import Navbar from "../../components/Navbar";

const MinuPass = () => {
    return (
        <div class="">
            <Navbar></Navbar>
            <div class="h-560 w-full flex  items-center">
                <div class="w-1/2">

                </div>
                <div class="w-1/2">
                    <div class="bg-black text-white w-48 flex items-center justify-center rounded-full px-3 py-2 btn-border-cyan">
                        <h1 class="text-4xl">Minu pass</h1>
                    </div>
                    <div class="ml-8 mt-4">
                        <h3>Nimi:</h3>
                        <h3>Vanus/kool/Linn: [vabatahtlik info]</h3>
                        <h3>(Moto)</h3>
                    </div>
                </div>
            </div>
            <div class="bg-black text-white px-14">
                <h1>Minu ettevõtlikkud kogemused</h1>
                <div class="text-black bg-main-cyan justify-between items-center flex h-16 rounded-md px-4">
                    <div class="flex items-center gap-3">
                        <h1>Tüüp</h1>
                        <select class="bg-white text-black rounded-md p-2">
                            <option>Vali tüüp</option>
                            <option>Projekt</option>
                            <option>Kursus</option>
                        </select>
                    </div>
                    <div class="flex items-center gap-3">
                        <h1>Kuupäev</h1>
                        <input type="date" class="bg-white text-black rounded-md  p-2"></input>
                    </div>
                    <div class="flex items-center gap-3">
                        <h1>Sorteeri</h1>
                        <select class="bg-white text-black rounded-md p-2">
                            <option>Vali sorteerimise viis</option>
                            <option>Viimased</option>
                            <option>Kõige vanemad</option>
                        </select>
                    </div>
                </div>
                <div>
                    <div class=" bg-main-cyan p-0.5 rounded-full my-4 pl-4 w-96">
                        <input placeholder="Otsing" class="bg-black rounded-full px-2 w-full"></input>
                    </div>
                </div>
                <div>
                    <div>
                        <div class="p-0.5 bg-main-pink pl-2 h-12 rounded-md relative">
                            <div class="bg-black h-full rounded-md flex items-center pl-4">
                                <h1>Projketi pealkiri</h1>
                            </div>
                            <div class="absolute right-4 top-5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="12" viewBox="0 0 19 12" fill="none">
                                    <path d="M2 9.5L9.5 2L17 9.5" stroke="#FF00FF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <div class="px-2">
                            <div>
                                <h1 class="mt-2">Kirjeldus</h1>
                                <div class="bg-white h-48 rounded-md mt-2 p-2">
                                    <p class="text-black">Text</p>
                                </div>
                                <h1 class="mt-2">Reflektsiooniküsimus</h1>
                                <div class="bg-white h-48 rounded-md mt-2 p-2">
                                    <p class="text-black">Text</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default MinuPass;