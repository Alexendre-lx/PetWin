import { StaticImageData } from 'next/image';

export interface PetProfilePhotosProps {
  photoArray: {
    id : number;
    imageSource: string;
  }[];
}
