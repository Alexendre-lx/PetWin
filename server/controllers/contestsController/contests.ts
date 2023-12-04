import { Router, Request, Response } from 'express';
import { getContestParticipantsData, 
    getContestInProgress, 
    getAllContestsInfo, 
    getContestInfo, 
    getParticipantIdByContest, 
    getAlreadyParticipates, 
    getParticipantIdByContestByRegion, 
    getContestbyParticipant } from './contestsFunctions'; 

const routerContests = Router();

routerContests.get('/participants/:contestId', async (req: Request, res: Response) => {
  const contestId = req.params.contestId;
  const participantsData = await getContestParticipantsData(contestId);
  return res.status(200).json(participantsData);
});
routerContests.get('/in-progress', getContestInProgress);
routerContests.get('/all-info', getAllContestsInfo);
routerContests.get('/info', getContestInfo);
routerContests.get('/participants', getParticipantIdByContest);
routerContests.get('/already-participates', getAlreadyParticipates);
routerContests.get('/participantsByRegion', getParticipantIdByContestByRegion);
routerContests.get('/by-participant', getContestbyParticipant);

export default routerContests;
