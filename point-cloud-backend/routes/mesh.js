const express = require('express');
const router = express.Router();
const Mesh = require('../models/mesh');

router.use(express.json());

// Route to save mesh data
router.post('/', async (req, res) => {
  await Mesh.deleteMany({});
  try {
    const savedMeshes = [];
    console.log(req.body);
    for (const reqBody of req.body) {
      const { position, rotation, scale, label, id, isMeasurement, point1, point2 } = reqBody;
      const newMesh = new Mesh({
        position,
        rotation,
        scale,
        label,
        id,
        isMeasurement,
        point1,
        point2,
      });
      savedMeshes.push(newMesh);
    }
    const savedData = await Mesh.insertMany(savedMeshes);
    res.json(savedData);
  } catch (err) {
    console.log("error", err);
    res.status(400).json({ message: err.message });
  }
});


// Route to get all meshes
router.get('/', async (req, res) => {
  try {
    const meshes = await Mesh.find();
    res.json(meshes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
