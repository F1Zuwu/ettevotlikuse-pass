import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { API_BASE_URL, deleteExperience, getExperience } from "../../API";



const ActionButton = ({
  label,
  accent = "bg-main-pink",
  onClick,
  disabled = false,
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full p-px ${accent} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <span className={`block ${accent} rounded-full p-px pl-2`}>
        <span className="block rounded-full bg-black text-white text-[30px] leading-none px-6 py-2.25">
          {label}
        </span>
      </span>
    </button>
  );
};


const formatDateRange = (dateString) => {
  if (!dateString) {
    return "-";
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  const formatted = date.toLocaleDateString("et-EE");
  return `${formatted} - ${formatted}`;
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

const fileNameFromProof = (proof) => {
  if (proof?.file_name) {
    return proof.file_name;
  }

  if (!proof?.proof_url) {
    return "tõend";
  }

  const safeUrl = proof.proof_url.split("?")[0];
  const parts = safeUrl.split("/");
  return parts[parts.length - 1] || "tõend";
};

const VaataRohkem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [experience, setExperience] = useState(null);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getExperience(id);
        const data = response?.experience || response;
        setExperience(data || null);
      } catch {
        setError("Tegevuse laadimine ebaõnnestus.");
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id]);

  const proofs = useMemo(() => experience?.proofs || [], [experience]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Kas oled kindel, et soovid selle tegevuse kustutada?",
    );
    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      await deleteExperience(id);
      navigate("/mina/tegevused");
    } catch {
      setError("Tegevuse kustutamine ebaõnnestus.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#efefef] min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-20 text-2xl">
          Laadin tegevust...
        </div>
        <Footer />
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="bg-[#efefef] min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-20">
          <p className="text-2xl text-[#B13838]">
            {error || "Tegevust ei leitud."}
          </p>
          <button
            type="button"
            className="mt-6 bg-black text-white rounded-full px-6 py-2"
            onClick={() => navigate("/mina/tegevused")}
          >
            Tagasi tegevustesse
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#efefef] min-h-screen">
      <Navbar />

      <main>
        <section className="py-14 text-center px-4">
          <h1 className="text-black text-[56px] font-bold leading-tight">
            {experience.title || "Tegevus"}
          </h1>
          <p className="text-black text-[28px] mt-2">
            {formatDateRange(experience.date)}
          </p>
        </section>

        <section className="bg-black text-white">
          <div className="max-w-7xl mx-auto px-8 pt-8 pb-16">
            {error && <p className="text-[#FF7B7B] text-xl mb-5">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-[30px] mb-3">Kirjeldus</h2>
                <div className="bg-[#efefef] text-black rounded-[10px] min-h-72 p-4 text-[24px]">
                  {experience.description || "-"}
                </div>
              </div>

              <div>
                <h2 className="text-[30px] mb-3">Tüüp</h2>
                <div className="inline-flex items-center rounded-full bg-[#efefef] text-black px-6 h-12 text-[22px]">
                  {experience?.category?.name || "Muu"}
                </div>

                <h2 className="text-[30px] mt-6 mb-3">Reflektsiooniküsimus</h2>
                <div className="bg-[#efefef] text-black rounded-[10px] min-h-37 p-4 text-[24px]">
                  {experience?.reflection?.question ||
                    "Reflektsiooniküsimus puudub"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h2 className="text-[30px] mb-3">Kinnitaja email</h2>
                <div className="bg-[#efefef] text-black rounded-[10px] h-12 px-4 text-[20px] flex items-center">
                  {experience.approver_email || "-"}
                </div>
              </div>

              <div>
                <h2 className="text-[30px] mb-3">Pildid/Lingid/Failid</h2>
                <div className="bg-[#efefef] rounded-[10px] min-h-12 px-2 py-1 flex flex-wrap gap-2 items-center">
                  {proofs.length === 0 && (
                    <span className="text-black text-[18px] px-2">
                      Tõendid puuduvad
                    </span>
                  )}
                  {proofs.map((proof) => (
                    <a
                      key={proof.proof_id || proof.proof_url}
                      href={resolveProofUrl(proof.proof_url)}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-main-cyan text-black px-4 py-1 text-[16px] hover:opacity-90"
                    >
                      {fileNameFromProof(proof)}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between gap-4">
              <ActionButton
                label="Tagasi"
                accent="bg-main-green"
                onClick={() => navigate("/mina/tegevused")}
                type="button"
              />

              <div className="flex gap-4">
                <ActionButton
                  label="Muuda"
                  accent="bg-main-pink"
                  onClick={() => navigate(`/mina/tegevused/lisa?edit=${id}`)}
                  type="button"
                />

                <ActionButton
                  label={deleting ? "Kustutan..." : "Kustuta"}
                  accent="bg-main-pink"
                  onClick={handleDelete}
                  disabled={deleting}
                  type="button"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default VaataRohkem;
