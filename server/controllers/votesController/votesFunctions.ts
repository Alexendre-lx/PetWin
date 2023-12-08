import { Request, Response } from 'express';
import { db } from '../../index';
import { formatRelativeTime } from '../../utils/FormatDate';
import { startOfDay } from 'date-fns';

interface VoteData {
  id: string;
  participantName: string;
  postedAt: string;
  voterName: string;
  votes: number;
  profilePicture: string;
}

interface UpdatedRanking {
  id: string;
  votes: number;
  registration: number;
}
interface animalCardsList {
  name: string;
  id: string;
  place: number;
  placeRegion: number;
  votes: number;
  pictureURL: string;
  isRegistered: boolean;
}

interface Participant {
  name: string;
  id: string;
  place: number;
  placeRegion: number;
  votes: number;
  pictureURL: string;
  isRegistered?: boolean;
}

const convertFirestoreDocToJSON = (doc: FirebaseFirestore.QueryDocumentSnapshot): VoteData => {
  const data = doc.data();
  return {
    id: doc.id,
    participantName: data.participantName,
    postedAt: formatRelativeTime(data.postedAt.seconds),
    voterName: data.voterName,
    votes: data.votes,
    profilePicture: data.profilePicture,
  };
};

const handleErrorResponse = (res: Response, error: unknown, errorMessage: string) => {
  res.status(500).json({ error: errorMessage });
};

const validateLimitParameter = (req: Request, res: Response, next: () => void) => {
  const limit = Number(req.query.limit);
  if (isNaN(limit) || limit <= 0) {
    return res.status(400).json({ error: 'Invalid or missing limit parameter.' });
  }
  next();
};

const executeFirestoreQuery = async (query: FirebaseFirestore.Query) => {
  const snapshot = await query.get();
  if (!snapshot.empty) {
    return snapshot.docs.map(convertFirestoreDocToJSON);
  }
  return [];

};

const getVotesByQuery = async (req: Request, res: Response, query: FirebaseFirestore.Query) => {
  try {
    validateLimitParameter(req, res, async () => {
      const limit = Number(req.query.limit);
      const votesQuery = query.orderBy('postedAt', 'desc').limit(limit);
      const recentVotes = await executeFirestoreQuery(votesQuery);

      res.status(200).json(recentVotes);
    });
  } catch (error) {

    handleErrorResponse(res, error, 'Failed to fetch votes.');
  }
};


export const getParticipantAndVotesByOwner = async (req: Request, res: Response) => {
  try {
    const ownerId = req.query.ownerId;
    const limit = Number(req.query.limit);


    if (!ownerId) {
      return res.status(400).json({ error: 'Missing ownerId parameter.' });
    }

    const participantsCollection = db.collection('Participants');
    const q = participantsCollection.where('ownerId', '==', ownerId);
    const querySnapshot = await q.get();

    const participants: Participant[] = [];

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        const { name, isRegistered, pictureURLs, regionRank, rank, votes } = doc.data();
        participants.push({
          id: doc.id,
          name,
          isRegistered,
          pictureURL: pictureURLs[0],
          placeRegion: regionRank,
          place: rank,
          votes,
        });
      });
    }

    const votes = await Promise.all(
      participants.map(async (participant) => {
        try {

          const votesCollection = db.collection('Votes');
          const votesQuery = votesCollection.where('participantId', '==', participant.id).orderBy('postedAt', 'desc').limit(limit);
          const participantVotes = await votesQuery.get()
          return participantVotes.docs.map(convertFirestoreDocToJSON)

        } catch (error) {
          return null;
        }
      })
    );

    const validVotes = votes
      .filter((vote) => vote !== null)
      .flat();
    return res.status(200).json({ participantByOwner: participants, votes: validVotes });
  } catch (error) {
    console.error('Error in getParticipantVotesByOwner:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getRecentVotes = async (req: Request, res: Response) => {
  const votesCollection = db.collection('Votes');
  const votesQuery = votesCollection;
  await getVotesByQuery(req, res, votesQuery);
};

export const getRecentVotesForUser = async (req: Request, res: Response) => {
  const voterId = req.query.voterId;
  if (!voterId) {
    return res.status(400).json({ error: 'Missing voterId parameter.' });
  }
  const votesCollection = db.collection('Votes');
  const votesQuery = votesCollection.where('voterId', '==', voterId);
  await getVotesByQuery(req, res, votesQuery);
};

export const getRecentVotesForParticipant = async (req: Request, res: Response) => {
  const participantId = req.query.participantId;
  if (!participantId) {
    return res.status(400).json({ error: 'Missing participantId parameter.' });
  }

  const votesQuery = db.collection('Votes').where('participantId', '==', participantId);
  await getVotesByQuery(req, res, votesQuery);
};

export const getVotesUserParticipants = async (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required.' });
  }
  try {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const votesQuery = db.collection('Votes')
      .where('participantOwnerId', '==', userId)
      .where('postedAt', '>=', startOfToday);
    await getVotesByQuery(req, res, votesQuery);
  } catch (error) {
    handleErrorResponse(res, error, 'Failed to fetch user\'s votes.');
  }
};

