import { Request, Response } from 'express';
import { db } from '../../index';
import { formatDateRange, formatDateContest } from '../../utils/FormatDate';
import { DocumentData, Query } from 'firebase-admin/firestore';

interface ContestData {
    id: string;
    buttonSource: string;
    date1: string;
    name: string;
    contestants: string;
    trophy: {
        name: string;
        prize: string;
    };
    imageSource: string;
    isFinished: boolean;
    containerLink: string;
    date2: {
        formattedDate: string;
        daysLeft: string;
    }
    participants: number;
    amountToWin: number;
    prize: string[];
    prizeVotes: string[];
}

interface ContestGridListProps {
    name: string;
    imageSource: string;
    prize: number;
    place: number;
    totalVotes: number;
    prizeVotes: number | string;
    createdAt: {
        _seconds: string,
        _nanoseconds: string
    }
    id?: string;
    col?: number;
    xsCol?: number;
    pictureSize: any;
}


const fetchParticipantsData = async (participantIds: string[], orderBy?: string): Promise<ContestGridListProps[]> => {
    const participantCollection = db.collection('Participants');
    const participantDocRefs = participantIds.map((participantId) => participantCollection.doc(participantId));

    const participantSnapshots = await db.getAll(...participantDocRefs);

    const participantDataPromises = participantSnapshots.map(async (participantDocSnapshot) => {
        const participantData = participantDocSnapshot.data();

        if (participantData) {

            return {
                imageSource: participantData.pictureURLs[0],
                name: participantData.name,
                place: participantData.rank,
                totalVotes: participantData.votes,
                prize: participantData.prize,
                prizeVotes: participantData.prizeVotes,
                id: participantDocSnapshot.id,
                pictureSize: participantData.pictureSize,
                createdAt: participantData.createdAt
            } as ContestGridListProps;

        }

        return null;
    });

    const participantDataResults = await Promise.allSettled(participantDataPromises);
    const participantArray = participantDataResults
        .filter((result): result is PromiseFulfilledResult<ContestGridListProps> => result.status === 'fulfilled')
        .map((result) => result.value);

    if (orderBy === 'Vote -') {
        participantArray.sort((a, b) => b.totalVotes - a.totalVotes);
    } else if (orderBy === 'Recents') {
        participantArray.sort((a, b) => {
            const dateA = new Date(a.createdAt._seconds).getTime();
            const dateB = new Date(b.createdAt._seconds).getTime();
            return dateB - dateA;
        });
    }


    return participantArray
};

export const getContestParticipantsData = async (contestId: string, orderBy?: string): Promise<ContestGridListProps[]> => {
    const contestsCollection = db.collection('Contests');
    const contestDocRef = contestsCollection.doc(contestId);

    const contestDocSnapshot = await contestDocRef.get();

    if (!contestDocSnapshot.exists) {
        return [];
    }

    const contestData = contestDocSnapshot.data();

    if (!contestData || !contestData.contestParticipants) {
        return [];
    }

    return await fetchParticipantsData(contestData.contestParticipants, orderBy);
};


export async function updateParticipantsStatus(contestId: string) {
    try {
        const contestsCollection = db.collection('Contests');
        const contestDocRef = contestsCollection.doc(contestId);

        const contestDocSnapshot = await contestDocRef.get();
        const contestData = contestDocSnapshot.data();

        if (!contestData) {
            return false;
        }

        await Promise.all(
            (contestData.contestParticipants || []).map(async (participantId: string) => {
                const participantDocRef = db.collection('Participants').doc(participantId);
                const participantDocSnapshot = await participantDocRef.get();
                const participantData = participantDocSnapshot.data();

                if (!participantData) {
                    return;
                }

                const pastContestCollectionRef = participantDocRef.collection('PastContests');
                await pastContestCollectionRef.add({
                    contestId: participantData.contestIdInProgress || '',
                    prize: participantData.prize || '',
                    prizeVotes: participantData.prizeVotes || '',
                    prizeVotesRegion: participantData.prizeVotesRegion || '',
                    votes: participantData.votes || 0,
                    rank: participantData.rank || 0,
                    regionRank: participantData.regionRank || 0,
                });

                await participantDocRef.update({
                    isRegistered: false,
                    prize: '',
                    prizeVotes: '',
                    prizeVotesRegion: '',
                    votes: 0,
                    rank: 0,
                    regionRank: 0,
                    contestIdInProgress: '',
                });
            })
        );

        return true;
    } catch (error) {
        return false;
    }
}

