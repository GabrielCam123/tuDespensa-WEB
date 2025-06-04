import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export const Detalles_receta = () => {
  const { id } = useParams(); // Extraemos el ID de la URL
  const [receta, setReceta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReceta = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/recetas/${id}`);
        setReceta(res.data);
      } catch (err) {
        setError("Error al cargar la receta");
      } finally {
        setLoading(false);
      }
    };

    fetchReceta();
  }, [id]);

  if (loading) return <p className="text-center">Cargando receta...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!receta) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{receta.titulo}</h1>
      <p className="text-gray-700 mb-4">{receta.descripcion}</p>

      <img
        src={
          receta.imagen
            ? `http://localhost:3000/uploads/${encodeURIComponent(
                receta.imagen
              )}`
            : "https://via.placeholder.com/600x400?text=Sin+Imagen"
        }
        alt={receta.titulo}
        className="w-full h-80 object-cover rounded-xl mb-6"
      />

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Categoría:</h2>
        <p className="text-gray-600">{receta.categoria}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Autor:</h2>
        <p className="text-gray-600">{receta.autor?.nombre || "Desconocido"}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Detalles:</h2>
        <p>
          <strong>Tiempo:</strong> {receta.detalle?.tiempo || "N/A"}
        </p>
        <p>
          <strong>Dificultad:</strong> {receta.detalle?.dificultad || "N/A"}
        </p>
        <p>
          <strong>Características:</strong>{" "}
          {receta.detalle?.caracteristicas?.join(", ") || "N/A"}
        </p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Ingredientes:</h2>
        <ul className="list-disc list-inside">
          {receta.ingredientes?.map((ing, i) => (
            <li key={i}>
              {ing.cantidad ?? ""} {ing.unidad} {ing.nombre}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Instrucciones:</h2>
        {receta.instrucciones?.map((step, i) => (
          <div key={i} className="mb-4">
            <h3 className="font-bold">Paso {step.paso}</h3>
            <p className="text-gray-700">{step.texto}</p>
            {step.imagen && (
              <img
                src={`http://localhost:3000/uploads/${encodeURIComponent(
                  step.imagen
                )}`}
                alt={`Paso ${step.paso}`}
                className="w-full h-64 object-cover rounded-xl mt-2"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
