import { Router } from 'express';
import {
    getCheckoutUrl,
    
} from './stripeFunctions'; 

import {authenticateUser} from '../../middleware'

const routerStripe = Router();
routerStripe.get('/getCheckoutUrl', getCheckoutUrl);

export default routerStripe;

