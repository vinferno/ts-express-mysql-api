import express from 'express';
import { runDbReset } from '../controllers/dbController';

const router = express.Router();

router.get('/', runDbReset);

export default router;