export const getContestInProgress = async (req: Request, res: Response) => {
    try {
        const contestsCollection = db.collection('Contests');
        const openContestsQuery = contestsCollection.where('open', '==', true);
        const openContests = await openContestsQuery.get();

        if (openContests.empty) {
            return res.status(200).json([]);
        }
        
        const contestsInProgress: ContestData[] = (
            await Promise.all(
                openContests.docs.map(async (contestDoc) => {
                    const contestData = contestDoc.data();
                    const currentDate = Math.floor(Date.now() / 1000);
                    const isContestInProgress = currentDate >= contestData.startDate.seconds && currentDate <= contestData.endDate.seconds;
                    
                    if (isContestInProgress) {
                        
                        const contestId = contestDoc.id;
                        return getContestDataById(contestId);
                    } else {
                        const contestRef = contestsCollection.doc(contestDoc.id);
                        await contestRef.update({ open: false });
                        await updateParticipantsStatus(contestDoc.id);
                        return null;
                    }
                })
            )
        ).filter((contestData): contestData is ContestData => contestData !== null);

        const validContestsInProgress: ContestData[] = contestsInProgress
            .filter((contestResult): contestResult is ContestData => 'id' in contestResult);
        return res.status(200).json({validContestsInProgress : validContestsInProgress});
    } catch (error) {
        return res.status(500).json({ error: 'Une erreur est survenue lors de la recherche des concours en cours.' })

    }
};

export const getAllContestsInfo = async (req: Request, res: Response) => {
    try {
        const contestsCollection = db.collection('Contests');
        const contestDocs = await contestsCollection.get();

        if (contestDocs.empty) {
            return res.status(200).json([]);
        }

        const allContestsInfo: (ContestData | { error: string })[] = await Promise.all(
            contestDocs.docs.map(async (contestDoc) => {
                return await getContestDataById(contestDoc.id);
            })
        );

        const validContestsInfo: ContestData[] = allContestsInfo.filter(isContestData);

        return res.status(200).json(validContestsInfo);
    } catch (error) {
        return res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des informations des concours.' })
    }
};

const getContestDataById = async (contestId: string): Promise<ContestData | { error: string }> => {
    const contestsCollection = db.collection('Contests');
    const contestDocRef = contestsCollection.doc(contestId);

    try {
        const contestDocSnapshot = await contestDocRef.get();

        if (!contestDocSnapshot.exists) {
            return { error: 'Le concours n\'existe pas' };
        }

        const contestData = contestDocSnapshot.data();

        if (!contestData) {
            return { error: 'Données du concours introuvables' };
        }


        const allParticipantsDoc = await getFirstParticipant(contestId)
        const date = formatDateRange(contestData.startDate.seconds, contestData.endDate.seconds);
        const buttonSource = `contests/${contestData.participantsType.toLowerCase()}/${contestId}`;
        const containerLink = allParticipantsDoc? `contestants/${allParticipantsDoc.docs[0].id}` : buttonSource
        const name = `${contestData.name}`;
        const prizeTrophy = contestData.reward ? `${contestData.reward[0]}` : '';
        const contestants = allParticipantsDoc ? `${allParticipantsDoc.docs.length}` : '0';
        const trophy = {
            name: 'À Gagner',
            prize: prizeTrophy,
        };
        const isFinished = !contestData.open;
        const formatDate = formatDateContest(contestData.startDate.seconds, contestData.endDate.seconds);
        const participants = allParticipantsDoc?.docs.length || 0;
        const amountToWin = contestData.reward[0];
        const prize = contestData.reward[0];
        const prizeVotes = contestData.rewardVotes;
        const imageSource = allParticipantsDoc && allParticipantsDoc.docs[0].data().mainPicture 
        return {
            id: contestId,
            buttonSource: buttonSource,
            date1: date,
            name: name,
            prize: prize,
            contestants: contestants,
            trophy: trophy,
            imageSource: imageSource,
            isFinished: isFinished,
            containerLink: containerLink,
            date2: formatDate,
            participants: participants,
            amountToWin: amountToWin,
            prizeVotes: prizeVotes,
        };
    } catch (error) {
        return { error: 'Une erreur est survenue lors de la récupération des informations du concours.' };
    }
};


