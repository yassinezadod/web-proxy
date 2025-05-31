const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const proxyRoutes = require('./routes/proxy.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');
const logoutRoute = require('./routes/logout');
const logsRouter = require('./routes/logs.routes');
const statsRoutes = require('./routes/stats.routes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Ta config Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API opérationnelle 🚀' });
});
app.use('/api', authRoutes);
app.use('/api', proxyRoutes);
app.use('/api', statsRoutes);
app.use('/api', logsRouter);

// Monte le routeur pour /api/logout
app.use('/api', logoutRoute);


module.exports = app;
