import Trophy from '@petwin/icons/trophy';
import styles from './prizes.module.scss';
import { PrizesProps } from './Prizes.props';
import Image from 'next/image';
import ArrowCarousel from '@petwin/icons/arrowCarousel';
import cn from 'classnames';
import TrophyLastPlaces from '../TrophyLastPlaces/TrophyLastPlaces';

function Prizes({ prizesData, handlePrizeOnClick , prizeWorld, prizeVotesWorld}: PrizesProps) {
  return (
    <div className="row gap-2 gap-xl-0">
      <div className="col-12 col-xl-6 d-flex flex-column align-items-center p-0">
        <div className={cn(styles.prizesSplitContainers, 'p-3 p-md-5 w-full')}>
          <div
            className={cn(
              'w-100 d-flex justify-content-center pt-3',
              styles.prizesSplitLabel
            )}
          >
            <h3>Concours Monde</h3>
          </div>
          <div className="row m-0">
            <div
              className={cn(
                'bg-white col-12 d-flex flex-column justify-content-center align-items-center my-3 py-3 py-md-5',
                styles.prizeTrophyContainer
              )}
            >
              <Trophy />
              <h4>1er monde</h4>
              <h6>{prizeWorld[0]}€</h6>
            </div>
            <div className="col-12 d-flex flex-row justify-content-between p-0">
              <div
                className={cn(
                  'bg-white col d-flex flex-column justify-content-center align-items-center mx-2 py-3 py-md-5',
                  styles.prizeTrophyContainer
                )}
              >
                <Trophy silver />
                <h4>2éme Monde</h4>
                <h5>{prizeWorld[1]}€</h5>
              </div>
              <div
                className={cn(
                  'bg-white col d-flex flex-column justify-content-center align-items-center mx-2 py-3 py-md-5',
                  styles.prizeTrophyContainer
                )}
              >
                <Trophy bronze />
                <h4>3éme Monde</h4>
                <h5>{prizeWorld[2]}€</h5>
              </div>
              <div
                className={cn(
                  'bg-white col d-flex flex-column justify-content-center align-items-center mx-2 py-3 py-md-5',
                  styles.prizeTrophyContainer
                )}
              >
                <Trophy blue />
                <h4>4éme Monde</h4>
                <h5>{prizeWorld[3]}€</h5>
              </div>
            </div>
          </div>
          <div className="row pt-4">
            <TrophyLastPlaces place="5-30éme" prize={prizeWorld[4]} />
          </div>
        </div>
      </div>
      <div className="col-12 col-xl-6 p-0">
        <div
          className={cn(
            styles.prizesSplitContainers,
            'p-3 ms-xl-5 ms-0 p-md-5'
          )}
        >
          <div
            className={cn(
              'd-flex justify-content-center pt-3',
              styles.prizesSplitLabel
            )}
          >
            <h3>Classement Par Région</h3>
          </div>
          <div className="row py-0 pt-3">
            <div className="d-flex flex-column gap-2">
              {prizesData.map((prize: any, idx) => (
                <div
                  key={idx}
                  className="rounded-lg m-auto row d-flex justify-content-between border py-1 border-gray-300 col-12 bg-white"
                >
                  <div className="d-flex flex-row col-11 p-0 p-md-2">
                    <div
                      className={cn(
                        'd-flex justify-content-center align-items-center mr-2 ml-2'
                      )}
                    >
                      <div className={cn(styles.regionRankingImage)}>
                        <Image
                          className="p-2 p-md-0"
                          src={prize.imageSource}
                          alt={prize.key}
                          width={100}
                          height={100}
                        />
                      </div>
                    </div>
                    <div className="d-flex flex-column justify-content-center col text-[16px]">
                      <p className={styles.countryName}>{prize.value}</p>
                      <div
                        className={cn(
                          'd-flex flex-row g m-0',
                          styles.trophyVotesList
                        )}
                      >
                        <div className={cn('d-flex m-0', styles.TrophyWrapper)}>
                          <Trophy />
                          <div className="m-0 d-flex flex-row gap-1">
                            <div className={styles.TrophyVotes}>
                              {prize.goldenVotes}
                            </div>
                            <div className={styles.TrophyVotes}> | votes</div>
                          </div>
                        </div>
                        <div className={cn('m-0', styles.TrophyWrapper)}>
                          <Trophy silver />
                          <div className="m-0 d-flex flex-row gap-1">
                            <div className={styles.TrophyVotes}>
                              {prize.silverVotes}
                            </div>
                            <div className={styles.TrophyVotes}> | votes</div>
                          </div>
                        </div>
                        <div className={cn('d-flex m-0', styles.TrophyWrapper)}>
                          <Trophy bronze />
                          <div className="m-0 d-flex flex-row gap-1">
                            <div className={styles.TrophyVotes}>
                              {prize.bronzeVotes}
                            </div>
                            <div className={styles.TrophyVotes}> | votes</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={cn(
                      'col-1 d-flex justify-content-center align-items-center'
                    )}
                  >
                    <button
                      className={cn(styles.ArrowWrapper)}
                      onClick={() => handlePrizeOnClick(prize.key)}
                    >
                      <ArrowCarousel />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Prizes;
