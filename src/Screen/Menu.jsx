import React from "react";
import { Link } from "react-router-dom";
import salirIcon from '/logOut.svg';
import "./Menu.css";

const menuItems = [
    { title: "Productos", icon: "📦", link: "/productos" },
    { title: "Clientes", icon: "👥", link: "/clientes" },
    { title: "Transportistas", icon: "🚚", link: "/transportistas" },
    { title: "Panel", icon: "📊", link: "/panel" },
    { title: "Ventas", icon: "💰", link: "/ventas" },
    { title: "Almacenes", icon: "🏢", link: "/almacenes" },
];

const Menu = ({ CerrarSesion }) => {
    const onLogout = () => {
        CerrarSesion(null)
    }

    return (
        <div className="menu-container">
            <div className="div-button">
                <button className="logout-button" onClick={onLogout}>
                    <img src={salirIcon} alt="Icono salir" className="logout-icon" />
                    Cerrar Sesión
                </button>
            </div>

            <h2 className="menu-title">Menú SiloRoll</h2>
            <div className="menu-grid">
                {menuItems.map((item, index) => (
                    <Link to={item.link} key={index}>
                        <div key={index} className="menu-card">
                            <span className="menu-icon">{item.icon}</span>
                            <p className="menu-title-card">{item.title}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Menu;
