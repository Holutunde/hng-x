const express = require("express");
const router = express.Router();
const Person = require("../model/person");
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const mongoose = require("mongoose");

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
      msg: "name does not meet validation, should be string only",
    });
  }
  const person = new Person(req.body);
  await person.save();
  res.status(200).json({
    success: true,
    msg: "Person created successfully",
    person: person,
  });
});

// Read a person by ID
router.get("/:user_id", async (req, res) => {
  const personId = req.params.user_id;
  // Check if the provided ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(req.params.user_id)) {
    return res.status(400).json({
      success: false,
      msg: `Person with id ${personId} does not exit`,
    });
  }

  const person = await Person.findById(personId);
  res.status(StatusCodes.OK).json({ person });
});

// Update a person by ID
router.patch("/:user_id", async (req, res) => {
  const personId = req.params.user_id;

  if (!mongoose.Types.ObjectId.isValid(req.params.user_id)) {
    return res.status(400).json({
      success: false,
      msg: `Person with id ${personId} does not exit`,
    });
  }
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

  const person = await Person.findByIdAndUpdate(personId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    msg: "Person updated successfully",
    person: person,
  });
});

// Delete a person by ID
router.delete("/:user_id", async (req, res) => {
  const personId = req.params.user_id;

  if (!mongoose.Types.ObjectId.isValid(req.params.user_id)) {
    return res.status(400).json({
      success: false,
      msg: `Person with id ${personId} does not exit`,
    });
  }
  const person = await Person.findByIdAndDelete(personId);

  res.status(200).json({
    success: true,
    msg: "Person deleted successfully",
    person: person,
  });
});

module.exports = router;
