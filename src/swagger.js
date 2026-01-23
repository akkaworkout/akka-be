const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AkkaWorkout API",
      version: "1.0.0",
      description: "Akka Workout API 명세서",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
      {
        url: "https://port-0-akka-workout-be-mkqkv57u21e615f4.sel3.cloudtype.app",
        description: "Production server",
      },
    ],
  },

  apis: [path.join(__dirname, "/**/*.js")],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;