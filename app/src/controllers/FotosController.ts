/* eslint-disable no-console */
import * as path from 'path';
import { promisify } from 'util';
import { ApiRequest, Response } from 'express';
import { logger } from '@/utils/logger';
import { imagesYoloPth } from '..';

const sleep = promisify(setTimeout);
const fs = require('fs');

const { GoogleGenerativeAI } = require('@google/generative-ai');

async function processFile(file: string, model): Promise<void> {
  const imagesDir = path.resolve(__dirname, '..', '..', 'images');

  const fullPath = path.join(imagesDir, file);
  const imageData = fs.readFileSync(fullPath);
  const base64Image = imageData.toString('base64');

  const result = await model.generateContent([
    'Descreva qual veículo vê nessa foto, me passe placa, modelo e coloração! Caso não consiga descrever me passo os valores vazios e informando o error. Os dados separados e a mensagem em português',
    {
      inlineData: {
        data: base64Image,
        mimeType: 'image/png',
      },
    }]);

  return result.response.text();
}

export default class FotosController {
  static async filesToGemini(req?: ApiRequest, res?: Response) {
    try {
      const { GOOGLE_API_KEY } = process.env;
      const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const imagesDir = path.resolve(__dirname, '..', '..', 'images');

      const files = fs.readdirSync(imagesDir);

      const batches = [];
      for (let i = 0; i < files.length; i += 10) {
        batches.push(files.slice(i, i + 10));
      }

      let logContent = '';
      const nowDate = new Date();

      let batchIndex = 0;
      for await (const batch of batches) {
        batchIndex += 1;

        logContent += '\nLote processado:\n';
        const logFileName = `lote_${batchIndex}_${nowDate}.txt`;
        const logFilePath = path.join(__dirname, '..', '..', 'logs', logFileName);

        for await (const file of batch) {
          console.log(`Analisando Arquivo ${file} do Lote(${batchIndex})`);
          logContent += `Analisando arquivo: ${file}\n`;
          const responseText = await processFile(file, model);
          logContent += `\n${responseText}`;
          await sleep(1000);
        }

        console.log('Finalizou Lote: ', batchIndex);
        fs.writeFileSync(logFilePath, logContent);
        logContent += '';
        await sleep(20000);
      }

      fs.writeFileSync(path.join(__dirname, '..', '..', 'logs', 'imagem_analysis_log.txt'), logContent);
      if (res) {
        res?.json({
          image: logContent,
          JSON: JSON.stringify(logContent),
        });
      }
    } catch (error) {
      const errorMessage = error?.message || 'Ops! Ocorreu algum error.';
      logger.error('UserController(me): ', errorMessage);
      res.status(500).json({
        message: errorMessage,
      });
    }
  }

  static async filesToYolo(filePath: string) {
    try {
      const destinationDirectory = imagesYoloPth;
      const destinationPath = path.join(destinationDirectory, path.basename(filePath));

      if (!fs.existsSync(destinationDirectory)) {
        fs.mkdirSync(destinationDirectory, { recursive: true });
      }
      fs.renameSync(filePath, destinationPath);
      setTimeout(() => {}, 1000);

      console.log('Arquivo movido e excluído com sucesso.');
    } catch (error) {
      console.error('Erro ao mover ou excluir o arquivo:', error.message);
    }
  }
}
