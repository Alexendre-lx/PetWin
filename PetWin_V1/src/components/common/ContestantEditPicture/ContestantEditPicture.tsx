import styles from './ContestantEditPicture.module.scss';
import { Col, Modal, Row } from 'react-bootstrap';
import { ContestantEditPictureProps } from '@petwin/components/common/ContestantEditPicture/ContestantEditPictureProps.props'
import Button from '@petwin/components/common/Button/Button';
import React, { useState, useContext, useEffect, ChangeEvent, useRef } from 'react';
import { convertFile } from '@petwin/utils/convertFile';
import cn from 'classnames';
import { UserContext, UserContextType } from '@petwin/context/userContext';
import Image from 'next/image';
import axios from 'axios';


const ContestantEditPicture = ({
    openModal,
    handleClose,
    participantId,
    participantPictures,
    participantMainPicture,
    ownerId,
}: ContestantEditPictureProps) => {

    const [imagesfile, setImagesFile] = useState<File[]>([])
    const [newPhotoURL, setNewPhotoURL] = useState<string[]>([]);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [allParticipantPhotos, setAllParticipantPhotos] = useState<string[]>([])
    const hiddenFileInput = useRef<HTMLInputElement | null>(null);

    const { getUserToken, currentUser } = useContext(UserContext) as UserContextType;
    const [userToken, setUserToken] = useState<string>('')
    const [isError, setIsError] = useState<boolean>(false);
    const updateParticipantPicture = async (
    ) => {
        try {
            const response = await axios.post('http://localhost:8080/api/participants/updateParticipantPicture', {
                participantId,
                newPhotoURL,
                userId: ownerId,
                participantPhotos: allParticipantPhotos,
            }, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': userToken,
                },

            });

            if (!response.data) {
                setIsError(true)
            }

            return;
        } catch (error) {
            setIsError(true)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            if (currentUser) {
                const userToken = await getUserToken(currentUser);
                setUserToken(userToken)
            }
        };
        fetchData();
    }, [currentUser]);

    useEffect(() => {
        const imageSources = participantPictures?.map(photo => photo.imageSource);
        imageSources?.unshift(participantMainPicture)
        setAllParticipantPhotos(imageSources)
        setSelectedImages(imageSources)
        setNewPhotoURL(imageSources)
    }, [participantPictures]);

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImagesArray: string[] = [];
            const newImagesURLArray: string[] = [];
            const newImagesfile: File[] = [];
            for (let i = 0; i < files.length; i++) {
                if (newImagesArray.length < 4) {
                    newImagesArray.push(URL.createObjectURL(files[i]));
                    newImagesfile.push(files[i])
                    const url = await convertFile(files[i])
                    if (url) newImagesURLArray.push(url)

                }
            }
            setSelectedImages([...selectedImages, ...newImagesArray]);
            setImagesFile([...imagesfile, ...newImagesfile])
            setNewPhotoURL([...newPhotoURL, ...newImagesURLArray])
        }

    }
    const handleImageRemove = (index: number) => {
        const updatedImages = [...selectedImages];
        const updatedImagesFile = [...imagesfile];
        const updatedImagesURL = [...newPhotoURL];
        updatedImagesFile.splice(index, 1)
        updatedImages.splice(index, 1);
        updatedImagesURL.splice(index, 1);
        setSelectedImages(updatedImages);
        setImagesFile(updatedImagesFile);
        setNewPhotoURL(updatedImagesURL)
    };


    const handleUpdateParticipant = async () => {
        await updateParticipantPicture();
        handleClose();
    };

    return (
        <Modal
            show={openModal}
            onHide={handleClose}
            centered
            scrollable
            className={styles.Modal}
            size="lg"
        >
            <Modal.Header>
                <Modal.Title className={styles.ModalTitle}>
                    Modifier les photos
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <div className={cn(styles.imageUploader, 'w-full')}>
                        <div className={styles.imageCounter}>Images sélectionnées : {selectedImages?.length}/4</div>
                        <div className={styles.imageGrid}>
                            {selectedImages?.map((image, index) => (
                                <div key={index} className={styles.imageContainer}>
                                    <Image src={image} alt="Selected" width={100} height={100} />
                                    <button onClick={() => handleImageRemove(index)}>Supprimer</button>
                                </div>
                            ))}
                        </div>

                    </div>
                </Row>
                <Row>
                    <Col className={styles.InputForm}>
                        {selectedImages?.length < 4 && (
                            <>
                                <div className={styles.Label}>Avatar</div>
                                <input
                                    type="file"
                                    className={styles.Input}
                                    placeholder="Picture"
                                    onChange={handleImageChange}
                                    ref={hiddenFileInput}

                                />
                            </>
                        )}

                    </Col>

                </Row>

            </Modal.Body>
            <Modal.Footer className={styles.Footer}>
                <div className={styles.ButtonContainer}>
                    <Button md label="Annuler" onClick={handleClose} />
                    <Button orange md label="Sauvegarder" onClick={handleUpdateParticipant} />
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default ContestantEditPicture;
