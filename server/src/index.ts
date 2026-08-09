/**
 * Servidor Ítaca — backend mínimo
 *
 * Express + TypeScript, sem banco de dados nem autenticação: expõe apenas
 * `POST /scan`, que analisa uma foto via Claude (visão) e "detecta" uma das
 * 5 criaturas mitológicas do Scanner de Ciclope, no tom satírico do app.
 *
 * Uso local de desenvolvimento apenas — `cors()` totalmente liberado abaixo.
 * NÃO fazer deploy real com essa configuração de CORS sem restringi-la a uma
 * origem confiável.
 */

import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { handleScan } from './scan';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/scan', handleScan);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`[itaca-server] ouvindo na porta ${port}`);
});
