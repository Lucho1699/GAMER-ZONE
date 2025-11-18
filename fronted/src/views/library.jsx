import { useState, useEffect } from "react";
import Tarjetajuego from "../components/TarjetaJuego";

function Library() {
  // 🔹 URL de la API
  const URL_API = "http://localhost:3000";

  // 🔹 Estados
  const [juegos, setJuegos] = useState([]);
  const [name, setName] = useState("");
  const [developer, setDeveloper] = useState("");
  const [gender, setGender] = useState("");
  const [description, setDescription] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [editando, setEditando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [search, setSearch] = useState("");


  const token = localStorage.getItem('token');


  // 🔹 Obtener juegos al cargar la página
  useEffect(() => {
    fetch(URL_API, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setJuegos(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al obtener juegos:", err);
        setJuegos([]);
        setCargando(false);
      });
  }, [token]); // ← Agregado token como dependencia

  // 🔹 Guardar un nuevo juego
  const saveGame = async (e) => {
    e.preventDefault(); // evitar recargar la página
    if (editando) {
      //editar juego existente
      const gameId = sessionStorage.getItem("gameId");
      try {
        const res = await fetch(`${URL_API}/${gameId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            name,
            developer,
            gender,
            description,
            imageSrc,
          }),
        });
        const data = await res.json();
        console.log("Respuesta del servidor:", data);
        // Actualizar la lista de juegos con el juego editado
        setJuegos((prevJuegos) =>
          prevJuegos.map((juego) =>
            juego._id === data._id ? data : juego
          )
        );
        // Limpiar campos y estado de edición
        setName("");
        setDeveloper("");
        setGender("");
        setDescription("");
        setImageSrc("");
        setEditando(false);
        sessionStorage.removeItem("gameId");
      } catch (error) {
        console.error("Error al actualizar juego:", error);
      }
      return;
    } else {
      //crear nuevo juego
      const nuevoJuego = {
        gameId: sessionStorage.getItem("gameId") || "anon",
        name,
        developer,
        gender,
        description,
        imageSrc,
      };

      try {
        const res = await fetch(URL_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(nuevoJuego),
        });

        // Verificar respuesta del servidor
        const data = await res.json();
        console.log("Respuesta del servidor:", data);

        // Actualizar la lista de juegos con el nuevo juego agregado
        setJuegos((prev) => [...prev, data.juego]);


        // Limpiar campos
        setName("");
        setDeveloper("");
        setGender("");
        setDescription("");
        setImageSrc("");
      } catch (error) {
        console.error("Error al guardar juego:", error);
      }
    }
  };


  //editar juego - activar edicion
  const activarEdicion = (juego) => {
    setName(juego.name);
    setDeveloper(juego.developer);
    setGender(juego.gender);
    setDescription(juego.description);
    setImageSrc(juego.imageSrc);
    sessionStorage.setItem("gameId", juego._id);
    setEditando(true);
  };



  //eliminar un juego
  const eliminarJuego = async (Id) => {
    const res = await fetch(`${URL_API}/${Id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (res.ok) {
      setJuegos(juegos.filter((juego) => juego._id !== Id));
    }
  };


// Actualizar estado de completado
const juego_completo = async (id, nuevoEstado) => {
  try {
    const res = await fetch(`${URL_API}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ completado: nuevoEstado })
    });

    if (res.ok) {
      setJuegos(juegos.map(juego => 
        juego._id === id ? { ...juego, completado: nuevoEstado } : juego
      ));
      console.log("✅ Estado de completado actualizado");
    }
  } catch (error) {
    console.error("❌ Error al actualizar completado:", error);
  }
};

  

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth';
  };


  // Mostrar mensaje de carga
  if (cargando) {
    return <div className="loading">Cargando juegos...</div>;
  }

  //filtar los juegos antes de mostrarlos
  const juegosFiltrados = juegos.filter((juego) => {
  const q = search.toLowerCase();
  return (
    juego.name.toLowerCase().includes(q) ||
    juego.developer.toLowerCase().includes(q) ||
    juego.gender.toLowerCase().includes(q)
  );
});



  return (
    <>
      <h1 className="bienvenida">🕹️Bienvenido A Tu almacen De Juegos</h1> 
      <h2 className="header">🎮 Mi Biblioteca de Juegos</h2>

      <input
  type="text"
  placeholder="Buscar juegos por nombre, género o desarrollador..."
  className="search-bar"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>


      <div className="form-new-edit-game">
        <form onSubmit={saveGame}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Nombre del juego"
            required
          />
          <input
            value={developer}
            onChange={(e) => setDeveloper(e.target.value)}
            type="text"
            placeholder="Desarrollador"
            required
          />
          <input
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            type="text"
            placeholder="Género"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            type="text"
            placeholder="Descripción"
          />
          <input
            value={imageSrc}
            onChange={(e) => setImageSrc(e.target.value)}
            type="text"
            placeholder="URL de la imagen"
          />
          <button type="submit">{editando ? "Actualizar Juego" : "Guardar Juego"}</button>
        </form>
      </div>

      <div className="library-container">
        {juegos.length === 0 ? (
          <p>No tienes juegos en tu biblioteca. ¡Agrega uno!</p>
        ) : (
          juegosFiltrados.map((juego, index) => (
            <Tarjetajuego
              key={juego._id || index}
              id={juego._id}
              gamename={juego.name}
              developer={juego.developer}
              gender={juego.gender}
              description={juego.description}
              imagesrc={juego.imageSrc}
              onUpdateCompletado={juego_completo}
              onDelete={eliminarJuego}
              onEdit={() => activarEdicion(juego)}
            />
          ))
        )}
      </div>
      
      <div>
        <button onClick={handleLogout} className="btn-logout">
          Cerrar Sesión
        </button>
      </div>
    </>
  );
}


export default Library;