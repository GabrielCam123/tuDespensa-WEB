import React from "react";

export const CardPlan = ({ nombrePlan, caracteristicas = [] }) => {
  return (
    <div className="border border-descripcion px-8 py-2 rounded-2xl gap-8 hover:bg-paleta4 hover:text-white group flex flex-col justify-between">
      <h1 className="text-4xl">{nombrePlan}</h1>
      <ul className="m-3">
        {caracteristicas.map((item, index) => (
          <li
            key={index}
            className="list-disc text-descripcion group-hover:text-white"
          >
            {item}
          </li>
        ))}
      </ul>
      <a
        href="https://mega.nz/file/PFkBlIYR#5qgYFjBcoduAlDJGzW2jSt3XMPtRuudJYj4B6AITmgw"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="bg-paleta3 w-full rounded-2xl p-4 text-white font-bold ">
          Descargar La Aplicación
        </button>
      </a>
    </div>
  );
};
