const express = require("express");
const router = express.Router();
const { createBatch, deleteBatch } = require("../controllers/batch.controller");

router.route("/").post(createBatch);
router.route("/:id").delete(deleteBatch);

module.exports = router;
