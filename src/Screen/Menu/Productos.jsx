import React, { useEffect, useState } from "react";
import "./Productos.css";
import { FaArrowLeft } from "react-icons/fa";
import { FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Productos = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", photo: "" });

  useEffect(() => {
    fetch('/api/product/get_products')
      .then(res => res.json())
      .then(data => {
        const productosConvertidos = data.map(producto => ({
          ...producto,
          price: parseFloat(producto.price.replace('$', ''))
        }));
        setProducts(productosConvertidos);
      })
      .catch(console.error);
  }, []);


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
    setForm({ name: "", description: "", price: "", photo: "" });
    setModalType("register");
  };

  const handleDeleteRequest = (product) => {
    setSelectedProduct(product);
    setModalType("delete");
  };

  const handleDeleteConfirm = () => {
    setProducts(products.filter((product) => product.code !== selectedProduct.code));
    // Hacer fetch al backend para editar el producto
    fetch('/api/product/delete_product', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: selectedProduct.code,
      })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Error al eliminar el producto');
        }
        return res.json();
      })
      .then(data => {
        console.log("Producto eliminado:", data);
        // Aquí podrías actualizar la lista de productos si deseas
      })
      .catch(error => {
        console.error("Error:", error.message);
      });
    closeModal();
  };

  const handleSave = () => {
    if (modalType === "edit") {
      setProducts(products.map((p) => (p.code === selectedProduct.code ? { ...form, code: p.code } : p)));
      // Hacer fetch al backend para editar el producto
      fetch('/api/product/edit_product', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: form.code,
          name: form.name,
          description: form.description,
          price: parseFloat(form.price), // Asegura que sea número
          photo: form.photo
        })
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Error al editar el producto');
          }
          return res.json();
        })
        .then(data => {
          console.log("Producto editado:", data);
        })
        .catch(error => {
          console.error("Error:", error.message);
        });
    } else if (modalType === "register") {
      setProducts([...products, { ...form }]);

      // Hacer fetch al backend para registrar el producto
      fetch('/api/product/register_product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: parseFloat(form.price), // Asegura que sea número
          photo: form.photo
        })
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Error al egregar el producto');
          }
          return res.json();
        })
        .then(data => {
          console.log("Producto agregado:", data);
        })
        .catch(error => {
          console.error("Error:", error.message);
        });
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
      <FaArrowLeft
        className="arrow-icon"
        onClick={() => navigate('/menu')}
      />
      <h2 className="productos-title">Lista de Productos</h2>
      <button className="btn-registrar" onClick={handleRegister}>➕ Registrar Producto</button>
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
            <tr key={product.code}>
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

                {/* <label >Imagen</label>
                <input
                  id="photo-upload"
                  name="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                /> */}

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
