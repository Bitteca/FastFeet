import { Router } from 'express';
import multer from 'multer';

import SessionController from './app/controllers/SessionController';
import RecipientsController from './app/controllers/RecipientsController';
import FileController from './app/controllers/FileController';
import CourierController from './app/controllers/CourierController';
import SignatureController from './app/controllers/SignatureController';

import authMiddleware from './app/middleware/auth';
import multerConfig from './config/multer';
import signatureConfig from './config/signaturesUpload';

const routes = new Router();
const upload = multer(multerConfig);
const uploadSignatures = multer(signatureConfig);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
routes.post('/recipient', RecipientsController.store);
routes.put('/recipient/:id', RecipientsController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.post(
  '/signatures',
  uploadSignatures.single('signature'),
  SignatureController.store
);

// Couriers
routes.get('/couriers', CourierController.index);
routes.post('/couriers', CourierController.store);
routes.put('/couriers/:id', CourierController.update);
routes.delete('/couriers/:id', CourierController.delete);

export default routes;
