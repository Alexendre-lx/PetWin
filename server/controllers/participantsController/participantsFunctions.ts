import { Request, Response } from 'express';
import { imageToBytes } from '../../utils/convertFile'
import { updateRanking, updateRegionRanking } from '../votesController/votesFunctions';
import { updateParticipantsStatus } from '../contestsController/contestsFunctions'
import { uploadFile, deleteFileByStorageUrl } from '../usersController/usersFunctions';
import { db } from '../../index';

const PARTICIPANTS_COLLECTION = 'Participants';
const USERS_COLLECTION = 'Users';
const CONTESTS_COLLECTION = 'Contests';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};


const handleErrors = (res: Response, errorMessage: string, status = 500) => {
    return res.status(status).json({ success: false, message: errorMessage });
};

interface FeaturedGridListProps {
    name: string;
    imageSource: string;
    prize: number;
    place: number | string;
    totalVotes: number | string;
    prizeVotes: number | string;
    id: string | number;
    isRegistered: boolean
}
interface RandomParticipants {
    userPicture: string;
    participantPicture: string;
    name: string;
    byName: string;
    vote: number;
    participantId: string;
}
interface Participant {
    name: string;
    id: string;
    place: number;
    placeRegion : number;
    votes: number;
    pictureURL : string;
    isRegistered ?: boolean;
}

interface searchParticipant {
    id: string;
    name: string;
    votes: number;
    place: number;
    owner_name: string;
    pictureURL: string;
}

interface Photo {
    id: number;
    imageSource: string;
}

interface ParticipantInfoResponse {
    name: string;
    breed: string;
    location: string;
    mainPhoto: string;
    ownerPicture: string;
    awards: {
        name: string;
        place: string;
    }[];
    description: string;
    ownerName: string;
    photos: Photo[];
    ownerId: string;
    contestIdInProgress: string;
    specie: string;
    rank: number;
    isRegistered: boolean;
}

export const addParticipantAndParticipate = async (req: Request, res: Response) => {
    try {
        const { name, breed, description, specie, pictures }: { ownerId: string, name: string, breed: string, description: string, specie: string, pictures: string[] } = req.body.data;
        const ownerId = req.body.userId
        // Step 1: Validate user
        const userData = await getUserData(ownerId);
        if (!userData) {
            return handleErrors(res, "L'utilisateur n'existe pas", 404);
        }
        // Step 2: Find open contests
        const contestDoc = await findOpenContest(specie);
        // Step 3: Upload pictures
        const pictureURLs = await uploadPictures(ownerId, specie, name, pictures);

        // Step 4: Create participant data
        const participantData = createParticipantData(ownerId, userData.location, breed, name, description, specie, pictureURLs);

        // Step 5: Add participant to contest
        const participantId = await addParticipantToContest(contestDoc ? contestDoc?.id : null, participantData);

        // Step 6: Update rankings
        await updateRankings(contestDoc ? contestDoc?.id : null, participantData);

        return res.status(200).json({ success: true, message: 'Animal ajouté au concours avec succès.', participantId: participantId });
    } catch (err: any) {

        return handleErrors(res, err.message);
    }
}

export const addParticipantToContest = async (
    contestId: string | null,
    participantData: any,
): Promise<string | null> => {
    try {

        const participantsCollection = db.collection(PARTICIPANTS_COLLECTION);
        const participantDocRef = participantsCollection.doc();
        const participantId = participantDocRef.id;

        await participantDocRef.set({
            ...participantData,
            isRegistered: contestId ? true : false,
            votes: 0,
            contestIdInProgress: contestId ? contestId : '',
            prize: 0,
            prizeVotes: 0,
            prizeVotesRegion: 0,
            rank: 0,
            regionRank: 0,
        });

        if (contestId) {
            const contestDocRef = db.collection('Contests').doc(contestId);
            const participantContestDocRef = contestDocRef.collection('ContestParticipants').doc(participantId);
            await participantContestDocRef.set({
                votes: participantData?.votes,
                regionRank: participantData?.regionRank,
                rank: participantData?.rank,
                location: participantData?.location,
                createdAt: participantData?.createdAt,
                mainPicture: participantData?.pictureURLs[0]
            });
        }

        return participantId;
    } catch (error) {
        return null;
    }
};

const extractBase64Header = (base64String: string): string | null =>{
    const parts = base64String.split('/');
    if (parts.length >= 6) {
      const header = parts[5];
      return header;
    }
    return null;
  }



