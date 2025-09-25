import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import knowledgeBaseRoutes from './routes/knowledgeBaseRoutes';
import documentRoutes from './routes/documentRoutes';
import chatRoutes from './routes/chatRoutes';

dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running!' });
});

// Routes
app.use('/api/v1/knowledge-bases', knowledgeBaseRoutes);
app.use('/api/v1', documentRoutes);
app.use('/api/v1', chatRoutes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
