import React, { useState } from "react";
import "./Clientes.css";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const initialClients = [
  { id: 1, name: "Carlos", surname: "Fernández", property: "Estancia La Esperanza", zone: "Norte", activity: "Ganadería", phone: "78945612" },
  { id: 2, name: "Ana", surname: "Gutiérrez", property: "Granja Santa María", zone: "Oeste", activity: "Lechería", phone: "76543210" },
  { id: 3, name: "Juan", surname: "Pérez", property: "Hacienda El Roble", zone: "Sur", activity: "Cría de Bovinos", phone: "70123456" },
];

const Clientes = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState(initialClients);
  const [modalType, setModalType] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [form, setForm] = useState({ name: "", surname: "", property: "", zone: "", activity: "", phone: "" });

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
    setForm({ name: "", surname: "", property: "", zone: "", activity: "", phone: "" });
    setModalType("register");
  };

  const handleDeleteRequest = (client) => {
    setSelectedClient(client);
    setModalType("delete");
  };

  const handleDeleteConfirm = () => {
    setClients(clients.filter((client) => client.id !== selectedClient.id));
    closeModal();
  };

  const handleSave = () => {
    if (modalType === "edit") {
      setClients(clients.map((c) => (c.id === selectedClient.id ? { ...form, id: c.id } : c)));
    } else if (modalType === "register") {
      setClients([...clients, { ...form, id: clients.length + 1 }]);
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
      <table className="clientes-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>{client.name} {client.surname}</td>
              <td>
                <button className="btn btn-view" onClick={() => handleView(client)}>👁 Ver</button>
                <button className="btn btn-edit" onClick={() => handleEdit(client)}>✏ Editar</button>
                <button className="btn btn-delete" onClick={() => handleDeleteRequest(client)}>🗑 Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn-registrar" onClick={handleRegister}>➕ Registrar Cliente</button>

      {/* MODALES */}
      {modalType && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>✖</button>

            {/* MODAL VER */}
            {modalType === "view" && (
              <>
                <h3>{selectedClient.name} {selectedClient.surname}</h3>
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
                <input type="text" name="surname" value={form.surname} onChange={handleChange} />

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