const uploadPictures = async (ownerId: string, specie: string, name: string, pictures: string[]) => {

    const imageUploadPromises = pictures.map(async (picture: string, index: number) => {
        if (!picture.includes('storage.googleapis')) {
            const hearder = extractBase64Header(picture)
            const imageBytes = await imageToBytes(picture);
            try {
                const url = await uploadFile(imageBytes, `images/${ownerId}/MyParticipant/${specie}/Picture-${name}-${hearder}`);
                return url;
            } catch (error) {
                throw new Error('Erreur lors du téléchargement du fichier :' + error);
            }
        } else return picture;
    });

    return Promise.all(imageUploadPromises);
}

const getUserData = async (ownerId: string) => {
    const userDocRef = db.collection(USERS_COLLECTION).doc(ownerId);
    const userDocSnapshot = await userDocRef.get();

    return userDocSnapshot.exists ? userDocSnapshot.data() : null;
}

const createParticipantData = (ownerId: string, location: string, breed: string, name: string, description: string, specie: string, pictureURLs: string[]) => {
    return {
        ownerId: ownerId,
        location: location,
        breed: breed,
        name: name,
        description: description,
        specie: specie,
        pictureURLs: pictureURLs,
        createdAt: new Date(),
        isRegistered: false,
        prize: 0,
        prizeVotes: 0,
        prizeVotesRegion: 0,
        votes: 0,
        rank: 0,
        regionRank: 0,
    };
}

const findOpenContest = async (specie: string) => {
    const contestsCollection = db.collection(CONTESTS_COLLECTION);
    const openContestsQuery = contestsCollection.where('open', '==', true).where('participantsType', '==', specie);
    const openContests = await openContestsQuery.get();

    if (openContests.empty) {
        return null;
    }

    // Choose the first open contest (you can adjust the logic for choosing the appropriate contest)
    const contestDoc = openContests.docs[0];
    const { startDate, endDate } = contestDoc.data();

    // Vérifiez si le concours est en cours (la date actuelle est entre startDate et endDate)
    const currentDate = Math.floor(Date.now() / 1000);
    const isContestInProgress = currentDate >= startDate.seconds && currentDate <= endDate.seconds;
    if (!isContestInProgress) {
        const contestRef = db.collection(CONTESTS_COLLECTION).doc(contestDoc.id)
        contestRef.update({ open: false })
        await updateParticipantsStatus(contestDoc.id)
    }

    return contestDoc;
}


const updateRankings = async (contestId: string | null, participantData: any) => {
    if (!contestId) {
        return;
    }
    await updateRanking(contestId);
    await updateRegionRanking(contestId, participantData.location);
}


export const participate = async (req: Request, res: Response) => {
    const { participantId } = req.body;
    try {
        const participantDocRef = db.collection(PARTICIPANTS_COLLECTION).doc(participantId);
        const participantDocSnapshot = await participantDocRef.get();
        if (!participantDocSnapshot.exists) {
            return handleErrors(res, "Le participant n'existe pas", 404);
        }

        const participantData = participantDocSnapshot.data();

        if (!participantData) {
            return handleErrors(res, "Données du participant introuvables", 404);
        }

        const contestDoc = await findOpenContest(participantData.specie);
        if (contestDoc) {

            const contestRef = db.collection(CONTESTS_COLLECTION).doc(contestDoc?.id).collection('ContestParticipants').doc(participantId);
            await contestRef.set({
                votes: participantData.votes,
                rank: participantData.rank,
                location: participantData.location,
                regionRank: participantData.regionRank,
                createdAt: participantData?.createdAt

            });

            await updateRankings(contestDoc?.id, participantData);

            return res.status(200).json({ success: true, message: 'Animal ajouté au concours avec succès.', participantId: participantId });
        }
        return res.status(200).json({ success: false, message: 'Pas de concours en cours', participantId: participantId });
    } catch (err: any) {
        return handleErrors(res, err.message);
    }
}

export const updateParticipant = async (req: Request, res: Response) => {

    const { participantId, newName, newBreed, newDescription } = req.body;

    try {
        const participantDocRef = db.collection(PARTICIPANTS_COLLECTION).doc(participantId);
        const participantDocSnapshot = await participantDocRef.get();
        const participantData = participantDocSnapshot.data();

        const updateData: { [key: string]: any } = {};

        if (newName) updateData.name = newName;
        if (newBreed !== 'race') updateData.breed = newBreed;
        if (newDescription) updateData.description = newDescription;

        if (participantData && participantDocSnapshot.exists) {
            await participantDocRef.update(updateData);
            return res.status(200).json({ message: 'Participant mis à jour avec succès.' });
        } else {
            return res.status(404).json({ error: 'Le participant n\'existe pas.' });
        }
    } catch (error) {
        return handleErrors(res, 'Une erreur est survenue lors de la récupération des participants.', 500);
    }

}

