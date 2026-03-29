//https://api.epass.raimokivi.ee
export const API_BASE_URL = "http://localhost:3005";

const parseResponseBody = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return { message: text };
};

// Kategooria rakendused
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories`);
    if (!response.ok) throw new Error("Kategooriate laadimine ebaõnnestus");
    return await response.json();
  } catch (error) {
    console.error("Viga kategooriate laadimisel:", error);
    throw error;
  }
};

export const createCategory = async (name) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/category`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error("Kategooria loomine ebaõnnestus");
    return await response.json();
  } catch (error) {
    console.error("Viga kategooria loomisel:", error);
    throw error;
  }
};

// Reflektsioon rakendused
export const fetchReflections = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reflections`);
    if (!response.ok) throw new Error("Reflektsioonide laadimine ebaõnnestus");
    return await response.json();
  } catch (error) {
    console.error("Viga reflektsioonide laadimisel:", error);
    throw error;
  }
};

export const createReflection = async (question) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reflection`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    if (!response.ok) throw new Error("Refleksiooni loomine ebaõnnestus");
    return await response.json();
  } catch (error) {
    console.error("Viga refleksiooni loomisel:", error);
    throw error;
  }
};

// Tegevuse rakendused
export const addExperience = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/api/experience/add`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // FormData object
    });

    const payload = await parseResponseBody(response);

    if (!response.ok) {
      throw new Error(
        payload?.error || payload?.message || "Tegevuse lisamine ebaõnnestus"
      );
    }

    return payload;
  } catch (error) {
    console.error("Viga tegevuse lisamisel:", error);
    throw error;
  }
};

export const getExperience = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/experience/${id}`);
    if (!response.ok) throw new Error("Tegevuse laadimine ebaõnnestus");
    return await response.json();
  } catch (error) {
    console.error("Viga tegevuse laadimisel:", error);
    throw error;
  }
};

export const updateExperience = async (id, formData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/api/experience/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) throw new Error("Tegevuse uuendamine ebaõnnestus");
    return await response.json();
  } catch (error) {
    console.error("Viga tegevuse uuendamisel:", error);
    throw error;
  }
};

export const deleteExperience = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/api/experience/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Tegevuse kustutamine ebaõnnestus");
    return await response.json();
  } catch (error) {
    console.error("Viga tegevuse kustutamisel:", error);
    throw error;
  }
};