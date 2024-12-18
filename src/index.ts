import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/', (req, res) => {
    res.json({
        home: {url: '/', text: 'lists all routes'},
        users: {url: '/api/users', text: 'list all users'}
    })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