export const updateParticipantPicture = async (req: Request, res: Response) => {

    const { participantId, newPhotoURL, participantPhotos } = req.body;

    const photoToDelete: string[] = participantPhotos.filter((photo: string) => !newPhotoURL.includes(photo));
    try {
        const participantDocRef = db.collection(PARTICIPANTS_COLLECTION).doc(participantId);
        const participantDocSnapshot = await participantDocRef.get();
        const participantData = participantDocSnapshot.data();
        const updateData: { [key: string]: any } = {};
        if (photoToDelete[0] !== null) await deleteFileByStorageUrl(photoToDelete)
        updateData.pictureURLs = await uploadPictures(participantData?.ownerId, participantData?.specie, participantData?.name, newPhotoURL);
        if (participantData && participantDocSnapshot.exists) {
            await participantDocRef.update(updateData);
            return res.status(200).json({ message: 'Participant mis à jour avec succès.' });
        } else {
            return res.status(404).json({ error: 'Le participant n\'existe pas.' });
        }
    } catch (error) {
        return handleErrors(res, 'Une erreur est survenue lors de la récupération des participants.', 500);
    }

}

export const getParticipantByOwner = async (req: Request, res: Response) => {
    const ownerId = req.query.ownerId;

    try {
        const participantsCollection = db.collection(PARTICIPANTS_COLLECTION);
        const q = participantsCollection.where('ownerId', '==', ownerId);
        const querySnapshot = await q.get();
        const participants: Participant[] = [];

        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                const { name, isRegistered, pictureURLs,regionRank, rank , votes } = doc.data();
                participants.push({
                    id: doc.id,
                    name,
                    isRegistered,
                    pictureURL: pictureURLs[0],
                    placeRegion : regionRank,
                    place : rank,
                    votes : votes
                });
            });
        }

        return res.status(200).json(participants);
    } catch (error) {
        return handleErrors(res, 'Une erreur est survenue lors de la récupération des participants.', 500);
    }
}

export const getParticipantByOwnerForProfile = async (req: Request, res: Response) => {
    const ownerId = req.query.ownerId as string;
    try {
        const participantsCollection = db.collection(PARTICIPANTS_COLLECTION);
        const q = participantsCollection.where('ownerId', '==', ownerId);
        const querySnapshot = await q.get();

        const participants = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            place: doc.data().rank,
            votes: doc.data().votes,
            placeRegion: doc.data().regionRank,
            isRegistered: doc.data().isRegistered,
            pictureURL: doc.data().pictureURLs[0],
        }));
        return res.status(200).json(participants);
    } catch (error) {
        return handleErrors(res, 'Une erreur est survenue lors de la récupération des participants.', 500);
    }
}


export const getParticipantInfo = async (req: Request, res: Response) => {
    try {
        const participantId = req.query.participantId as string;
        const participantDocRef = db.collection(PARTICIPANTS_COLLECTION).doc(participantId);
        const participantDocSnapshot = await participantDocRef.get();

        if (!participantDocSnapshot.exists) {
            return handleErrors(res, 'Le participant n\'existe pas', 404);
        }

        const participantData = participantDocSnapshot.data();

        if (!participantData) {
            return handleErrors(res, 'Données du participant introuvables', 404);
        }

        const userDocRef = db.collection(USERS_COLLECTION).doc(participantData.ownerId as string);
        const userDocSnapshot = await userDocRef.get();

        if (!userDocSnapshot.exists) {
            return handleErrors(res, 'L\'utilisateur n\'existe pas', 404);
        }

        const userData = userDocSnapshot.data();

        if (!userData) {
            return handleErrors(res, 'Données de l\'utilisateur introuvables', 404);
        }

        const photo: Photo[] = [];

        const responseData: ParticipantInfoResponse = {
            name: participantData.name,
            breed: participantData.breed,
            location: participantData.location,
            mainPhoto: participantData.pictureURLs[0],
            ownerPicture: userData.profilePicture,
            awards: [
                { name: 'World', place: participantData.rank },
                { name: 'Region', place: participantData.regionRank },
                { name: 'Votes', place: participantData.votes },
            ],
            description: participantData.description,
            ownerName: userData.name,
            photos: photo,
            ownerId: participantData.ownerId,
            contestIdInProgress: participantData.contestIdInProgress,
            specie: participantData.specie,
            rank: participantData.rank,
            isRegistered: participantData.isRegistered,
        };

        for (let i = 1; i < participantData.pictureURLs.length; i++) {
            responseData.photos.push({
                id: i,
                imageSource: participantData.pictureURLs[i],
            });
        }

        return res.status(200).json(responseData);
    } catch (error) {
        return handleErrors(res, 'Une erreur est survenue lors de la récupération des informations du participant', 500);
    }
};

