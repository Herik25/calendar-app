const express = require("express");
const Appointment = require("../models/Appointment");

const router = express.Router();

// POST route to add new appointments
router.post("/", async (req, res) => {
  const { title, date, startTime, endTime } = req.body;

  try {
    const newAppointment = new Appointment({
      title,
      date,
      startTime,
      endTime,
    });

    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: "Error creating appointment", error });
  }
});

// GET route to retrieve all appointments
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving appointments", error });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, date, startTime, endTime } = req.body;

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { title, date, startTime, endTime },
      { new: true }
    );
    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: "Error updating appointment", error });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(id);
    if (!deletedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting appointment", error });
  }
});

module.exports = router;
