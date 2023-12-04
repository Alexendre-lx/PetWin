import { Modal } from 'react-bootstrap';
import styles from './MessageModal.module.scss';
import React from 'react';
import { MessageModalProps } from '@petwin/components/common/MessageModal/MessageModalProps.props';


const MessageModal = ({
  openModal,
  handleCancel,
  content,
}: MessageModalProps) => {
  return (
    <Modal
      show={openModal}
      onHide={handleCancel}
      centered
      className={styles.Modal}
      size="sm"
    >
      <Modal.Body>
 
        <div className={styles.Congratulations}>Oupss!</div>
        <div className={styles.Content}>{content}</div>
      </Modal.Body>
    </Modal>
  );
};

export default MessageModal;
