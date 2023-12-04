import Image from 'next/image';
import styles from './testimonialsComponent.module.scss';
import Star from '@petwin/icons/star';
import { TestimonialsProps } from './Testimonials.props';
import cn from 'classnames';

function TestimonialsComponent({
  imageSource,
  name,
  rating,
  desc,
  contest,
  date,
  prize,
}: TestimonialsProps) {
  return (
    <div className="px-md-3 px-2 col-md-4 col-6 h-100 mb-4">
      <div
        className={cn(
          'p-md-4 p-2 rounded-3xl',
          styles.testimonialsComponentContainer
        )}
      >
        <div className={styles.testimonialsComponentItem}>
          <div className="position-relative">
            <Image
              className="rounded-xl"
              src={imageSource}
              alt="Pet Image"
            />
            <div
              className={cn(
                'bg-white position-absolute bottom-0 left-0 ml-2 mb-2',
                styles.testimonialsComponentPrize
              )}
            >
              <p className="m-auto py-1 px-md-4 px-2">{prize}</p>
            </div>
          </div>
          <h3>{name}</h3>
          <div className="d-flex flex-row">
            {Array(rating)
              .fill(null)
              .map((idx) => (
                <Star key={idx} />
              ))}
          </div>
          <p>{desc}</p>
          <div>
            <span>{contest}</span>
            <span>.</span>
            <span>{date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestimonialsComponent;
