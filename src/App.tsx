import React, { useState } from 'react';
import Home from './pages/Home';
import Admin from './pages/Admin';

const App: React.FC = () => {
  // Sistema simple de navegación
  const [ruta, setRuta] = useState('home');

  return (
    <div>
      {/* Si la ruta es 'admin' mostramos el panel, si no, la Tienda */}
      {ruta === 'admin' ? (
        <Admin />
      ) : (
        <Home />
      )}
      
      {/* Botón secreto para ir al Admin (flotante abajo a la derecha) */}
      {ruta === 'home' && (
        <button 
          onClick={() => setRuta('admin')}
          className="fixed bottom-4 right-4 z-50 bg-gray-900 text-gray-500 p-2 rounded-full opacity-20 hover:opacity-100 transition-opacity text-xs"
        >
          Admin
        </button>
      )}
      
       {ruta === 'admin' && (
        <button 
          onClick={() => setRuta('home')}
          className="fixed bottom-4 right-4 z-50 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg"
        >
          Volver a la Tienda
        </button>
      )}
    </div>
  );
};

export default App;