export const getLatestParticipantsByPage = async (req: Request, res: Response) => {
    try {
        const limitNumber = Number(req.query.limit) || 6;
        const lastItemId = String(req.query.lastItemId);
        const participantsCollection = db.collection(PARTICIPANTS_COLLECTION);

        let q = participantsCollection
            .where('isRegistered', '==', true)
            .orderBy('createdAt', 'desc');

        if (lastItemId !== '') {
            const startAfterDoc = await participantsCollection.doc(lastItemId).get();
            q = q.startAfter(startAfterDoc).limit(limitNumber);
        } else {
            q = q.limit(limitNumber);
        }

        const participantDocSnapshot = await q.get();
        const latestParticipants = participantDocSnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            place: doc.data().rank,
            votes: doc.data().votes,
            description: doc.data().description,
            pictureURL: doc.data().pictureURLs[0],
        }));

        const hasNextPage = participantDocSnapshot.docs.length === limitNumber ? true : false

        return res.status(200).json({ latestParticipants: latestParticipants, hasNextPage: hasNextPage });
    } catch (error) {
        return handleErrors(res, 'Une erreur est survenue lors de la récupération des derniers participants', 500);
    }
};

export const getLatestParticipants = async (req: Request, res: Response) => {
    try {
        const limitNumber = Number(req.query.limit) || 3;

        const participantCollection = db.collection(PARTICIPANTS_COLLECTION);
        const participantsQuery = participantCollection
            .where('isRegistered', '==', true)
            .orderBy('createdAt', 'desc')
            .limit(limitNumber);

        const participantDocSnapshot = await participantsQuery.get();

        const latestParticipants = participantDocSnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            place: doc.data().rank,
            votes: doc.data().votes,
            description: doc.data().description,
            pictureURL: doc.data().pictureURLs[0],
        }));
        const hasNextPage = participantDocSnapshot.docs.length === limitNumber ? true : false
        return res.status(200).json({ latestParticipants: latestParticipants, hasNextPage: hasNextPage });
    } catch (error) {
        return handleErrors(res, 'Une erreur est survenue lors de la récupération des derniers participants', 500);
    }
};

export const getParticipantsWithoutVote = async (req: Request, res: Response) => {
    try {
        const limitNumber = Number(req.query.limit) || 6;
        const lastItemId = String(req.query.lastItemId);

        const participantsCollection = db.collection(PARTICIPANTS_COLLECTION);
        let participantsQuery = participantsCollection
            .where('isRegistered', '==', true)
            .where('votes', '==', 0)
            .orderBy('rank')

        if (lastItemId !== '') {
            const startAfterDoc = await participantsCollection.doc(lastItemId).get();
            participantsQuery = participantsQuery.startAfter(startAfterDoc).limit(limitNumber);
        } else {
            participantsQuery = participantsQuery.limit(limitNumber);
        }
        const participantDocSnapshot = await participantsQuery.get();

        const participantsWithoutVotes = participantDocSnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            place: doc.data().rank,
            votes: doc.data().votes,
            description: doc.data().description,
            pictureURL: doc.data().pictureURLs[0],
        }));
        const hasNextPage = participantDocSnapshot.docs.length === limitNumber ? true : false
        return res.status(200).json({ participantsWithoutVotes: participantsWithoutVotes, hasNextPage: hasNextPage });
    } catch (error) {
        return handleErrors(res, 'Une erreur est survenue lors de la récupération des participants sans votes', 500);
    }
};

