import React from 'react';
import cn from 'classnames';
import styles from './homeHero.module.scss';
import Button from '../common/Button/Button';
import ILoveMyPets from '@petwin/icons/ILoveMyPets';
import Arrow from '@petwin/icons/arrow';
import Container from '@petwin/components/common/Container/Container';

function HomeHero() {

  return (
    <Container className={cn(styles.HomeContainer)}>
      <div
        className={cn(
          styles.HomeWrapper,
          'flex-column-reverse flex-md-row pt-md-5 pt-0 mt-0'
        )}
      >
        <div className={cn(styles.HomeText, 'row m-0')}>
          <h1 className="col-12 pb-2 p-0"> Concours Photo Chiens et Chats</h1>
          <h3 className="col-12 col-md-11 p-0">
          Votre Chien ou votre chat est le plus Mignon ? Postez sa photo et inscrivez vous gratuitement, votez et remportez jusqu'à 2000€ ! 

          </h3>
        </div>
        <div
          className={cn(
            'd-flex d-md-block flex-row-reverse',
            styles.ILoveMyPetsWrapper
          )}
        >
          <ILoveMyPets />
        </div>
      </div>
      <div className={styles.ButtonContainer}>
        <Button
          label="Participer"
          source={'/participate'}
          icon={<Arrow />}
          big
        />
      </div>
    </Container>
  );
}

export default HomeHero;
