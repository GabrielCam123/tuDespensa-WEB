import { FaUsers } from "react-icons/fa";
import { GrPlan } from "react-icons/gr";
import { TbReportAnalytics } from "react-icons/tb";
import { FaRobot } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { FaReceipt } from "react-icons/fa";
import { TbListNumbers } from "react-icons/tb";
import { BiLogOut } from "react-icons/bi";
import { BsFillBasketFill } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";
import { useState, useEffect } from "react";

const navItems = [
  {
    icon: <FaUsers />,
    label: "Gestión de usuarios",
    subItems: [
      { label: "Lista de usuarios", to: "/administracion" },
      { label: "Crear un usuario", to: "/administracion/crear_un_usuario" },
    ],
  },
  {
    icon: <TbListNumbers />,
    label: "Lista de ingredientes",
    to: "/administracion/ingredientes",
  },
  {
    icon: <FaReceipt />,
    label: "Gestión de recetas",
    to: "/administracion/gestion_recetas",
  },
  {
    icon: <MdManageAccounts />,
    label: "Perfil de usuario",
    to: "/administracion/perfil",
  },
  {
    icon: <TbReportAnalytics />,
    label: "Reportes",
    to: "/administracion/reporte",
    border: "border-b",
  },
  // {
  //   icon: <GrPlan />,
  //   label: "Planes Nutricionales",
  //   to: "/planes",
  //   border: "border-b",
  // },
];

export const Aside = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };
  useEffect(() => {
    if (
      location.pathname === "/administracion" ||
      location.pathname === "/administracion/crear_usuario"
    ) {
      setOpenMenus((prev) => ({ ...prev, "Gestión de usuarios": true }));
    }
  }, [location.pathname]);

  return (
    <section className="bg-paleta4 sticky top-0 group w-[64px] hover:w-1/5 transition-all duration-500 flex flex-col gap-3 h-screen text-white overflow-hidden">
      <div className="flex w-full justify-center mt-4 px-2 gap-2 items-center">
        <img
          src="/images/IconoDespensa.svg"
          alt="logo Tu Despensa"
          className="w-12 h-12"
        />
        <span className="hidden group-hover:flex flex-col text-[18px]">
          <p>Tu</p>
          <p>Despensa</p>
        </span>
      </div>

      <ul className="flex flex-col divide-y divide-white text-[18px] mt-2 border-t">
        {navItems.map(({ icon, label, to, subItems, border }, idx) => (
          <li key={idx} className={`${border || ""}`}>
            {subItems ? (
              <>
                <button
                  onClick={() => toggleMenu(label)}
                  className={`flex w-full h-12 px-2 items-center gap-2 transition-all group-hover:justify-start justify-center 
              ${
                openMenus[label]
                  ? "bg-paleta5 text-black  border-t border-white border-b"
                  : "hover:bg-paleta5 hover:text-black"
              }
            `}
                >
                  <span className="text-2xl group-hover:text-base transition-all">
                    {icon}
                  </span>
                  <p className="hidden group-hover:inline">{label}</p>
                  <p className="hidden group-hover:inline">
                    {openMenus[label] ? "↑" : "↓"}
                  </p>
                </button>
                {openMenus[label] && (
                  <ul className=" flex flex-col gap-1 py-1">
                    {subItems.map(({ label: subLabel, to: subTo }, subIdx) => {
                      const siglas = subLabel
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .toUpperCase(); // genera "LU", "AU", etc.

                      return (
                        <li key={subIdx}>
                          <Link
                            to={subTo}
                            className={`flex items-center justify-center group-hover:justify-start gap-2 rounded px-2 py-1 h-10 transition-all
                            ${
                              location.pathname === subTo
                                ? "bg-paleta5 text-black"
                                : "hover:bg-paleta5 hover:text-black"
                            }`}
                          >
                            {/* Texto completo cuando está expandido */}
                            <p className="hidden group-hover:flex">
                              &#x2022; {subLabel}
                            </p>

                            {/* Siglas centradas cuando está colapsado */}
                            <p className="group-hover:hidden w-full text-center">
                              {siglas}
                            </p>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            ) : (
              <Link
                to={to}
                className={`flex w-full h-12 px-2 items-center gap-2 transition-all group-hover:justify-start justify-center
            ${
              location.pathname === to
                ? "bg-paleta5 text-black"
                : "hover:bg-paleta5 hover:text-black"
            }`}
              >
                <span className="text-2xl group-hover:text-base transition-all">
                  {icon}
                </span>
                <p className="hidden group-hover:inline">{label}</p>
              </Link>
            )}
          </li>
        ))}
      </ul>

      <button className="flex w-full mt-auto mb-4 justify-center aling transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 ">
        <Link
          to="/"
          onClick={() => {
            logout();
          }}
          className="flex gap-2"
        >
          <BiLogOut className="size-8" />
          <p className="hidden group-hover:flex items-center">Desconectarse</p>
        </Link>
      </button>
    </section>
  );
};
