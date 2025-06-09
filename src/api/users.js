import axios from "./axios";
export const getUsersRequest = () => axios.get("/users");
export const updateUserRequest = (id, userData) =>
  axios.put(`/user/${id}`, userData);
export const deleteUserRequest = (id) => axios.delete(`/user/${id}`);
export const getUserByIdRequest = (id) => {
  return axios.get(`/users/${id}`);
};
export const getDespensaByUserId = (id) => axios.get(`/despensa/user/${id}`);
export const getDietByUserId = (id) => axios.get(`/diet/user/${id}`);
export const getInformationByUserId = (id) =>
  axios.get(`/information/user/${id}`);
export const getHistoryByUserId = (id) =>
  axios.get(`/shopping-history/user/${id}`);
export const getListaByUserId = (id) => axios.get(`/lista/user/${id}`);
export const createUserRequest = (formData) =>
  axios.post("/users", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const updateUserRequestWeb = (id, formData) =>
  axios.put(`/user/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const updateInformationByUserId = async (id, informacion) => {
  const response = await fetch(`http://localhost:4000/api/information/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(informacion),
  });

  if (!response.ok) {
    throw new Error("Error actualizando la información");
  }

  return await response.json();
};
export const createOrUpdateDietByUserId = async (id, dietData) => {
  console.log("Enviando dieta al backend:", dietData, "para usuario:", id);

  const response = await fetch(`http://localhost:4000/api/diet/user/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dietData),
  });

  if (!response.ok) {
    throw new Error("Error creando o actualizando la dieta");
  }

  return await response.json();
};
