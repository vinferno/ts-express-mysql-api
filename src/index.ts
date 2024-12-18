import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import infoRoutes from './routes/infoRoutes';
import dbRoutes from './routes/dbRoutes'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/db/reset', dbRoutes)

app.use('/', infoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
