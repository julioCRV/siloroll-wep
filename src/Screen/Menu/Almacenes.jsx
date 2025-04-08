import React, { useEffect, useState } from "react";
import "./Almacenes.css";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Almacenes = () => {
  const navigate = useNavigate();
  const [warehouses, setWarehouses] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [form, setForm] = useState({ name: "", direction: "" });
  const [productForm, setProductForm] = useState({ name: "", description: "", price: "" });

  useEffect(() => {
    fetch('/api/warehouse/get_warehouses')
      .then(res => res.json())
      .then(async (almacenes) => {
        const almacenesCompletos = await Promise.all(
          almacenes.map(async (almacen) => {
            const res = await fetch('/api/warehouse/get_warehouse', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ code: almacen.code }),
            });
            const data = await res.json();
            return { ...almacen, ...data };
          })
        );
        setWarehouses(almacenesCompletos);
      })
      .catch(console.error);
  }, []);

  const handleView = (warehouse) => {
    console.log(warehouse)
    setSelectedWarehouse(warehouse);
    setModalType("view");
  };

  const handleEdit = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setForm(warehouse);
    setModalType("edit");
  };

  const handleRegister = () => {
    setForm({ name: "", direction: "" });
    setModalType("register");
  };

  const handleDeleteRequest = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setModalType("delete");
  };

  const handleDeleteConfirm = () => {
    setWarehouses(warehouses.filter((w) => w.code !== selectedWarehouse.code));

    // Hacer fetch al backend para eliminar el almacen
    fetch('/api/warehouse/delete_warehouse', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: selectedWarehouse.code,
      })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Error al eliminar el almacen');
        }
        return res.json();
      })
      .then(data => {
        console.log("Almacen eliminado:", data);
      })
      .catch(error => {
        console.error("Error:", error.message);
      });
    closeModal();
  };

  const handleSave = () => {
    if (modalType === "edit") {
      setWarehouses(warehouses.map((w) => (w.code === selectedWarehouse.code ? { ...form, code: w.code } : w)));

      // Hacer fetch al backend para editar el almacen
      fetch('/api/warehouse/edit_warehouse', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: form.code,
          name: form.name,
          direction: form.direction
        })
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Error al editar el almacen');
          }
          return res.json();
        })
        .then(data => {
          console.log("Almacen editado:", data);
        })
        .catch(error => {
          console.error("Error:", error.message);
        });
    } else if (modalType === "register") {
      setWarehouses([...warehouses, { ...form }]);

      // Hacer fetch al backend para registrar el almacen
      fetch('/api/warehouse/register_warehouse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: form.name,
          direction: form.direction
        })
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Error al egregar el almacen');
          }
          return res.json();
        })
        .then(data => {
          console.log("Almacen agregado:", data);
        })
        .catch(error => {
          console.error("Error:", error.message);
        });
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
console.log(selectedWarehouse)
  return (
    <div className="almacenes-container">
      <FaArrowLeft
        className="arrow-icon"
        onClick={() => navigate('/menu')}
      />
      <h2 className="almacenes-title">Lista de Almacenes </h2>
      <button className="btn-registrar" onClick={handleRegister}>➕ Registrar Almacén</button>
      <table className="almacenes-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {warehouses.map((warehouse) => (
            <tr key={warehouse.code}>
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

      {/* MODALES */}
      {modalType && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>✖</button>

            {/* MODAL VER */}
            {modalType === "view" && (
              <>
                <h3>{selectedWarehouse.name}</h3>
                <p><strong>Dirección:</strong> {selectedWarehouse.direction}</p>
                <h4>Productos Almacenados</h4>
                {selectedWarehouse.products.length > 0 ? (
                  <ul>
                    {selectedWarehouse.products.map((product) => (
                      <li key={product.code}>{product.product_name} - Bs {product.product_count}</li>
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
                <input type="text" name="direction" value={form.direction} onChange={handleChange} />

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