export const addVote = async (contestId: string, participantId: string, userId: string, votes: number) => {
  try {

    const result = await db.runTransaction(async (transaction) => {
      const [voterData, participantData] = await Promise.all([
        transaction.get(db.doc(`Users/${userId}`)),
        transaction.get(db.doc(`Participants/${participantId}`)),
      ]);

      if (!voterData.exists || !participantData.exists) {
        throw new Error('Voter or participant not found');
      }

      const voterDoc = voterData.data();
      const participantDoc = participantData.data();

      if (
        !voterDoc ||
        !participantDoc ||
        !participantDoc.isRegistered
      ) {
        throw new Error('Invalid vote parameters');
      }

      const voteRef = db.collection('Votes').doc();
      transaction.set(voteRef, {
        participantId,
        participantName: participantDoc.name,
        participantOwnerId: participantDoc.ownerId,
        voterId: userId,
        voterName: voterDoc.name,
        postedAt: new Date(),
        votes: Number(votes),
        profilePicture: voterDoc.profilePicture,
      });

      const region = participantDoc.location as string;
      const currentVotes = Number(participantDoc.votes) || 0;
      const newVotes = currentVotes + Number(votes);
      transaction.update(db.doc(`Participants/${participantId}`), { votes: newVotes });

      const contestParticipantsRef = db.collection(`Contests/${contestId}/ContestParticipants`).doc(participantId);

      transaction.update(contestParticipantsRef, {

        votes: newVotes,
      });
      return { success: true, voteId: voteRef.id, region: region };
    });

    await updateRanking(contestId);

    if ('region' in result) {
      await updateRegionRanking(contestId, result.region);
    }

    return result;
  } catch (error) {
    throw error;
  }
};


export const addParticipantToContest = async (
  contestId: string,
  participantId: string,
): Promise<{ addSucceeded: boolean }> => {
  try {
    const contestDocRef = db.collection('Contests').doc(contestId);
    const contestDoc = await contestDocRef.get();

    if (!contestDoc.exists) {
      return {
        addSucceeded: false,
      };
    }
    const participantRef = db.collection('Participants').doc(participantId);
    const participantDoc = await participantRef.get();
    const participantData = participantDoc.data();
    const participantDocRef = contestDocRef.collection('ContestParticipants').doc(participantId);
    await participantDocRef.set({
      votes: participantData?.votes,
      regionRank: participantData?.regionRank,
      rank: participantData?.rank,
      location: participantData?.location,
      createdAt: participantData?.createdAt
    });

    return {
      addSucceeded: true,
    };
  } catch (error) {
    return {
      addSucceeded: false,
    };
  }
};


export const changeParticipantRegion = async (contestId: string, participantId: string, currentRegion: string, newRegion: string):
  Promise<{ updateSucceeded: boolean; updateError?: string }> => {
  try {
    await updateRegionRanking(contestId, currentRegion);
    await updateRegionRanking(contestId, newRegion);

    return {
      updateSucceeded: true,
    };
  } catch (error) {
    return {
      updateSucceeded: false,
      updateError: "An error occurred while changing the participant's region.",
    };
  }
};


