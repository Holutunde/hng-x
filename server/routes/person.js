const express = require("express");
const router = express.Router();
const Person = require("../model/person");
const Joi = require("joi");

const personSchema = Joi.object({
  name: Joi.string().required(),
});

// Create a new person
router.post("/", async (req, res) => {
  // Validate the request body against the schema
  const { error } = personSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      msg: "name does not meet validation",
    });
  }
  const person = new Person(req.body);
  try {
    await person.save();
    res.status(201).json({
      success: true,
      msg: "Person created successfully",
      person: person,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Failed to create person",
    });
  }
});

// Read all persons
router.get("/persons", async (req, res) => {
  try {
    const persons = await Person.find();
    res.status(200).json({
      success: true,
      persons: persons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Failed to fetch persons",
    });
  }
});

// Read a person by ID
router.get("/:user_id", async (req, res) => {
  const personId = req.params.user_id;
  try {
    const person = await Person.findById(personId);
    if (!person) {
      return res.status(404).json({
        success: false,
        msg: "Person not found",
      });
    }
    res.status(200).json({
      success: true,
      person: person,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Failed to fetch person",
    });
  }
});

// Update a person by ID
router.patch("/:user_id", async (req, res) => {
  const personId = req.params.user_id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).json({
      success: false,
      msg: "Invalid updates",
    });
  }

  try {
    const person = await Person.findByIdAndUpdate(personId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!person) {
      return res.status(404).json({
        success: false,
        msg: "Person not found",
      });
    }

    res.status(200).json({
      success: true,
      msg: "Person updated successfully",
      person: person,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Failed to update person",
    });
  }
});

// Delete a person by ID
router.delete("/:user_id", async (req, res) => {
  const personId = req.params.user_id;
  try {
    const person = await Person.findByIdAndDelete(personId);
    if (!person) {
      return res.status(404).json({
        success: false,
        msg: "Person not found",
      });
    }
    res.status(200).json({
      success: true,
      msg: "Person deleted successfully",
      person: person,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Failed to delete person",
    });
  }
});

module.exports = router;
