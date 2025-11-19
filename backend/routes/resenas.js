const express = require('express');
const router = express.Router();
const Resena = require('../models/resena');
const authMiddleware = require('../middleware/middleware');

// GET - Obtener reseñas de un juego específico
router.get('/juego/:juegoId', authMiddleware, async (req, res) => {
  try {
    const { juegoId } = req.params;
    const resenas = await Resena.find({ juegoId: juegoId })
      .sort({ fechaCreacion: -1 });
    res.status(200).json(resenas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener reseñas' });
  }
});

// POST - Crear una nueva reseña
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { juegoId, titulo, contenido, puntuacion, aspectosPositivos, aspectosNegativos, recomendado, horasJugadas} = req.body;

      if (!juegoId || !titulo || !contenido || puntuacion === undefined || horasJugadas === undefined) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const nuevaResena = new Resena({
      juegoId,
      titulo,
      contenido,
      puntuacion,
      aspectosPositivos: aspectosPositivos || [],
      aspectosNegativos: aspectosNegativos || [],
      recomendado: recomendado !== undefined ? recomendado : true,
      horasJugadas
    });

    await nuevaResena.save();
    res.status(201).json({ message: 'Reseña creada correctamente', resena: nuevaResena });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear reseña' });
  }
});

// DELETE - Eliminar una reseña
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const resenaEliminada = await Resena.findByIdAndDelete(req.params.id);
    if (!resenaEliminada) {
      return res.status(404).json({ error: 'Reseña no encontrada' });
    }
    res.status(200).json({ message: 'Reseña eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar reseña' });
  }
});

module.exports = router;