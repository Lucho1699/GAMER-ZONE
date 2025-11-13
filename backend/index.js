const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Game = require('./models/game');

const app = express();
const port = process.env.PORT || 3000;

/*Habilitar Permisos CORS de nuestro api*/
app.use(cors());

/*Convertir el body de las peticiones a formato json*/
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 👈 Agregado: para leer datos de formularios también

//Coneccion a la base de datos MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((error) => console.error('❌ Error conectando a MongoDB:', error));


// 🔹 Obtener todos los juegos (GET /data)
app.get('/', async (req, res) => {
  console.log("📨 Llegó un GET a /data");

  try {
    const games = await Game.find();
    console.log("📦 Juegos encontrados:", games.length);
    res.status(200).json(games);
  } catch (err) {
    console.error("❌ Error al obtener juegos:", err);
    res.status(500).json({ error: 'Error obteniendo juegos' });
  }
});


// 🔹 Agregar nuevo juego (POST /data)
app.post('/', async (req, res) => {
  console.log("📩 Llegó un POST a /data");
  console.log("🧠 Cuerpo recibido:", req.body);

  const { name, gender, developer, description, imageSrc } = req.body;

  // Validar campos vacíos
  if (!name || !gender || !developer || !description || !imageSrc) {
    return res.status(400).json({ error: 'Ningún campo puede estar vacío' });
  }

  try {
    // Verificar si el juego ya existe
    const existingGame = await Game.findOne({ name: name });
    if (existingGame) {
      return res.status(400).json({ error: 'Juego ya existente' });
    }

    // Crear nuevo juego
    const newGame = new Game({
      name,
      gender,
      developer,
      description,
      imageSrc,
    });

    // Guardar
    await newGame.save();
    console.log("🎮 Juego agregado correctamente:", newGame);
    res.status(201).json({ message: 'Juego agregado correctamente' });

  } catch (err) {
    console.error("❌ Error al guardar juego:", err);
    res.status(500).json({ error: 'Error guardando el juego' });
  }
});





// 🔹 Agregar reseñas
const resenasRoutes = require('./routes/resenas');
app.use('/resenas', resenasRoutes);





//Iniciar el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en puerto http://localhost:${port}`);
});
