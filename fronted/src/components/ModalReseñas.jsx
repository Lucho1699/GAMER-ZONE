import { useState, useEffect } from "react";


function ModalReseñas({ juegoId, gamename, onClose }) {
  const URL_API = "http://localhost:3000";
  const token = localStorage.getItem('token');

  const [resenas, setResenas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cargando, setCargando] = useState(true);

  // Formulario
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [puntuacion, setPuntuacion] = useState(5);
  const [recomendado, setRecomendado] = useState(true);
  const [horasJugadas, setHorasJugadas] = useState(0);


  // Cargar reseñas al abrir el modal
  useEffect(() => {
    const cargarResenas = async () => {
      try {
        const res = await fetch(`${URL_API}/resenas/juego/${juegoId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setResenas(data);
        setCargando(false);
      } catch (err) {
        console.error("Error al cargar reseñas:", err);
        setCargando(false);
      }
    };

    cargarResenas();
  }, [juegoId, token, URL_API]);

  const agregarResena = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${URL_API}/resenas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          juegoId,
          titulo,
          contenido,
          puntuacion,
          recomendado,
          horasJugadas  
        })

      });

      const data = await res.json();
      if (res.ok) {
        setResenas([data.resena, ...resenas]);
        setTitulo("");
        setContenido("");
        setPuntuacion(5);
        setRecomendado(true);
        setMostrarFormulario(false);
      }
    } catch (err) {
      console.error("Error al agregar reseña:", err);
    }
  };

  const eliminarResena = async (resenaId) => {
    try {
      const res = await fetch(`${URL_API}/resenas/${resenaId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setResenas(resenas.filter(r => r._id !== resenaId));
      }
    } catch (err) {
      console.error("Error al eliminar reseña:", err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-resenas" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header-resenas">
          <h2>📝 Reseñas de {gamename}</h2>
          <button className="modal-close" onClick={onClose}>✖</button>
        </div>

        {/* Body */}
        <div className="modal-body-resenas">
          
          {/* Botón para agregar reseña */}
          <button 
            className="btn-nueva-resena" 
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
          >
            {mostrarFormulario ? "❌ Cancelar" : "➕ Agregar Reseña"}
          </button>

          {/* Formulario para nueva reseña */}
          {mostrarFormulario && (
            <form className="form-resena" onSubmit={agregarResena}>
              <input
                type="text"
                placeholder="Título de la reseña"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
              <textarea
                placeholder="Escribe tu reseña..."
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                rows="4"
                required
              />
              <div className="form-row">
                <label>
                  Puntuación: 
                  <select value={puntuacion} onChange={(e) => setPuntuacion(Number(e.target.value))}>
                    <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                    <option value={4}>⭐⭐⭐⭐ (4)</option>
                    <option value={3}>⭐⭐⭐ (3)</option>
                    <option value={2}>⭐⭐ (2)</option>
                    <option value={1}>⭐ (1)</option>
                  </select>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={recomendado}
                    onChange={(e) => setRecomendado(e.target.checked)}
                  />
                  Lo recomiendo
                </label>
              </div>
              <button type="submit" className="btn-guardar-resena">Guardar Reseña</button>
              <input
              type="number"
              placeholder="Horas jugadas"
              value={horasJugadas}
              onChange={(e) => setHorasJugadas(Number(e.target.value))}
              min="0"
              required
            />

            </form>
          )}

          {/* Lista de reseñas */}
          <div className="lista-resenas">
            {cargando ? (
              <p>Cargando reseñas...</p>
            ) : resenas.length === 0 ? (
              <p className="sin-resenas">No hay reseñas aún. ¡Sé el primero en escribir una!</p>
            ) : (
              resenas.map((resena) => (
                <div key={resena._id} className="tarjeta-resena">
                  <div className="resena-header">
                    <h3>{resena.titulo}</h3>
                    <div className="resena-puntuacion">
                      {"⭐".repeat(resena.puntuacion)}
                    </div>
                  </div>
                  <p className="resena-contenido">{resena.contenido}</p>
                      <p className="resena-horas">⏱️ Horas jugadas: <strong>{resena.horasJugadas}</strong> </p>
                  <div className="resena-footer">
                    <span className={`resena-recomendado ${resena.recomendado ? 'si' : 'no'}`}>
                      {resena.recomendado ? "👍 Recomendado" : "👎 No recomendado"}
                    </span>
                    <button 
                      className="btn-eliminar-resena" 
                      onClick={() => eliminarResena(resena._id)}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalReseñas;