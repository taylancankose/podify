const fs = require("fs-extra");
const path = require("path");

const srcDir = path.join(__dirname, "../src/mail");
const destDir = path.join(__dirname, "../dist/mail");

fs.copy(srcDir, destDir)
  .then(() => console.log("Files copied successfully!"))
  .catch((err) => console.error("Error copying files:", err));