const isContestData = (data: ContestData | { error: string }): data is ContestData => {
    return !('error' in data);
};

export const getContestInfo = async (req: Request, res: Response) => {
    try {
        const contestId = req.query.contestId;
        const contestInfo = await getContestDataById(contestId as string);

        return res.status(200).json(contestInfo);
    } catch (error) {
        return res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des informations du concours.' })
    }
};


export const getParticipantIdByContest = async (req: Request, res: Response) => {
    try {
        const contestId = String(req.query.contestId);
        const region = String(req.query.region);
        const limit = Number(req.query.limit) || 8;
        const orderBy = req.query.orderBy as string;
        const lastItemId = req.query.lastItemId as string;

        const contestRef = db.collection('Contests').doc(contestId);
        const contestDoc = await contestRef.get();

        if (!contestDoc.exists) {
            return res.status(404).json({ success: false, error: 'Contest not found.' });
        }

        const participantsCollection = contestRef.collection('ContestParticipants');
        let q: Query<DocumentData> | undefined = participantsCollection;
        if (orderBy) {
            switch (orderBy) {
                case 'Vote -':
                    q = participantsCollection.orderBy('votes', 'asc');
                    break;
                case 'Vote +':
                    q = participantsCollection.orderBy('votes', 'desc');
                    break;
                case 'Recents':
                    q = participantsCollection.orderBy('createdAt', 'asc');
                    break;
                default:
                    break;
            }
        }

        if (lastItemId) {
            const participantRef = db.collection('Participants').doc(lastItemId);
            const participantDoc = await participantRef.get();
            q = q.startAfter(participantDoc);

        }

        const contestNewDoc = await q.limit(limit).get();
        if (contestNewDoc.docs.length !== 0) {
            const participants = await Promise.all(
                contestNewDoc.docs.map(async (participantSnapshot) => {
                    const participantId = participantSnapshot.id;
                    const participantRef = db.collection('Participants').doc(participantId);
                    const participantDoc = await participantRef.get();
                    const participantData = participantDoc.data();
                    return {
                        imageSource: participantData?.pictureURLs[0],
                        name: participantData?.name,
                        place: participantData?.rank,
                        totalVotes: participantData?.votes,
                        prize: participantData?.prize,
                        prizeVotes: participantData?.prizeVotes,
                        id: participantSnapshot.id,
                        pictureSize: participantData?.pictureSize,
                        createdAt: participantData?.createdAt
                    } as ContestGridListProps
                })
            );
            const hasNextPage = participants.length === limit;
            return res.status(200).json({ success: true, sortedParticipants: participants, hasNextPage: hasNextPage });
        }

        return res.status(200).json({ sortedParticipants: [], hasNextPage: false });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'An error occurred while retrieving contest information.' });
    }
};



export const getAlreadyParticipates = async (req: Request, res: Response) => {
    const ownerId = req.query.ownerId as string;

    try {
        const participantsCollection = db.collection('Participants');
        const q = participantsCollection.where('ownerId', '==', ownerId).orderBy('votes', 'desc');
        const querySnapshot = await q.get();

        if (!querySnapshot.empty) {
            const myParticipant = {
                name: querySnapshot.docs[0].data().name,
                imageSource: querySnapshot.docs[0].data().pictureURLs[0],
                participantId: querySnapshot.docs[0].id
            }

            return res.status(200).json({ alreadyParticipates: true, myParticipant: myParticipant })
        }
        else return res.status(200).json({ alreadyParticipates: false })

    } catch (error) {
        return res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des participants.' })
    }
};


