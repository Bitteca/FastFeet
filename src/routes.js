import { Router } from 'express';
import multer from 'multer';

import SessionController from './app/controllers/SessionController';
import RecipientsController from './app/controllers/RecipientsController';
import FileController from './app/controllers/FileController';
import CourierController from './app/controllers/CourierController';
import SignatureController from './app/controllers/SignatureController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryWithdrawController from './app/controllers/DeliveryWithdrawController';
import DeliveriesByCourierController from './app/controllers/DeliveriesByCourierController';
import DeliveredController from './app/controllers/DeliveredController';
import ProblemsController from './app/controllers/ProblemsController';
import DeliveriesWithProblemsController from './app/controllers/DeliveriesWithProblemsController';

import authMiddleware from './app/middleware/auth';
import multerConfig from './config/multer';
import signatureConfig from './config/signaturesUpload';

const routes = new Router();
const upload = multer(multerConfig);
const uploadSignatures = multer(signatureConfig);

routes.post('/sessions', SessionController.store);

/**
 * Deliveries Problems
 */
routes.get('/deliveries/problems', ProblemsController.index);
routes.get('/deliveries/:id/problems', DeliveriesWithProblemsController.index);
routes.post('/deliveries/:id/problems', ProblemsController.store);
routes.delete('/problem/:id/cancel-delivery', ProblemsController.delete);

routes.use(authMiddleware);
routes.post('/recipient', RecipientsController.store);
routes.put('/recipient/:id', RecipientsController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.post(
  '/signatures',
  uploadSignatures.single('signature'),
  SignatureController.store
);

/**
 * Couriers
 */

routes.get('/couriers', CourierController.index);
routes.post('/couriers', CourierController.store);
routes.put('/couriers/:id', CourierController.update);
routes.delete('/couriers/:id', CourierController.delete);
routes.put(
  '/couriers/:id/deliveries/:delivery_id/withdraw',
  DeliveredController.update
);
routes.get('/couriers/:id/deliveries', DeliveriesByCourierController.index);

/**
 * Deliveries
 */
routes.get('/deliveries', DeliveryController.index);
routes.post('/deliveries', DeliveryController.store);
routes.put('/deliveries/:id', DeliveryController.update);
routes.delete('/deliveries/:id', DeliveryController.delete);

/**
 * Withdraw Deliveries
 */
routes.put('/deliveries/:id/withdraw', DeliveryWithdrawController.update);

export default routes;
