import { Modal } from 'react-bootstrap';
import { SortModalProps } from './SortModalProps.props';
import { useState } from 'react';
import Button from '../Button/Button';
import SortIcon from '@petwin/icons/sortIcon';
import cn from 'classnames';
import styles from './sortModal.module.scss';

function SortModal({ handleSort, selectedSort }: SortModalProps) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function callBackHandleSort(event: React.MouseEvent<HTMLButtonElement>) {
    const innerHTML = event.currentTarget.innerHTML;
    handleSort(innerHTML);
    handleClose();
  }

  return (
    <div>
      <button
        onClick={handleShow}
        className={cn('bg-white p-2 p-md-3 rounded-circle', styles.SortButton)}
      >
        <SortIcon />
      </button>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        className={styles.SortModalContainer}
      >
        <Modal.Header className={styles.SortModalHeader}>
          <Modal.Title className={styles.SortModalTitle}>
            Filtrer par:
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.SortModalBody}>
          <button
            className={cn(
              styles.SortModalButton,
              'Vote +' === selectedSort && styles.SortModalButtonActive
            )}
            onClick={callBackHandleSort}
          >
            Vote +
          </button>
          <button
            className={cn(
              styles.SortModalButton,
              'Vote -' === selectedSort && styles.SortModalButtonActive
            )}
            onClick={callBackHandleSort}
          >
            Vote -
          </button>
          <button
            className={cn(
              styles.SortModalButton,
              'Recents' === selectedSort && styles.SortModalButtonActive
            )}
            onClick={callBackHandleSort}
          >
            Recents
          </button>
        </Modal.Body>
        <Modal.Footer className={styles.SortModalFooter}>
          <Button label="Fermer" onClick={handleClose} orange md />
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SortModal;
