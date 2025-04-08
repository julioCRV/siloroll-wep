import React, { useEffect, useState } from "react";
import "./Ventas.css";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const VentasSiloroll = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cliente: "",
    producto: "",
    cantidad: "",
    toneladas: "",
    almacen: "",
    transportista: "",
  });

  const [formDataPost, setFormDataPost] = useState({
    cliente: "",
    producto: "",
    cantidad: "",
    toneladas: "",
    almacen: "",
    transportista: "",
    precio: "",
  });

  const [ventas, setVentas] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [opcionesClientes, setOpcionesClientes] = useState([]);
  const [opcionesProductos, setOpcionesProductos] = useState([]);
  const [opcionesAlmacen, setOpcionesAlmacen] = useState([]);
  const [opcionesTransportistas, setOpcionesTransportistas] = useState([]);

  const cargarVentas = () => {
    fetch('https://silo-roll-backend.onrender.com/sale/get_sales')
      .then(res => res.json())
      .then(data => {
        setVentas(data);
      })
      .catch(console.error);
  };

  useEffect(() => {
    cargarVentas();
  }, []);


  useEffect(() => {
    fetch('https://silo-roll-backend.onrender.com/product/get_products')
      .then(res => res.json())
      .then(data => {
        const productosConvertidos = data.map(producto => ({
          ...producto,
          price: parseFloat(producto.price.replace('$', ''))
        }));
        setOpcionesProductos(productosConvertidos);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch('https://silo-roll-backend.onrender.com/customer/get_customers')
      .then(res => res.json())
      .then(data => {
        setOpcionesClientes(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch('https://silo-roll-backend.onrender.com/warehouse/get_warehouses')
      .then(res => res.json())
      .then(data => {
        setOpcionesAlmacen(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch('https://silo-roll-backend.onrender.com/carrier/get_carriers')
      .then(res => res.json())
      .then(drivers => {
        const formattedDrivers = drivers.map(([code, name, last_name]) => ({
          code,
          name: name.trim(),
          last_name: last_name.trim()
        }));
        setOpcionesTransportistas(formattedDrivers);
      })
      .catch(console.error);
  }, []);

  const handleChange = (key, value) => {
    setFormDataPost(prev => ({ ...prev, [key]: value }));

    // Elegir la lista correspondiente según el key
    let lista = [];

    switch (key) {
      case 'cliente':
        lista = opcionesClientes;
        break;
      case 'producto':
        lista = opcionesProductos;
        break;
      case 'almacen':
        lista = opcionesAlmacen;
        break;
      case 'transportista':
        lista = opcionesTransportistas;
        break;
      default:
        break;
    }

    // Buscar el objeto con el mismo code
    const seleccionado = lista.find(item => item.code === parseInt(value));
    if (key === 'producto') {
      setFormDataPost(prev => ({ ...prev, 'precio': seleccionado.price }));
    }

    if (seleccionado) {
      const nombreCompleto = `${seleccionado.name}${seleccionado.last_name ? ' ' + seleccionado.last_name : ''}`;
      setFormData(prev => ({
        ...prev,
        [key]: nombreCompleto
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  const handleSell = () => {
    setIsModalVisible(true);
  };

  const confirmSell = () => {
    sendPostSale();
    const newVenta = {
      cliente: formData.cliente,
      producto: formData.producto,
      cantidad: formData.cantidad,
      costo: parseInt(formData.cantidad) * formDataPost.precio,
    };

    setTimeout(() => {
      cargarVentas();
    }, 300);

    // setVentas([...ventas, newVenta]);
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

  const sendPostSale = () => {

    // Hacer fetch al backend para registar una venta
    fetch('https://silo-roll-backend.onrender.com/sale/make_sale', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product_code: formDataPost.producto,
        carrier_code: formDataPost.transportista,
        customer_code: formDataPost.cliente,
        warehouse_code: formDataPost.almacen,
        amount: formDataPost.cantidad,
        ton: formDataPost.toneladas,
        price: formDataPost.precio * formDataPost.cantidad
      })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Error al realizar la venta');
        }
        return res.json();
      })
      .then(data => {
        console.log("Venta agregada:", data);
      })
      .catch(error => {
        console.error("Error:", error.message);
      });
  }


  return (
    <div className="ventas-container">
      <FaArrowLeft
        className="arrow-icon"
        onClick={() => navigate('/menu')}
      />
      <h2 className="productos-title">Registrar ventas</h2>

      <form className="ventas-form">
        <div className="form-grid">
          {/* Cliente */}
          <div className="form-item">
            <label>Cliente</label>
            <select
              value={formData.cliente.code}
              onChange={(e) => handleChange("cliente", e.target.value)}
            >
              <option value="">Seleccionar Cliente</option>
              {opcionesClientes.map((cliente, index) => (
                <option key={index} value={cliente.code}>{cliente.name} {cliente.last_name}</option>
              ))}
            </select>
          </div>

          {/* Producto */}
          <div className="form-item">
            <label>Producto</label>
            <select
              value={formData.producto.code}
              onChange={(e) => handleChange("producto", e.target.value)}
            >
              <option value="">Seleccionar Producto</option>
              {opcionesProductos.map((producto, index) => (
                <option key={index} value={producto.code}>{producto.name}</option>
              ))}
            </select>
          </div>

          {/* Cantidad */}
          <div className="form-item">
            <label>Cantidad</label>
            <input
              type="number"
              value={formData.cantidad}
              onChange={(e) => handleChange("cantidad", e.target.value)}
            />
          </div>

          {/* Toneladas */}
          <div className="form-item">
            <label>Toneladas</label>
            <input
              type="number"
              value={formData.toneladas}
              onChange={(e) => handleChange("toneladas", e.target.value)}
            />
          </div>

          {/* Almacén */}
          <div className="form-item">
            <label>Almacén</label>
            <select
              value={formData.almacen.code}
              onChange={(e) => handleChange("almacen", e.target.value)}
            >
              <option value="">Seleccionar Almacén</option>
              {opcionesAlmacen.map((almacen, index) => (
                <option key={index} value={almacen.code}>{almacen.name}</option>
              ))}
            </select>
          </div>

          {/* Transportista */}
          <div className="form-item">
            <label>Transportista</label>
            <select
              value={formData.transportista.code}
              onChange={(e) => handleChange("transportista", e.target.value)}
            >
              <option value="">Seleccionar Transportista</option>
              {opcionesTransportistas.map((transportista, index) => (
                <option key={index} value={transportista.code}>{transportista.name} {transportista.last_name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="boton-container">
          <button
            type="button"
            onClick={handleSell}
            disabled={!Object.values(formData).every((val) => val !== "")}
          >
            Vender
          </button>
        </div>
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
            <th>Fecha</th>
            <th>Hora</th>
            <th>Transportista</th>
            <th>Almacen</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta, amount) => (
            <tr key={amount}>
              <td>{venta.customer_name}</td>
              <td>{venta.product}</td>
              <td>{venta.sale_date}</td>
              <td>{venta.sale_time}</td>
              <td>{venta.carrier_name}</td>
              <td>{venta.warehouse}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VentasSiloroll;
