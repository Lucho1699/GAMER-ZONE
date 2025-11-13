// routes/resenas.js
const express = require('express');
const router = express.Router();
const Resena = require('../models/resena');

// 🟢 Obtener todas las reseñas
router.get('/', async (req, res) => {
  try {
    const resenas = await Resena.find()
      .populate('juegoId', 'name imageSrc') // 👈 muestra info básica del juego
      .sort({ fechaCreacion: -1 });
    res.json(resenas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener reseñas', error: error.message });
  }
});

// 🟢 Obtener reseñas de un juego específico
router.get('/juego/:juegoId', async (req, res) => {
  try {
    const resenas = await Resena.find({ juegoId: req.params.juegoId })
      .sort({ fechaCreacion: -1 });
    res.json(resenas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener reseñas', error: error.message });
  }
});

// 🟢 Crear una nueva reseña
router.post('/', async (req, res) => {
  try {
    const nuevaResena = new Resena(req.body);
    const resenaGuardada = await nuevaResena.save();
    res.status(201).json(resenaGuardada);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear la reseña', error: error.message });
  }
});

// 🟢 Eliminar una reseña
router.delete('/:id', async (req, res) => {
  try {
    const resenaEliminada = await Resena.findByIdAndDelete(req.params.id);
    if (!resenaEliminada) {
      return res.status(404).json({ mensaje: 'Reseña no encontrada' });
    }
    res.json({ mensaje: 'Reseña eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar la reseña', error: error.message });
  }
});

module.exports = router;
