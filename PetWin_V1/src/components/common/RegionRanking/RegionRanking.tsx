import Trophy from '@petwin/icons/trophy';
import Image from 'next/image';
import { RegionRankingProps } from '@petwin/components/common/RegionRanking/RegionRanking.props';

function RegionRanking({ rankingData }: { rankingData: RegionRankingProps[] }) {
  return (
    <div>
      {rankingData.map((el: RegionRankingProps, idx: number) => (
        <div className="d-flex" key={idx}>
          <Image
            src={el.imageSource}
            width={200}
            height={200}
            alt={el.country}
          />
          <div>
            <h4>{el.country}</h4>
            <div>
              <div>
                <Trophy />
                <p>{el.goldenVotes}</p>
              </div>
              <div>
                <Trophy />
                <p>{el.silverVotes}</p>
              </div>
              <div>
                <Trophy />
                <p>{el.bronzeVotes}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RegionRanking;
