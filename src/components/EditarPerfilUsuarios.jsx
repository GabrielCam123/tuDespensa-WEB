import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getUserByIdRequest,
  getDietByUserId,
  getInformationByUserId,
  updateUserRequestWeb,
  updateInformationByUserId,
  createOrUpdateDietByUserId,
} from "../api/users";
import { useNavigate } from "react-router-dom";

export const EditarPerfilUsuarios = () => {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [imagen, setImagen] = useState(null);
  const [informacion, setInformacion] = useState(null);
  const [dieta, setDieta] = useState("");
  const navigate = useNavigate();

  const subirImagen = async () => {
    const formData = new FormData();
    formData.append("image", imagen);

    try {
      const response = await fetch(
        `https://tudespensa-backend.onrender.com/api/user/${usuario._id}/upload-photo`, // ruta corregida
        {
          method: "PUT",
          body: formData,
        }
      );

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("Imagen subida con éxito", data);
        setMensaje("Imagen subida correctamente.");
      } else {
        const text = await response.text();
        console.log("Respuesta no JSON:", text);
        setMensaje("Imagen subida, pero la respuesta no es JSON.");
      }
    } catch (error) {
      console.error("Error al subir la imagen", error);
      setMensaje("Error al subir la imagen.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await getUserByIdRequest(id);
        setUsuario(userRes.data);
      } catch (error) {
        console.error("Error al obtener usuario:", error);
      }

      try {
        const dietaRes = await getDietByUserId(id);
        setDieta(dietaRes.data.type_diet || "Estandar");
      } catch (error) {
        console.warn("Este usuario no tiene una dieta registrada");
        setDieta(null);
      }

      try {
        const informacionRes = await getInformationByUserId(id);
        setInformacion(informacionRes.data);
      } catch (error) {
        console.warn("Este usuario no tiene información registrada");
        setInformacion(null);
      }
    };

    fetchData();
  }, [id]);

  if (!usuario) {
    return <p className="text-center mt-10">Cargando perfil del usuario...</p>;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUsuario((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleChangeInformacion = (e) => {
    const { name, value } = e.target;
    setInformacion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeDieta = (e) => {
    setDieta(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setImagen(file);
  };

  const handleGuardarTodo = async () => {
    try {
      setGuardando(true);

      // 1. Crear FormData con los datos del usuario
      const formDataUsuario = new FormData();

      // Agregar campos simples (ejemplo)
      formDataUsuario.append("username", usuario.username);
      formDataUsuario.append("email", usuario.email);
      formDataUsuario.append("role", usuario.role);
      formDataUsuario.append("status", usuario.status);

      // Si quieres subir la imagen también aquí (opcional, o ya la subes en subirImagen)
      //   if (imagen) {
      //     formDataUsuario.append("profilephoto", imagen);
      //   }

      // 2. Enviar la actualización del usuario
      const resUser = await updateUserRequestWeb(id, formDataUsuario);
      setUsuario(resUser.data.user);

      // 3. Actualizar información personal
      const resInfo = await updateInformationByUserId(id, informacion);
      setInformacion(resInfo.data);

      // 4. Crear o actualizar dieta
      console.log(
        "Valor de dieta (string):",
        dieta === null ? "Estandar" : dieta
      );

      const dietaPayload = {
        type_diet: dieta === null ? "Estandar" : dieta,
      };

      console.log("Dieta que se enviará al backend:", dietaPayload);

      const resDiet = await createOrUpdateDietByUserId(id, dietaPayload);
      setDieta(resDiet.diet); // solo si quieres actualizar el estado

      console.log("Respuesta del backend (dieta):", resDiet.data);

      alert("Cambios guardados correctamente");
      navigate(`/administracion/perfil/${id}`);
    } catch (error) {
      console.error("Error guardando datos:", error);
      alert("Error al guardar los datos");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center">
        Perfil del Usuario
      </h1>
      <div className="w-full p-4 bg-paleta2 shadow-md rounded-md grid-cols-2 grid gap-4">
        {/* Sección Usuario */}
        <div className="flex flex-col p-4 bg-white rounded-2xl">
          <div className="flex flex-col items-center">
            <img
              src={`https://tudespensa-backend.onrender.com/${usuario.profilephoto}`}
              alt="Foto de perfil"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 shadow-md cursor-pointer"
              onClick={() => document.getElementById("fileInput").click()}
            />
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <label>
              <strong>Nombre:</strong>
              <input
                type="text"
                name="username"
                value={usuario.username || ""}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
              />
            </label>

            <label>
              <strong>Email:</strong>
              <input
                type="email"
                name="email"
                value={usuario.email || ""}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
              />
            </label>

            <label>
              <strong>Rol:</strong>
              <select
                name="role"
                value={usuario.role || ""}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
              >
                <option value="" disabled>
                  Seleccione un rol
                </option>
                <option value="Usuario">Usuario</option>
                <option value="Administrador">Administrador</option>
              </select>
            </label>

            <label className="flex items-center gap-2">
              <strong>Estado:</strong>
              <input
                type="checkbox"
                name="status"
                checked={usuario.status || false}
                onChange={handleChange}
              />
              {usuario.status ? "Activo" : "Inactivo"}
            </label>
          </div>
        </div>

        {/* Información Personal */}
        <div className="bg-white p-4 rounded-xl">
          {informacion ? (
            <>
              <h2 className="text-lg font-semibold mb-3">
                Información Personal
              </h2>

              {[
                { label: "Nombre", name: "Nombre" },
                { label: "Apellidos", name: "Apellidos" },
                {
                  label: "Estatura (cm)",
                  name: "Estatura",
                  type: "number",
                  step: "0.01",
                },
                {
                  label: "Peso (Kg)",
                  name: "Peso",
                  type: "number",
                  step: "0.1",
                },
              ].map(({ label, name, type = "text", step }) => (
                <label key={name} className="flex justify-between mb-2">
                  <strong>{label}:</strong>
                  <input
                    type={type}
                    step={step}
                    name={name}
                    value={informacion[name] || ""}
                    onChange={handleChangeInformacion}
                    className="border rounded px-2 py-1 w-2/3"
                  />
                </label>
              ))}

              <label className="flex justify-between mb-2">
                <strong>Edad (fecha de nacimiento):</strong>
                <input
                  type="date"
                  name="Edad"
                  value={informacion.Edad ? informacion.Edad.split("T")[0] : ""}
                  onChange={handleChangeInformacion}
                  className="border rounded px-2 py-1 w-2/3"
                />
              </label>

              <label className="flex justify-between mb-2">
                <strong>Género:</strong>
                <select
                  name="Genero"
                  value={informacion.Genero || ""}
                  onChange={handleChangeInformacion}
                  className="border rounded px-2 py-1 w-2/3"
                >
                  <option value="" disabled>
                    Seleccione una opción
                  </option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                </select>
              </label>
              <label className="flex justify-between mb-2">
                <strong>Dieta:</strong>
                <select
                  name="Dieta"
                  value={dieta}
                  onChange={handleChangeDieta}
                  className="border rounded px-2 py-1 w-2/3"
                >
                  <option value="" disabled>
                    Seleccione una opción
                  </option>
                  <option value="Estandar">Estandar</option>
                  <option value="Vegetariano">Vegetariano</option>
                </select>
              </label>
            </>
          ) : (
            <p>
              No se encontró información personal registrada por el usuario.
            </p>
          )}
        </div>
      </div>

      {/* Botones finales */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={async () => {
            await subirImagen();
            await handleGuardarTodo();
          }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={guardando}
        >
          {guardando ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>

      {mensaje && (
        <p className="mt-4 text-center text-sm text-gray-700">{mensaje}</p>
      )}
    </div>
  );
};
