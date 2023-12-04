import { Request, Response } from 'express';
import { db, storage } from '../../index';
import { imageToBytes } from '../../utils/convertFile';
import { changeParticipantRegion } from '../votesController/votesFunctions';


const handleErrors = (res: Response, errorMessage: string, status = 500) => {
  return res.status(status).json({ success: false, message: errorMessage });
};

const getUserDocRef = (userId: string) => db.collection('Users').doc(userId);

export const addUser = async (req: Request, res: Response) => {
  try {

    const { uid, email, registrationDate, userFirstName, userLastName }: { uid: string, email: string, registrationDate: string, userFirstName: string, userLastName: string } = req.body;
    const userDocRef = getUserDocRef(uid);

    await userDocRef.set({
      email,
      registrationDate,
      name: userLastName ? userFirstName + ' ' + userLastName : userFirstName,
      location: 'France',
      profilePicture: '',
      votesAvailable: 0,

    });

    return res.status(200).json({ message: 'Utilisateur inscrit avec succès' });
  } catch (error) {

    handleErrors(res, 'Erreur lors de l\'inscription', 500);
  }
};
export const addUserGoogleAndFacebook = async (req: Request, res: Response) => {
  try {

    const { uid, email, registrationDate, userFirstName }: { uid: string, email: string, registrationDate: string, userFirstName: string, userLastName: string } = req.body;
    const userDocRef = getUserDocRef(uid);

    await userDocRef.set({
      email,
      registrationDate,
      name: userFirstName,
      location: 'France',
      profilePicture: '',
      votesAvailable: 0,

    });

    return res.status(200).json({ message: 'Utilisateur inscrit avec succès' });
  } catch (error) {

    handleErrors(res, 'Erreur lors de l\'inscription', 500);
  }
};

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    const userDocRef = getUserDocRef(userId);
    const userDocSnapshot = await userDocRef.get();

    if (!userDocSnapshot.exists) return res.status(404).json({ error: 'L\'utilisateur n\'existe pas' });

    const userData = userDocSnapshot.data();

    if (!userData) return res.status(404).json({ error: 'Données de l\'utilisateur introuvables' });

    const responseData = {
      name: userData.name,
      location: userData.location,
      profilePicture: userData.profilePicture,
    };

    return res.status(200).json(responseData);
  } catch (error) {
    handleErrors(res, 'Erreur lors de la récupération des informations de l\'utilisateur', 500);
  }
};

export const getUserProfilePicture = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    const userDocRef = getUserDocRef(userId);
    const userDocSnapshot = await userDocRef.get();

    if (!userDocSnapshot.exists) return res.status(200).json(null);

    const userData = userDocSnapshot.data();

    if (!userData) return res.status(404).json({ error: 'Données de l\'utilisateur introuvables' });
    const data = {
      profilePicture: userData.profilePicture ? userData.profilePicture : null,
      name: userData.name ? userData.name : null
    }
    return res.status(200).json(data);
  } catch (error) {
    handleErrors(res, 'Erreur lors de la récupération des informations de l\'utilisateur', 500);
  }
};

export const uploadFile = async (uint8Array: Uint8Array, remoteFilePath: string) => {
  const bucket = storage.bucket();
  const file = bucket.file(remoteFilePath);
  const bufferData = Buffer.from(uint8Array);
  await file.save(bufferData);
  const [url] = await file.getSignedUrl({ action: 'read', expires: '01-01-2100' });
  return url;

};

function exctractPathFile(storageUrl: string): string | null {
  const regex = /\images\/[^?]+/;
  const match = storageUrl.match(regex);

  return match ? match[0] : null;
}

export async function deleteFileByStorageUrl(storageUrls: string[]) {
  storageUrls.map(async (storageUrl) => {
    const path = exctractPathFile(storageUrl);
    if (path) {
      const bucket = storage.bucket();
      await bucket.file(path).delete();
    }

  })
}

