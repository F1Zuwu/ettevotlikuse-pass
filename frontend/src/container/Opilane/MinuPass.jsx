import Navbar from "../../components/Navbar";
import leenelem from "../../assets/images/LEEN_element_17 1.png";
import Footer from "../../components/Footer";
import copyIco from "../../assets/icons/copy.png";
import { API_BASE_URL } from "../../API";
import { useEffect, useMemo, useState } from "react";

const MinuPass = () => {
    const [user, setUser] = useState(null);
    const [activities, setActivities] = useState([]);
    const [categoriesById, setCategoriesById] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedType, setSelectedType] = useState("all");
    const [selectedDate, setSelectedDate] = useState("");
    const [sortOrder, setSortOrder] = useState("latest");
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedIds, setExpandedIds] = useState({});
    const [shareMessage, setShareMessage] = useState("");

    const token = localStorage.getItem("token");

    const formatDate = (dateString) => {
        if (!dateString) {
            return "-";
        }

        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) {
            return dateString;
        }

        return date.toLocaleDateString("et-EE", { year: "numeric", month: "long", day: "numeric" });
    };

    const resolveCategoryName = (activity) => {
        if (activity?.category?.name) {
            return activity.category.name;
        }

        const categoryId = Number(activity?.category_id);
        if (Number.isFinite(categoryId) && categoriesById[categoryId]) {
            return categoriesById[categoryId];
        }

        return "Muu";
    };

    const resolveProofUrl = (proofUrl) => {
        if (!proofUrl) {
            return "";
        }

        if (proofUrl.startsWith("http://") || proofUrl.startsWith("https://")) {
            return proofUrl;
        }

        return `${API_BASE_URL}${proofUrl}`;
    };

    useEffect(() => {
        if (!token) {
            window.location.href = "/login";
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");

                const [profileResponse, experiencesResponse, categoriesResponse] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/user/profile`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }),
                    fetch(`${API_BASE_URL}/api/experiences/`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }),
                    fetch(`${API_BASE_URL}/api/categories`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }),
                ]);

                const [profileData, experiencesData, categoriesData] = await Promise.all([
                    profileResponse.json(),
                    experiencesResponse.json(),
                    categoriesResponse.json(),
                ]);

                if (!profileResponse.ok || !profileData?.success) {
                    window.location.href = "/login";
                    return;
                }

                setUser(profileData.user);

                const categories = Array.isArray(categoriesData)
                    ? categoriesData
                    : Array.isArray(categoriesData?.categories)
                        ? categoriesData.categories
                        : [];

                const categoryLookup = categories.reduce((acc, category) => {
                    acc[category.category_id] = category.name;
                    return acc;
                }, {});
                setCategoriesById(categoryLookup);

                const allExperiences = Array.isArray(experiencesData?.experiences)
                    ? experiencesData.experiences
                    : [];

                const userExperiences = allExperiences.filter(
                    (experience) => experience.user_id === profileData.user.user_id,
                );

                setActivities(userExperiences);

                if (userExperiences.length > 0) {
                    setExpandedIds({ [userExperiences[0].experience_id]: true });
                }
            } catch (fetchError) {
                setError("Andmete laadimine ebaõnnestus. Proovi uuesti.");
                setActivities([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    const uniqueTypes = useMemo(() => {
        const set = new Set(
            activities.map((activity) => resolveCategoryName(activity)).filter(Boolean),
        );
        return Array.from(set);
    }, [activities, categoriesById]);

    const filteredActivities = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        const filtered = activities.filter((activity) => {
            const typeName = resolveCategoryName(activity);

            const matchesType = selectedType === "all" || typeName === selectedType;
            const matchesDate = !selectedDate || activity.date === selectedDate;
            const matchesSearch =
                !query ||
                activity.title?.toLowerCase().includes(query) ||
                activity.description?.toLowerCase().includes(query) ||
                activity.reflectionanswer?.toLowerCase().includes(query) ||
                typeName.toLowerCase().includes(query);

            return matchesType && matchesDate && matchesSearch;
        });

        return filtered.sort((a, b) => {
            const aTime = new Date(a.date).getTime();
            const bTime = new Date(b.date).getTime();

            if (sortOrder === "oldest") {
                return aTime - bTime;
            }

            return bTime - aTime;
        });
    }, [activities, searchTerm, selectedType, selectedDate, sortOrder, categoriesById]);

    const toggleExpanded = (activityId) => {
        setExpandedIds((prev) => ({
            ...prev,
            [activityId]: !prev[activityId],
        }));
    };

    const publicLink = `${window.location.origin}/mina/pass?user=${user?.user_id || ""}`;

    const handleCopyPublicLink = async () => {
        try {
            await navigator.clipboard.writeText(publicLink);
            setShareMessage("Avalik link kopeeriti.");
        } catch {
            setShareMessage("Linki ei saanud kopeerida.");
        }
    };

    const handleExportPdf = () => {
        window.print();
    };

    const handleShareLinkedIn = () => {
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicLink)}`;
        window.open(linkedInUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="">
            <Navbar></Navbar>
            <div className="h-560 w-full flex items-center">
                <div className="w-1/2">

                </div>
                <div className="w-1/2">
                    <div className="bg-black text-white w-48 flex items-center justify-center rounded-full px-3 py-2 btn-border-cyan">
                        <h1 className="text-4xl">Minu pass</h1>
                    </div>
                    <div className="ml-8 mt-4">
                        <h3>Nimi: {user?.name}</h3>
                        <h3>{formatDate(user?.birthday)}</h3>
                        <h3>(Moto)</h3>
                    </div>
                </div>
            </div>
            <div className="bg-black text-white px-8 pt-4 relative">
                <img src={leenelem} alt="LEEN Element" className="absolute right-0 -top-0.5"></img>
                <div className="bg-main-pink pl-4 rounded-full mt-14 mb-14">
                    <h1 className="py-4 bg-black rounded-full pl-4 text-3xl">Minu ettevõtlikkud kogemused</h1>
                </div>
                <div className="text-black bg-main-cyan justify-between items-center flex h-16 rounded-md px-4 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                        <h1>Tüüp</h1>
                        <select
                            className="bg-white text-black rounded-md p-2"
                            value={selectedType}
                            onChange={(event) => setSelectedType(event.target.value)}
                        >
                            <option value="all">Kõik tüübid</option>
                            {uniqueTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-3">
                        <h1>Kuupäev</h1>
                        <input
                            type="date"
                            className="bg-white text-black rounded-md p-2"
                            value={selectedDate}
                            onChange={(event) => setSelectedDate(event.target.value)}
                        ></input>
                    </div>
                    <div className="flex items-center gap-3">
                        <h1>Sorteeri</h1>
                        <select
                            className="bg-white text-black rounded-md p-2"
                            value={sortOrder}
                            onChange={(event) => setSortOrder(event.target.value)}
                        >
                            <option value="latest">Viimased</option>
                            <option value="oldest">Kõige vanemad</option>
                        </select>
                    </div>
                </div>
                <div>
                    <div className="bg-main-cyan p-0.5 rounded-full my-4 pl-4 w-96">
                        <input
                            placeholder="Otsing"
                            className="bg-black rounded-full px-2 w-full"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        ></input>
                    </div>
                </div>
                <div className="pt-12">
                    {loading && <p>Laadin tegevusi...</p>}
                    {!loading && error && <p className="text-red-400">{error}</p>}
                    {!loading && !error && filteredActivities.length === 0 && (
                        <p>Filtritele vastavaid tegevusi ei leitud.</p>
                    )}
                    {!loading && !error && filteredActivities.map((activity) => {
                        const isExpanded = !!expandedIds[activity.experience_id];
                        const reflectionQuestion = activity?.reflection?.question || "Reflektsiooniküsimus puudub";
                        const proofImage = activity.proofs?.find((proof) =>
                            /\.(png|jpe?g|gif|webp|svg)$/i.test(proof.proof_url || ""),
                        );

                        return (
                            <div key={activity.experience_id} className="mb-4">
                                <div className={`p-0.5 pl-2 h-12 rounded-md relative ${isExpanded ? "bg-main-pink" : "bg-main-yellow"}`}>
                                    <button
                                        type="button"
                                        className="bg-black h-full rounded-md flex items-center pl-4 w-full text-left"
                                        onClick={() => toggleExpanded(activity.experience_id)}
                                    >
                                        <h1>{activity.title}</h1>
                                    </button>
                                    <div className="absolute right-4 top-5">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="12" viewBox="0 0 19 12" fill="none">
                                            <path
                                                d={isExpanded ? "M2 9.5L9.5 2L17 9.5" : "M2 2.5L9.5 10L17 2.5"}
                                                stroke={isExpanded ? "#FF00FF" : "#FFFF00"}
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                {isExpanded && (
                                    <div className="px-2">
                                        <div className="grid md:grid-cols-2 gap-16 mt-2">
                                            <div>
                                                <h1 className="mt-2">Kirjeldus</h1>
                                                <div className="bg-white min-h-40 rounded-md mt-2 p-2">
                                                    <p className="text-black">{activity.description}</p>
                                                </div>
                                                <div className="flex flex-row rounded-md mt-2 py-2">
                                                <h1 className="mr-2">Reflektsiooniküsimus: </h1>
                                                <p className="text-white">{reflectionQuestion}</p>
                                                </div>
                                                <h1 className="mt-2">Vastus:</h1>
                                                <div className="bg-white min-h-32 rounded-md mt-2 p-2">
                                                    <p className="text-black">{activity.reflectionanswer || "Vastus puudub"}</p>
                                                </div>
                                            </div>
                                            <div>
                
                                                <div className="mt-8 h-1/3 overflow-hidden rounded-md bg-white text-black flex items-center justify-center">
                                                    {proofImage ? (
                                                        <img
                                                            src={resolveProofUrl(proofImage.proof_url)}
                                                            alt={proofImage.file_name || "Tegevuse tõend"}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <span>Pildiline tõend puudub</span>
                                                    )}
                                                </div>
                                                <h1 className="mt-2">Tüüp</h1>
                                                <div className="bg-white rounded-md mt-2 p-2 text-black w-1/5 text-center">{resolveCategoryName(activity)}</div>
                                                
                                                <div className="mt-2 p-2 text-white ">{formatDate(activity.date)}</div>
                                                
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="flex flex-col items-center gap-4 py-8">
                    <button className="bg-main-pink rounded-full w-28 p-0.5 pl-2" onClick={() => window.location.href = "/mina/tegevused/lisa"}>
                        <h1 className="bg-black rounded-full">Lisa uus</h1>
                    </button>
                    <button className="bg-main-green rounded-full w-38 p-0.5 pl-2" onClick={() => window.location.href = "/mina/tegevused"}>
                        <h1 className="bg-black rounded-full">Minu tegevused</h1>
                    </button>
                </div>
            </div>
            <div className="bg-white flex justify-center items-center flex-col py-8">
                <h1 className="bg-black rounded-full text-3xl text-white p-2 px-12">Jagamine ja Eksport</h1>
                <div className="flex mt-12 gap-4 flex-wrap justify-center">
                    <button className="flex relative cursor-pointer" onClick={handleCopyPublicLink}>
                        <h1 className="bg-black text-white rounded-xl px-4 py-1.5 pr-14">Kopeeri avalik link</h1>
                        <div className="bg-main-green rounded-full h-12 absolute -top-1 -right-1 w-12">
                            <img src={copyIco} alt="Kopeeri" className="p-2" />
                        </div>
                    </button>
                    <button className="bg-black text-white rounded-xl px-4 py-1.5" onClick={handleExportPdf}>
                        Laadi alla PDF
                    </button>
                    <button className="bg-black text-white rounded-xl px-4 py-1.5" onClick={handleShareLinkedIn}>
                        Jaga LinkedInis
                    </button>
                </div>
                {shareMessage && <p className="mt-4 text-black">{shareMessage}</p>}
            </div>
            <Footer></Footer>
        </div>
    );
};

export default MinuPass;