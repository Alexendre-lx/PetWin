import { useRef, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Image from 'next/image';
import styles from './petProfilePhotos.module.scss';
import { PetProfilePhotosProps } from './PetProfilePhotosProps.props';
import Slider from 'react-slick';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Share } from 'yet-another-react-lightbox/plugins';
import cn from 'classnames';
import ArrowCarousel from '@petwin/icons/arrowCarousel';

function PetProfilePhotos({ photoArray }: PetProfilePhotosProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | undefined>(
    undefined
  );
  const photosSlider = useRef<Slider | null>(null);

  const settings = {
    arrows: false,
    dots: false,
    slidesToShow: 6,
    slidesToScroll: 5,
    infinite: false,
    autoplay: false,
    speed: 500,
    swipe: true,
    focusOnSelect: false,
    rows: 1,
    adaptiveHSeven: true,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  const firstFourPhotos = photoArray.slice(0, 3);
  const firstSevenPhotos =
    photoArray.length > 6 ? photoArray.slice(0, 6) : photoArray;
  const lastPhoto = photoArray.length - 1;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxIndex(undefined);
  };

  const slides = photoArray.map((photo) => ({
    src: photo.imageSource,
    alt: 'animal-photos',
    width: 1920,
    height: 1080,
  }));

  return (
    <Row className={styles.PhotosContainer}>
      <div
        className={cn(styles.Arrow, styles.ArrowNext)}
        onClick={() => photosSlider?.current?.slickNext()}
      >
        <ArrowCarousel />
      </div>
      <div
        className={cn(styles.Arrow, styles.ArrowPrev)}
        onClick={() => photosSlider?.current?.slickPrev()}
      >
        <ArrowCarousel />
      </div>
      {firstFourPhotos.length !== 0 && (
        <Slider ref={photosSlider} className="d-block d-xl-none" {...settings}>
          {firstFourPhotos.map((photo, index) => (
            <Col xs={3} className={styles.PhotoCard} key={photo.id}>
              <Image
                src={photo.imageSource}
                alt={'animal-photos'}
                width={200}
                height={200}
                onClick={() => openLightbox(photo.id)}
              />
            </Col>
          ))}
          {photoArray.length > 3 && (
            <Col
              xs={3}
              className={cn(styles.PhotoCard, 'position-relative')}
              key={photoArray[lastPhoto].id}
            >
              <Image
                src={photoArray[lastPhoto].imageSource}
                width={200}
                height={200}
                alt={'animal-photos'}
              />
              <div
                className={cn(
                  'position-absolute bottom-0 top-0 left-0 right-0 m-auto d-flex justify-content-center align-items-center',
                  styles.PhotoOverlay
                )}
                onClick={() => openLightbox(photoArray[lastPhoto].id)}
              >
                <p>{`+ ${photoArray.length}`}</p>
              </div>
            </Col>
          )}
        </Slider>
      )}

      {firstSevenPhotos.length !== 0 && (
        <Row className="d-none d-xl-flex">
          {firstSevenPhotos.map((photo, index) => (
            <Col xs={1} className={styles.PhotoCard} key={photo.id}>
              <Image
                src={photo.imageSource}
                alt={'animal-photos'}
                width={200}
                height={200}
                onClick={() => openLightbox(photo.id)}
              />
            </Col>
          ))}
        </Row>
      )}

      <Lightbox
        slides={slides}
        open={lightboxOpen}
        index={lightboxIndex}
        close={closeLightbox}
        plugins={[Share]}
        styles={{
          navigationPrev: { left: '100px' },
          navigationNext: { right: '100px' },
          container: { backgroundColor: '#000000be' },
        }}
      />
    </Row>
  );
}

export default PetProfilePhotos;
