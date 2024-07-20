import { Router } from 'express';
import FotosController from '@/controllers/FotosController';

const userRoutes = Router();

userRoutes.get('/gemini', FotosController.filesToGemini);

export default userRoutes;
