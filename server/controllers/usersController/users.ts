import { Router } from 'express';
import {
  addUser,
  getUserInfo,
  getUserProfilePicture,
  updateUser,
  userExists,
  addUserGoogleAndFacebook, 
  checkEmail
} from './usersFunctions'; 

import {authenticateUser} from '../../middleware'

const routerUser = Router();

routerUser.post('/addUser', addUser);
routerUser.post('/addUserGoogleAndFacebook', addUserGoogleAndFacebook);

routerUser.post('/updateUser', authenticateUser, updateUser);

routerUser.get('/getUserInfo', authenticateUser, getUserInfo);
routerUser.get('/getUserProfilePicture', getUserProfilePicture);
routerUser.get('/userExists', userExists);

routerUser.get('/checkEmail' , checkEmail)

export default routerUser;
