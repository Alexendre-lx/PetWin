import cn from 'classnames';
import styles from './theyWon.module.scss';
import BigTrophy from '@petwin/images/bigTrophy.png';
import Image from 'next/image';
import Button from '@petwin/components/common/Button/Button';
import Arrow from '@petwin/icons/arrow';
import theyWonImage from '@petwin/images/theyWon.png';
import Star from '@petwin/icons/star';
import Slider from 'react-slick';
import { useEffect, useRef, useState } from 'react';
import ArrowCarousel from '@petwin/icons/arrowCarousel';
import Container from '@petwin/components/common/Container/Container';
import { v4 as uuidv4 } from 'uuid';

function TheyWon() {
  const [theyWonList, setTheyWonList] = useState<
    {
      name: string;
      desc: string;
      rank: number;
      avatar: string;
      prize: number;
      id: number;
    }[]
  >([]);

  const slider = useRef<Slider | null>(null);
  const smallSlider = useRef<Slider | null>(null);

  useEffect(() => {
    setTheyWonList([
      {
        name: 'Clara',
        desc: `Merci infiniment à tous vous avez étaient super!! J’ai reçu mon lot en quelques jours après validation. 
        Merci pour ce super site j’ai rencontré plein de superbe personne avec qui je peux parler de ma passion. Sans vous rien n’aurez était possible 💕`,
        prize: 100,
        avatar: '',
        rank: 5,
        id: 1,
      },
      {
        name: 'Yaya',
        desc: 'Bien, merci pour le concours.',
        prize: 100,
        avatar: '',
        rank: 5,
        id: 2,
      },
      {
        name: 'Sylvie',
        desc: 'Vraiment top, merci encore un super site ou on peut parler entre fan de loulou',
        prize: 100,
        avatar: '',
        rank: 5,
        id: 3,
      },
      {
        name: 'Louis',
        desc: 'Bonjour. Merci. Super.',
        prize: 100,
        avatar: '',
        rank: 5,
        id: 4,
      },
      {
        name: 'Caroline',
        desc: `J’adooore. Super concours très enrichissants et on se prend vite au jeu Lot reçu en presque moins de 24h. 
        Merci à Cécile et Manu !!!`,
        prize: 100,
        avatar: '',
        rank: 4,
        id: 5,
      },
      {
        name: 'Marie Louise',
        desc: `Très heureuse d’avoir gagné 100€. J’ai reçu le lendemain après avoir envoyé les papiers. Je rejoue avec les votes que j’ai en cadeau lol `,
        prize: 100,
        avatar: '',
        rank: 5,
        id: 6,
      }, {
        name: 'Charlene',
        desc: `Soir, concours très sympa tout le monde s’est pris au jeu dans la famille pour notre fripouille. Meme le bureau on était tous à fond pendant les quelques jours`,
        prize: 100,
        avatar: '',
        rank: 4,
        id: 7,
      }, {
        name: 'Delphine',
        desc: `Très heureuse d’avoir gagné 100€. J’ai reçu le lendemain après avoir envoyé les papiers. Je rejoue avec les votes que j’ai en cadeau lol `,
        prize: 100,
        avatar: '',
        rank: 5,
        id: 8,
      }, {
        name: 'Guillaume',
        desc: `Winner !!!! Très bien lot reçu rapidement 👍 `,
        prize: 100,
        avatar: '',
        rank: 5,
        id: 9,
      }, {
        name: 'Muriel',
        desc: `Reçu argent en 1j parfait, merci `,
        prize: 100,
        avatar: '',
        rank: 4,
        id: 10,
      }, {
        name: 'Nathalie',
        desc: `J’ai beaucoup aimé le concours. C’est la 4eme fois que je participe on devient vite Addict pour aller voir si tout va bien et qu’on garde notre place 🫣+ des gens super sympa, je recommande `,
        prize: 100,
        avatar: '',
        rank: 4,
        id: 11,
      }, {
        name: 'Justine',
        desc: `Bon site. Lot reçu rapidement. Equipe sérieuse si on a question. Top. Aurevoir `,
        prize: 100,
        avatar: '',
        rank: 5,
        id: 12,
      },
    ]);
  }, []);

  const settings = {
    arrows: false,
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
  };
  const settingsXs = {
    arrows: false,
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <Container className={cn(styles.TheyWonContainer, 'pt-md-5 pt-4')}>
      <div className="row d-flex justify-content-center mb-3 mt-md-5 mt-3">
        <Image
          className={styles.BigTrophy}
          src={BigTrophy}
          alt={'big-trophy'}
          width={100}
          height={100}
        />
        <h2 className={cn('pt-3 pt-md-6')}>ILS ONT GAGNÉ</h2>
      </div>
      <div
        className={cn(
          'd-none d-xl-block position-relative',
          styles.SliderWrapper
        )}
      >
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
        <Slider ref={slider} {...settings}>
          {theyWonList.map((winner) => (
            <div key={winner.id} className={styles.WinnerCardContainer}>
              <div className={cn(styles.WinnerCard)}>
                <div className={styles.ImageWrapper}>
                  <Image src={theyWonImage} alt={'they-won'} />
                  <div className={styles.WinnerPrize}>
                    <p>{winner.prize}€</p>
                  </div>
                </div>
                <div className={styles.Rank}>
                  {Array(winner.rank)
                    .fill(0)
                    .map(() => (
                      <Star key={uuidv4()} />
                    ))}
                </div>
                <div className={styles.Name}>{winner.name}</div>
                <div className={styles.Desc}>
                {winner.desc}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <div
        className={cn(
          'd-block d-xl-none position-relative',
          styles.SliderWrapper
        )}
      >
        <div className={styles.SliderArrowsContainerPrev}>
          <button
            className={cn(styles.SliderArrows, styles.Next)}
            onClick={() => smallSlider?.current?.slickPrev()}
          >
            <ArrowCarousel />
          </button>
        </div>
        <div className={styles.SliderArrowsContainerNext}>
          <button
            className={cn(styles.SliderArrows, styles.Prev)}
            onClick={() => smallSlider?.current?.slickNext()}
          >
            <ArrowCarousel />
          </button>
        </div>
        <Slider ref={smallSlider} {...settingsXs}>
          {theyWonList.map((winner) => (
            <div key={winner.id} className={styles.WinnerCardContainer}>
              <div className={cn(styles.WinnerCard)}>
                <div className={styles.ImageWrapper}>
                  <Image src={theyWonImage} alt={'they-won'} />
                  <div className={styles.WinnerPrize}>
                    <p>${winner.prize}</p>
                  </div>
                </div>
                <div className={styles.Rank}>
                  {Array(winner.rank)
                    .fill(0)
                    .map(() => (
                      <Star key={uuidv4()} />
                    ))}
                </div>
                <div className={styles.Name}>Name</div>
                <div className={styles.Desc}>
                  I love the seeing the different types of pets and getting to
                  know about them, it&apos;s also fu...
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <div className={styles.ButtonContainer}>
        <Button
          label={'Participer'}
          source={'/participate'}
          icon={<Arrow />}
          big
        />
      </div>
    </Container>
  );
}

export default TheyWon;
