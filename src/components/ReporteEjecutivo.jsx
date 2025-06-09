import React, { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ReportePDF from "./ReportePDF";

const ReporteEjecutivo = () => {
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("todos");

  // Función para obtener datos del reporte desde la API
  const obtenerReporte = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (fechaInicio) queryParams.append("desde", fechaInicio);
      if (fechaFin) queryParams.append("hasta", fechaFin);
      if (tipoUsuario !== "todos") queryParams.append("tipo", tipoUsuario);

      const res = await fetch(
        `https://tudespensa-backend.onrender.com/api/reportes/ejecutivo?${queryParams.toString()}`,
        { credentials: "include" }
      );

      if (!res.ok) throw new Error("Error en la respuesta de la API");

      const data = await res.json();

      // Validar registrosMensuales para evitar errores y ordenar por meses
      const registrosMensualesArray = Array.isArray(data.registrosMensuales)
        ? data.registrosMensuales
        : [
            { mes: "Enero", cantidad: 2 },
            { mes: "Febrero", cantidad: 3 },
            { mes: "Marzo", cantidad: 1 },
            { mes: "Abril", cantidad: 5 },
          ];

      const mesesOrden = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];

      // Ordenar datos por mes para la gráfica
      const registrosMensualesOrdenados = registrosMensualesArray.sort(
        (a, b) => mesesOrden.indexOf(a.mes) - mesesOrden.indexOf(b.mes)
      );

      setReporte({
        ...data,
        registrosMensuales: registrosMensualesOrdenados,
      });
    } catch (error) {
      console.error("Error al obtener el reporte ejecutivo:", error);
      setReporte(null);
    } finally {
      setLoading(false);
    }
  };

  // Cargar reporte al montar el componente
  useEffect(() => {
    obtenerReporte();
  }, []);

  // Filtrar usuarios según tipo seleccionado
  const usuariosFiltrados = useMemo(() => {
    if (!reporte || !Array.isArray(reporte.usuariosRegistrados)) return [];
    if (tipoUsuario === "todos") return reporte.usuariosRegistrados;
    return reporte.usuariosRegistrados.filter(
      (user) => user.tipo === tipoUsuario || user.tipoUsuario === tipoUsuario
    );
  }, [reporte, tipoUsuario]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium">Desde</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Hasta</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Tipo de usuario</label>
          <select
            value={tipoUsuario}
            onChange={(e) => setTipoUsuario(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="todos">Todos</option>
            <option value="premium">Premium</option>
            <option value="gratuito">Gratuito</option>
          </select>
        </div>
        <button
          onClick={obtenerReporte}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Generar Reporte
        </button>
      </div>

      {loading && <div className="p-4">Cargando reporte...</div>}
      {!loading && !reporte && (
        <div className="p-4 text-red-500">Error al cargar reporte</div>
      )}

      {reporte && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Reporte Ejecutivo</h1>
            <PDFDownloadLink
              document={
                <ReportePDF
                  reporte={reporte}
                  fechaInicio={fechaInicio}
                  fechaFin={fechaFin}
                  tipoUsuario={tipoUsuario}
                  usuariosFiltrados={usuariosFiltrados} // Pasar lista filtrada
                />
              }
              fileName="reporte-ejecutivo.pdf"
            >
              {({ loading }) => (
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  disabled={loading}
                >
                  {loading ? "Generando PDF..." : "Descargar PDF"}
                </button>
              )}
            </PDFDownloadLink>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(tipoUsuario === "todos" || tipoUsuario === "gratuito") && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-semibold">Usuarios Gratuitos</h2>
                  <p className="text-4xl mt-2 text-gray-700">
                    {reporte.usuariosGratuitos ?? "-"}
                  </p>
                </div>
              )}

              {(tipoUsuario === "todos" || tipoUsuario === "premium") && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-semibold">Usuarios Premium</h2>
                  <p className="text-4xl mt-2 text-green-600">
                    {reporte.usuariosPremium ?? "-"}
                  </p>
                </div>
              )}

              {tipoUsuario === "todos" && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-semibold">Total de Usuarios</h2>
                  <p className="text-4xl mt-2 text-blue-600">
                    {reporte.totalUsuarios ?? "-"}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Registros por Mes</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reporte.registrosMensuales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="cantidad" fill="#3182ce" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {usuariosFiltrados.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Usuarios Registrados
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 font-medium">#</th>
                        <th className="px-4 py-2 font-medium">
                          Nombre de Usuario
                        </th>
                        <th className="px-4 py-2 font-medium">Correo</th>
                        <th className="px-4 py-2 font-medium">
                          Fecha de Registro
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuariosFiltrados.map((user, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="px-4 py-2">{index + 1}</td>
                          <td className="px-4 py-2">
                            {user.username ?? "Sin nombre"}
                          </td>
                          <td className="px-4 py-2">{user.email ?? "-"}</td>
                          <td className="px-4 py-2">
                            {new Date(user.createdAt).toLocaleDateString() ??
                              "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReporteEjecutivo;
