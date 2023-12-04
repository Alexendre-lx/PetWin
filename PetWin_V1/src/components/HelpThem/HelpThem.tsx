import cn from 'classnames';
import styles from '@petwin/components/common/NewParticipant/newParticipant.module.scss';
import Participant from '@petwin/components/common/Participant/Participant';
import Button from '@petwin/components/common/Button/Button';
import Arrow from '@petwin/icons/arrow';
import Container from '@petwin/components/common/Container/Container';

interface ParticipantsProps {
  participants: {
    description: string;
    name: string;
    id: string;
    place: number;
    votes: number;
    pictureURL:string;
    isRegistered: boolean;

  }[];
}

function HelpThem({ participants }: ParticipantsProps) {
  return (
    <Container className={cn(styles.NewParticipantContainer, 'bg-white')}>
      <div className="row d-flex justify-content-center mb-6">
        <h2 className={cn('pt-4 pt-md-5 text-center')}>
        Aidez-les à obtenir leur premier vote
        </h2>
      </div>
      <div className={`row gap-y-4 mb-5  d-md-flex`}>
        {participants.map((participant, index) => (
          <div className={`col-12 col-md-4 col-xl-4`} key={index}>
            <Participant participant={participant} />
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-center pb-10 text-nowrap">
        <Button
          label="Voir tous les participants"
          source={'/new-participants'}
          icon={<Arrow />}
          orange
          big
        />
      </div>
    </Container>
  );
}

export default HelpThem;
