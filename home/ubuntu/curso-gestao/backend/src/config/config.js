require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET || 'curso_gestao_secret_key',
  jwtExpiresIn: '24h'
};
