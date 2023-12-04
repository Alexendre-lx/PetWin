import Image from 'next/image';
import { ParticipantProps } from './ProfileMyPet.props';
import cn from 'classnames';
import styles from './ProfileMyPet.module.scss';
import Trophy from '@petwin/icons/trophy';
import { useRouter } from 'next/router';

function ProfileMyPet({ participant }: ParticipantProps) {


    const router = useRouter();

    function goTo() {
        router.push(`/contestants/${participant.id}`);
    }

    return (
        <div
            className={cn(
                `position-relative`,
                styles.FeaturedContainer,
            )}
            onClick={goTo}
        >
            <div className={styles.DarkenImage}>
                <Image src={participant.pictureURL} alt={participant.name} width={250} height={250}/>
            </div>
            <div
                className={cn(
                    'position-absolute bottom-0 left-0 z-2 m-3 m-md-4',
                    styles.FeaturedImageInfo
                )}
            >

                {!participant.isRegistered ? (
                    <h4>{participant.name}</h4>
                ) : (
                    <>
                        <div className="d-flex items-center">
                            <h4 className="mr-10"> {participant.name} |</h4>
                            <p> {participant.votes} votes</p>
                        </div>

                        <div className="d-flex gap-1">
                            <Trophy />
                            <p>  {participant.place} Monde </p>
                        </div>
                        <div className="d-flex gap-1">
                            <Trophy />
                            <p>  {participant.placeRegion} Région</p>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}

export default ProfileMyPet;