export const getParticipantByName = async (req: Request, res: Response) => {
    const name = req.query.name;

    try {
        const participantsCollection = db.collection(PARTICIPANTS_COLLECTION);
        const querySnapshot = await participantsCollection.where('name', '==', name).get();
        const participants: searchParticipant[] = [];

        if (querySnapshot.empty) return res.status(200).json(participants);

        const promises = querySnapshot.docs.map(async (participantDoc) => {
            const { name, votes, pictureURLs, ownerId, rank } = participantDoc.data();
            const userDocRef = db.collection(USERS_COLLECTION).doc(ownerId as string);
            const userDocSnapshot = await userDocRef.get();
            const userData = userDocSnapshot.data();

            participants.push({
                id: participantDoc.id,
                name: name,
                votes: votes,
                pictureURL: pictureURLs[0],
                place: rank,
                owner_name: userData?.name,
            });
        });

        await Promise.all(promises);

        return res.status(200).json(participants);
    } catch (error) {
        return handleErrors(res, 'Une erreur est survenue lors de la récupération des participants par nom', 500);
    }
};

export const getParticipantByFeatures = async (req: Request, res: Response) => {
    const specie = req.query.specie;
    const breed = req.query.breed;
    const region = req.query.region;
    const lastItemId = String(req.query.lastItemId);
    const limitNumber = Number(req.query.limit);

    try {
        const participantsCollection = db.collection(PARTICIPANTS_COLLECTION);
        let q = participantsCollection.where('specie', '==', specie);

        if (breed !== 'race') {
            q = q.where('breed', '==', breed);
        }

        if (region !== 'region') {
            q = q.where('location', '==', region);
        }

        if (lastItemId !== '') {
            const startAfterDoc = await participantsCollection.doc(lastItemId).get();
            q = q.orderBy('votes').startAfter(startAfterDoc).limit(limitNumber);
        } else {
            q = q.orderBy('votes').limit(limitNumber);
        }

        const participants: FeaturedGridListProps[] = [];
        const querySnapshot = await q.get();

        const promises = querySnapshot.docs.map(async (participantDoc) => {
            const { name, votes, pictureURLs, rank, prize, prizeVotes, isRegistered } = participantDoc.data();
            participants.push({
                id: participantDoc.id,
                name: name,
                totalVotes: votes,
                imageSource: pictureURLs[0],
                place: rank,
                prizeVotes: prizeVotes,
                prize: prize,
                isRegistered: isRegistered
            });
        });

        await Promise.all(promises);
        const hasNextPage = participants.length === limitNumber ? true : false
        return res.status(200).json({ participants: participants, hasNextPage: hasNextPage });

    } catch (error) {
        return handleErrors(res, 'Une erreur est survenue lors de la récupération des participants par caractéristiques', 500);
    }
};





export const getRandomParticipants = async (req: Request, res: Response) => {
    try {
        const participantId = req.query.participantId as string;

        const participantCollection = db.collection('Participants');
        const userCollection = db.collection('Users');

        const participantQuerySnapshot = await participantCollection.get();
        const numberOfParticipants = participantQuerySnapshot.size;

        let randomIndex = 0;
        if (numberOfParticipants > 5) {
            randomIndex = Math.floor(Math.random() * (numberOfParticipants - 5));
        }

        const q = participantCollection.orderBy('createdAt').startAt(randomIndex).limit(5);
        const querySnapshot = await q.get();

        const participants: RandomParticipants[] = [];

        const specifiedParticipantIndex = participantQuerySnapshot.docs.findIndex((doc) => doc.id === participantId);

        if (specifiedParticipantIndex !== -1) {
            participantQuerySnapshot.docs.splice(specifiedParticipantIndex, 1);
        } else {
            participantQuerySnapshot.docs.pop();
        }

        const promises = querySnapshot.docs.map(async (participantDoc) => {
            if (participantDoc.id !== participantId) {
                const { name, votes, pictureURLs, ownerId } = participantDoc.data();

                const userDocRef = userCollection.doc(ownerId as string);
                const userDocSnapshot = await userDocRef.get();

                if (!userDocSnapshot.exists) {
                    return res.status(404).json({ error: 'L\'utilisateur n\'existe pas' });
                }

                const userData = userDocSnapshot.data();

                if (!userData) {
                    return res.status(404).json({ error: 'Données du participant introuvables' });
                }

                participants.push({
                    userPicture: userData.profilePicture,
                    participantPicture: pictureURLs[0],
                    name,
                    byName: userData.name,
                    vote: votes,
                    participantId: participantDoc.id,

                });
            }
        });

        await Promise.all(promises);

        if (participants.length < 4 && numberOfParticipants <= 4) {
            return res.status(200).json(participants);
        }

        return res.status(200).json(participants);
    } catch (error) {

        return res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des informations des participants' });
    }
};