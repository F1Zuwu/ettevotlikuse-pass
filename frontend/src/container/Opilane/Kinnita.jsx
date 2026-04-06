import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { API_BASE_URL } from "../../API";



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

const Kinnita = () => {
  const [Question, setQuestion] = useState("")
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [error, setError] = useState("");
  const [experience, setExperience] = useState(null);
  const [approverEmail, setApproverEmail] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const fetchExperience = async () => {
      if (!token) {
        setError("Kinnituslahter puudub.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/approve?token=${token}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Tegevuse laadimine ebaõnnestus.");
        }

        
        setExperience(data);
        fetchRelfectionQuestion(data.reflection_id)
      } catch (err) {
        setError(err.message || "Tegevuse laadimine ebaõnnestus.");
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [token]);

  const proofs = useMemo(() => experience?.proofs || [], [experience]);

  const handleApprove = async () => {
    if (!approverEmail) {
      setError("Palun sisestage oma e-posti aadress.");
      return;
    }

    try {
      setApproving(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/approve?token=${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: approverEmail,
            feedback: feedback || null,
            status: "kinnitatud",
            token,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Kinnitamine ebaõnnestus.");
      }

      alert("Tegevus kinnitatud!");
      navigate("/");
    } catch (err) {
      setError(err.message || "Kinnitamine ebaõnnestus.");
    } finally {
      setApproving(false);
    }
  };

  const handleDecline = async () => {
    if (!approverEmail) {
      setError("Palun sisestage oma e-posti aadress.");
      return;
    }

    const confirmed = window.confirm(
      "Kas oled kindel, et soovid selle tegevuse tagasi saata?"
    );
    if (!confirmed) {
      return;
    }

    try {
      setDeclining(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/experience/approve?token=${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: approverEmail,
            feedback: feedback || null,
            status: "tagasi",
            token,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Tegevuse tagasikutsumine ebaõnnestus.");
      }

      alert("Tegevus saadeti tagasi!");
      navigate("/");
    } catch (err) {
      setError(err.message || "Tegevuse tagasikutsumine ebaõnnestus.");
    } finally {
      setDeclining(false);
    }
  };

  const fetchRelfectionQuestion = (id) => {
    fetch(`${API_BASE_URL}/api/reflection/${id}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      setQuestion(data.question)
    })
  }

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
                  <h1>{Question}</h1>
                  {console.log(experience)}
                  {experience?.reflectionanswer ||
                    "Refleksiooniküsimus puudub"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

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

            <div className="mt-8">
              <h2 className="text-[30px] mb-3">Kinnitaja teave</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-[22px] block mb-2">
                    Sinu e-posti aadress
                  </label>
                  <input
                    type="email"
                    value={approverEmail}
                    onChange={(e) => setApproverEmail(e.target.value)}
                    placeholder="example@mail.com"
                    className="w-full bg-[#efefef] text-black rounded-[10px] px-4 py-3 text-[20px]"
                  />
                </div>

                <div>
                  <label className="text-[22px] block mb-2">
                    Tagasiside (valikuline)
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Märkused ja tagasiside tegevuse kohta..."
                    className="w-full bg-[#efefef] text-black rounded-[10px] px-4 py-3 text-[20px] min-h-32"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <ActionButton
                label={declining ? "Laeb..." : "Lükka tagasi"}
                accent="bg-main-pink"
                onClick={handleDecline}
                disabled={declining || approving}
                type="button"
              />

              <ActionButton
                label={approving ? "Kinnitan..." : "Kinnita"}
                accent="bg-main-green"
                onClick={handleApprove}
                disabled={approving || declining}
                type="button"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Kinnita;
