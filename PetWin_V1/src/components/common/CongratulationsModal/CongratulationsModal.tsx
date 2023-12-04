import { Modal } from 'react-bootstrap';
import styles from './CongratulationsModal.module.scss';
import React from 'react';
import { CongratulationsModalProps } from '@petwin/components/common/CongratulationsModal/CongratulationsModal.props';
import Check from '@petwin/icons/check';

const CongratulationsModal = ({
  openModal,
  handleCancel,
  content,
}: CongratulationsModalProps) => {
  return (
    <Modal
      show={openModal}
      onHide={handleCancel}
      centered
      className={styles.Modal}
      size="sm"
    >
      <Modal.Body>
        <div className={styles.CheckMarkWrapper}>
          <Check />
        </div>
        <div className={styles.Congratulations}>Congratulations!</div>
        <div className={styles.Content}>{content}</div>
      </Modal.Body>
    </Modal>
  );
};

export default CongratulationsModal;
