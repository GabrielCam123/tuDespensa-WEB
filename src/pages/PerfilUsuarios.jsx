import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getUserByIdRequest,
  getDespensaByUserId,
  getDietByUserId,
  getInformationByUserId,
  getHistoryByUserId,
  getListaByUserId,
} from "../api/users";
import { useNavigate } from "react-router-dom";

export const PerfilUsuario = () => {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [despensa, setDespensa] = useState(null);
  const [dieta, setDieta] = useState(null);
  const [informacion, setInformacion] = useState(null);
  const [historial, setHistorial] = useState(null);
  const [lista, setLista] = useState(null);
  const [abiertos, setAbiertos] = useState({});
  const navigate = useNavigate();
  const handleEditarClick = () => {
    navigate(`/administracion/editar/${id}`);
  };

  const toggleHistorial = (id) => {
    setAbiertos((prev) => ({ ...prev, [id]: !prev[id] }));
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
        const despensaRes = await getDespensaByUserId(id);
        setDespensa(despensaRes.data);
      } catch (error) {
        console.warn("Este usuario no tiene una despensa registrada");
        setDespensa(null);
      }

      try {
        const dietaRes = await getDietByUserId(id);
        setDieta(dietaRes.data);
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

      try {
        const historialRes = await getHistoryByUserId(id);
        setHistorial(historialRes.data);
      } catch (error) {
        console.warn("Este usuario no tiene historial registrado");
        setHistorial(null);
      }

      try {
        const listaRes = await getListaByUserId(id);
        setLista(listaRes.data);
      } catch (error) {
        console.warn("Este usuario no tiene una lista de compras registrada");
        setLista(null);
      }
    };

    fetchData();
  }, [id]);

  if (!usuario) {
    return <p className="text-center mt-10">Cargando perfil del usuario...</p>;
  }

  const calcularEdad = (fechaNacimiento) => {
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mesActual = hoy.getMonth();
    const diaActual = hoy.getDate();
    const mesNacimiento = nacimiento.getMonth();
    const diaNacimiento = nacimiento.getDate();

    if (
      mesActual < mesNacimiento ||
      (mesActual === mesNacimiento && diaActual < diaNacimiento)
    ) {
      edad--;
    }

    return edad;
  };

  return (
    <div>
      <button
        onClick={() => navigate("/administracion")}
        className=" hover:underline text-2xl ml-4 mt-2 text-paleta1"
      >
        ← Volver
      </button>
      <h1 className="text-2xl font-bold mb-2 mt-2 text-center">
        Perfil del Usuario
      </h1>
      <div className="w-full p-3 bg-paleta2 shadow-md rounded-md grid-cols-3 grid grid-rows-2 gap-2 h-screen">
        <div className="flex flex-col p-4  bg-white rounded-2xl row-span-2">
          <span className="w-full justify-center items-center flex">
            <img
              src={`https://tudespensa-backend.onrender.com/${usuario.profilephoto}`}
              alt="Foto de perfil"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 shadow-md"
            />
          </span>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <strong>Nombre de usuario:</strong>
              <span>{usuario.username}</span>
            </div>
            <div className="flex justify-between">
              <strong>Email:</strong>
              <span>{usuario.email}</span>
            </div>
            <div className="flex justify-between">
              <strong>Rol:</strong>
              <span>{usuario.role}</span>
            </div>
            <div className="flex justify-between">
              <strong>Estado:</strong>
              <span>{usuario.status ? "Activo" : "Inactivo"}</span>
            </div>
            <div className="flex justify-between">
              <strong>Plan:</strong>
              <span>{usuario.plan}</span>
            </div>
            <div className="flex justify-between">
              <strong>Creado el:</strong>
              <span>{new Date(usuario.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <hr className="my-4" />
          <span>
            <h2 className="text-lg font-semibold mb-2">Información Personal</h2>
            {informacion ? (
              <>
                <p className="flex justify-between">
                  <strong>Nombre:</strong> <span>{informacion.Nombre}</span>
                </p>
                <p className="flex justify-between">
                  <strong>Apellidos:</strong>
                  <span>{informacion.Apellidos}</span>
                </p>
                <p className="flex justify-between">
                  <strong>Estatura:</strong>
                  <span>{informacion.Estatura}</span>
                </p>
                <p className="flex justify-between">
                  <strong>Peso:</strong>
                  <span>{informacion.Peso}</span>
                </p>
                <p className="flex justify-between">
                  <strong>Edad:</strong>{" "}
                  <span>
                    {informacion.Edad
                      ? calcularEdad(informacion.Edad) + " años"
                      : "No especificado"}
                  </span>
                </p>
                <p className="flex justify-between">
                  <strong>Género:</strong>
                  <span>{informacion.Genero}</span>
                </p>
              </>
            ) : (
              <p>
                No se encontró información personal registrada por el usuario.
              </p>
            )}
          </span>
          <span>
            {dieta ? (
              <p className="flex justify-between">
                <strong>Tipo de dieta:</strong>
                <span>{dieta.type_diet}</span>
              </p>
            ) : (
              <p>
                No se encontró información de dieta registrada por el usuario.
              </p>
            )}
          </span>
        </div>

        {/* <hr className="my-4" /> */}
        <span className="bg-white p-4  rounded-2xl flex flex-col overflow-hidden">
          <h2 className="text-lg font-semibold mb-2">Despensa</h2>
          {despensa && despensa.items?.length > 0 ? (
            <ul className="list-disc list-inside overflow-y-scroll">
              {despensa.items.map((item, index) => (
                <li key={index}>
                  {item.nombre || "Ingrediente"}: {item.cantidad} {item.unidad}
                </li>
              ))}
            </ul>
          ) : (
            <p>
              No se encontró una lista de despensa registrada por el usuario.
            </p>
          )}
        </span>
        <span className="bg-white p-4 rounded-2xl overflow-hidden flex flex-col">
          <h2 className="text-lg font-semibold mb-2">
            Lista de Compras Actual
          </h2>
          {lista && lista.items?.length > 0 ? (
            <table className="min-w-full bg-white rounded shadow overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-2">Nombre</th>
                  <th className="text-left px-4 py-2">Categoría</th>
                  <th className="text-left px-4 py-2">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {lista.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{item.nombre}</td>
                    <td className="px-4 py-2">{item.categoria}</td>
                    <td className="px-4 py-2">
                      {item.cantidad} {item.unidad || ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay una lista de compras registrada actualmente.</p>
          )}
        </span>
        <span className="col-span-2 bg-white p-4 flex flex-col overflow-hidden">
          <h2 className="text-lg font-semibold mb-2">Historial de Compras</h2>
          <span className="overflow-y-scroll">
            {historial && historial.length > 0 ? (
              <ul className="space-y-4 ">
                {historial
                  .filter((item) => item.completada)
                  .map((item) => (
                    <li key={item._id} className="border p-4 rounded shadow-sm">
                      <div className="flex justify-between items-center">
                        <div>
                          <p>
                            <strong>Fecha de creación:</strong>{" "}
                            {new Date(item.fechaCreacion).toLocaleString()}
                          </p>
                          <p>
                            <strong>Fecha de completado:</strong>{" "}
                            {new Date(item.fechaCompletado).toLocaleString()}
                          </p>
                          <p>
                            <strong>Ítems:</strong> {item.totalItems} |{" "}
                            <strong>Comprados:</strong> {item.itemsComprados}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleHistorial(item._id)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                        >
                          {abiertos[item._id]
                            ? "Ocultar Detalles"
                            : "Ver Detalles"}
                        </button>
                      </div>

                      {abiertos[item._id] && (
                        <table className="mt-3 w-full text-sm bg-gray-100 rounded shadow overflow-hidden">
                          <thead className="bg-gray-200">
                            <tr>
                              <th className="text-left px-4 py-2">Nombre</th>
                              <th className="text-left px-4 py-2">Categoría</th>
                              <th className="text-left px-4 py-2">Cantidad</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.items.map((i, index) => (
                              <tr
                                key={index}
                                className="border-t border-gray-300"
                              >
                                <td className="px-4 py-2">{i.nombre}</td>
                                <td className="px-4 py-2">{i.categoria}</td>
                                <td className="px-4 py-2">
                                  {i.cantidad} {i.unidad || ""}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </li>
                  ))}
              </ul>
            ) : (
              <p>No hay historial de compras completado de momento.</p>
            )}
          </span>
        </span>
      </div>
      <div className=" flex justify-end p-4">
        <button
          onClick={handleEditarClick}
          className="bg-blue-600 
            text-white 
            px-6 
            py-3 
            rounded-lg 
            shadow-md 
            hover:bg-blue-700 
            focus:outline-none 
            focus:ring-2 
            focus:ring-blue-400 
            focus:ring-opacity-75 
            transition 
            duration-300 
            ease-in-out
            font-semibold
            "
        >
          Editar
        </button>
      </div>
    </div>
  );
};
