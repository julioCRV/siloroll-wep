import React from 'react';

// Componente Modal
const Modal = ({ text, type }) => {

  // Íconos dependiendo del tipo
  const icon = type === 'success' ? '✅' : '❌';
  
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.icon}>{icon}</div>
        <p>{text}</p>
      </div>
    </div>
  );
};

// Estilos básicos en línea
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    textAlign: 'center',
    width: '300px',
  },
  icon: {
    fontSize: '20px',
    marginBottom: '10px',
  },
  button: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Modal;
