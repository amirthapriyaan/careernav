
const skillsDictionary = require("./skillsDictionary.json");

function extractSkills(text = "") {
  if (!text || typeof text !== "string") {
    return [];
  }

  const normalized = text.toLowerCase();
  const found = new Set();

  Object.values(skillsDictionary).forEach((categorySkills) => {
    if (!Array.isArray(categorySkills)) return;

    categorySkills.forEach((skill) => {
      const escaped = skill.replace(/\+/g, "\\+").replace(/\./g, "\\.");
      const pattern = new RegExp(`\\b${escaped}\\b`, "i");

      if (pattern.test(normalized)) {
        found.add(skill.toLowerCase());
      }
    });
  });

  return Array.from(found);
}

module.exports = { extractSkills };
