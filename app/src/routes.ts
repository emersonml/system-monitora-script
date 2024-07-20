import { Router } from 'express';

import fotosRoutes from './routes/Fotos';

const routes = Router();
routes.use('/fotos', fotosRoutes);

export default routes;
