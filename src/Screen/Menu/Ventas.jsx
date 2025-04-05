import React, { useState } from "react";
import "./Ventas.css";

const VentasSiloroll = () => {
  const [formData, setFormData] = useState({
    cliente: "",
    producto: "",
    cantidad: "",
    toneladas: "",
    almacen: "",
    transportista: "",
  });
  const [ventas, setVentas] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const opcionesClientes = ["Cliente A", "Cliente B", "Cliente C"];
  const opcionesProductos = ["Maíz", "Soja", "Trigo"];
  const opcionesAlmacen = ["Depósito 1", "Depósito 2"];
  const opcionesTransportistas = ["Transp. X", "Transp. Y"];

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSell = () => {
    setIsModalVisible(true);
  };

  const confirmSell = () => {
    const newVenta = {
      cliente: formData.cliente,
      producto: formData.producto,
      cantidad: formData.cantidad,
      costo: parseInt(formData.cantidad) * 100, // Precio ficticio por unidad
    };
    setVentas([...ventas, newVenta]);
    setIsModalVisible(false);
    setFormData({
      cliente: "",
      producto: "",
      cantidad: "",
      toneladas: "",
      almacen: "",
      transportista: "",
    });
  };

  return (
    <div className="ventas-container">
      <h2>Registrar Venta</h2>
      <form className="ventas-form">
        <label>Cliente</label>
        <select
          value={formData.cliente}
          onChange={(e) => handleChange("cliente", e.target.value)}
        >
          <option value="">Seleccionar Cliente</option>
          {opcionesClientes.map((cliente, index) => (
            <option key={index} value={cliente}>
              {cliente}
            </option>
          ))}
        </select>

        <label>Producto</label>
        <select
          value={formData.producto}
          onChange={(e) => handleChange("producto", e.target.value)}
        >
          <option value="">Seleccionar Producto</option>
          {opcionesProductos.map((producto, index) => (
            <option key={index} value={producto}>
              {producto}
            </option>
          ))}
        </select>

        <label>Cantidad</label>
        <input
          type="number"
          value={formData.cantidad}
          onChange={(e) => handleChange("cantidad", e.target.value)}
        />

        <label>Toneladas</label>
        <input
          type="number"
          value={formData.toneladas}
          onChange={(e) => handleChange("toneladas", e.target.value)}
        />

        <label>Almacén</label>
        <select
          value={formData.almacen}
          onChange={(e) => handleChange("almacen", e.target.value)}
        >
          <option value="">Seleccionar Almacén</option>
          {opcionesAlmacen.map((almacen, index) => (
            <option key={index} value={almacen}>
              {almacen}
            </option>
          ))}
        </select>

        <label>Transportista</label>
        <select
          value={formData.transportista}
          onChange={(e) => handleChange("transportista", e.target.value)}
        >
          <option value="">Seleccionar Transportista</option>
          {opcionesTransportistas.map((transportista, index) => (
            <option key={index} value={transportista}>
              {transportista}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleSell}
          disabled={!Object.values(formData).every((val) => val !== "")}
        >
          Vender
        </button>
      </form>

      {isModalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirmar Venta</h3>
            <p><strong>Cliente:</strong> {formData.cliente}</p>
            <p><strong>Producto:</strong> {formData.producto}</p>
            <p><strong>Cantidad:</strong> {formData.cantidad}</p>
            <p><strong>Toneladas:</strong> {formData.toneladas}</p>
            <p><strong>Almacén:</strong> {formData.almacen}</p>
            <p><strong>Transportista:</strong> {formData.transportista}</p>
            <button onClick={confirmSell}>Confirmar</button>
            <button onClick={() => setIsModalVisible(false)}>Cancelar</button>
          </div>
        </div>
      )}

      <h2>Ventas Registradas</h2>
      <table className="ventas-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Costo</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta, index) => (
            <tr key={index}>
              <td>{venta.cliente}</td>
              <td>{venta.producto}</td>
              <td>{venta.cantidad}</td>
              <td>{venta.costo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VentasSiloroll;
