import { NextApiRequest, NextApiResponse } from 'next';
import { NextConnect } from 'next-connect';

import AuditController from '@api/controllers/AuditController';
import CapabilityController from '@api/controllers/CapabilityController';
import auth from '@api/middlewares/Auth';
import bodyParser from '@api/middlewares/BodyParser';

import CamerasController from './controllers/CamerasController';
import CompanyController from './controllers/CompanyController';
import DashboardController from './controllers/DashboardController';
import EnvironmentController from './controllers/EnvironmentController';
import RoleController from './controllers/RoleController';
import SessionController from './controllers/SessionController';
import UserController from './controllers/UserController';

export default function routes(api: NextConnect<NextApiRequest, NextApiResponse>) {
    api.use(bodyParser);

    api.get('/', (req, res) => res.send('ERP - Api'));

    api.post('/sessions', SessionController.create);
    api.delete('/sessions', auth(), SessionController.delete);

    api.get('/audits', auth(), AuditController.list);

    api.get('/environments', auth(true), EnvironmentController.list);
    api.put('/environments', auth(), EnvironmentController.update);

    api.get('/roles', auth(), RoleController.list);
    api.post('/roles', auth(), RoleController.create);
    api.put('/roles/:id', auth(), RoleController.update);
    api.get('/roles/:id', auth(), RoleController.update);
    api.delete('/roles/:id', auth(), RoleController.delete);
    api.get('/roles/:id/capabilities', auth(), RoleController.getCapabilities);
    api.put('/roles/:id/capabilities', auth(), RoleController.updateCapabilities);

    api.get('/capabilities', auth(), CapabilityController.list);

    api.get('/dashboard', auth(), DashboardController.list);

    api.get('/users', auth(), UserController.list);
    api.post('/users', auth(), UserController.create);
    api.put('/users/:id', auth(), UserController.update);
    api.delete('/users/:id', auth(), UserController.delete);
    api.get('/users/me', auth(), UserController.me);
    api.get('/users/:id', auth(), UserController.get);
    api.post('/users/recover-password', UserController.recoverPassword);

    api.get('/cameras', auth(), CamerasController.list);
    api.get('/cameras/:id', auth(), CamerasController.get);
    api.post('/cameras', auth(), CamerasController.create);
    api.put('/cameras/:id', auth(), CamerasController.update);
    api.delete('/cameras/:id', auth(), CamerasController.delete);

    api.get('/company', auth(), CompanyController.list);
    api.get('/company/:id', auth(), CompanyController.get);
    api.post('/company', auth(), CompanyController.create);
    api.put('/company/:id', auth(), CompanyController.update);
    api.delete('/company/:id', auth(), CompanyController.delete);

    return api;
}
