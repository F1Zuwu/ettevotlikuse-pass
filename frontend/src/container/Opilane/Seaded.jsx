import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import userIcon from "../../assets/icons/user.png";
import { API_BASE_URL, fetchUserProfile, updateUserProfile } from "../../API";
import ActionButton from "../../components/ActionButton";

const getResolvedImageUrl = (url) => {
  if (!url) {
    return "";
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${API_BASE_URL}${url}`;
};

const splitName = (fullName = "") => {
  const value = fullName.trim();
  if (!value) {
    return { firstName: "", lastName: "" };
  }

  const parts = value.split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "" };
  }

  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts.at(-1) || "",
  };
};

const COUNTRY_PHONE_CODES = [
  { value: "+372", label: "EE (+372)" },
  { value: "+371", label: "LV (+371)" },
  { value: "+370", label: "LT (+370)" },
  { value: "+358", label: "FI (+358)" },
  { value: "+46", label: "SE (+46)" },
  { value: "+47", label: "NO (+47)" },
  { value: "+49", label: "DE (+49)" },
  { value: "+44", label: "UK (+44)" },
  { value: "+1", label: "US/CA (+1)" },
];

const parsePhoneValue = (rawPhone = "") => {
  const value = rawPhone.trim();
  if (!value) {
    return { code: "+372", number: "" };
  }

  const compact = value.replace(/\s+/g, "");
  const sortedCodes = COUNTRY_PHONE_CODES.map((item) => item.value).sort(
    (a, b) => b.length - a.length,
  );

  for (const code of sortedCodes) {
    if (compact.startsWith(code)) {
      return {
        code,
        number: compact.slice(code.length).replace(/\D/g, ""),
      };
    }
  }

  if (compact.startsWith("+")) {
    const codeMatch = compact.match(/^\+\d{1,4}/);
    if (codeMatch) {
      return {
        code: codeMatch[0],
        number: compact.slice(codeMatch[0].length).replace(/\D/g, ""),
      };
    }
  }

  return { code: "+372", number: compact.replace(/\D/g, "") };
};

const normalizeBirthdayValue = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    if (value === "Invalid date") {
      return "";
    }

    const match = value.match(/^\d{4}-\d{2}-\d{2}/);
    return match ? match[0] : "";
  }

  const asDate = new Date(value);
  if (Number.isNaN(asDate.getTime())) {
    return "";
  }

  return asDate.toISOString().slice(0, 10);
};

const Seaded = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCode, setPhoneCode] = useState("+372");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthday, setBirthday] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [activeSection, setActiveSection] = useState("konto");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchUserProfile();
        const profile = data.user || {};
        const nameParts = splitName(profile.name || "");

        setFirstName(nameParts.firstName);
        setLastName(nameParts.lastName);
        setEmail(profile.email || "");
        const parsedPhone = parsePhoneValue(profile.phone || "");
        setPhoneCode(parsedPhone.code);
        setPhoneNumber(parsedPhone.number);
        setBirthday(normalizeBirthdayValue(profile.birthday));
        setProfileImage(profile.profileimg || "");
      } catch {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, token]);

  const fullName = useMemo(() => {
    return [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");
  }, [firstName, lastName]);

  const validateProfile = () => {
    if (!firstName.trim()) {
      setError("Eesnimi on kohustuslik.");
      return false;
    }

    if (!emailRegex.test(email.trim())) {
      setError("Sisesta korrektne e-maili aadress.");
      return false;
    }

    if (newPassword || currentPassword) {
      if (!newPassword || !currentPassword) {
        setError("Parooli muutmiseks sisesta nii praegune kui uus salasõna.");
        return false;
      }
      if (newPassword.length < 8) {
        setError("Uus salasõna peab olema vähemalt 8 tähemärki.");
        return false;
      }
    }

    return true;
  };

  const handleSaveProfile = async ({ withPassword = false } = {}) => {
    if (!token) {
      return;
    }

    if (!validateProfile()) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const payload = new FormData();
      payload.append("name", fullName);
      payload.append("email", email.trim());
      payload.append("phone", `${phoneCode}${phoneNumber}`);
      payload.append("birthday", normalizeBirthdayValue(birthday));
      payload.append("profileimg", profileImage.trim());

      if (profileImageFile) {
        payload.append("profileImage", profileImageFile);
      }

      if (withPassword && newPassword && currentPassword) {
        payload.append("currentPassword", currentPassword);
        payload.append("newPassword", newPassword);
      }

      const data = await updateUserProfile(payload);
      const updatedUser = data?.user || {};

      if (typeof updatedUser.profileimg === "string") {
        setProfileImage(updatedUser.profileimg);
      }

      setProfileImageFile(null);

      if (withPassword) {
        setCurrentPassword("");
        setNewPassword("");
      }

      setSuccessMessage("Andmed salvestatud.");
    } catch (saveError) {
      setError(saveError?.message || "Salvestamine ebaõnnestus. Proovi uuesti.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const sidebarLinkClass =
    "text-white text-lg text-left hover:text-main-yellow transition-colors duration-150";

  const inputClass =
    "h-10 rounded-[10px] border border-black bg-white px-3 text-black outline-none";

  const handlePhoneNumberChange = (event) => {
    const digitsOnly = event.target.value.replace(/\D/g, "");
    setPhoneNumber(digitsOnly);
  };

  const handleProfileImageFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setProfileImageFile(file);
  };

  // Easy control thingy.
  const sizeClasses = {
    backButton: "h-10 w-10 text-5xl",
    seadedButton: "w-42 h-auto",
    seadedButtonText: "text-[18px] px-4 py-2",
    logoutButton: "w-4/5 max-w-sm",
    logoutText: "text-[18px] px-4 py-2",
    smallSaveButton:
      "h-9 rounded-[10px] bg-main-green px-4 text-[15px] text-white",
    sidebarDeleteText: "text-[18px] px-4 py-2",
    profileRemoveButton:
      "h-9 rounded-[10px] bg-[#B13838] px-4 text-[15px] text-white hover:opacity-90",
    muudaHelperText: "mt-2 text-[16px]",
    plainMuudaButton:
      "h-9 rounded-[10px] bg-[#FFBB00] px-4 text-[15px] text-black hover:opacity-90",
  };

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      <div className="w-full">
        <div className="flex flex-col lg:flex-row">
          <aside className="bg-black w-full lg:w-95">
            <div className="px-6 py-7 border-b border-main-pink">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className={`${sizeClasses.backButton} flex items-center justify-center rounded-[15px] bg-main-pink text-black leading-none`}
                  aria-label="Tagasi"
                  onClick={() => navigate("/")}
                >
                  <span className="relative -top-1">&lt;</span>
                </button>
                <ActionButton
                  label="Seaded"
                  accent="bg-main-pink"
                  textClassName={sizeClasses.seadedButtonText}
                  className={sizeClasses.seadedButton}
                />
              </div>
            </div>

            <div className="px-6 py-8 border-b border-main-pink">
              <ActionButton
                label="Konto"
                accent={activeSection === "konto" ? "bg-main-cyan" : "bg-black"}
                onClick={() => setActiveSection("konto")}
                className="w-full max-w-96.25"
                textClassName="!text-[20px] px-5 py-2"
                iconNode={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="22"
                    viewBox="0 -2 17 24"
                    fill="none"
                    className="text-white shrink-0"
                    aria-hidden="true"
                  >
                    <ellipse
                      cx="8.6857"
                      cy="5.49032"
                      rx="5.21146"
                      ry="5.49032"
                      fill="currentColor"
                    />
                    <path
                      d="M16.9372 19.2161C16.9372 17.8573 16.7182 16.5118 16.2926 15.2564C15.867 14.0011 15.2432 12.8604 14.4568 11.8996C13.6705 10.9388 12.7369 10.1766 11.7094 9.6566C10.682 9.13661 9.58074 8.86897 8.46862 8.86897C7.35651 8.86897 6.25528 9.13661 5.22782 9.6566C4.20036 10.1766 3.26679 10.9388 2.4804 11.8996C1.69402 12.8604 1.07022 14.0011 0.644635 15.2564C0.219047 16.5118 -9.72242e-08 17.8573 0 19.2161L8.46862 19.2161H16.9372Z"
                      fill="currentColor"
                    />
                  </svg>
                }
              />

              <div className="mt-4">
                <ActionButton
                  label="Privaatsus ja turvalisus"
                  accent={
                    activeSection === "privacy" ? "bg-main-cyan" : "bg-black"
                  }
                  onClick={() => setActiveSection("privacy")}
                  className="w-full max-w-96.25"
                  textClassName="!text-[20px] px-5 py-2"
                  iconNode={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      width="22"
                      height="22"
                      className="text-white shrink-0"
                      aria-hidden="true"
                    >
                      <rect
                        x="5"
                        y="10"
                        width="14"
                        height="10"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M8 10V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  }
                />
              </div>

              <div className="mt-4"></div>
            </div>

            <div className="px-6 py-8 pl-16 border-b border-main-pink">
              <div className="flex flex-col gap-5">
                <button
                  type="button"
                  className={`${sidebarLinkClass} ${activeSection === "notifications" ? "border-l-4 border-main-cyan pl-2" : ""}`}
                  onClick={() => setActiveSection("notifications")}
                >
                  Teavituste eelistused
                </button>
                <button
                  type="button"
                  className={`${sidebarLinkClass} ${activeSection === "dataManagement" ? "border-l-4 border-main-cyan pl-2" : ""}`}
                  onClick={() => setActiveSection("dataManagement")}
                >
                  Andmete haldus
                </button>
                <button
                  type="button"
                  className={`${sidebarLinkClass} ${activeSection === "support" ? "border-l-4 border-main-cyan pl-2" : ""}`}
                  onClick={() => setActiveSection("support")}
                >
                  Abi ja tugi
                </button>
              </div>
            </div>

            <div className="px-6 py-8 space-y-4 flex flex-col">
              <ActionButton
                label="Logi välja"
                accent="bg-main-green"
                onClick={handleLogout}
                textClassName={sizeClasses.logoutText}
                className={sizeClasses.logoutButton}
              />

              <ActionButton
                label="Kustuta kasutaja"
                accent="bg-main-pink"
                onClick={() =>
                  setError(
                    "Kasutaja kustutamise funktsioon pole veel saadaval.",
                  )
                }
                textClassName={sizeClasses.sidebarDeleteText}
                className={sizeClasses.logoutButton}
              />
            </div>
          </aside>

          <main className="w-full bg-white px-5 py-6 sm:px-8 lg:px-10 lg:py-6">
            {loading && <p className="text-black text-lg">Laen andmeid...</p>}

            {!loading && (
              <div className="mx-auto w-full max-w-336 text-black space-y-5">
                {activeSection === "konto" ? (
                  <>
                    <h1 className="text-[34px] leading-none">Konto</h1>
                    <div className="border-t border-black" />

                    {error && (
                      <p className="mt-4 rounded-md border border-[#b13838] bg-[#ffd9d9] px-3 py-2 text-[#7a0000]">
                        {error}
                      </p>
                    )}
                    {successMessage && (
                      <p className="mt-4 rounded-md border border-[#2f7d32] bg-[#e3f8e2] px-3 py-2 text-[#1c5f20]">
                        {successMessage}
                      </p>
                    )}

                    <section className="py-3 border-b border-black">
                      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-5 items-center">
                        <div className="h-34 w-34 rounded-full bg-black overflow-hidden flex items-center justify-center">
                          {profileImage ? (
                            <img
                              src={getResolvedImageUrl(profileImage)}
                              alt="Profiili pilt"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <img
                              src={userIcon}
                              alt="Profiili pilt"
                              className="h-24 w-24"
                            />
                          )}
                        </div>

                        <div className="w-full">
                          <h2 className="text-[26px] leading-none">
                            Profiili pilt
                          </h2>
                          <p className="mt-2 text-[#666] text-sm">
                            PNG, JPEG under 15 MB
                          </p>
                          <div className="mt-3 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto] gap-2">
                            <input
                              id="profileImage"
                              name="profileImage"
                              type="text"
                              value={profileImage}
                              onChange={(event) =>
                                setProfileImage(event.target.value)
                              }
                              className={`${inputClass} w-full min-w-0`}
                              placeholder="Profiilipildi URL"
                            />

                            <input
                              id="profileImageFile"
                              name="profileImageFile"
                              type="file"
                              accept="image/png,image/jpeg,image/jpg"
                              onChange={handleProfileImageFileChange}
                              className="h-10 w-full min-w-0 rounded-[10px] border border-black bg-white px-2 text-xs text-black sm:text-sm file:mr-2 file:rounded-md file:border-0 file:bg-main-yellow file:px-2 file:py-1 file:text-xs file:text-black sm:file:px-3 sm:file:text-sm"
                            />

                            <button
                              type="button"
                              onClick={() => handleSaveProfile()}
                              disabled={saving}
                              className={`${sizeClasses.smallSaveButton} ${saving ? "opacity-60 cursor-not-allowed" : ""}`}
                            >
                              {saving ? "Salvestan..." : "Salvesta"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setProfileImage("");
                                setProfileImageFile(null);
                              }}
                              className={sizeClasses.profileRemoveButton}
                            >
                              Eemalda
                            </button>
                          </div>

                          {profileImageFile && (
                            <p className="mt-2 text-sm text-[#333]">
                              Valitud fail: {profileImageFile.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </section>

                    <section className="py-3 border-b border-black">
                      <h2 className="text-[26px] leading-none">Täisnimi</h2>
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="firstName" className="text-[18px]">Eesnimi</label>
                          <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={firstName}
                            onChange={(event) =>
                              setFirstName(event.target.value)
                            }
                            className={`${inputClass} mt-2 w-full`}
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="text-[18px]">Perekonnanimi</label>
                          <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            value={lastName}
                            onChange={(event) =>
                              setLastName(event.target.value)
                            }
                            className={`${inputClass} mt-2 w-full`}
                          />
                        </div>
                      </div>
                    </section>

                    <section className="py-3 border-b border-black">
                      <h2 className="text-[26px] leading-none">
                        Kontakt andmed
                      </h2>

                      <div className="mt-3 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end">
                          <div className="w-full md:w-2/3">
                            <label htmlFor="email" className="text-[18px]">E-mail</label>
                            <input
                              id="email"
                              name="email"
                              type="email"
                              value={email}
                              onChange={(event) => setEmail(event.target.value)}
                              className={`${inputClass} mt-2 w-full`}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end">
                          <div className="w-full md:w-2/3">
                            <label className="text-[18px]">
                              Telefoni number
                            </label>
                            <div className="mt-2 grid grid-cols-[auto_1fr] gap-2 w-full">
                              <select
                                id="phoneCode"
                                name="phoneCode"
                                value={phoneCode}
                                onChange={(event) =>
                                  setPhoneCode(event.target.value)
                                }
                                className={inputClass}
                                aria-label="Riigikood"
                              >
                                {COUNTRY_PHONE_CODES.map((country) => (
                                  <option
                                    key={country.value}
                                    value={country.value}
                                  >
                                    {country.label}
                                  </option>
                                ))}
                              </select>

                              <input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                value={phoneNumber}
                                onChange={handlePhoneNumberChange}
                                className={inputClass}
                                placeholder="5512345"
                                inputMode="numeric"
                                pattern="[0-9]*"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className="py-3 border-b border-black">
                      <h2 className="text-[26px] leading-none">Salasõna</h2>
                      <p className={sizeClasses.muudaHelperText}>
                        Muuda praegust salasõna
                      </p>

                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="currentPassword" className="text-[18px]">
                            Praegune salasõna
                          </label>
                          <input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(event) =>
                              setCurrentPassword(event.target.value)
                            }
                            className={`${inputClass} mt-2 w-full`}
                          />
                        </div>
                        <div>
                          <label htmlFor="newPassword" className="text-[18px]">Uus salasõna</label>
                          <input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(event) =>
                              setNewPassword(event.target.value)
                            }
                            className={`${inputClass} mt-2 w-full`}
                          />
                        </div>
                      </div>
                    </section>

                    <section className="py-3">
                      <h2 className="text-[26px] leading-none">Sünnipäev</h2>
                      <div className="mt-3 max-w-75.5">
                        <input
                          id="birthday"
                          name="birthday"
                          type="date"
                          value={birthday}
                          onChange={(event) => setBirthday(event.target.value)}
                          className={`${inputClass} w-full`}
                        />
                      </div>
                    </section>

                    <div className="pb-2 flex justify-end">
                      <ActionButton
                        label={saving ? "Salvestan..." : "Salvesta muudatused"}
                        accent="bg-main-green"
                        onClick={() => handleSaveProfile()}
                        disabled={saving}
                        textClassName="text-[20px] px-5 py-2"
                      />
                    </div>
                  </>
                ) : activeSection === "privacy" ? (
                  <>
                    <h1 className="text-[34px] leading-none">
                      Privaatsus ja turvalisus
                    </h1>
                    <div className="border-t border-black" />

                    <section className="rounded-[14px] border border-black bg-white px-6 py-7">
                      <h2 className="text-[26px] leading-none">Arenduses</h2>
                      <p className="mt-3 text-[18px] text-[#333]">
                        See vaade on hetkel arenduses. Tule varsti tagasi -
                        lisame siia peagi privaatsuse ja turvalisuse seaded.
                      </p>
                    </section>
                  </>
                ) : activeSection === "notifications" ? (
                  <>
                    <h1 className="text-[34px] leading-none">
                      Teavituste eelistused
                    </h1>
                    <div className="border-t border-black" />

                    <section className="rounded-[14px] border border-black bg-white px-6 py-7">
                      <h2 className="text-[26px] leading-none">Arenduses</h2>
                      <p className="mt-3 text-[18px] text-[#333]">
                        See vaade on hetkel arenduses. Tule varsti tagasi -
                        lisame siia peagi teavituste eelistuste seaded.
                      </p>
                    </section>
                  </>
                ) : activeSection === "dataManagement" ? (
                  <>
                    <h1 className="text-[34px] leading-none">Andmete haldus</h1>
                    <div className="border-t border-black" />

                    <section className="rounded-[14px] border border-black bg-white px-6 py-7">
                      <h2 className="text-[26px] leading-none">Arenduses</h2>
                      <p className="mt-3 text-[18px] text-[#333]">
                        See vaade on hetkel arenduses. Tule varsti tagasi -
                        lisame siia peagi andmete halduse funktsioonid.
                      </p>
                    </section>
                  </>
                ) : activeSection === "support" ? (
                  <>
                    <h1 className="text-[34px] leading-none">Abi ja tugi</h1>
                    <div className="border-t border-black" />

                    <section className="rounded-[14px] border border-black bg-white px-6 py-7">
                      <h2 className="text-[26px] leading-none">Arenduses</h2>
                      <p className="mt-3 text-[18px] text-[#333]">
                        See vaade on hetkel arenduses. Tule varsti tagasi -
                        lisame siia peagi abi ja tugisüsteemi.
                      </p>
                    </section>
                  </>
                ) : (
                  <>
                    <h1 className="text-[34px] leading-none">
                      Passi haldamine
                    </h1>
                    <div className="border-t border-black" />

                    <section className="rounded-[14px] border border-black bg-white px-6 py-7">
                      <h2 className="text-[26px] leading-none">
                        Varsti saadaval
                      </h2>
                      <p className="mt-3 text-[18px] text-[#333]">
                        See vaade on hetkel arenduses. Tule varsti tagasi -
                        lisame siia peagi passi haldamise funktsioonid.
                      </p>
                    </section>
                  </>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Seaded;
