import React from "react";
import { Bar } from "react-chartjs-2";

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"; 
import "./Panel.css";

// 🔹 Registrar los módulos necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
// Datos de ventas por mes (Ejemplo)
const salesData = {
  labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
  datasets: [
    {
      label: "Ventas (Bs)",
      data: [1200, 1500, 1700, 2000, 1800, 2100], // Datos ficticios
      backgroundColor: "rgba(54, 162, 235, 0.6)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
    },
  ],
};

// Datos de ventas individuales
const salesTable = [
  { id: 1, cliente: "Juan Pérez", producto: "Harina", cantidad: 5, costo: 150 },
  { id: 2, cliente: "María López", producto: "Azúcar", cantidad: 10, costo: 250 },
  { id: 3, cliente: "Carlos Gómez", producto: "Arroz", cantidad: 8, costo: 200 },
];

const Panel = () => {
  return (
    <div className="panel-container">
      <h2 className="panel-title"> Panel de Ventas</h2>

      {/* GRÁFICO DE BARRAS */}
      <div className="chart-container">
        <Bar data={salesData} />
      </div>

      {/* TABLA DE VENTAS */}
      <div className="table-container">
        <h3>📋 Ventas Registradas</h3>
        <table className="sales-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Costo (Bs)</th>
            </tr>
          </thead>
          <tbody>
            {salesTable.map((sale) => (
              <tr key={sale.id}>
                <td>{sale.cliente}</td>
                <td>{sale.producto}</td>
                <td>{sale.cantidad}</td>
                <td>{sale.costo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Panel;
