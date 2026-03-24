import { useEffect, useState } from "react";
import langIco from "../assets/icons/lang.png"
import { API_BASE_URL } from "../API";

const Navbar = () => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        fetch(API_BASE_URL + "/api/user/profile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                if (data.success) {
                    setUser(data.user);
                }
            })
    }, [])
    return (
        <div class="bg-black text-white">
            <div class="h-24 flex items-center px-10">
                 <div className="cursor-pointer" onClick={() => window.location.href = "/"}>
                <h1 class="text-3xl">Ettevõtlikkuse Pass</h1>
                </div>
                <div class="absolute right-10 flex items-center  ">
                    <img src={langIco} class="w-5 h-5 mr-2" alt="Language Icon"></img>
                    <button>Eesti keel</button>

                    <svg class="ml-3" xmlns="http://www.w3.org/2000/svg" width="10" height="9" viewBox="0 0 10 9" fill="none">
                        <path d="M4.82053 8.34939L9.64106 -2.86102e-06H1.00136e-05L4.82053 8.34939Z" fill="white" />
                    </svg>
                </div>
            </div>
            <div class="px-10 py-4 flex gap-20 relative">
                <div class="flex items-center cursor-pointer" onClick={() => window.location.href = "/"}>
                    <a>Avaleht</a>
                </div>
                <div class="flex items-center cursor-pointer" onClick={() => window.location.href = "/info"}>
                    <a>Ettevõtlikkuse Pass</a>
                </div>
                {user && (
                    <div class="flex items-center cursor-pointer" onClick={() => window.location.href = "/mina/pass"}>
                        <a>Minu pass</a>
                    </div>
                )}
                <div class="flex items-center cursor-pointer" onClick={() => window.location.href = "/funktsioonid"}>
                    <a>Funktsioonid</a>
                </div>
                <div class="flex items-center cursor-pointer" onClick={() => window.location.href = "/abi"}>
                    <a>Abi ja Kontakt</a>
                </div>

                <div class="absolute right-10 flex top-2">
                    {user && (
                        <svg class="mt-3 cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="17" height="25" viewBox="0 0 17 30" fill="none">
                            <ellipse cx="8.6857" cy="5.49032" rx="5.21146" ry="5.49032" fill="white" />
                            <path d="M16.9372 19.2161C16.9372 17.8573 16.7182 16.5118 16.2926 15.2564C15.867 14.0011 15.2432 12.8604 14.4568 11.8996C13.6705 10.9388 12.7369 10.1766 11.7094 9.6566C10.682 9.13661 9.58074 8.86897 8.46862 8.86897C7.35651 8.86897 6.25528 9.13661 5.22782 9.6566C4.20036 10.1766 3.26679 10.9388 2.4804 11.8996C1.69402 12.8604 1.07022 14.0011 0.644635 15.2564C0.219047 16.5118 -9.72242e-08 17.8573 0 19.2161L8.46862 19.2161H16.9372Z" fill="white" />
                        </svg>
                    )}
                    {!user && (
                        <button class="px-4 py-2 bg-white text-black flex items-center gap-2 rounded-full cursor-pointer" onClick={() => window.location.href = "/login"}>
                            <h1 class="mr-6">Logi sisse</h1>
                            <svg class="absolute right-4 top-3" xmlns="http://www.w3.org/2000/svg" width="17" height="25" viewBox="0 0 17 30" fill="none">
                                <ellipse cx="8.6857" cy="5.49032" rx="5.21146" ry="5.49032" fill="black" />
                                <path d="M16.9372 19.2161C16.9372 17.8573 16.7182 16.5118 16.2926 15.2564C15.867 14.0011 15.2432 12.8604 14.4568 11.8996C13.6705 10.9388 12.7369 10.1766 11.7094 9.6566C10.682 9.13661 9.58074 8.86897 8.46862 8.86897C7.35651 8.86897 6.25528 9.13661 5.22782 9.6566C4.20036 10.1766 3.26679 10.9388 2.4804 11.8996C1.69402 12.8604 1.07022 14.0011 0.644635 15.2564C0.219047 16.5118 -9.72242e-08 17.8573 0 19.2161L8.46862 19.2161H16.9372Z" fill="black" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Navbar; 