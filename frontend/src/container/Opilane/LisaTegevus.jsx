import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import {
  fetchCategories,
  createCategory,
  fetchReflections,
  createReflection,
  addExperience,
  getExperience,
  updateExperience,
} from "../../API";
import CustomSelect from "../../components/CustomSelect";
import ActionButton from "../../components/ActionButton";

const LisaTegevus = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const messageAnchorRef = useRef(null);
  const [existingStatus, setExistingStatus] = useState("ootel");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
    reflectionanswer: "",
    category_id: "",
    reflection_id: "",
    approver_email: "",
  });

  const [files, setFiles] = useState([]);
  const [urlProofs, setUrlProofs] = useState([{ proof_url: "" }]);

  // Fetched data
  const [categories, setCategories] = useState([]);
  const [reflections, setReflections] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newReflectionQuestion, setNewReflectionQuestion] = useState("");

  const editId = searchParams.get("edit");
  const isEditMode = !!editId;
  const exitPath = isEditMode ? `/mina/tegevused/${editId}` : "/mina/tegevused";

  const getReflectionId = (reflection) =>
    reflection.id || reflection.reflection_id;

  const categoryOptions = [
    { value: "", label: "Vali kategooria" },
    ...categories.map((category) => ({
      value: String(category.id || category.category_id),
      label: category.name,
    })),
  ];

  const reflectionOptions = [
    { value: "", label: "Vali reflektsiooniküsimus" },
    ...reflections.map((reflection) => ({
      value: String(getReflectionId(reflection)),
      label: reflection.question,
    })),
  ];

  // Load categories and reflections on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, reflectionsData, experienceData] =
          await Promise.all([
            fetchCategories(),
            fetchReflections(),
            isEditMode ? getExperience(editId) : Promise.resolve(null),
          ]);
        setCategories(categoriesData || []);
        setReflections(reflectionsData || []);

        if (isEditMode && experienceData) {
          const experience = experienceData?.experience || experienceData;
          const date = experience?.date ? new Date(experience.date) : null;
          const formattedDate =
            date && !Number.isNaN(date.getTime())
              ? date.toISOString().split("T")[0]
              : "";

          const urlProofList = (experience?.proofs || [])
            .filter((proof) => /^https?:\/\//i.test(proof.proof_url || ""))
            .map((proof) => ({ proof_url: proof.proof_url }));

          setFormData({
            title: experience?.title || "",
            date: formattedDate,
            description: experience?.description || "",
            reflectionanswer: experience?.reflectionanswer || "",
            category_id: String(experience?.category_id || ""),
            reflection_id: String(experience?.reflection_id || ""),
            approver_email: experience?.approver_email || "",
          });

          setExistingStatus(
            (experience?.status || "ootel").toString().trim().toLowerCase(),
          );
          setUrlProofs(
            urlProofList.length > 0 ? urlProofList : [{ proof_url: "" }],
          );
        }
      } catch (err) {
        console.error("Viga andmete laadimisel:", err);
        setError("Kategooriate ja reflektsioonide laadimine ebaõnnestus");
      }
    };
    loadData();
  }, [editId, isEditMode]);

  useEffect(() => {
    if ((error || success) && messageAnchorRef.current) {
      messageAnchorRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [error, success]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files || []));
  };

  // Handle URL proof change
  const handleUrlProofChange = (index, value) => {
    const newProofs = [...urlProofs];
    newProofs[index].proof_url = value;
    setUrlProofs(newProofs);
  };

  // Add new URL proof input
  const addUrlProofInput = () => {
    setUrlProofs([...urlProofs, { proof_url: "" }]);
  };

  // Remove URL proof input
  const removeUrlProofInput = (index) => {
    setUrlProofs(urlProofs.filter((_, i) => i !== index));
  };

  // Create new category if needed
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setError("Kategooria nimi ei saa olla tühi");
      return;
    }
    try {
      const newCategory = await createCategory(newCategoryName);
      setCategories([...categories, newCategory.data]);
      setFormData((prev) => ({ ...prev, category_id: newCategory.data.id }));
      setNewCategoryName("");
      setSuccess("Kategooria loodud!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Kategooria loomine ebaõnnestus");
    }
  };

  // Create new reflection if needed
  const handleCreateReflection = async () => {
    if (!newReflectionQuestion.trim()) {
      setError("Reflektsiooni küsimus ei saa olla tühi");
      return;
    }
    try {
      const newReflection = await createReflection(newReflectionQuestion);
      setReflections([...reflections, newReflection.data]);
      setFormData((prev) => ({
        ...prev,
        reflection_id: getReflectionId(newReflection.data),
      }));
      setNewReflectionQuestion("");
      setSuccess("Reflektsioon loodud!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Refleksiooni loomine ebaõnnestus");
    }
  };

  // Validate form
  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Tegevuse nimi on kohustuslik");
      return false;
    }
    if (!formData.date) {
      setError("Kuupäev on kohustuslik");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Kirjeldus on kohustuslik");
      return false;
    }
    if (!formData.reflectionanswer.trim()) {
      setError("Refleksiooni vastus on kohustuslik");
      return false;
    }
    if (!formData.category_id) {
      setError("Kategooria on kohustuslik");
      return false;
    }
    if (!formData.reflection_id) {
      setError("Reflektsiooniküsimus on kohustuslik");
      return false;
    }
    return true;
  };

  // Handle form submission
  const resetFormState = () => {
    setFormData({
      title: "",
      date: "",
      description: "",
      reflectionanswer: "",
      category_id: "",
      reflection_id: "",
      approver_email: "",
    });
    setFiles([]);
    setUrlProofs([{ proof_url: "" }]);
  };

  const handleClearAndExit = () => {
    resetFormState();
    navigate(exitPath);
  };

  const handleSubmit = async ({
    statusOverride,
    exitAfterSave = false,
  } = {}) => {
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();

      // Convert date from YYYY-MM-DD to DD-MM-YYYY
      const dateParts = formData.date.split("-");
      const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

      // Add text fields
      const resolvedStatus =
        statusOverride || (isEditMode ? existingStatus || "ootel" : "ootel");

      form.append("title", formData.title);
      form.append("date", formattedDate);
      form.append("description", formData.description);
      form.append("reflectionanswer", formData.reflectionanswer);
      form.append("status", resolvedStatus);
      form.append("category_id", formData.category_id);
      if (formData.reflection_id)
        form.append("reflection_id", formData.reflection_id);
      if (formData.approver_email)
        form.append("approver_email", formData.approver_email);

      // Add files
      files.forEach((file) => {
        form.append("files", file);
      });

      // Filter and add URL proofs
      const validUrls = urlProofs
        .map((p) => ({ proof_url: (p.proof_url || "").trim() }))
        .filter((p) => p.proof_url);

      // In edit mode always send proofs array so backend can sync removals too.
      if (isEditMode) {
        form.append("proofs", JSON.stringify(validUrls));
      } else if (validUrls.length > 0) {
        form.append("proofs", JSON.stringify(validUrls));
      }

      const response = isEditMode
        ? await updateExperience(editId, form)
        : await addExperience(form);

      if (response.success) {
        setSuccess(
          isEditMode
            ? "Tegevus edukalt uuendatud!"
            : "Tegevus edukalt lisatud!",
        );

        if (!isEditMode || exitAfterSave) {
          resetFormState();
        }

        setTimeout(() => {
          if (exitAfterSave) {
            navigate(exitPath);
            return;
          }

          if (isEditMode) {
            navigate(exitPath);
            return;
          }
          navigate("/mina/tegevused");
        }, 2000);
      }
    } catch (err) {
      setError(err.message || "Tegevuse lisamine ebaõnnestus");
      console.error("Viga tegevuse lisamisel:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#efefef] min-h-screen">
      <Navbar />

      <main>
        <section className="max-w-7xl mx-auto px-6 py-14">
          <h1 className="text-center text-[72px] font-bold text-black">
            {isEditMode ? "Muuda tegevust" : "Lisage uus tegevus"}
          </h1>
          <div className="h-0.5 bg-[#9b9b9b] mt-14" />
        </section>

        <div ref={messageAnchorRef}></div>

        {error && (
          <section className="bg-[#B13838] text-white max-w-7xl mx-auto px-8 py-4 rounded-[10px] mb-6">
            <p className="text-[20px]">{error}</p>
          </section>
        )}

        {success && (
          <section className="bg-main-green text-white max-w-7xl mx-auto px-8 py-4 rounded-[10px] mb-6">
            <p className="text-[20px]">{success}</p>
          </section>
        )}

        <section className="bg-black text-white">
          <div className="max-w-7xl mx-auto px-8 pt-16 pb-28">
            <form className="space-y-8">
              <div className="grid grid-cols-12 gap-x-8 gap-y-10">
                {/* Title */}
                <div className="col-span-12 md:col-span-5">
                  <label className="block text-[28px] mb-3">
                    Tegevuse nimi *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full h-13 rounded-[10px] bg-[#ebebeb] text-black px-4 text-[24px] outline-none"
                    placeholder="Sisestage tegevuse nimi"
                  />
                </div>

                {/* Date */}
                <div className="col-span-12 md:col-span-3">
                  <label className="block text-[28px] mb-3">Kuupäev *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full h-13 rounded-[10px] bg-[#ebebeb] text-black px-4 text-[24px] outline-none"
                  />
                </div>

                {/* Category */}
                <div className="col-span-12 md:col-span-4">
                  <label className="block text-[28px] mb-3">Tüüp *</label>
                  <CustomSelect
                    fullWidth
                    value={String(formData.category_id || "")}
                    onChange={(value) => {
                      setFormData((prev) => ({ ...prev, category_id: value }));
                      setError("");
                    }}
                    options={categoryOptions}
                    buttonClassName="h-13 text-[24px]"
                  />
                </div>

                {/* Description */}
                <div className="col-span-12 md:col-span-5">
                  <label className="block text-[28px] mb-3">Kirjeldus *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full h-80 rounded-[10px] bg-[#ebebeb] text-black px-4 py-3 text-[24px] outline-none resize-none"
                    placeholder="Sisestage tegevuse kirjeldus"
                  />
                </div>

                {/* Reflection Answer and Approver Email */}
                <div className="col-span-12 md:col-span-7 space-y-5">
                  <div>
                    <label className="block text-[28px] mb-3">
                      Reflektsiooniküsimus *
                    </label>
                    <CustomSelect
                      fullWidth
                      value={String(formData.reflection_id || "")}
                      onChange={(value) => {
                        setFormData((prev) => ({
                          ...prev,
                          reflection_id: value,
                        }));
                        setError("");
                      }}
                      options={reflectionOptions}
                      buttonClassName="h-13 text-[24px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[28px] mb-3">
                      Refleksiooni vastus *
                    </label>
                    <textarea
                      name="reflectionanswer"
                      value={formData.reflectionanswer}
                      onChange={handleInputChange}
                      className="w-full h-46 rounded-[10px] bg-[#ebebeb] text-black px-4 py-3 text-[24px] outline-none resize-none"
                      placeholder="Kirjutage vastus valitud küsimusele"
                    />
                  </div>

                  <div>
                    <label className="block text-[28px] mb-3">
                      Saaja email
                    </label>
                    <input
                      type="email"
                      name="approver_email"
                      value={formData.approver_email}
                      onChange={handleInputChange}
                      className="w-full h-13 rounded-[10px] bg-[#ebebeb] text-black px-4 text-[24px] outline-none"
                      placeholder="Sisestage saaja email (valikuline)"
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-[28px] mb-3">
                      Lisage fail/pilt/link
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="w-full h-13 rounded-[10px] bg-[#ebebeb] text-black px-2 text-[20px] outline-none file:mr-3 file:rounded-full file:border-0 file:bg-main-cyan file:text-black file:px-4 file:py-1.5 file:text-[18px]"
                    />
                    {files.length > 0 && (
                      <p className="text-[16px] mt-2 text-gray-300">
                        {files.length} fail(i) valitud
                      </p>
                    )}
                  </div>

                  {/* URL Proofs */}
                  <div>
                    <label className="block text-[28px] mb-3">
                      Linkid (URL-id)
                    </label>
                    <div className="space-y-3">
                      {urlProofs.map((proof, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="url"
                            value={proof.proof_url}
                            onChange={(e) =>
                              handleUrlProofChange(index, e.target.value)
                            }
                            className="flex-1 h-13 rounded-[10px] bg-[#ebebeb] text-black px-4 text-[24px] outline-none"
                            placeholder="https://..."
                          />
                          {urlProofs.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeUrlProofInput(index)}
                              className="bg-[#B13838] text-white rounded-[10px] px-4 py-2 text-[20px]"
                            >
                              Eemalda
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addUrlProofInput}
                        className="text-[20px] text-gray-400 hover:text-gray-200 mt-2"
                      >
                        + Lisa veel üks link
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
                {isEditMode ? (
                  <div className="flex flex-wrap items-center gap-4">
                    <ActionButton
                      label="Tagasi"
                      accent="bg-main-green"
                      onClick={() => navigate(`/mina/tegevused/${editId}`)}
                      disabled={loading}
                      type="button"
                    />
                    <ActionButton
                      label="Salvesta ja saada"
                      accent="bg-main-pink"
                      onClick={() => handleSubmit({ statusOverride: "ootel" })}
                      disabled={loading}
                      type="button"
                    />
                    <ActionButton
                      label="Salvesta mustand ja välju"
                      accent="bg-main-green"
                      onClick={() =>
                        handleSubmit({
                          statusOverride: "mustand",
                          exitAfterSave: true,
                        })
                      }
                      disabled={loading}
                      type="button"
                    />
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-4">
                    <ActionButton
                      label="Salvesta ja saada"
                      accent="bg-main-pink"
                      onClick={() => handleSubmit({ statusOverride: "ootel" })}
                      disabled={loading}
                      type="button"
                    />
                    <ActionButton
                      label="Salvesta mustand ja välju"
                      accent="bg-main-green"
                      onClick={() =>
                        handleSubmit({
                          statusOverride: "mustand",
                          exitAfterSave: true,
                        })
                      }
                      disabled={loading}
                      type="button"
                    />
                  </div>
                )}

                <ActionButton
                  label="Kustuta"
                  accent="bg-main-pink"
                  onClick={handleClearAndExit}
                  disabled={loading}
                  type="button"
                />
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LisaTegevus;
