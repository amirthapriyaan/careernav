

const COMMON = {
  java: {
    resources: [
      { title: "Official Java Tutorials", url: "https://docs.oracle.com/javase/tutorial/" },
      { title: "Java Programming - freeCodeCamp", url: "https://www.youtube.com/watch?v=grEKMHGYyns" },
      { title: "Baeldung Java Guides", url: "https://www.baeldung.com/" },
      { title: "Java: The Complete Reference (book)", url: "https://www.amazon.com/Java-Complete-Reference-Herbert-Schildt/dp/1260440230" }
    ],
    description:
      "Java is a class-based, object-oriented programming language used widely for backend systems, Android development, and large scale applications. Focus on OOP concepts, Java Collections, exception handling, and multithreading.",
    projectIdea: "Build a RESTful Notes API using Spring Boot and store data in an H2 or MySQL database."
  },
  sql: {
    resources: [
      { title: "SQL Tutorial - W3Schools", url: "https://www.w3schools.com/sql/" },
      { title: "SQLBolt Interactive Lessons", url: "https://sqlbolt.com/" },
      { title: "Mode Analytics SQL Tutorial", url: "https://mode.com/sql-tutorial/" },
      { title: "LeetCode Database Problems", url: "https://leetcode.com/problemset/database/" }
    ],
    description:
      "SQL is used to query and manage relational databases. Learn SELECT, JOINs, GROUP BY, subqueries, window functions, indexes, and normalization.",
    projectIdea: "Design a small e-commerce database schema and write queries for reporting sales and inventory."
  },
  python: {
    resources: [
      { title: "Python Docs - Tutorial", url: "https://docs.python.org/3/tutorial/" },
      { title: "Automate the Boring Stuff (Al Sweigart)", url: "https://automatetheboringstuff.com/" },
      { title: "Python for Everybody (Coursera)", url: "https://www.coursera.org/specializations/python" }
    ],
    description: "Python is a versatile language used for scripting, backend, and data science. Focus on data structures, OOP, modules, and writing scripts.",
    projectIdea: "Create a web scraper and store results in CSV or MongoDB."
  },
  react: {
    resources: [
      { title: "React Official Docs", url: "https://react.dev/learn" },
      { title: "React Tutorial - FreeCodeCamp", url: "https://www.freecodecamp.org/news/learn-react-by-building-a-simple-app/" },
      { title: "Fullstack Open React", url: "https://fullstackopen.com/en/" }
    ],
    description: "React is a library for building component-based UIs. Learn JSX, props, state, hooks, and component patterns.",
    projectIdea: "Build a Todo app with persisted state and filters."
  },
  node: {
    resources: [
      { title: "Node.js Official Docs", url: "https://nodejs.org/en/docs/" },
      { title: "Node.js Crash Course (Traversy)", url: "https://www.youtube.com/watch?v=fBNz5xF-Kx4" },
      { title: "Express Guide", url: "https://expressjs.com/en/starter/installing.html" }
    ],
    description: "Node.js lets you run JavaScript on the server. Learn event loop, Express, middleware, REST APIs, and basic error handling.",
    projectIdea: "Create a REST API for a Note app with JWT auth."
  },
  mongodb: {
    resources: [
      { title: "MongoDB Official Docs", url: "https://www.mongodb.com/docs/" },
      { title: "MongoDB University Free Courses", url: "https://university.mongodb.com/" }
    ],
    description: "MongoDB is a NoSQL document database suitable for flexible JSON-like data. Learn CRUD operations, indexing, and modeling patterns.",
    projectIdea: "Build an expense tracker storing transactions in MongoDB."
  },
  docker: {
    resources: [
      { title: "Docker Docs — Get Started", url: "https://docs.docker.com/get-started/" },
      { title: "Docker Compose documentation", url: "https://docs.docker.com/compose/" }
    ],
    description: "Docker allows packaging apps into containers. Learn images, containers, Dockerfile, and Compose for multi-container apps.",
    projectIdea: "Dockerize a Node + MongoDB app and run with docker-compose."
  },
  aws: {
    resources: [
      { title: "AWS Skill Builder", url: "https://explore.skillbuilder.aws/learn" },
      { title: "AWS Free Tier tutorials", url: "https://aws.amazon.com/getting-started/" }
    ],
    description: "AWS provides cloud infrastructure services. Focus on EC2, S3, IAM, and basic networking.",
    projectIdea: "Deploy a static website to S3 and host backend on EC2 or Elastic Beanstalk."
  }
};

function findClosestKey(skill) {
  const s = (skill || "").toLowerCase();
  for (const k of Object.keys(COMMON)) {
    if (s.includes(k)) return k;
  }
  return null;
}

function getResources(skill) {
  const k = findClosestKey(skill);
  if (k) return COMMON[k].resources;
  // generic fallback
  return [{ title: `Search ${skill} on YouTube`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill)}` }];
}
function getDescription(skill) {
  const k = findClosestKey(skill);
  if (k) return COMMON[k].description;
  return `Learn ${skill} by following high-quality tutorials and building a small project. Focus on core concepts and then build a simple project.`;
}
function getProjectIdea(skill) {
  const k = findClosestKey(skill);
  if (k) return COMMON[k].projectIdea;
  return `Build a small project showcasing your skills in ${skill}.`;
}
function getCategory(skill) {
  const k = findClosestKey(skill);
  if (!k) return "other";
  if (["react"].includes(k)) return "frontend";
  if (["node","java","python"].includes(k)) return "backend";
  if (["docker","aws"].includes(k)) return "devops";
  return "other";
}

module.exports = {
  getResources,
  getDescription,
  getProjectIdea,
  getCategory
};
