import { Router } from 'express';
import {
  getRecentVotes,
  getRecentVotesForUser,
  getRecentVotesForParticipant,
  getVotesUserParticipants,
  getParticipantAndVotesByOwner
} from './votesFunctions';

import {authenticateUser} from '../../middleware'


const routerVotes = Router();


routerVotes.get('/recentVotes', getRecentVotes);
routerVotes.get('/recentVotesForUser', getRecentVotesForUser);
routerVotes.get('/recentVotesForParticipant', getRecentVotesForParticipant);
routerVotes.get('/votesUserParticipants', getVotesUserParticipants);

routerVotes.get('/getParticipantVotesByOwner', getParticipantAndVotesByOwner);



export default routerVotes;
