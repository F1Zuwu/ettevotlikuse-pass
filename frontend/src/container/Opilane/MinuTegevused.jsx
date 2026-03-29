import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../API";
import CustomSelect from "../../components/CustomSelect";

const statusClass = {
    kinnitatud: "bg-main-green",
    ootel: "bg-[#FFBB00]",
    "tagasi lükatud": "bg-[#B13838]",
    mustand: "bg-[#9D9D9D]"
};

const MinuTegevused = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedType, setSelectedType] = useState("all");
    const [selectedDate, setSelectedDate] = useState("");
    const [sortOrder, setSortOrder] = useState("latest");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const token = localStorage.getItem("token");
    const PAGE_SIZE = 8;

    const normalizeStatus = (status = "") => status.toString().trim().toLowerCase();

    const formatStatus = (status = "") => {
        const normalized = normalizeStatus(status);
        if (!normalized) {
            return "Määramata";
        }
        return normalized
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const getActivityType = (activity) => activity?.category?.name || "Muu";

    const getDateInputValue = (dateString) => {
        if (!dateString) {
            return "";
        }

        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) {
            return "";
        }

        return date.toISOString().split("T")[0];
    };

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");

                const [profileResponse, experiencesResponse] = await Promise.all([
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
                ]);

                const [profileData, experiencesData] = await Promise.all([
                    profileResponse.json(),
                    experiencesResponse.json(),
                ]);

                if (!profileResponse.ok || !profileData?.success) {
                    navigate("/login");
                    return;
                }

                setUser(profileData.user);

                const allExperiences = Array.isArray(experiencesData?.experiences)
                    ? experiencesData.experiences
                    : [];

                const userExperiences = allExperiences.filter(
                    (experience) => experience.user_id === profileData.user.user_id,
                );

                setActivities(userExperiences);
            } catch (fetchError) {
                setError("Tegevuste laadimine ebaõnnestus. Proovi uuesti.");
                setActivities([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token, navigate]);

    const uniqueTypes = useMemo(() => {
        const set = new Set(activities.map((activity) => getActivityType(activity)).filter(Boolean));
        return Array.from(set);
    }, [activities]);

    const filteredActivities = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        const filtered = activities.filter((activity) => {
            const typeName = getActivityType(activity);
            const normalizedStatus = normalizeStatus(activity.status);
            const activityDate = getDateInputValue(activity.date);

            const matchesType = selectedType === "all" || typeName === selectedType;
            const matchesStatus = selectedStatus === "all" || normalizedStatus === selectedStatus;
            const matchesDate = !selectedDate || activityDate === selectedDate;
            const matchesSearch =
                !query ||
                activity.title?.toLowerCase().includes(query) ||
                activity.description?.toLowerCase().includes(query) ||
                typeName.toLowerCase().includes(query) ||
                formatStatus(activity.status).toLowerCase().includes(query);

            return matchesType && matchesStatus && matchesDate && matchesSearch;
        });

        return filtered.sort((a, b) => {
            const aTime = new Date(a.date).getTime();
            const bTime = new Date(b.date).getTime();

            if (sortOrder === "oldest") {
                return aTime - bTime;
            }

            return bTime - aTime;
        });
    }, [activities, searchTerm, selectedType, selectedStatus, selectedDate, sortOrder]);

    const totalPages = Math.max(1, Math.ceil(filteredActivities.length / PAGE_SIZE));

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedType, selectedStatus, selectedDate, sortOrder]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const pageStart = (currentPage - 1) * PAGE_SIZE;
    const paginatedActivities = filteredActivities.slice(pageStart, pageStart + PAGE_SIZE);

    const handleViewMore = (activityId) => {
        navigate(`/mina/tegevused/${activityId}`);
    };

    const statusFilters = [
        { label: "Kinnitatud", value: "kinnitatud", accent: "bg-main-green", width: "w-[137px]" },
        { label: "Ootel", value: "ootel", accent: "bg-[#FFBB00]", width: "w-[77px]" },
        { label: "Tagasi lükatud", value: "tagasi lükatud", accent: "bg-[#B13838]", width: "w-[180px]" },
        { label: "Mustand", value: "mustand", accent: "", width: "w-[106px]" },
    ];

    const typeOptions = [
        { value: "all", label: "Kõik tüübid" },
        ...uniqueTypes.map((type) => ({ value: type, label: type })),
    ];

    const sortOptions = [
        { value: "latest", label: "Viimased" },
        { value: "oldest", label: "Kõige vanemad" },
    ];

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
                            <CustomSelect
                                value={selectedType}
                                onChange={setSelectedType}
                                options={typeOptions}
                                buttonClassName="h-12 w-42.5 text-[20px]"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <span>Kuupäev</span>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(event) => setSelectedDate(event.target.value)}
                                    className="bg-white text-black rounded-[10px] h-12 w-42.5 px-3 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 ml-auto">
                            <span>Sorteeri</span>
                            <CustomSelect
                                value={sortOrder}
                                onChange={setSortOrder}
                                options={sortOptions}
                                buttonClassName="h-12 w-82 text-[20px]"
                            />
                        </div>
                    </div>
                </section>

                <section className="flex flex-wrap items-center gap-2 mt-3 mb-8">
                    {statusFilters.map((filter) => (
                        <button
                            key={filter.label}
                            type="button"
                            onClick={() => setSelectedStatus((prev) => (prev === filter.value ? "all" : filter.value))}
                            className={`${filter.width} h-9.5 rounded-[10px] text-white text-[20px] leading-none overflow-hidden pl-2 ${filter.accent ? `${filter.accent} p-0.5` : "bg-black"} ${selectedStatus === filter.value ? "ring-2 ring-black/80" : "opacity-85"}`}
                        >
                            <span className="bg-black h-full w-full rounded-lg flex items-center justify-center px-2.75">
                                {filter.label}
                            </span>
                        </button>
                    ))}

                    <div className="ml-auto relative w-80 md:w-90">
                        <input
                            type="text"
                            placeholder="Otsi"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
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
                        {loading && <p className="text-[20px] text-black py-4">Laadin tegevusi...</p>}
                        {!loading && error && <p className="text-[20px] text-[#B13838] py-4">{error}</p>}
                        {!loading && !error && paginatedActivities.length === 0 && (
                            <p className="text-[20px] text-black py-4">Filtritele vastavaid tegevusi ei leitud.</p>
                        )}
                        {!loading && !error && paginatedActivities.map((tegevus) => {
                            const formattedStatus = formatStatus(tegevus.status);
                            const statusColor = statusClass[normalizeStatus(tegevus.status)] || "bg-[#9D9D9D]";

                            return (
                                <div key={tegevus.experience_id} className="grid grid-cols-[2.1fr_0.9fr_0.9fr_0.95fr] items-center h-11 text-[20px] text-black gap-2">
                                    <span className="truncate" title={tegevus.title}>{tegevus.title}</span>
                                    <span className="truncate" title={getActivityType(tegevus)}>{getActivityType(tegevus)}</span>
                                    <span>
                                        <span className={`text-white rounded-[10px] px-3 py-1 text-[20px] ${statusColor}`}>
                                            {formattedStatus}
                                        </span>
                                    </span>
                                    <button
                                        type="button"
                                        className="bg-black text-white rounded-[10px] h-9.25 text-[20px] px-2 w-37.75 justify-self-end"
                                        onClick={() => handleViewMore(tegevus.experience_id)}
                                    >
                                        Vaata rohkem
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <div className="flex justify-center items-center gap-4 mt-10 text-[32px]">
                    <button
                        type="button"
                        className="bg-black text-white rounded-[10px] px-4 py-1 disabled:opacity-50"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                    >
                        Eelmine
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                        <button
                            type="button"
                            key={pageNumber}
                            className={`${currentPage === pageNumber ? "bg-[#7a7a7a]" : "bg-black"} text-white rounded-[10px] w-14 h-14`}
                            onClick={() => setCurrentPage(pageNumber)}
                        >
                            {pageNumber}
                        </button>
                    ))}
                    <button
                        type="button"
                        className="bg-black text-white rounded-[10px] px-4 py-1 disabled:opacity-50"
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Järgmine
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default MinuTegevused;