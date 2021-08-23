const swaggerJsdoc = require("swagger-jsdoc");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fundoo Notes API with Swagger",
      version: "0.1.0",
      description: "This is a Fundoo Notes API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Ananya",
        url: "https://github.com/Ananya-Krishnappa/",
        email: "ananyak3395@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/",
      },
    ],
  },
  apis: ["./app/routes/route.js"],
};

const swaggerSpecs = swaggerJsdoc(options);

module.exports = {
  swaggerSpecs,
};
