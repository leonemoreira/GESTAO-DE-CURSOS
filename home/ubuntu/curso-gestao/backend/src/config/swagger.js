const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Sistema de Gestão de Cursos",
      version: "1.0.0",
      description: "Documentação da API para o Sistema de Gestão de Cursos e Anotações dos Alunos",
    },
    servers: [
      {
        url: "http://localhost:3001/api", // Ajuste a URL base conforme necessário
        description: "Servidor de Desenvolvimento"
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
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
  },
  // Caminho para os arquivos que contêm as definições da API (rotas)
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("Documentação Swagger disponível em /api-docs");
};

module.exports = setupSwagger;
