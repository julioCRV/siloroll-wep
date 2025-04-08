import React, { useEffect, useState } from "react";
import "./Clientes.css";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Clientes = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [form, setForm] = useState({ name: "", last_name: "", property: "", zone: "", activity: "", phone: "" });

  useEffect(() => {
    fetch('https://silo-roll-backend.onrender.com/customer/get_customers')
      .then(res => res.json())
      .then(async (clientes) => {
        const clientesCompletos = await Promise.all(
          clientes.map(async (cliente) => {
            const res = await fetch('https://silo-roll-backend.onrender.com/customer/get_customer', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ code: cliente.code }),
            });
            const data = await res.json();
            return { ...cliente, ...data };
          })
        );
        setClients(clientesCompletos);
      })
      .catch(console.error);
  }, []);

  const handleView = (client) => {
    setSelectedClient(client);
    setModalType("view");
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setForm(client);
    setModalType("edit");
  };

  const handleRegister = () => {
    setForm({ name: "", last_name: "", property: "", zone: "", activity: "", phone: "" });
    setModalType("register");
  };

  //  /  /  /  /  /  /  /  /  /  /  /  /  /  /  /  /  /  /  /  /  /  /  /  /  /  /  /  /  /  /  /  /  /  /  /  /
  const handleDeleteRequest = (client) => {
    setSelectedClient(client);
    setModalType("delete");
  };

  const handleDeleteConfirm = () => {
    setClients(clients.filter((client) => client.code !== selectedClient.code));

    // Hacer fetch al backend para eliminar cliente
    fetch('https://silo-roll-backend.onrender.com/customer/delete_customer', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: selectedClient.code,
      })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Error al eliminar el producto');
        }
        return res.json();
      })
      .then(data => {
        console.log("Cliente eliminado:", data);
      })
      .catch(error => {
        console.error("Error:", error.message);
      });
    closeModal();
  };

  const handleSave = () => {
    if (modalType === "edit") {
      setClients(clients.map((c) => (c.code === selectedClient.code ? { ...form, code: c.code } : c)));
      console.log(form)
      // Hacer fetch al backend para editar el cliente
      fetch('https://silo-roll-backend.onrender.com/customer/edit_customer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: form.code,
          name: form.name,
          last_name: form.last_name,
          property: form.property,
          zone: form.zone,
          activity: form.activity,
          phone: form.phone
        })
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Error al editar la información del cliente');
          }
          return res.json();
        })
        .then(data => {
          console.log("Cliente editado:", data);
        })
        .catch(error => {
          console.error("Error:", error.message);
        });
    } else if (modalType === "register") {
      setClients([...clients, { ...form, id: clients.length + 1 }]);
      
      // Hacer fetch al backend para registrar el producto
      fetch('https://silo-roll-backend.onrender.com/customer/register_customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: form.name,
          last_name: form.last_name,
          property: form.property,
          zone: form.zone,
          activity: form.activity,
          phone: form.phone
        })
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Error al egregar el cliente');
          }
          return res.json();
        })
        .then(data => {
          console.log("Cliente agregado:", data);
          closeModal();
        })
        .catch(error => {
          console.error("Error:", error.message);
        });
    }
    closeModal();
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedClient(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="clientes-container">
      <FaArrowLeft
        className="arrow-icon"
        onClick={() => navigate('/menu')}
      />
      <h2 className="clientes-title">Lista de Clientes</h2>
      <button className="btn-registrar" onClick={handleRegister}>➕ Registrar Cliente</button>
      <table className="clientes-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.code}>
              <td>{client.name} {client.last_name}</td>
              <td>
                <button className="btn btn-view" onClick={() => handleView(client)}>👁 Ver</button>
                <button className="btn btn-edit" onClick={() => handleEdit(client)}>✏ Editar</button>
                <button className="btn btn-delete" onClick={() => handleDeleteRequest(client)}>🗑 Eliminar</button>
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
                <h3>{selectedClient.name} {selectedClient.last_name}</h3>
                <p><strong>Propiedad:</strong> {selectedClient.property}</p>
                <p><strong>Zona:</strong> {selectedClient.zone}</p>
                <p><strong>Actividad:</strong> {selectedClient.activity}</p>
                <p><strong>Celular:</strong> {selectedClient.phone}</p>
              </>
            )}

            {/* MODALES EDITAR & REGISTRAR */}
            {(modalType === "edit" || modalType === "register") && (
              <>
                <h3>{modalType === "edit" ? "Editar Cliente" : "Registrar Cliente"}</h3>
                <label>Nombre:</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} />

                <label>Apellido:</label>
                <input type="text" name="last_name" value={form.last_name} onChange={handleChange} />

                <label>Propiedad:</label>
                <input type="text" name="property" value={form.property} onChange={handleChange} />

                <label>Zona:</label>
                <input type="text" name="zone" value={form.zone} onChange={handleChange} />

                <label>Actividad:</label>
                <input type="text" name="activity" value={form.activity} onChange={handleChange} />

                <label>Celular:</label>
                <input type="number" name="phone" value={form.phone} onChange={handleChange} />

                <button className="btn-save" onClick={handleSave}>
                  {modalType === "edit" ? "Guardar Cambios" : "Registrar"}
                </button>
              </>
            )}

            {/* MODAL ELIMINAR */}
            {modalType === "delete" && (
              <>
                <h3>Eliminar Cliente</h3>
                <p>¿Estás seguro de que deseas eliminar a <strong>{selectedClient.name}</strong>?</p>
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

export default Clientes;
