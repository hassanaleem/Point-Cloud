const express = require('express');
const router = express.Router();
const History = require('../models/history');

router.use(express.json());

router.post('/', async (req, res) => {
  try {
    console.log(req.body);
    const newHistory = new History(req.body);
    const savedData = await newHistory.save();
    res.json(savedData);
  } catch (err) {
    console.log("error", err);
    res.status(400).json({ message: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const history = await History.find();
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
