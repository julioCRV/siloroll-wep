import React, { useState } from "react";
import "./Productos.css";

const initialProducts = [
  { id: 1, name: "Ensilaje de Maíz", price: 550, description: "Alimento rico en fibra y nutrientes esenciales." },
  { id: 2, name: "Heno de Alfalfa", price: 720, description: "Fuente de proteína y energía para el ganado." },
  { id: 3, name: "Concentrado Proteico", price: 1300, description: "Mezcla optimizada para un mejor crecimiento." },
];

const Productos = () => {
  const [products, setProducts] = useState(initialProducts);
  const [modalType, setModalType] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: "" });

  const handleView = (product) => {
    setSelectedProduct(product);
    setModalType("view");
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setForm(product);
    setModalType("edit");
  };

  const handleRegister = () => {
    setForm({ name: "", description: "", price: "" });
    setModalType("register");
  };

  const handleDeleteRequest = (product) => {
    setSelectedProduct(product);
    setModalType("delete");
  };

  const handleDeleteConfirm = () => {
    setProducts(products.filter((product) => product.id !== selectedProduct.id));
    closeModal();
  };

  const handleSave = () => {
    if (modalType === "edit") {
      setProducts(products.map((p) => (p.id === selectedProduct.id ? { ...form, id: p.id } : p)));
    } else if (modalType === "register") {
      setProducts([...products, { ...form, id: products.length + 1 }]);
    }
    closeModal();
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedProduct(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="productos-container">
      <h2 className="productos-title">Lista de Productos</h2>
      <table className="productos-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio (Bs)</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price.toLocaleString("es-BO")}</td>
              <td>
                <button className="btn btn-view" onClick={() => handleView(product)}>👁 Ver</button>
                <button className="btn btn-edit" onClick={() => handleEdit(product)}>✏ Editar</button>
                <button className="btn btn-delete" onClick={() => handleDeleteRequest(product)}>🗑 Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn-registrar" onClick={handleRegister}>➕ Registrar Producto</button>

      {/* MODALES */}
      {modalType && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>✖</button>

            {/* MODAL VER */}
            {modalType === "view" && (
              <>
                <h3>{selectedProduct.name}</h3>
                <p><strong>Precio:</strong> Bs {selectedProduct.price.toLocaleString("es-BO")}</p>
                <p><strong>Descripción:</strong> {selectedProduct.description}</p>
              </>
            )}

            {/* MODALES EDITAR & REGISTRAR */}
            {(modalType === "edit" || modalType === "register") && (
              <>
                <h3>{modalType === "edit" ? "Editar Producto" : "Registrar Producto"}</h3>
                <label>Nombre:</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} />

                <label>Descripción:</label>
                <textarea name="description" value={form.description} onChange={handleChange}></textarea>

                <label>Precio (Bs):</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} />

                <button className="btn-save" onClick={handleSave}>
                  {modalType === "edit" ? "Guardar Cambios" : "Registrar"}
                </button>
              </>
            )}

            {/* MODAL ELIMINAR */}
            {modalType === "delete" && (
              <>
                <h3>Eliminar Producto</h3>
                <p>¿Estás seguro de que deseas eliminar <strong>{selectedProduct.name}</strong>?</p>
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

export default Productos;
