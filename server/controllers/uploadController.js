
const pdfLib = require("pdf-parse");

async function parsePdfBuffer(buffer) {
  try {
    if (!buffer) throw new Error("Empty buffer");

    if (typeof pdfLib === "function") {
      return (await pdfLib(buffer)).text || "";
    }
    if (pdfLib && typeof pdfLib.default === "function") {
      return (await pdfLib.default(buffer)).text || "";
    }
    if (pdfLib && typeof pdfLib.pdf === "function") {
      return (await pdfLib.pdf(buffer)).text || "";
    }
    throw new Error("pdf-parse export not a function");
  } catch (err) {
    console.error("parsePdfBuffer error:", err);
    throw err;
  }
}

// Generic upload handler 
async function uploadPdf(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Only PDF files are accepted" });
    }

    const buffer = req.file.buffer;
    const text = await parsePdfBuffer(buffer);

    return res.json({ text });
  } catch (err) {
    console.error("uploadPdf error:", err);
    return res.status(500).json({ error: err.message || "Failed to parse PDF" });
  }
}

module.exports = { uploadPdf, parsePdfBuffer };
