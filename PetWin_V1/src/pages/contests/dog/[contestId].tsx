import AnimalContest from '@petwin/components/common/AnimalContest/AnimalContest';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Loader } from '@petwin/components/common/Loader/Loader';
import ErreurComponent from '@petwin/components/Error/Error';
import axios from 'axios';
import { useState, useEffect } from 'react';

interface ContestInfo {
    name: string;
    date2: {
        formattedDate: string;
        daysLeft: string;
    }
    participants: number;
    amountToWin: number;
    prize: string[];
    prizeVotes: string[];
}

function DogContestPage() {

    const router = useRouter();
    const contestId = router.query.contestId as string;
    const [contestInfo, setContestInfo] = useState<ContestInfo>();
    const [isErrorContestInfo, setIsErrorContestInfo] = useState<boolean>(false);
    const [isLoadingContestInfo, setIsLoadingContestInfo] = useState<boolean>(true);


    const fetchContestInfo = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/contests/info?contestId=${contestId}`);
            setContestInfo(response.data);
            setIsLoadingContestInfo(false)
        } catch (error) {
            setIsErrorContestInfo(true);
        }
    };

    useEffect(() => {
        if (contestId) fetchContestInfo();
    }, [contestId]);

    if (isLoadingContestInfo ) return <Loader />;

    if (isErrorContestInfo) return <ErreurComponent onRetry={fetchContestInfo} />;
    return (
        <>
            <Head>
                <title>Coucours de Chien | PetWin</title>
            </Head>
            {contestInfo ? (
                <AnimalContest contestData={contestInfo} />
            ) : (
                <Loader />
            )}
        </>
    );
}

export default DogContestPage;

