import React, { useState } from "react";
import { createUserRequest } from "../api/users";
import { useNavigate } from "react-router-dom";

const CrearUnUsuario = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "Usuario",
    status: true,
    profilephoto: null,
    Nombre: "",
    Apellidos: "",
    Estatura: "",
    Peso: "",
    Edad: "",
    Genero: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      await createUserRequest(data);
      alert("Usuario creado exitosamente");
      navigate("/administracion");
    } catch (error) {
      console.error("Error al crear usuario:", error);
      alert("Hubo un error al crear el usuario");
    }
  };

  // Clase común para inputs y selects para estilo uniforme
  const commonInputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-paleta1";

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-2xl border border-gray-200">
      <h2 className="text-3xl font-semibold mb-8 text-center text-paleta1">
        Crear Nuevo Usuario
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campos de información personal */}
        <div className=" bg-white rounded-lg shadow-md space-y-4">
          <div>
            <label
              className="block text-gray-700 font-semibold mb-1"
              htmlFor="Nombre"
            >
              Nombre:
            </label>
            <input
              id="Nombre"
              type="text"
              name="Nombre"
              value={formData.Nombre || ""}
              onChange={handleChange}
              required
              className={commonInputClass}
            />
          </div>

          <div>
            <label
              className="block text-gray-700 font-semibold mb-1"
              htmlFor="Apellidos"
            >
              Apellidos:
            </label>
            <input
              id="Apellidos"
              type="text"
              name="Apellidos"
              value={formData.Apellidos || ""}
              onChange={handleChange}
              required
              className={commonInputClass}
            />
          </div>

          <div>
            <label
              className="block text-gray-700 font-semibold mb-1"
              htmlFor="Estatura"
            >
              Estatura (cm):
            </label>
            <input
              id="Estatura"
              type="number"
              name="Estatura"
              value={formData.Estatura || ""}
              onChange={handleChange}
              required
              min={0}
              className={commonInputClass}
            />
          </div>

          <div>
            <label
              className="block text-gray-700 font-semibold mb-1"
              htmlFor="Peso"
            >
              Peso (kg):
            </label>
            <input
              id="Peso"
              type="number"
              name="Peso"
              value={formData.Peso || ""}
              onChange={handleChange}
              required
              min={0}
              className={commonInputClass}
            />
          </div>

          <div>
            <label
              className="block text-gray-700 font-semibold mb-1"
              htmlFor="Edad"
            >
              Fecha de nacimiento:
            </label>
            <input
              id="Edad"
              type="date"
              name="Edad"
              value={formData.Edad ? formData.Edad.slice(0, 10) : ""}
              onChange={handleChange}
              required
              className={commonInputClass}
            />
          </div>

          <div>
            <label
              className="block text-gray-700 font-semibold mb-1"
              htmlFor="Genero"
            >
              Género:
            </label>
            <select
              id="Genero"
              name="Genero"
              value={formData.Genero || ""}
              onChange={handleChange}
              required
              className={commonInputClass + " bg-white"}
            >
              <option value="" disabled>
                Seleccione género
              </option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>
        </div>

        {/* Datos de cuenta */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Nombre de Usuario:
          </label>
          <input
            type="text"
            name="username"
            className={commonInputClass}
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Correo Electrónico:
          </label>
          <input
            type="email"
            name="email"
            className={commonInputClass}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Contraseña:
          </label>
          <input
            type="password"
            name="password"
            className={commonInputClass}
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Rol:</label>
          <select
            name="role"
            className={commonInputClass + " bg-white"}
            value={formData.role}
            onChange={handleChange}
          >
            <option value="Usuario">Usuario</option>
            <option value="Administrador">Administrador</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="status"
            checked={formData.status}
            onChange={handleChange}
            className="h-5 w-5 text-paleta1 focus:ring-2 focus:ring-paleta1 rounded"
          />
          <label className="text-gray-700 font-semibold">¿Activo?</label>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Foto de Perfil:
          </label>
          <input
            type="file"
            name="profilephoto"
            accept="image/*"
            onChange={handleChange}
            className="block w-full text-gray-500 text-sm
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-paleta1 file:text-white
              hover:file:bg-paleta2
              focus:outline-none focus:ring-2 focus:ring-paleta1"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-paleta1 hover:bg-paleta2 text-white font-semibold py-3 rounded-md shadow-md transition duration-300"
        >
          Crear Usuario
        </button>
      </form>
    </div>
  );
};

export default CrearUnUsuario;
