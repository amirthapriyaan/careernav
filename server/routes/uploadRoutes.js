
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadPdf } = require("../controllers/uploadController");

// memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// POST /api/upload/resume  -> returns { text }
router.post("/resume", upload.single("file"), uploadPdf);

// POST /api/upload/pdf    -> generic (use for JD upload)
router.post("/pdf", upload.single("file"), uploadPdf);

module.exports = router;
