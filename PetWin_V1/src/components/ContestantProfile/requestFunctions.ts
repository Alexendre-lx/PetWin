import axios from 'axios';
import { LatestVoteProps } from '@petwin/components/common/LatestVote/LatestVote.props';
import { ContestantSliderItemProps } from '@petwin/components/common/ContestantSliderItem/ContestantSliderItemProps.props';

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
    isRegistered: boolean
}

interface Comment {
    id: string;
    authorName: string;
    comment: string;
    postedAt: string;
    like: number;
    authorPicture: string;
    likesPeople: string[];
}

interface NextPreviousParticipant {
    hasParticipant: boolean;
    participantId: string;
}

interface PaginatedCommentResponse {
    comments: Comment[];
    hasNextPage: boolean;
  }
export async function fetchParticipantInfo(participantId: string): Promise<ParticipantInfoResponse> {
    try {
        const response = await axios.get(
            `http://localhost:8080/api/participants/getParticipantInfo`,
            {
                params: { participantId: participantId },
            }
        );
        if (!response.data) {
            throw new Error('Erreur lors de la requête');
        }
        return response.data;
    } catch (error : any) {
        return error;
    }
}

export async function fetchRandomParticipant(participantId: string): Promise<ContestantSliderItemProps[]> {
    try {
        const response = await axios.get(
            `http://localhost:8080/api/participants/getRandomParticipants`,
            {
                params: { participantId: participantId },
            }
        );
        if (!response.data) {
            throw new Error('Erreur lors de la requête');
        }
        return response.data;
    } catch (error : any) {
        return error;
    }
}

export async function fetchVotesForParticipant(participantId: string): Promise<LatestVoteProps['votesData']> {
    try {
        const response = await axios.get(
            `http://localhost:8080/api/votes/recentVotesForParticipant`,
            {
                params: { participantId: participantId, limit: 25 },
            }
        );
        if (!response.data) {
            throw new Error('Erreur lors de la requête');
        }
        return response.data;
    } catch (error : any) {
        return error;
    }
}

export async function fetchComments(
    participantId: string,
    lastItemId: string
): Promise<PaginatedCommentResponse> {
    try {
        const response = await axios.get(
            `http://localhost:8080/api/comments/getCommentsForParticipant`,
            {
                params: {
                    participantId: participantId,
                    lastItemId: lastItemId,
                    limit: 10,
                },
            }
        );
        if (!response.data) {
            throw new Error('Erreur lors de la requête');
        }
        return response.data;
    } catch (error : any) {
        return error;
    }
}

export async function addComments(
    participantId: string,
    userId: string,
    comment: string,
    userToken: string
): Promise<{ message?: string; error?: string; commentId?: string }> {
    try {
        const response = await axios.post('http://localhost:8080/api/comments/addComment', {
            participantId,
            userId,
            comment,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': userToken,
            },
        });

        if (!response.data) {
            throw new Error('Failed to add a comment');
        }

        return response.data;
    } catch (error : any) {
        return error;
    }
}

export async function likeComment(
    commentId: string,
    userId: string,
    userToken: string
): Promise<{ message?: string; error?: string }> {
    try {
        const response = await axios.post('http://localhost:8080/api/comments/likeComment', {
            commentId,
            userId,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': userToken,
            },
        });

        if (!response.data) {
            throw new Error('Failed to like a comment');
        }

        return response.data;
    } catch (error : any) {
        return error;
    }
}

export async function unlikeComment(
    commentId: string,
    userId: string,
    userToken: string
): Promise<{ message?: string; error?: string }> {
    try {
        const response = await axios.post('http://localhost:8080/api/comments/unlikeComment', {
            commentId,
            userId,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': userToken,
            },
        });

        if (!response.data) {
            throw new Error('Failed to unlike a comment');
        }

        return response.data;
    } catch (error : any) {
        return error;
    }
}

export async function addVote(
    contestId: string,
    participantId: string,
    userId: string,
    votes: number,
    userToken: string
) {
    try {
        const response = await axios.post('http://localhost:8080/api/votes/addVote', {
            contestId: contestId,
            participantId,
            userId,
            votes,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': userToken,
            },
        });

        if (!response.data) {
            throw new Error('Failed to add votes');
        }

        return response.data;
    } catch (error : any) {
        return error;
    }
}
