import { Router } from 'express';
import {
    addComment,
    getCommentsForParticipant,
    likeComment,
    unlikeComment,
  } from './commentsFunctions';

  import {authenticateUser} from '../../middleware'

const routerComments = Router();

routerComments.post('/addComment',authenticateUser, addComment);
routerComments.post('/likeComment',authenticateUser, likeComment);
routerComments.post('/unlikeComment',authenticateUser, unlikeComment);

routerComments.get('/getCommentsForParticipant', getCommentsForParticipant);

export default routerComments;
