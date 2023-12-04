import { RegisterToWinProps } from '@petwin/components/common/RegisterToWin/RegisterToWin.props';
import { Col, Row } from 'react-bootstrap';
import Image from 'next/image';
import styles from './RegisterToWin.module.scss';
import Button from '@petwin/components/common/Button/Button';
import Arrow from '@petwin/icons/arrow';
import Meow from '@petwin/icons/meow';
import cn from 'classnames';
import Woof from '@petwin/icons/woof';

const RegisterToWin = ({
  right,
  src,
  content,
  dogIcon,
}: RegisterToWinProps) => {
  return (
    <section className={styles.RegisterToWin}>
      <Row className={cn(`d-flex flex-column flex-xxl-row m-0`)}>
        <Col sm={{ order: right ? 2 : 1 }} className={styles.ImageContainer}>
          {!dogIcon ? (
            <div className={cn(styles.MeowInnerIcon, 'd-block d-xxl-none')}>
              <Meow />
            </div>
          ) : (
            <div
              className={cn(
                right ? styles.WoofInnerIcon : styles.LeftWoofInnerIcon,
                'd-block d-xxl-none'
              )}
            >
              <Woof />
            </div>
          )}
          <Image src={src} alt={'registerToWin'} width={500} height={500} />
        </Col>
        <Col
          sm={{ order: right ? 1 : 2 }}
          className={cn(
            styles.ContentContainer,
            right && styles.OrangeContent,
            'd-flex justify-content-center align-items-center'
          )}
        >
          <div
            className={cn(
              styles.ContentWrapper,
              'd-flex flex-column justify-content-md-start align-items-md-start justify-content-center text-center text-md-start align-items-center'
            )}
          >
            {!dogIcon ? (
              <div className={cn(styles.MeowIcon, 'd-none d-xxl-block z-5')}>
                <Meow />
              </div>
            ) : (
              <div
                className={cn(
                  right ? styles.WoofIcon : styles.LeftWoofIcon,
                  'd-none d-xxl-block z-5'
                )}
              >
                <Woof />
              </div>
            )}
            <div className={cn(styles.Content, 'mb-2 mb-md-4')}>{content}</div>
            <Button
              label={'Participer'}
              source={'/participate'}
              icon={<Arrow />}
              orange={!right}
              big
            />
          </div>
        </Col>
      </Row>
    </section>
  );
};

export default RegisterToWin;
