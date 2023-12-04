import { Request, Response } from 'express';
import { db } from '../../index';

const token = 'sk_test_51O8no2HJ6LFTygo16h2KzTU4s7xeqAWGxXNeEJx05vu55m5m9OTU1i1P75TfZjJKqUfA2WL6dMtgQwuB9cYKnnCO00fwvwslSM'
interface CheckoutSessionData {
  error?: string; 
  url?: string; 
  sessionId?: string;
}
export const getCheckoutUrl = async (req: Request, res: Response): Promise<void> => {
  try {

    const userId = req.query.userId as string;
    const priceId = req.query.priceId as string;
    const participantId = req.query.participantId as string;
    const votes = Number(req.query.votes);
    const contestId = req.query.contestId as string;

    if (!userId || !priceId || !participantId) {
      res.status(400).json({ error: 'Missing required parameters in the request.' });
      return;
    }
    const docRef = await db
    .collection('customers')
    .doc(userId)
    .collection("checkout_sessions")
    .add({
      mode: "payment",
      price: priceId, 
      success_url: `http://localhost:3000/contestants/${participantId}`,
      cancel_url: `http://localhost:3000/`,
      metadata: {
        participantId: participantId,
        userId :userId,
        votes:votes,
        contestId: contestId
      },
    });
  
  docRef.onSnapshot((snap) => {
    const { error, url, sessionId } = snap.data() as CheckoutSessionData;
    if (error) {
      console.error(error);

      return res.status(500).json({ error: 'there is a probleme' })
    }
    if (url) {
      return res.status(200).json({ url: url, sessionId: sessionId})
    }
  })
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};