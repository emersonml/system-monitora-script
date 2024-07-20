import 'module-alias/register';
import 'dotenv/config';

import * as path from 'path';
import express from 'express';

import cors from 'cors';
import chokidar from 'chokidar';
import routes from './routes';
import FotosController from '@/controllers/FotosController';

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

app.get('/', (request, response) => response.json({ message: '🚀' }));

const port = 3333;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server app listening on port ${port}`);
});

const pathProject = path.resolve(__dirname, '../');
export const ftpImages = path.resolve(pathProject, `${process.env.PATH_IMAGES_FTP}`);
export const imagesYoloPth = path.resolve(pathProject, process.env.PATH_IMAGES_YOLO);

const watcher = chokidar.watch(ftpImages, {
  // eslint-disable-next-line no-useless-escape
  ignored: /(^|[\/\\])\../,
  persistent: true,
});

watcher.on('add', async (pathImage) => {
  const imageName = pathImage.split('/').pop();
  console.log('🚀 New Image Name', imageName);

  await FotosController.filesToYolo(pathImage);
});
