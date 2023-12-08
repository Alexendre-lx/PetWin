import styles from '@petwin/components/Profile/profile.module.scss';
import { Col, Row } from 'react-bootstrap';
import Add from '@petwin/icons/add';
import Button from '@petwin/components/common/Button/Button';
import Slider from 'react-slick';
import cn from 'classnames';
import { ProfileSectionProps } from './ProfileSection.props';
import { useRef } from 'react';
import ArrowCarousel from '@petwin/icons/arrowCarousel';
import { useRouter } from 'next/router';
import ProfileMyPet from '@petwin/components/Profile/components/ProfileSection/ProfileMyPet/ProfileMyPet';
import Image from 'next/image';
const ProfileSection = ({ animalCardsList, participantsVotesByOwner }: ProfileSectionProps) => {
  const slider = useRef<Slider | null>(null);

  const router = useRouter();

  function goRegister() {
    router.push('/participate');
  }
  return (
    <>
      <div className={styles.SectionContainer}>
        <div className={styles.SectionWrapper}>
          <div className={styles.Title}>Mes animaux</div>
          <div className="position-relative d-block d-xl-none">
            <div className={styles.SliderArrowsContainerPrev}>
              <button
                className={cn(styles.SliderArrows, styles.Next)}
                onClick={() => slider?.current?.slickPrev()}
              >
                <ArrowCarousel />
              </button>
            </div>
            <div className={styles.SliderArrowsContainerNext}>
              <button
                className={cn(styles.SliderArrows, styles.Prev)}
                onClick={() => slider?.current?.slickNext()}
              >
                <ArrowCarousel />
              </button>
            </div>
            <Slider ref={slider}>
              {animalCardsList.map((animal) => (
                <div className={`p-1 ${styles.AnimalCard}`} key={animal.id}>
                  <ProfileMyPet key={animal.id} participant={animal} />
                  <div className={styles.ParticipateButton}>
                    {animal.isRegistered ? (
                      <Button orange disabled md label="Participer" onClick={goRegister} />
                    ) : (
                      <Button orange md label="Participer" onClick={goRegister} />
                    )}

                  </div>

                </div>
              ))}
              <div className={cn(styles.AnimalCardsWrapper, 'px-1')}>
                <Col className={styles.AnimalCard}>
                  <div className={styles.AddIcon}>
                    <Add />
                  </div>
                  <div className={styles.ParticipateButton}>
                    <Button
                      orange
                      md
                      label="Participer"
                      onClick={goRegister}
                    />
                  </div>
                </Col>
              </div>
            </Slider>
          </div>
          <Row className={cn(styles.AnimalCardsWrapper, 'd-none d-xl-flex')}>
            {animalCardsList.map((animal) => (
              <div className={`p-1 ${styles.AnimalCard}`} key={animal.id}>
                <ProfileMyPet key={animal.id} participant={animal} />
                <div className={styles.ParticipateButton}>
                  {animal.isRegistered ? (
                    <Button orange disabled md label="Participer" onClick={goRegister} />
                  ) : (
                    <Button orange md label="Participer" onClick={goRegister} />
                  )}

                </div>

              </div>
            ))}
            <div className={`p-1 ${styles.AnimalCard}`}>
              <div className={styles.AddIcon}><Add /></div>
              <div className={styles.ParticipateButton}>
                <Button orange md label="Participer" onClick={goRegister} />
              </div>
            </div>
          </Row>


        </div>
      </div >
      <div className={styles.SectionContainer}>
        <div className={styles.SectionWrapper}>
        <div className={styles.Title}>Votes récents</div>
          {participantsVotesByOwner.length === 0 ? (
            <>
             
              <div className={styles.NoData}>pas de vote aujourd'hui</div>
            </>

          ) : (
            <Row className={styles.RecentVotesWrapper}>
              <div className="position-relative d-block d-md-none">
                <div className={styles.SliderArrowsContainerPrev}>
                  <button
                    className={cn(styles.SliderArrows, styles.Next)}
                    onClick={() => slider?.current?.slickPrev()}
                  >
                    <ArrowCarousel />
                  </button>
                </div>
                <div className={styles.SliderArrowsContainerNext}>
                  <button
                    className={cn(styles.SliderArrows, styles.Prev)}
                    onClick={() => slider?.current?.slickNext()}
                  >
                    <ArrowCarousel />
                  </button>
                </div>
                <Slider ref={slider}>
                  {participantsVotesByOwner.map((votes) => (
                    <div
                      key={votes.id}
                      className={cn(
                        styles.RecentVoteCard,
                        'd-flex flex-row justify-content-between px-4'
                      )}
                    >
                      <div className={styles.Avatar}>
                        <Image src={votes.profilePicture} width={35} height={35} alt={'avatar'} />
                      </div>
                      <div className={styles.PersonalInfo}>
                        <div className={styles.Name}>{votes.voterName} a voté pour {votes.participantName}</div>
                        <div className={styles.Timestamp}>{votes.postedAt}</div>
                      </div>
                      <div className={styles.Place}>{votes.votes}</div>
                    </div>
                  ))}
                </Slider>
                </div>
              <div className="d-none d-md-flex gap-4">
                {participantsVotesByOwner?.map((votes) => (
                  <Col key={votes.id} className={styles.RecentVoteCard}>
                    <div className={styles.Avatar}>
                      <Image src={votes.profilePicture} width={35} height={35} alt={'avatar'} />
                    </div>
                    <div className={styles.PersonalInfo}>
                      <div className={styles.Name}>{votes.voterName} a voté pour {votes.participantName}</div>
                      <div className={styles.Timestamp}>{votes.postedAt}</div>
                    </div>
                    <div className={styles.Place}>{votes.votes}</div>
                  </Col>
                ))}
              </div>
            </Row>
             )
          }

        </div>
      </div>
      {/*<div className={styles.SectionContainer} id="notifications">
        <div className={styles.SectionWrapper}>
          <div className={styles.Title}>Notifications</div>
          <div className={styles.NoData}>No new notifications today</div>
        </div>
      </div>
      <div className={styles.SectionContainer}>
        <div className={styles.SectionWrapper}>
          <div className={styles.Title}>Activities</div>
          <div className={styles.NoData}>No activities</div>
        </div>
      </div>*/}
    </>
  );
};

export default ProfileSection;
