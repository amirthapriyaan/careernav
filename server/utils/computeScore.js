

function computeScore(jdSkills = [], resumeSkills = []) {
  const jdSet = new Set(jdSkills);
  const resumeSet = new Set(resumeSkills);

  const matchedSkills = [];
  const missingSkills = [];

  jdSet.forEach((skill) => {
    if (resumeSet.has(skill)) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const total = jdSet.size || 1;
  const rawScore = (matchedSkills.length / total) * 10;
  const score = Math.round(rawScore * 10) / 10; // 1 decimal

  let level = "Weak Match";
  if (score >= 8) level = "Strong Match";
  else if (score >= 5) level = "Moderate Match";

  return { score, level, matchedSkills, missingSkills };
}

module.exports = { computeScore };
