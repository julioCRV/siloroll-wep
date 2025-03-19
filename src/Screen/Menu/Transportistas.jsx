import React, { useState } from "react";
import "./Transportistas.css";

const initialDrivers = [
  { id: 1, name: "Carlos", surname: "Fernández", plate: "ABC-123", phone: "78945612" },
  { id: 2, name: "Ana", surname: "Gutiérrez", plate: "XYZ-789", phone: "76543210" },
  { id: 3, name: "Juan", surname: "Pérez", plate: "LMN-456", phone: "70123456" },
];

const Transportistas = () => {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [modalType, setModalType] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [form, setForm] = useState({ name: "", surname: "", plate: "", phone: "" });

  const handleView = (driver) => {
    setSelectedDriver(driver);
    setModalType("view");
  };

  const handleEdit = (driver) => {
    setSelectedDriver(driver);
    setForm(driver);
    setModalType("edit");
  };

  const handleRegister = () => {
    setForm({ name: "", surname: "", plate: "", phone: "" });
    setModalType("register");
  };

  const handleDeleteRequest = (driver) => {
    setSelectedDriver(driver);
    setModalType("delete");
  };

  const handleDeleteConfirm = () => {
    setDrivers(drivers.filter((driver) => driver.id !== selectedDriver.id));
    closeModal();
  };

  const handleSave = () => {
    if (modalType === "edit") {
      setDrivers(drivers.map((d) => (d.id === selectedDriver.id ? { ...form, id: d.id } : d)));
    } else if (modalType === "register") {
      setDrivers([...drivers, { ...form, id: drivers.length + 1 }]);
    }
    closeModal();
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedDriver(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="transportistas-container">
      <h2 className="transportistas-title">Lista de Transportistas</h2>
      <table className="transportistas-table">
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.id}>
              <td>{driver.name} {driver.surname}</td>
              <td>
                <button className="btn btn-view" onClick={() => handleView(driver)}>👁 Ver</button>
                <button className="btn btn-edit" onClick={() => handleEdit(driver)}>✏ Editar</button>
                <button className="btn btn-delete" onClick={() => handleDeleteRequest(driver)}>🗑 Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn-registrar" onClick={handleRegister}>➕ Registrar Transportista</button>

      {/* MODALES */}
      {modalType && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>✖</button>

            {/* MODAL VER */}
            {modalType === "view" && (
              <>
                <h3>{selectedDriver.name} {selectedDriver.surname}</h3>
                <p><strong>Placa:</strong> {selectedDriver.plate}</p>
                <p><strong>Teléfono:</strong> {selectedDriver.phone}</p>
              </>
            )}

            {/* MODALES EDITAR & REGISTRAR */}
            {(modalType === "edit" || modalType === "register") && (
              <>
                <h3>{modalType === "edit" ? "Editar Transportista" : "Registrar Transportista"}</h3>
                <label>Nombre:</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} />

                <label>Apellido:</label>
                <input type="text" name="surname" value={form.surname} onChange={handleChange} />

                <label>Placa:</label>
                <input type="text" name="plate" value={form.plate} onChange={handleChange} />

                <label>Teléfono:</label>
                <input type="number" name="phone" value={form.phone} onChange={handleChange} />

                <button className="btn-save" onClick={handleSave}>
                  {modalType === "edit" ? "Guardar Cambios" : "Registrar"}
                </button>
              </>
            )}

            {/* MODAL ELIMINAR */}
            {modalType === "delete" && (
              <>
                <h3>Eliminar Transportista</h3>
                <p>¿Estás seguro de que deseas eliminar a <strong>{selectedDriver.name} {selectedDriver.surname}</strong>?</p>
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

export default Transportistas;
