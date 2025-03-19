import React, { useState } from "react";
import "./Almacenes.css";

const initialWarehouses = [
  { id: 1, name: "Almacén Central", address: "Av. Industrial 456", products: [] },
  { id: 2, name: "Depósito Norte", address: "Calle Comercio 123", products: [] },
];

const Almacenes = () => {
  const [warehouses, setWarehouses] = useState(initialWarehouses);
  const [modalType, setModalType] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [form, setForm] = useState({ name: "", address: "" });
  const [productForm, setProductForm] = useState({ name: "", description: "", price: "" });

  const handleView = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setModalType("view");
  };

  const handleEdit = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setForm(warehouse);
    setModalType("edit");
  };

  const handleRegister = () => {
    setForm({ name: "", address: "" });
    setModalType("register");
  };

  const handleDeleteRequest = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setModalType("delete");
  };

  const handleDeleteConfirm = () => {
    setWarehouses(warehouses.filter((w) => w.id !== selectedWarehouse.id));
    closeModal();
  };

  const handleSave = () => {
    if (modalType === "edit") {
      setWarehouses(warehouses.map((w) => (w.id === selectedWarehouse.id ? { ...form, id: w.id } : w)));
    } else if (modalType === "register") {
      setWarehouses([...warehouses, { ...form, id: warehouses.length + 1, products: [] }]);
    }
    closeModal();
  };

  const handleAddProduct = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setProductForm({ name: "", description: "", price: "" });
    setModalType("addProduct");
  };

  const handleSaveProduct = () => {
    const updatedWarehouses = warehouses.map((w) =>
      w.id === selectedWarehouse.id
        ? { ...w, products: [...w.products, { ...productForm, id: w.products.length + 1 }] }
        : w
    );
    setWarehouses(updatedWarehouses);
    closeModal();
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedWarehouse(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProductChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  return (
    <div className="almacenes-container">
      <h2 className="almacenes-title">Lista de Almacenes </h2>
      <table className="almacenes-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {warehouses.map((warehouse) => (
            <tr key={warehouse.id}>
              <td>{warehouse.name}</td>
              <td>
                <button className="btn btn-add" onClick={() => handleAddProduct(warehouse)}>➕ Agregar Producto</button>
                <button className="btn btn-view" onClick={() => handleView(warehouse)}>👁 Ver</button>
                <button className="btn btn-edit" onClick={() => handleEdit(warehouse)}>✏ Editar</button>
                <button className="btn btn-delete" onClick={() => handleDeleteRequest(warehouse)}>🗑 Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn-registrar" onClick={handleRegister}>➕ Registrar Almacén</button>

      {/* MODALES */}
      {modalType && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>✖</button>

            {/* MODAL VER */}
            {modalType === "view" && (
              <>
                <h3>{selectedWarehouse.name}</h3>
                <p><strong>Dirección:</strong> {selectedWarehouse.address}</p>
                <h4>Productos Almacenados</h4>
                {selectedWarehouse.products.length > 0 ? (
                  <ul>
                    {selectedWarehouse.products.map((product) => (
                      <li key={product.id}>{product.name} - ${product.price}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay productos en este almacén.</p>
                )}
              </>
            )}

            {/* MODALES EDITAR & REGISTRAR */}
            {(modalType === "edit" || modalType === "register") && (
              <>
                <h3>{modalType === "edit" ? "Editar Almacén" : "Registrar Almacén"}</h3>
                <label>Nombre:</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} />

                <label>Dirección:</label>
                <input type="text" name="address" value={form.address} onChange={handleChange} />

                <button className="btn-save" onClick={handleSave}>
                  {modalType === "edit" ? "Guardar Cambios" : "Registrar"}
                </button>
              </>
            )}

            {/* MODAL AGREGAR PRODUCTO */}
            {modalType === "addProduct" && (
              <>
                <h3>Agregar Producto a {selectedWarehouse.name}</h3>
                <label>Nombre del Producto:</label>
                <input type="text" name="name" value={productForm.name} onChange={handleProductChange} />

                <label>Descripción:</label>
                <input type="text" name="description" value={productForm.description} onChange={handleProductChange} />

                <label>Precio:</label>
                <input type="number" name="price" value={productForm.price} onChange={handleProductChange} />

                <button className="btn-save" onClick={handleSaveProduct}>Guardar Producto</button>
              </>
            )}

            {/* MODAL ELIMINAR */}
            {modalType === "delete" && (
              <>
                <h3>Eliminar Almacén</h3>
                <p>¿Estás seguro de que deseas eliminar <strong>{selectedWarehouse.name}</strong>?</p>
                <div className="modal-actions">
                  <button className="btn btn-cancel" onClick={closeModal}>❌ Cancelar</button>
                  <button className="btn btn-confirm" onClick={handleDeleteConfirm}>✅ Confirmar</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Almacenes;
