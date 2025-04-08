import React, { useEffect, useState } from "react";
import "./Transportistas.css";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const initialDrivers = [
  { id: 1, name: "Carlos", last_name: "Fernández", placa: "ABC-123", phone: "78945612" },
  { id: 2, name: "Ana", last_name: "Gutiérrez", placa: "XYZ-789", phone: "76543210" },
  { id: 3, name: "Juan", last_name: "Pérez", placa: "LMN-456", phone: "70123456" },
];

const Transportistas = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [form, setForm] = useState({ name: "", last_name: "", placa: "", phone: "" });

  useEffect(() => {
    fetch('https://silo-roll-backend.onrender.com/carrier/get_carriers')
      .then(res => res.json())
      .then(async (drivers) => {
        const driversCompletos = await Promise.all(
          drivers.map(async ([code, name, last_name]) => {
            const res = await fetch('https://silo-roll-backend.onrender.com/carrier/get_carrier', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ code }), // Solo enviamos el código
            });
            const data = await res.json();
            return {
              code,
              name: name.trim(),
              last_name: last_name.trim(),
              ...data,
            };
          })
        );
        setDrivers(driversCompletos);
      })
      .catch(console.error);
  }, []);

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
    setForm({ name: "", last_name: "", placa: "", phone: "" });
    setModalType("register");
  };

  const handleDeleteRequest = (driver) => {
    setSelectedDriver(driver);
    setModalType("delete");
  };

  const handleDeleteConfirm = () => {
    setDrivers(drivers.filter((driver) => driver.code !== selectedDriver.code));

    // Hacer fetch al backend para eliminar al transportista
    fetch('https://silo-roll-backend.onrender.com/carrier/delete_carrier', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: selectedDriver.code,
      })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Error al eliminar al transportista');
        }
        return res.json();
      })
      .then(data => {
        console.log("Transportista eliminado:", data);
      })
      .catch(error => {
        console.error("Error:", error.message);
      });
    closeModal();
  };

  const handleSave = () => {
    if (modalType === "edit") {
      setDrivers(drivers.map((d) => (d.code === selectedDriver.code ? { ...form, code: d.code } : d)));

      // Hacer fetch al backend para editar la información del transportista
      fetch('https://silo-roll-backend.onrender.com/carrier/edit_carrier', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: form.code,
          name: form.name,
          last_name: form.last_name,
          placa: form.placa,
          phone: form.phone
        })
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Error al agregar al trasportista');
          }
          return res.json();
        })
        .then(data => {
          console.log("Transportista editado:", data);
        })
        .catch(error => {
          console.error("Error:", error.message);
        });
    } else if (modalType === "register") {
      setDrivers([...drivers, { ...form }]);

      // Hacer fetch al backend para registrar el transportista
      fetch('https://silo-roll-backend.onrender.com/carrier/register_carrier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: form.name,
          last_name: form.last_name,
          placa: form.placa,
          phone: form.phone
        })
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Error al egregar al transportista');
          }
          return res.json();
        })
        .then(data => {
          console.log("Transportista agregado:", data);
        })
        .catch(error => {
          console.error("Error:", error.message);
        });
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
      <FaArrowLeft
        className="arrow-icon"
        onClick={() => navigate('/menu')}
      />
      <h2 className="transportistas-title">Lista de Transportistas</h2>
      <button className="btn-registrar" onClick={handleRegister}>➕ Registrar Transportista</button>
      <table className="transportistas-table">
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.code}>
              <td>{driver.name} {driver.last_name}</td>
              <td>
                <button className="btn btn-view" onClick={() => handleView(driver)}>👁 Ver</button>
                <button className="btn btn-edit" onClick={() => handleEdit(driver)}>✏ Editar</button>
                <button className="btn btn-delete" onClick={() => handleDeleteRequest(driver)}>🗑 Eliminar</button>
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
                <h3>{selectedDriver.name} {selectedDriver.last_name}</h3>
                <p><strong>Placa:</strong> {selectedDriver.placa}</p>
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
                <input type="text" name="last_name" value={form.last_name} onChange={handleChange} />

                <label>Placa:</label>
                <input type="text" name="placa" value={form.placa} onChange={handleChange} />

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
                <p>¿Estás seguro de que deseas eliminar a <strong>{selectedDriver.name} {selectedDriver.last_name}</strong>?</p>
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
