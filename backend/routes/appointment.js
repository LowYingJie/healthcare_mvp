// backend/routes/appointment.js

const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const auth = require('../middleware/authMiddleware');

// Create an appointment
router.post('/', auth, async (req, res) => {
  const { doctorId, date, time, reason } = req.body;
  try {
    const appointment = new Appointment({
      patientId: req.user.id,
      doctorId,
      date,
      time,
      reason
    });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get appointments for a user (patient or doctor)
router.get('/', auth, async (req, res) => {
  try {
    const filter = req.user.role === 'doctor'
      ? { doctorId: req.user.id }
      : { patientId: req.user.id };

    const appointments = await Appointment.find(filter)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name email');

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update appointment status (e.g., mark as completed/cancelled)
router.put('/:id', auth, async (req, res) => {
  const { status } = req.body;
  try {
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
