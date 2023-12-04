import React, { FC, useEffect, useState } from 'react';
import cn from 'classnames';
import Button from '../common/Button/Button';
import Arrow from '@petwin/icons/arrow';
import styles from './Error.module.scss'; // Assurez-vous d'importer le fichier module.scss correct
import { useRouter } from 'next/router';

const ErreurComponent: FC<ErreurComponentProps> = ({ message, onRetry }) => {

    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("Une erreur est survenue, veuillez réessayer")
    const [labelButton, setLabelButton] = useState("Réessayer")

    const goBackHome = () => {
        router.push('/')
    }
    useEffect(() => {
        if (message = 'Vous n\'avez pas accès à cette page') {
            setErrorMessage(message);
            setLabelButton("Retourner à l'accueil")
        }
    }, [message])
    return (
        <div className={styles.Wrapper}>
            <div
                className={cn(
                    'row d-flex justify-content-center text-center pt-10 d-none d-md-block pb-md-3 pb-0',
                    styles.ContestsText
                )}
            >
                <h2>{errorMessage}</h2>
                {labelButton === "Retourner à l'accueil" ? (
                    onRetry && (
                        <div className={styles.ButtonContainer}>
                            <Button
                                big
                                className='with'
                                label={labelButton}
                                orange
                                icon={<Arrow />}
                            />
                        </div>
                    )
                ) : (
                    <div className={styles.ButtonContainer}>
                        <Button
                            big
                            className='with'
                            label={labelButton}
                            orange
                            icon={<Arrow />}
                            onClick={goBackHome}
                        />
                    </div>
                )}

            </div>
        </div>
    );
};

export default ErreurComponent;


