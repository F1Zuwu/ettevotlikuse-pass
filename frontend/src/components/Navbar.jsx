import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import langIco from "../assets/icons/lang.png";
import { API_BASE_URL } from "../API";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const hasToken = !!localStorage.getItem("token");
    const showAuthenticatedUi = hasToken || !!user;

    const navItemClass = (isActive) =>
        `flex items-center cursor-pointer transition-colors duration-150 ${
            isActive ? "text-main-yellow" : "hover-main-yellow"
        }`;

    useEffect(() => {
        let isMounted = true;
        const token = localStorage.getItem("token");

        if (!token) {
            setAuthLoading(false);
            return () => {
                isMounted = false;
            };
        }

        fetch(`${API_BASE_URL}/api/user/profile`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (isMounted && data.success) {
                    setUser(data.user);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setUser(null);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setAuthLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="bg-black text-white select-none overflow-hidden">
            <div className="h-24 flex items-center px-10">
                <div className="cursor-pointer" onClick={() => navigate("/")}>
                <h1 className="text-3xl">Ettevõtlikkuse Pass</h1>
                </div>
                <div className="absolute right-10 flex items-center">
                    <img src={langIco} className="w-5 h-5 mr-2" alt="Language Icon"></img>
                    <button>Eesti keel</button>

                    <svg className="ml-3" xmlns="http://www.w3.org/2000/svg" width="10" height="9" viewBox="0 0 10 9" fill="none">
                        <path d="M4.82053 8.34939L9.64106 -2.86102e-06H1.00136e-05L4.82053 8.34939Z" fill="white" />
                    </svg>
                </div>
            </div>
            <div className="px-10 py-4 flex gap-20 relative">
                <div className={navItemClass(location.pathname === "/")} onClick={() => navigate("/")}>
                    <a>Avaleht</a>
                </div>
                <div className={navItemClass(location.pathname === "/info")} onClick={() => navigate("/info")}>
                    <a>Ettevõtlikkuse Pass</a>
                </div>
                {showAuthenticatedUi && (
                    <div className={navItemClass(location.pathname === "/mina/pass" || location.pathname.startsWith("/mina/pass/"))} onClick={() => navigate("/mina/pass")}>
                        <a>Minu pass</a>
                    </div>
                )}
                <div className={navItemClass(location.pathname === "/funktsioonid")} onClick={() => navigate("/funktsioonid")}>
                    <a>Funktsioonid</a>
                </div>
                <div className={navItemClass(location.pathname === "/abi")} onClick={() => navigate("/abi")}>
                    <a>Abi ja Kontakt</a>
                </div>

                <div className="absolute right-10 flex top-2 min-w-44 justify-end">
                    {showAuthenticatedUi && (
                        <svg
                            className={`mt-3 cursor-pointer transition-colors duration-150 ${
                                location.pathname.startsWith("/mina/seaded")
                                    ? "text-main-yellow"
                                    : "text-white hover-main-yellow"
                            }`}
                            onClick={() => navigate("/mina/seaded")}
                            xmlns="http://www.w3.org/2000/svg"
                            width="17"
                            height="25"
                            viewBox="0 0 17 30"
                            fill="none"
                        >
                            <ellipse cx="8.6857" cy="5.49032" rx="5.21146" ry="5.49032" fill="currentColor" />
                            <path d="M16.9372 19.2161C16.9372 17.8573 16.7182 16.5118 16.2926 15.2564C15.867 14.0011 15.2432 12.8604 14.4568 11.8996C13.6705 10.9388 12.7369 10.1766 11.7094 9.6566C10.682 9.13661 9.58074 8.86897 8.46862 8.86897C7.35651 8.86897 6.25528 9.13661 5.22782 9.6566C4.20036 10.1766 3.26679 10.9388 2.4804 11.8996C1.69402 12.8604 1.07022 14.0011 0.644635 15.2564C0.219047 16.5118 -9.72242e-08 17.8573 0 19.2161L8.46862 19.2161H16.9372Z" fill="currentColor" />
                        </svg>
                    )}
                    {!showAuthenticatedUi && !authLoading && (
                        <button className="px-4 py-2 bg-white text-black flex items-center gap-2 rounded-full cursor-pointer relative" onClick={() => navigate("/login")}>
                            <h1 className="mr-6">Logi sisse</h1>
                            <svg className="absolute right-4 top-3" xmlns="http://www.w3.org/2000/svg" width="17" height="25" viewBox="0 0 17 30" fill="none">
                                <ellipse cx="8.6857" cy="5.49032" rx="5.21146" ry="5.49032" fill="black" />
                                <path d="M16.9372 19.2161C16.9372 17.8573 16.7182 16.5118 16.2926 15.2564C15.867 14.0011 15.2432 12.8604 14.4568 11.8996C13.6705 10.9388 12.7369 10.1766 11.7094 9.6566C10.682 9.13661 9.58074 8.86897 8.46862 8.86897C7.35651 8.86897 6.25528 9.13661 5.22782 9.6566C4.20036 10.1766 3.26679 10.9388 2.4804 11.8996C1.69402 12.8604 1.07022 14.0011 0.644635 15.2564C0.219047 16.5118 -9.72242e-08 17.8573 0 19.2161L8.46862 19.2161H16.9372Z" fill="black" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar; 