export const getParticipantIdByOwner = async (ownerId: string) => {
  try {
    const participants: string[] = [];
    const participantsCollection = db.collection('Participants');
    const querySnapshot = await participantsCollection.where('ownerId', '==', ownerId).get();

    if (querySnapshot.empty) return { success: false, message: 'L\'utilisateur n\'a pas d\'animaux' };

    querySnapshot.forEach((doc) => {
      participants.push(doc.id);
    });

    return { success: true, participants };
  } catch (error) {
    return { success: false, message: 'Une erreur est survenue lors de la récupération des participants.' };
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée. Utilisez la méthode PUT.' });

    const { userId, newName, newLocation, newPhotoURL } = req.body;
    const userDocRef = getUserDocRef(userId);
    const userDocSnapshot = await userDocRef.get();
    const updateData: { [key: string]: any } = {};
    const contestIds: string[] = [];

    if (newName) updateData.name = newName;
    if (newLocation !== 'region') {
      updateData.location = newLocation;
      const participantResult = await getParticipantIdByOwner(userId);
      const participants = participantResult?.participants || [];

      if (participants.length > 0) {
        await Promise.all(participants.map(async (participantId) => {
          const participantDocRef = db.collection('Participants').doc(participantId);
          const participantDocSnapshot = await participantDocRef.get();
          const participantData = participantDocSnapshot.data();
          if (participantData?.contestIdInProgress) {
            await participantDocRef.update({ location: newLocation });
            await updateRegionParticipantsContest(newLocation, participantId, participantData?.contestIdInProgress)
            const updateSucceeded = await changeParticipantRegion(
              participantData?.contestIdInProgress,
              participantId,
              participantData?.location,
              newLocation
            );
          }
          await participantDocRef.update({ location: newLocation });
          await updateRegionParticipantsContest(newLocation, participantId, participantData?.contestIdInProgress)
          const updateSucceeded = await changeParticipantRegion(
            participantData?.contestIdInProgress,
            participantId,
            participantData?.location,
            newLocation
          );

          if (updateSucceeded) contestIds.push(participantData?.contestIdInProgess);
        }));
      }
    }
    if (newPhotoURL) {
      const imageBytes = await imageToBytes(newPhotoURL);

      await uploadFile(imageBytes, `images/${userId}/profilePicture-${userId}`)
        .then((url) => {
          updateData.profilePicture = url;
        })
        .catch((error) => {
          return error
        });
    }

    if (userDocSnapshot.exists) {
      await userDocRef.update(updateData);
      return res.status(200).json({ message: 'Utilisateur mis à jour avec succès.', contestId: contestIds });
    } else {
      return res.status(404).json({ error: 'L\'utilisateur n\'existe pas.' });
    }
  } catch (error) {
    handleErrors(res, 'Une erreur est survenue lors de la mise à jour de l\'utilisateur', 500);
  }
};

export async function userExists(req: Request, res: Response) {
  const userId = req.query.userId as string
  try {
    const documentRef = db.collection('Users').doc(userId);
    const documentSnapshot = await documentRef.get();
    return documentSnapshot.exists;
  } catch (error) {
    return false;
  }
}

export const checkEmail = async (req: Request, res: Response) => {
  const email = req.query.email as string
  try {
    const usersRef = db.collection('Users');
    const snapshot = await usersRef.where('email', '==', email).get();
    return res.status(200).json(snapshot.empty);

  } catch (error) {
    return res.status(200).json(false);
  }
}

export const updateRegionParticipantsContest = async (newRegion: string, participantId: string, contestId: string) => {

  try {
    const contestDocRef = db.collection('Contests').doc(contestId);
    const contestDoc = await contestDocRef.get();

    if (!contestDoc.exists) {
      return {
        addSucceeded: false,
      };
    }
    const participantDocRef = contestDocRef.collection('ContestParticipants').doc(participantId);
    await participantDocRef.update({
      location: newRegion
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
