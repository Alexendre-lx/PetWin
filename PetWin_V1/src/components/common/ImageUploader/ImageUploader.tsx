import React, { useState, ChangeEvent, useRef } from 'react';
import style from './ImageUploader.module.scss';
import cn from 'classnames';
import Upload from '@petwin/icons/upload';
import Image from 'next/image';

const ImageUploader: React.FC = () => {
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const hiddenFileInput = useRef<HTMLInputElement | null>(null);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages: string[] = [];
            for (let i = 0; i < files.length; i++) {
                if (selectedImages.length < 8) {
                    newImages.push(URL.createObjectURL(files[i]));
                }
            }
            setSelectedImages([...selectedImages, ...newImages]);
        }
    };

    const handleImageRemove = (index: number) => {
        const updatedImages = [...selectedImages];
        updatedImages.splice(index, 1);
        setSelectedImages(updatedImages);
    };

    const handleClick = () => {
        hiddenFileInput.current?.click();
    };

    return (
        <div className={cn(style.imageUploader, 'w-full')}>
            <div className={style.imageCounter}>Images sélectionnées : {selectedImages.length}/8</div>
            <div className={style.imageGrid}>
                {selectedImages.map((image, index) => (
                    <div key={index} className={style.imageContainer}>
                        <Image src={image} alt="Selected" width={50} height={50}/>
                        <button onClick={() => handleImageRemove(index)}>Supprimer</button>
                    </div>
                ))}
            </div>
            {selectedImages.length < 8 && (
                <button className={cn(style.InputFileForm, 'w-full')} onClick={handleClick}>
                    <div className={style.Placeholder}>
                        <Upload />
                        <div>From Computer</div>
                    </div>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="invisible w-full h-full"
                        onChange={handleImageChange}
                        ref={hiddenFileInput}
                    />
                </button>
            )}
        </div>
    );
};

export default ImageUploader;