export const getParticipantIdByContestByRegion = async (req: Request, res: Response) => {
    const contestId = String(req.query.contestId);
    const region = String(req.query.region);
    const limit = Number(req.query.limit) || 8;
    const orderBy = req.query.orderBy as string;
    const lastItemId = req.query.lastItemId as string;

    try {
        const contestRef = db.collection('Contests').doc(contestId);
        const contestDoc = await contestRef.get();

        if (!contestDoc.exists) {
            return res.status(404).json({ updateSucceeded: false, updateError: 'Contest not found.' });
        }

        let participantsCollectionRef = contestRef.collection('ContestParticipants').where('location', '==', region);

        switch (orderBy) {
            case 'Vote -':
                participantsCollectionRef = participantsCollectionRef.orderBy('votes', 'asc');
                break;
            case 'Vote +':
                participantsCollectionRef = participantsCollectionRef.orderBy('votes', 'desc');
                break;
            case 'Recents':
                participantsCollectionRef = participantsCollectionRef.orderBy('createdAt', 'asc');
                break;
            default:
                break;
        }

        if (lastItemId !== '') {
            const participantRef = db.collection('Participants').doc(lastItemId);
            const participantDoc = await participantRef.get();
            participantsCollectionRef = participantsCollectionRef.startAfter(participantDoc);
        }

        const regionDoc = await participantsCollectionRef.get();

        if (regionDoc.docs.length !== 0) {
            const participants = await Promise.all(
                regionDoc.docs.map(async (participantSnapshot) => {
                    const participantId = participantSnapshot.id;
                    const participantRef = db.collection('Participants').doc(participantId);
                    const participantDoc = await participantRef.get();
                    const participantData = participantDoc.data();
                    return {
                        imageSource: participantData?.pictureURLs[0],
                        name: participantData?.name,
                        place: participantData?.rank,
                        totalVotes: participantData?.votes,
                        prize: participantData?.prize,
                        prizeVotes: participantData?.prizeVotes,
                        id: participantSnapshot.id,
                        pictureSize: participantData?.pictureSize,
                        createdAt: participantData?.createdAt
                    } as ContestGridListProps
                })
            );
            const hasNextPage = participants.length === limit;
            return res.status(200).json({ sortedParticipants: participants, hasNextPage: hasNextPage });
        }

        return res.status(200).json({ sortedParticipants: [], hasNextPage: false });
    } catch (error) {
        return res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des informations du concours.' });
    }
};


export const getContestbyParticipant = async (req: Request, res: Response) => {
    const ownerId = req.query.ownerId as string;

    try {
        const participantsCollection = db.collection('Participants');
        const q = participantsCollection.where('ownerId', '==', ownerId);
        const querySnapshot = await q.get();

        const contests: string[] = querySnapshot.docs.flatMap((doc) => {
            const contestInProgress = doc.data().contestIdInProgress as string;
            return contestInProgress.trim() !== "" ? [contestInProgress] : [];
        });

        const uniqueContests = contests.filter(
            (value: string, index: number, self: string[]) => {
                return self.indexOf(value) === index;
            }
        );
        const contestsInfo = await Promise.all(
            uniqueContests.map(async (contestId) => {
                return await getContestDataById(contestId);
            })
        );

        return res.status(200).json(contestsInfo);
    } catch (error) {

        return res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des participants.' })
    }
};

export const getFirstParticipant = async (contestId : string) => {    try {
        const contestRef = db.collection('Contests').doc(contestId);
        const contestDoc = await contestRef.get();

        if (!contestDoc.exists) {
            return null
        }

        const participantsCollectionRef = contestRef.collection('ContestParticipants').orderBy('votes', 'asc');

        const participantsDoc = await participantsCollectionRef.get();
    
        if (participantsDoc.docs.length !== 0) {
            
            return participantsDoc;
        }
        return null;
    } catch (error) {
        
        return null
    }
};