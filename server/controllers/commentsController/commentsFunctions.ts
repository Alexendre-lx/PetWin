import { Request, Response } from 'express';
import { db } from '../../index';
import { FieldValue } from 'firebase-admin/firestore';
import { formatRelativeTime } from '../../utils/FormatDate';

const getUserData = async (userId: string) => {
  const snapshot = await db.collection('Users').doc(userId).get();
  return snapshot.data();
};

const getParticipantData = async (participantId: string) => {
  const snapshot = await db.collection('Participants').doc(participantId).get();
  return snapshot.data();
};

const addCommentToFirestore = async (data: any) => {
  const commentRef = db.collection('Comments').doc();
  await commentRef.set(data);
  return commentRef.id;
};

const getCommentsQuery = async (participantId: string, limitNumber: number, lastItemId: string) => {
  const baseQuery = db.collection('Comments').where('participantId', '==', participantId);

  if (lastItemId !== '') {
    const startAfterDocSnapshot = await db.collection('Comments').doc(lastItemId).get();
    return baseQuery.orderBy('postedAt', 'desc').startAfter(startAfterDocSnapshot).limit(limitNumber);

  } else {
    
    return baseQuery.orderBy('postedAt', 'desc').limit(limitNumber);
  }
};


const updateCommentLikes = async (commentId: string, userId: string) => {
  const commentRef = db.collection('Comments').doc(commentId);

  return db.runTransaction(async (transaction) => {
    const commentSnapshot = await transaction.get(commentRef);
    const commentData = commentSnapshot.data();

    if (!commentData) {
      throw new Error('Le commentaire n\'existe pas.');
    }


    const updatedLikes = commentData.like + 1;
    const updatedLikesPeople = [...(commentData.likesPeople || []), userId];

    transaction.update(commentRef, { like: updatedLikes, likesPeople: updatedLikesPeople });

    return updatedLikes;
  });
};

const updateCommentUnLikes = async (commentId: string, userId: string) => {
  const commentRef = db.collection('Comments').doc(commentId);

  return db.runTransaction(async (transaction) => {
    const commentSnapshot = await transaction.get(commentRef);
    const commentData = commentSnapshot.data();

    if (!commentData) {
      throw new Error('Le commentaire n\'existe pas.');
    }

    const updatedLikes = commentData.like - 1;
    const updatedLikesPeople = (commentData.likesPeople || []).filter((id: string) => id !== userId);

    transaction.update(commentRef, { like: updatedLikes, likesPeople: updatedLikesPeople });

    return updatedLikes;
  });
};




export const addComment = async (req: Request, res: Response) => {
  const { participantId, userId, comment } = req.body;

  try {
    const [authorData, participantData] = await Promise.all([
      getUserData(userId),
      getParticipantData(participantId),
    ]);

    const commentId = await addCommentToFirestore({
      participantId,
      participantOwnerId: participantData?.ownerId,
      authorId: userId,
      authorName: authorData?.name,
      comment,
      postedAt: FieldValue.serverTimestamp(),
      likesPeople: [],
      like: 0,
      authorPicture: authorData?.profilePicture,
    });

    return res.status(200).json({ success: true, commentId });
  } catch (error) {
    return res.status(500).json({ error: 'Une erreur s\'est produite lors de la création du commentaire.' })
  }
};

export const getCommentsForParticipant = async (req: Request, res: Response) => {
  const participantId = req.query.participantId as string;
  const limitNumber = Number(req.query.limit) || 6;
  const lastItemId = String(req.query.lastItemId);
  try {
    const q = getCommentsQuery(participantId, limitNumber, lastItemId);
    const querySnapshot = await (await q).get();

    const comments = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      postedAt: formatRelativeTime(doc.data().postedAt.seconds),
      comment: doc.data().comment,
      authorName: doc.data().authorName,
      like: doc.data().like,
      authorPicture: doc.data().authorPicture,
      likesPeople: doc.data().likesPeople,
    }));
    const hasNextPage = querySnapshot.docs.length === 10 ? true : false
    return res.status(200).json({ comments: comments, hasNextPage: hasNextPage });
  } catch (error) {
    return res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération des commentaires.' })
  }
};

const handleCommentLike = async (
  req: Request,
  res: Response,
  updateFunction: (commentId: string, userId: string) => Promise<number>,
  successMessage: string
) => {
  const { commentId, userId } = req.body;

  try {
    const updatedLikes = await updateFunction(commentId, userId);
    return res.status(200).json({ success: true, likes: updatedLikes });
  } catch (error) {
    return res.status(500).json({ error: `Une erreur s'est produite lors de la mise à jour du ${successMessage}` })
  }
};

export const likeComment = async (req: Request, res: Response) => {
  handleCommentLike(req, res, updateCommentLikes, 'like du commentaire.');
};

export const unlikeComment = async (req: Request, res: Response) => {
  handleCommentLike(req, res, updateCommentUnLikes, 'unlike du commentaire.');
};
