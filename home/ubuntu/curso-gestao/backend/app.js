const express = require("express");
const cors = require("cors");
const config = require("./src/config/config");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const courseRoutes = require("./src/routes/courseRoutes");
const noteRoutes = require("./src/routes/noteRoutes");
const setupSwagger = require("./src/config/swagger"); // Importar configuração do Swagger

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar Swagger
setupSwagger(app);

// Rotas
app.get("/", (req, res) => {
  res.send("API do Sistema de Gestão de Cursos está rodando! Visite /api-docs para a documentação.");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/notes", noteRoutes);

// Middleware de tratamento de erros básico
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo deu errado!");
});

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app; // Exportar para possíveis testes futuros
