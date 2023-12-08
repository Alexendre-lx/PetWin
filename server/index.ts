import express from 'express';
import routerVotes from './controllers/votesController/votes';
import routerComments from './controllers/commentsController/comments';
import routerContests from './controllers/contestsController/contests';
import routerParticipants from './controllers/participantsController/participants';
import routerUser from './controllers/usersController/users';
import routerStripe from './controllers/stripeController/stripe';
import * as admin from 'firebase-admin';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorGlobal } from './middleware';
import http from 'http';
import { addVote } from './controllers/votesController/votesFunctions'


const serviceAccount = require("./Credentials.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "petwin-v2.appspot.com",
  });
}

export const db = admin.firestore();
export const storage = admin.storage();


const app = express();
const port = 8080;

const server = http.createServer(app);

app.use(cors());
/*
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api/', apiLimiter);
*/ 
app.use(express.json({ limit: '10mb' }))


app.use(helmet());
app.use(errorGlobal);


app.use('/api/votes', routerVotes);
app.use('/api/comments', routerComments);
app.use('/api/contests', routerContests);
app.use('/api/participants', routerParticipants);
app.use('/api/users', routerUser);
app.use('/api/stripe', routerStripe);


app.post('/stripe-webhook', express.json({ type: 'application/json' }), async (req, res) => {
  const event = req.body;

  try {

    switch (event.type) {
      case 'payment_intent.succeeded':
        const session = event.data.object;
        const { contestId, participantId, userId, votes } = session.metadata
        await addVote(contestId, participantId, userId, votes)
        res.status(200).end();
        break;


      default:
        break
    }
  } catch (err) {
    console.log(err)
    res.status(400).end();
  }
});



server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});