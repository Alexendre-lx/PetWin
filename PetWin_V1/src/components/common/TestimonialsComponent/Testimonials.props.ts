import { StaticImageData } from 'next/image';

export interface TestimonialsProps {
  imageSource: StaticImageData;
  name: string;
  rating: number;
  desc: string;
  contest: string;
  date: string;
  prize: string;
}
