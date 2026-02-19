const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "AkkaWorkout API",
            version: "1.0.0",
            description: "Akka Workout API 명세서",
        },
        components: {
            securitySchemes: {
                bearerAuth : {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        servers: [
            {
                url: "http://localhost:3000",
                description: "Local server",
            },
            {
                url: "https://api.akkaworkout.store/",
                description: "Production server",
            },
        ],
    },
    apis: [
        path.join(__dirname, "routes/*.js"),
        path.join(__dirname, "controllers/*.js"),
    ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;