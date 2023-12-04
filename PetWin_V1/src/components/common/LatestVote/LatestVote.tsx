import Slider from 'react-slick';
import cn from 'classnames';
import styles from './latestVote.module.scss';
import Arrow from '@petwin/icons/arrow';
import LatestVoteCard from './LatestVoteCard';

import { LatestVoteProps } from '@petwin/components/common/LatestVote/LatestVote.props';

function LatestVote({ orange, voteFor, votesData }: LatestVoteProps) {

  const settings = {
    arrows: false,
    dots: false,
    slidesToShow: 5,
    infinite: true,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    slidesToScroll: 1,
    cssEase: 'linear',
    rows: 1,
    pauseOnHover: true,
    adaptiveHeight: true,
    rtl: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };
  
  return (
    <div
      className={cn(
        'row p-0 m-0 w-100',
        styles.LatestVoteContainer,
        orange && styles.OrangeVote
      )}
    >
      <div
        className={cn(
          'col-3',
          styles.LatestVoteInfo,
          voteFor && styles.SmallInfo
        )}
      >
        Votes récents  {voteFor && `pour ${voteFor}`}
        <Arrow />
      </div>
      <div className={cn('col-12', styles.LatestVoteSlider)}>
        <Slider {...settings}>
          {votesData.map((vote) => (
            <LatestVoteCard
              key={vote.id}
              orange={orange}
              voted_for={vote.participantName}
              timestamp={vote.postedAt}
              avatar={vote.profilePicture}
              name={vote.voterName}
              id={vote.id}
            />
          ))}
        </Slider>


      </div>
    </div>
  );
}

export default LatestVote;
