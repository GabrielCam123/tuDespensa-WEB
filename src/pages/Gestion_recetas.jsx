import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Gestion_recetas = () => {
  const [recetas, setRecetas] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [busquedaActiva, setBusquedaActiva] = useState(""); // valor a buscar realmente
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();

  const limitePorPagina = 30;

  // Cargar categorías únicas al inicio
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/recetas/categorias"
        );
        setCategorias(res.data.categorias);
      } catch (err) {
        console.error("Error al obtener categorías", err);
      }
    };
    fetchCategorias();
  }, []);

  // Función reutilizable para traer recetas
  const fetchRecetas = async (
    paginaActual = pagina,
    busquedaQuery = busquedaActiva,
    categoria = categoriaSeleccionada
  ) => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/recetas", {
        params: {
          limite: limitePorPagina,
          pagina: paginaActual,
          busqueda: busquedaQuery,
          categoria,
        },
      });
      setRecetas(res.data.recetas);
      setTotalPaginas(Math.ceil(res.data.total / limitePorPagina));
    } catch (err) {
      setError("Error al obtener recetas");
    } finally {
      setLoading(false);
    }
  };

  // Cargar recetas al inicio y cuando cambian página o categoría o búsqueda activa
  useEffect(() => {
    fetchRecetas();
  }, [pagina, busquedaActiva, categoriaSeleccionada]);

  const handleBuscar = (e) => {
    e.preventDefault();
    setPagina(1);
    setBusquedaActiva(busqueda); // solo actualiza cuando se hace clic en "Buscar"
  };

  const getPagesToShow = () => {
    const maxButtons = 5;
    let pages = [];

    if (totalPaginas <= maxButtons) {
      for (let i = 1; i <= totalPaginas; i++) {
        pages.push(i);
      }
    } else {
      if (pagina <= 3) {
        pages = [1, 2, 3, 4, "...", totalPaginas];
      } else if (pagina >= totalPaginas - 2) {
        pages = [
          1,
          "...",
          totalPaginas - 3,
          totalPaginas - 2,
          totalPaginas - 1,
          totalPaginas,
        ];
      } else {
        pages = [1, "...", pagina - 1, pagina, pagina + 1, "...", totalPaginas];
      }
    }

    return pages;
  };

  if (loading) return <p className="text-center">Cargando recetas...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Listado de Recetas (Página {pagina} de {totalPaginas})
      </h1>

      {/* Formulario de filtros */}
      <form
        onSubmit={handleBuscar}
        className="flex flex-wrap gap-4 mb-6 justify-center"
      >
        <input
          type="text"
          placeholder="Buscar por título o descripción..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border px-3 py-2 rounded w-60"
        />
        <select
          value={categoriaSeleccionada}
          onChange={(e) => {
            setCategoriaSeleccionada(e.target.value);
            setPagina(1);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Buscar
        </button>
      </form>

      {/* Tarjetas de recetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recetas.map((receta) => (
          <div
            key={receta._id}
            className="border rounded-2xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer"
            onClick={() =>
              navigate(`/administracion/gestion_recetas/${receta._id}`)
            }
          >
            <img
              src={
                receta.imagen
                  ? `http://localhost:3000/uploads/${encodeURIComponent(
                      receta.imagen
                    )}`
                  : "https://via.placeholder.com/300x200?text=Sin+Imagen"
              }
              alt={receta.titulo}
              className="w-full h-40 object-cover rounded-xl mb-2"
            />
            <h2 className="text-xl font-semibold">{receta.titulo}</h2>
            <p className="text-gray-600 text-sm">
              {receta.descripcion?.slice(0, 100)}...
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Categoría: {receta.categoria}
            </p>
          </div>
        ))}
      </div>

      {/* Controles de paginación */}
      <div className="flex flex-wrap justify-center mt-6 gap-2">
        <button
          onClick={() => setPagina((prev) => Math.max(prev - 1, 1))}
          disabled={pagina === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Anterior
        </button>

        {getPagesToShow().map((page, index) =>
          page === "..." ? (
            <span key={index} className="px-3 py-1">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => setPagina(page)}
              className={`px-3 py-1 rounded ${
                pagina === page
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => setPagina((prev) => Math.min(prev + 1, totalPaginas))}
          disabled={pagina === totalPaginas}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};
