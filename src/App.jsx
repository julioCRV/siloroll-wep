import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// - - - - - - - - - - -  R U T A S - - - - - - - - - - -
import IniciarSesion from './Screen/IniciarSesion';
import Menu from './Screen/Menu';
import Almacenes from './Screen/Menu/Almacenes';
import Clientes from './Screen/Menu/Clientes';
import Panel from './Screen/Menu/Panel';
import Productos from './Screen/Menu/Productos';
import Transportistas from './Screen/Menu/Transportistas';
import Ventas from './Screen/Menu/Ventas';

const App = () => {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<IniciarSesion />} />
        <Route path='/menu' element={<Menu />} />
        <Route path='/almacenes' element={<Almacenes />} />
        <Route path='/clientes' element={< Clientes />} />
        <Route path='/panel' element={<Panel />} />
        <Route path='/productos' element={< Productos />} />
        <Route path='/transportistas' element={< Transportistas />} />
        <Route path='/ventas' element={<Ventas />} />
        <Route path="*" element={<IniciarSesion />} />
      </Routes>
    </div>
  );
};

export default App;
