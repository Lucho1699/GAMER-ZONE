function TarjetaJuego({ gamename, developer, gender, description, imagesrc, onDelete, onEdit, juego_completo, id }) {
    return (
        <>
            <div className="container-tarjeta-juego">
                <div className="imagen-tarjeta-juego">
                    <img src={imagesrc} alt={`Imagen del juego ${gamename}`} />
                </div>
                <div className="informacion-tarjeta-juego">
                    <h2 className="titulo-juego">Nombre: {gamename}</h2>
                    <p><strong>Desarrollador:</strong> {developer}</p>
                    <p><strong>Género:</strong> {gender}</p>
                    <p><strong>Descripcioción:</strong> {description}</p>
                    <p><strong>Completado:</strong> {juego_completo ? "Si" : "No"}<button className="boton-completo">✅</button><button className="boton-imcompleto">❌</button></p>

                    
                    
                    
                    <button className="boton-eliminar" onClick={()=> onDelete(id)}>Eliminar</button>
                   
                    <button className="boton-editar" onClick={()=> onEdit(id, gamename, developer, gender, description, imagesrc)}>Editar</button>
                </div>
            </div>
        </>
    );
}
export default TarjetaJuego;