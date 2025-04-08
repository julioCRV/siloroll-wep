import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import "./Panel.css";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const Panel = () => {
  const [salesTable, setSalesTable] = useState([])
  const [dashboard, setDashboard] = useState([]);
  const navigate = useNavigate();


const dailyRevenues = dashboard.map(item => {
  const revenue = parseFloat(item.total_revenue.replace('$', '').replace(',', ''));
  return revenue;
});


const salesByMonth = [0, 0, 0, 0, 0, 0]; // Inicializamos con 0 para cada mes (Enero a Junio)

dashboard.forEach(item => {
  const monthIndex = Math.floor((item.day - 1) / 31); 
  salesByMonth[monthIndex] += parseFloat(item.total_revenue.replace('$', '').replace(',', ''));
});

// Datos transformados para el gráfico
const salesData = {
  labels: [ "Abril", "Mayo", "Junio", "Agosto", "Septiembre"],
  datasets: [
    {
      label: "Ventas (Bs)",
      data: salesByMonth, // Datos de ventas por mes
      backgroundColor: "rgba(54, 162, 235, 0.6)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
    },
  ],
};
  useEffect(() => {
    fetch('/api/dashboard/get_dates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        year: 2025,
        month: 4,
      }),
    })
      .then(res => res.json())
      .then(data => {
        setDashboard(data.daily_totals);
        setSalesTable(data.sale_details)
      })
      .catch(console.error);
  }, []);


  return (
    <div className="panel-container">
      <FaArrowLeft
        className="arrow-icon"
        onClick={() => navigate('/menu')}
      />
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
              <th>Cantidad</th>
              <th>Producto</th>
              <th>Precio Unitario </th>
              <th>Precio Total</th>
              <th>Fecha</th>
              <th>Hora</th>
            </tr>
          </thead>
          <tbody>
            {salesTable.map((sale, index) => (
              <tr key={index}>
                <td>{sale.amount}</td>
                <td>{sale.name}</td>
                <td>{sale.single_price}</td>
                <td>{sale.total_price}</td>
                <td>{sale.date}</td>
                <td>{sale.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Panel;
