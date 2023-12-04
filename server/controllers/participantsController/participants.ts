import { Router } from 'express';
import {
  addParticipantAndParticipate,
  participate,
  updateParticipant,
  getParticipantByOwner,
  getParticipantByOwnerForProfile,
  getParticipantInfo,
  getLatestParticipantsByPage,
  getLatestParticipants,
  getParticipantsWithoutVote,
  getParticipantByName,
  getParticipantByFeatures,
  getRandomParticipants,
  updateParticipantPicture
} from './participantsFunctions'; 

import {authenticateUser} from '../../middleware'

const routerParticipants = Router();

routerParticipants.post('/addParticipantAndParticipate',authenticateUser, addParticipantAndParticipate);
routerParticipants.post('/participate',authenticateUser, participate);
routerParticipants.post('/updateParticipant',authenticateUser, updateParticipant);
routerParticipants.post('/updateParticipantPicture',authenticateUser, updateParticipantPicture);

routerParticipants.get('/getParticipantByOwner', getParticipantByOwner);
routerParticipants.get('/getParticipantByOwnerForProfile', getParticipantByOwnerForProfile);
routerParticipants.get('/getParticipantInfo', getParticipantInfo);
routerParticipants.get('/getLatestParticipantsByPage', getLatestParticipantsByPage);
routerParticipants.get('/getLatestParticipants', getLatestParticipants);
routerParticipants.get('/getParticipantsWithoutVote', getParticipantsWithoutVote);
routerParticipants.get('/getParticipantByName', getParticipantByName);
routerParticipants.get('/getParticipantByFeatures', getParticipantByFeatures);
routerParticipants.get('/getRandomParticipants', getRandomParticipants);
export default routerParticipants;
