require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10kb' }));

const aiRoutes = require('./routes/ai');
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(3001, () => {
  console.log('AI server running on http://localhost:3001');
  console.log('GROQ_KEY_1 set:', !!process.env.GROQ_KEY_1);
});
