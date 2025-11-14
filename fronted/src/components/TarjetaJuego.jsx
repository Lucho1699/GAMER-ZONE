function TarjetaJuego({ gamename, developer, gender, description, imagesrc, onDelete }) {
    return (
        <>
            <div className="container-tarjeta-juego">
                <div className="imagen-tarjeta-juego">
                    <img src={imagesrc} alt={`Imagen del juego ${gamename}`} />
                </div>
                <div className="informacion-tarjeta-juego">
                    <h2 className="titulo-juego">Nombre: {gamename}</h2>
                    <p><strong>Desarrollador:</strong> {developer}</p>
                    <p><strong>Género: {gender}</strong></p>
                    <p><strong>Descripcioción: {description}</strong></p>
                    <button className="boton-eliminar" onClick={()=> onDelete(gamename)}>Eliminar</button>
                </div>
            </div>
        </>
    );
}
export default TarjetaJuego;