export const updateRegionRanking = async (
  contestId: string,
  region: string
): Promise<{
  updateSucceeded: boolean;
  updatedRegionRanking?: UpdatedRanking[];
  updateError?: string;
}> => {
  try {
    const contestRef = db.collection('Contests').doc(contestId);
    const contestDoc = await contestRef.get();
    const contestData = contestDoc.data();

    if (!contestData) {
      return { updateSucceeded: false, updateError: 'Contest not found.' };
    }

    const participantsCollectionRef = contestRef.collection('ContestParticipants').where('location', '==', region)
    const participantsSnapshots = await participantsCollectionRef.get();
    const participants = await Promise.all(
      participantsSnapshots.docs.map(async (participantSnapshot) => {
        const participantId = participantSnapshot.id;
        const participantRef = db.collection('Participants').doc(participantId);
        const participantDoc = await participantRef.get();
        const participantData = participantDoc.data();
        return {
          id: participantDoc.id,
          votes: participantData?.votes || 0,
          registration: participantData?.createdAt?.seconds || 0,
        };
      })
    );

    const participantsWithVotes = participants.filter((p) => p.votes > 0);
    const participantsWithNullVotes = participants.filter((p) => p.votes === 0);

    participantsWithVotes.sort((a, b) => b.votes - a.votes || a.registration - b.registration);
    participantsWithNullVotes.sort((a, b) => a.registration - b.registration);

    const sortedRanking = [...participantsWithVotes, ...participantsWithNullVotes];

    await Promise.all(
      sortedRanking.map(async (participant, index) => {
        const participantRef = db.doc(`Participants/${participant.id}`);
        await participantRef.update({
          regionRank: index + 1,
          prizeVotesRegion: contestData.rewardVotesRegion?.[index] || 0,
        });
        const contestParticipantRef = db.doc(`Contests/${contestId}/ContestParticipants/${participant.id}`);
        await contestParticipantRef.update({
          regionRank: index + 1,
        })
      })
    );

    return {
      updateSucceeded: true,
      updatedRegionRanking: sortedRanking,
    };
  } catch (error) {
    return {
      updateSucceeded: false,
      updateError: 'An error occurred while updating the region ranking.',
    };
  }
};

export const updateRanking = async (
  contestId: string,
): Promise<{
  updateSucceeded: boolean;
  updatedRegionRanking?: UpdatedRanking[];
  updateError?: string;
}> => {
  try {
    const contestRef = db.collection('Contests').doc(contestId);
    const contestDoc = await contestRef.get();
    const contestData = contestDoc.data();

    if (!contestData) {
      return { updateSucceeded: false, updateError: 'Contest not found.' };
    }

    const participantsCollectionRef = contestRef.collection('ContestParticipants')
    const participantsSnapshots = await participantsCollectionRef.get();
    const participants = await Promise.all(
      participantsSnapshots.docs.map(async (participantSnapshot) => {
        const participantId = participantSnapshot.id;
        const participantRef = db.collection('Participants').doc(participantId);
        const participantDoc = await participantRef.get();
        const participantData = participantDoc.data();
        return {
          id: participantDoc.id,
          votes: participantData?.votes || 0,
          registration: participantData?.createdAt?.seconds || 0,
        };
      })
    );

    const participantsWithVotes = participants.filter((p) => p.votes > 0);
    const participantsWithNullVotes = participants.filter((p) => p.votes === 0);

    participantsWithVotes.sort((a, b) => b.votes - a.votes || a.registration - b.registration);
    participantsWithNullVotes.sort((a, b) => a.registration - b.registration);

    const sortedRanking = [...participantsWithVotes, ...participantsWithNullVotes];

    await Promise.all(
      sortedRanking.map(async (participant, index) => {
        const participantRef = db.doc(`Participants/${participant.id}`);
        await participantRef.update({
          rank: index + 1,
          prize: contestData.reward?.[index] || 0,
          prizeVotes: contestData.rewardVotes?.[index] || 0,
        });
        const contestParticipantRef = db.doc(`Contests/${contestId}/ContestParticipants/${participant.id}`);
        await contestParticipantRef.update({
          rank: index + 1,
        })
      })
    );

    return {
      updateSucceeded: true,
      updatedRegionRanking: sortedRanking,
    };
  } catch (error) {
    return {
      updateSucceeded: false,
      updateError: 'An error occurred while updating the region ranking.',
    };
  }
};
