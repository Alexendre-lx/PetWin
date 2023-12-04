import { Request, Response, NextFunction } from 'express';
import { auth as firebaseAuth, FirebaseError } from 'firebase-admin';


export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    const authToken: string | undefined = req.headers['authorization'] as string | undefined;
    const userId: string | undefined = (req.query.userId ?  req.query.userId  : req.body.userId) as string | undefined;
    const ownerId: string | undefined = req.query.ownerId as string | undefined;

    try {
      const ERROR_UNAUTHORIZED = { error: 'Unauthorized: Missing authToken' };
      const ERROR_FORBIDDEN_OWNER = { error: 'Forbidden: User does not have permission for ownerId' };
      const ERROR_FORBIDDEN_UID = { error: 'Forbidden: User ID does not match' };

      if (!authToken  || !userId ) {
        return res.status(403).json(ERROR_UNAUTHORIZED);
      }
  
      try {
        const authUser = await firebaseAuth().verifyIdToken(authToken);
        if (ownerId && authUser.uid !== ownerId) {
          return res.status(403).json(ERROR_FORBIDDEN_OWNER);
        }
        
        if (authUser.uid !== userId) {
          return res.status(403).json(ERROR_FORBIDDEN_UID);
        }
  
        next();
      } catch (verificationError: unknown) {
        if ((verificationError as FirebaseError).code === 'auth/id-token-expired') {
          return res.status(401).json({ error: 'Unauthorized: Token has expired' });
        }
  
        return res.status(401).json({ error: 'Unauthorized: Invalid authToken' });
      }
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized: Invalid authToken' });
    }
  };

 
  


export const errorGlobal = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({ error: 'Bad Request: Invalid JSON syntax' });
    }
    next(err); 
    res.status(500).json({ error: 'Internal Server Error' });
};
