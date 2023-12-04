import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import styles from './featured.module.scss';
import Button from '@petwin/components/common/Button/Button';
import Arrow from '@petwin/icons/arrow';
import catContest6 from '@petwin/images/catContest4.png';
import catContest7 from '@petwin/images/catContest.png';
import catContest4 from '@petwin/images/catContest2.png';
import catContest5 from '@petwin/images/catContest3.png';
import catContest8 from '@petwin/images/catContest5.png';
import dogContest6 from '@petwin/images/dogContest6.png';
import dogContest7 from '@petwin/images/dogContest7.png';
import dogContest4 from '@petwin/images/dogContest4.png';
import dogContest5 from '@petwin/images/dogContest5.png';
import dogContest8 from '@petwin/images/dogContest8.png';
import FeaturedGridList from '../FeaturedGridList/FeaturedGridList';
import { v4 as uuidv4 } from 'uuid';
import ChoiceButton from '@petwin/components/common/ChoiceButton/ChoiceButton';
import Container from '@petwin/components/common/Container/Container';
import DropDown from '@petwin/icons/dropDown';
import { FeaturedGridListProps } from '@petwin/components/common/FeaturedGridList/FeaturedGridListProps.props';
import { Loader } from '../Loader/Loader';
import ErreurComponent from '@petwin/components/Error/Error';
import axios from 'axios';

interface FeaturedParticipants {
  participants : FeaturedGridListProps[];
  hasNextPage : boolean
}


function Featured() {

  const [tabValuesRegions, setTabValuesRegions] = useState<{ key: string; value: string }[]>([
    { key: 'region', value: 'Les Régions' },
    { key: 'auvergne-rhone-alpes', value: 'Auvergne-Rhône-Alpes' },
    { key: 'bourgogne-franche-comte', value: 'Bourgogne-Franche-Comté' },
    { key: 'bretagne', value: 'Bretagne' },
    { key: 'centre-val-de-loire', value: 'Centre-Val de Loire' },
    { key: 'corse', value: 'Corse' },
    { key: 'grand-est', value: 'Grand Est' },
    { key: 'hauts-de-france', value: 'Hauts-de-France' },
    { key: 'ile-de-france', value: 'Île-de-France' },
    { key: 'normandie', value: 'Normandie' },
    { key: 'nouvelle-aquitaine', value: 'Nouvelle-Aquitaine' },
    { key: 'occitanie', value: 'Occitanie' },
    { key: 'pays-de-la-loire', value: 'Pays de la Loire' },
    { key: 'provence-alpes-cote-d-azur', value: 'Provence-Alpes-Côte d\'Azur' },
    { key: 'outre-mer', value: 'Outre-Mer' },
    { key: 'canada', value: 'Canada' },
    { key: 'belgique', value: 'Belgique' },
    { key: 'suisse', value: 'Suisse' },
  ]);

  const [tabValuesDogSpecies, setTabValuesDogSpecies] = useState<{ key: string; value: string }[]>([
    { key: 'race', value: 'Les Races' },
    { key: 'affenpinscher', value: 'Affenpinscher' },
    { key: 'afghan-hound', value: 'Afghan Hound (Lévrier Afghan)' },
    { key: 'airedale-terrier', value: 'Airedale Terrier' },
    { key: 'akita-inu', value: 'Akita Inu' },
    { key: 'alaskan-malamute', value: 'Alaskan Malamute' },
    { key: 'american-bulldog', value: 'American Bulldog' },
    { key: 'american-bully', value: 'American Bully' },
    { key: 'american-cocker-spaniel', value: 'American Cocker Spaniel' },
    { key: 'american-eskimo-dog', value: 'American Eskimo Dog' },
    { key: 'american-pit-bull-terrier', value: 'American Pit Bull Terrier' },
    { key: 'american-staffordshire-terrier', value: 'American Staffordshire Terrier' },
    { key: 'american-water-spaniel', value: 'American Water Spaniel' },
    { key: 'anatolian-shepherd-dog', value: 'Anatolian Shepherd Dog' },
    { key: 'australian-cattle-dog', value: 'Australian Cattle Dog' },
    { key: 'australian-shepherd', value: 'Australian Shepherd' },
    { key: 'australian-terrier', value: 'Australian Terrier' },
    { key: 'basenji', value: 'Basenji' },
    { key: 'basset-hound', value: 'Basset Hound' },
    { key: 'beagle', value: 'Beagle' },
    { key: 'bearded-collie', value: 'Bearded Collie' },
    { key: 'beauceron', value: 'Beauceron' },
    { key: 'bedlington-terrier', value: 'Bedlington Terrier' },
    { key: 'belgian-malinois', value: 'Belgian Malinois' },
    { key: 'belgian-sheepdog', value: 'Belgian Sheepdog' },
    { key: 'belgian-tervuren', value: 'Belgian Tervuren' },
    { key: 'bernese-mountain-dog', value: 'Bernese Mountain Dog' },
    { key: 'bichon-frise', value: 'Bichon Frisé' },
    { key: 'bichon-havanais', value: 'Bichon Havanais' },
    { key: 'black-and-tan-coonhound', value: 'Black and Tan Coonhound' },
    { key: 'black-russian-terrier', value: 'Black Russian Terrier' },
    { key: 'bloodhound', value: 'Bloodhound' },
    { key: 'border-collie', value: 'Border Collie' },
    { key: 'border-terrier', value: 'Border Terrier' },
    { key: 'borzoi', value: 'Borzoi' },
    { key: 'boston-terrier', value: 'Boston Terrier' },
    { key: 'bouledogue-americain', value: 'Bouledogue Américain (American Bulldog)' },
    { key: 'bouledogue-francais', value: 'Bouledogue Français (French Bulldog)' },
    { key: 'bouledogue-ingles', value: 'Bouledogue Inglés (English Bulldog)' },
    { key: 'boxer', value: 'Boxer' },
    { key: 'boykin-spaniel', value: 'Boykin Spaniel' },
    { key: 'brabancon', value: 'Brabançon' },
    { key: 'briard', value: 'Briard' },
    { key: 'brittany-spaniel', value: 'Brittany Spaniel' },
    { key: 'bull-terrier', value: 'Bull Terrier' },
    { key: 'bulldog-anglais', value: 'Bulldog Anglais (English Bulldog)' },
    { key: 'bulldog-australien', value: 'Bulldog Australien (Australian Bulldog)' },
    { key: 'bulldog-francais', value: 'Bulldog Français (French Bulldog)' },
    { key: 'bullmastiff', value: 'Bullmastiff' },
    { key: 'cairn-terrier', value: 'Cairn Terrier' },
    { key: 'canaan-dog', value: 'Canaan Dog' },
    { key: 'cane-corso', value: 'Cane Corso' },
    { key: 'cavalier-king-charles-spaniel', value: 'Cavalier King Charles Spaniel' },
    { key: 'chesapeake-bay-retriever', value: 'Chesapeake Bay Retriever' },
    { key: 'chihuahua', value: 'Chihuahua' },
    { key: 'chinese-crested-dog', value: 'Chinese Crested Dog' },
    { key: 'chinese-shar-pei', value: 'Chinese Shar-Pei' },
    { key: 'chinook', value: 'Chinook' },
    { key: 'chow-chow', value: 'Chow Chow' },
    { key: 'clumber-spaniel', value: 'Clumber Spaniel' },
    { key: 'cocker-spaniel', value: 'Cocker Spaniel' },
    { key: 'collie', value: 'Collie' },
    { key: 'coonhound', value: 'Coonhound' },
    { key: 'curly-coated-retriever', value: 'Curly-Coated Retriever' },
    { key: 'dachshund', value: 'Dachshund (Teckel)' },
    { key: 'dalmatian', value: 'Dalmatian (Dalmatien)' },
    { key: 'dandie-dinmont-terrier', value: 'Dandie Dinmont Terrier' },
    { key: 'deerhound', value: 'Deerhound' },
    { key: 'dhole', value: 'Dhole' },
    { key: 'dingo', value: 'Dingo' },
    { key: 'doberman-pinscher', value: 'Doberman Pinscher' },
    { key: 'dogue-allemand', value: 'Dogue Allemand (Great Dane)' },
    { key: 'dogue-de-bordeaux', value: 'Dogue de Bordeaux' },
    { key: 'dutch-shepherd', value: 'Dutch Shepherd' },
    { key: 'english-bulldog', value: 'English Bulldog (Bouledogue Anglais)' },
    { key: 'english-cocker-spaniel', value: 'English Cocker Spaniel' },
    { key: 'english-foxhound', value: 'English Foxhound' },
    { key: 'english-setter', value: 'English Setter' },
    { key: 'english-springer-spaniel', value: 'English Springer Spaniel' },
    { key: 'english-toy-terrier', value: 'English Toy Terrier' },
    { key: 'entlebucher-mountain-dog', value: 'Entlebucher Mountain Dog' },
    { key: 'epagneul-breton', value: 'Épagneul Breton (Brittany Spaniel)' },
    { key: 'epagneul-francais', value: 'Épagneul Français (French Spaniel)' },
    { key: 'epagneul-japonais', value: 'Épagneul Japonais (Japanese Chin)' },
    { key: 'epagneul-tibetain', value: 'Épagneul Tibétain (Tibetan Spaniel)' },
    { key: 'eurasier', value: 'Eurasier' },
    { key: 'field-spaniel', value: 'Field Spaniel' },
    { key: 'fila-brasileiro', value: 'Fila Brasileiro' },
    { key: 'finnish-lapphund', value: 'Finnish Lapphund' },
    { key: 'finnish-spitz', value: 'Finnish Spitz' },
    { key: 'flat-coated-retriever', value: 'Flat-Coated Retriever' },
    { key: 'fox-terrier-smooth', value: 'Fox Terrier (Smooth)' },
    { key: 'fox-terrier-wire', value: 'Fox Terrier (Wire)' },
    { key: 'foxhound', value: 'Foxhound' },
    { key: 'francais-blanc-et-noir', value: 'Français Blanc et Noir' },
    { key: 'francais-blanc-et-orange', value: 'Français Blanc et Orange' },
    { key: 'francais-tricolore', value: 'Français Tricolore' },
    { key: 'galgo-espanol', value: 'Galgo Español' },
    { key: 'german-pinscher', value: 'German Pinscher' },
    { key: 'german-shepherd-dog', value: 'German Shepherd Dog' },
    { key: 'german-shorthaired-pointer', value: 'German Shorthaired Pointer' },
    { key: 'german-wirehaired-pointer', value: 'German Wirehaired Pointer' },
    { key: 'giant-schnauzer', value: 'Giant Schnauzer' },
    { key: 'glen-of-imaal-terrier', value: 'Glen of Imaal Terrier' },
    { key: 'golden-retriever', value: 'Golden Retriever' },
    { key: 'gordon-setter', value: 'Gordon Setter' },
    { key: 'grand-basset-griffon-vendeen', value: 'Grand Basset Griffon Vendéen' },
    { key: 'great-dane', value: 'Great Dane (Dogue Allemand)' },
    { key: 'great-pyrenees', value: 'Great Pyrenees' },
    { key: 'greater-swiss-mountain-dog', value: 'Greater Swiss Mountain Dog' },
    { key: 'greyhound', value: 'Greyhound' },
    { key: 'harrier', value: 'Harrier' },
    { key: 'havanese', value: 'Havanese (Bichon Havanais)' },
    { key: 'ibizan-hound', value: 'Ibizan Hound' },
    { key: 'icelandic-sheepdog', value: 'Icelandic Sheepdog' },
    { key: 'irish-red-and-white-setter', value: 'Irish Red and White Setter' },
    { key: 'irish-setter', value: 'Irish Setter' },
    { key: 'irish-terrier', value: 'Irish Terrier' },
    { key: 'irish-water-spaniel', value: 'Irish Water Spaniel' },
    { key: 'irish-wolfhound', value: 'Irish Wolfhound' },
    { key: 'italian-greyhound', value: 'Italian Greyhound' },
    { key: 'jack-russell-terrier', value: 'Jack Russell Terrier' },
    { key: 'japanese-chin', value: 'Japanese Chin (Épagneul Japonais)' },
    { key: 'japanese-spitz', value: 'Japanese Spitz' },
    { key: 'kangal', value: 'Kangal' },
    { key: 'keeshond', value: 'Keeshond' },
    { key: 'kerry-blue-terrier', value: 'Kerry Blue Terrier' },
    { key: 'king-charles-spaniel', value: 'King Charles Spaniel (Cavalier King Charles Spaniel)' },
    { key: 'kishu-ken', value: 'Kishu Ken' },
    { key: 'komondor', value: 'Komondor' },
    { key: 'kuvasz', value: 'Kuvasz' },
    { key: 'labrador-retriever', value: 'Labrador Retriever' },
    { key: 'lakeland-terrier', value: 'Lakeland Terrier' },
    { key: 'lancashire-heeler', value: 'Lancashire Heeler' },
    { key: 'leonberger', value: 'Leonberger' },
    { key: 'lhasa-apso', value: 'Lhasa Apso' },
    { key: 'lowchen', value: 'Lowchen' },
    { key: 'malamute', value: 'Malamute (Alaskan Malamute)' },
    { key: 'malinois', value: 'Malinois (Belgian Malinois)' },
    { key: 'maltese', value: 'Maltese' },
    { key: 'manchester-terrier', value: 'Manchester Terrier' },
    { key: 'maremma-sheepdog', value: 'Maremma Sheepdog' },
    { key: 'mastiff', value: 'Mastiff' },
    { key: 'mexican-hairless', value: 'Mexican Hairless (Xoloitzcuintli)' },
    { key: 'miniature-bull-terrier', value: 'Miniature Bull Terrier' },
    { key: 'miniature-pinscher', value: 'Miniature Pinscher' },
    { key: 'miniature-schnauzer', value: 'Miniature Schnauzer' },
    { key: 'neapolitan-mastiff', value: 'Neapolitan Mastiff' },
    { key: 'newfoundland', value: 'Newfoundland' },
    { key: 'norfolk-terrier', value: 'Norfolk Terrier' },
    { key: 'norwegian-buhund', value: 'Norwegian Buhund' },
    { key: 'norwegian-elkhound', value: 'Norwegian Elkhound' },
    { key: 'norwegian-lundehund', value: 'Norwegian Lundehund' },
    { key: 'norwich-terrier', value: 'Norwich Terrier' },
    { key: 'nova-scotia-duck-tolling-retriever', value: 'Nova Scotia Duck Tolling Retriever' },
    { key: 'old-english-sheepdog', value: 'Old English Sheepdog' },
    { key: 'otterhound', value: 'Otterhound' },
    { key: 'papillon', value: 'Papillon' },
    { key: 'parson-russell-terrier', value: 'Parson Russell Terrier' },
    { key: 'pekingese', value: 'Pekingese (Pékinois)' },
    { key: 'pembroke-welsh-corgi', value: 'Pembroke Welsh Corgi' },
    { key: 'petit-basset-griffon-vendeen', value: 'Petit Basset Griffon Vendéen' },
    { key: 'pharaoh-hound', value: 'Pharaoh Hound' },
    { key: 'pit-bull-terrier', value: 'Pit Bull Terrier (American Pit Bull Terrier)' },
    { key: 'plott-hound', value: 'Plott Hound' },
    { key: 'pointer', value: 'Pointer' },
    { key: 'polish-lowland-sheepdog', value: 'Polish Lowland Sheepdog' },
    { key: 'pomeranian', value: 'Pomeranian' },
    { key: 'poodle', value: 'Poodle (Caniche)' },
    { key: 'portuguese-water-dog', value: 'Portuguese Water Dog' }
  ]);

  const [tabValuesCatSpecies, setTabValuesCatSpecies] = useState<{ key: string; value: string }[]>([
    { key: 'race', value: 'Les Races' },
    { key: 'abyssin', value: 'Abyssin' },
    { key: 'american-bobtail', value: 'American Bobtail' },
    { key: 'american-curl', value: 'American Curl' },
    { key: 'american-shorthair', value: 'American Shorthair' },
    { key: 'american-wirehair', value: 'American Wirehair' },
    { key: 'balinais', value: 'Balinais' },
    { key: 'bengal', value: 'Bengal' },
    { key: 'birman', value: 'Birman' },
    { key: 'bobtail-japonais', value: 'Bobtail japonais' },
    { key: 'bombay', value: 'Bombay' },
    { key: 'british-longhair', value: 'British Longhair' },
    { key: 'british-shorthair', value: 'British Shorthair' },
    { key: 'burmese', value: 'Burmese' },
    { key: 'burmilla', value: 'Burmilla' },
    { key: 'californian-spangled', value: 'Californian Spangled' },
    { key: 'ceylan', value: 'Ceylan' },
    { key: 'chartreux', value: 'Chartreux' },
    { key: 'chausie', value: 'Chausie' },
    { key: 'cornish-rex', value: 'Cornish Rex' },
    { key: 'cymric', value: 'Cymric' },
    { key: 'devon-rex', value: 'Devon Rex' },
    { key: 'donskoy', value: 'Donskoy' },
    { key: 'egyptian-mau', value: 'Egyptian Mau' },
    { key: 'european-shorthair', value: 'European Shorthair' },
    { key: 'exotic-shorthair', value: 'Exotic Shorthair' },
    { key: 'havana-brown', value: 'Havana Brown' },
    { key: 'highland-fold', value: 'Highland Fold' },
    { key: 'himalayen', value: 'Himalayen' },
    { key: 'khao-manee', value: 'Khao Manee' },
    { key: 'korat', value: 'Korat' },
    { key: 'laperm', value: 'LaPerm' },
    { key: 'maine-coon', value: 'Maine Coon' },
    { key: 'manx', value: 'Manx' },
    { key: 'mau-egyptien', value: 'Mau égyptien' },
    { key: 'munchkin', value: 'Munchkin' },
    { key: 'nebelung', value: 'Nebelung' },
    { key: 'norvegien-des-forets', value: 'Norvégien des forêts' },
    { key: 'ocicat', value: 'Ocicat' },
    { key: 'ojos-azules', value: 'Ojos Azules' },
    { key: 'oriental', value: 'Oriental' },
    { key: 'persan', value: 'Persan' },
    { key: 'peterbald', value: 'Peterbald' },
    { key: 'pixie-bob', value: 'Pixie-bob' },
    { key: 'ragdoll', value: 'Ragdoll' },
    { key: 'rex-allemand', value: 'Rex Allemand' },
    { key: 'rex-cornish', value: 'Rex Cornish' },
    { key: 'rex-devon', value: 'Rex Devon' },
    { key: 'rex-selkirk', value: 'Rex Selkirk' },
    { key: 'sacre-de-birmanie', value: 'Sacré de Birmanie' },
    { key: 'savannah', value: 'Savannah' },
    { key: 'scottish-fold', value: 'Scottish Fold' },
    { key: 'selkirk-rex', value: 'Selkirk Rex' },
    { key: 'serengeti', value: 'Serengeti' },
    { key: 'siamois', value: 'Siamois' },
    { key: 'siberien', value: 'Sibérien' },
    { key: 'singapura', value: 'Singapura' },
    { key: 'snowshoe', value: 'Snowshoe' },
    { key: 'sokoke', value: 'Sokoké' },
    { key: 'somali', value: 'Somali' },
    { key: 'sphynx', value: 'Sphynx' },
    { key: 'thai', value: 'Thai' },
    { key: 'tiffany', value: 'Tiffany' },
    { key: 'tonkinois', value: 'Tonkinois' },
    { key: 'toyger', value: 'Toyger' },
    { key: 'van-turc', value: 'Van Turc' },
    { key: 'york-chocolat', value: 'York chocolat' },
  ]);

  const catArray = [
    {
      imageSource: catContest8,
      name: 'Rolo',
      place: '1st',
      totalVotes: '245114 votes',
      prize: '$1,037',
      prizeVotes: '1000 votes',
      id: uuidv4(),
    },
    {
      imageSource: catContest5,
      name: 'Wendy',
      place: '1st',
      totalVotes: '245114 votes',
      prize: '$1,037',
      prizeVotes: '1000 votes',
      id: uuidv4(),
    },
    {
      imageSource: catContest6,
      name: 'Regina',
      place: '1st',
      totalVotes: '245114 votes',
      prize: '$1,037',
      prizeVotes: '1000 votes',
      id: uuidv4(),
    },
    {
      imageSource: catContest7,
      name: 'Tanya',
      place: '1st',
      totalVotes: '245114 votes',
      prize: '$1,037',
      prizeVotes: '1000 votes',
      id: uuidv4(),
    },
    {
      imageSource: catContest4,
      name: 'Rolo',
      place: '1st',
      totalVotes: '245114 votes',
      prize: '$1,037',
      prizeVotes: '1000 votes',
      id: uuidv4(),
    },
    {
      imageSource: catContest4,
      name: 'Rolo',
      place: '1st',
      totalVotes: '245114 votes',
      prize: '$1,037',
      prizeVotes: '1000 votes',
      id: uuidv4(),
    },
    {
      imageSource: catContest4,
      name: 'Rolo',
      place: '1st',
      totalVotes: '245114 votes',
      prize: '$1,037',
      prizeVotes: '1000 votes',
      id: uuidv4(),
    },
    {
      imageSource: catContest4,
      name: 'Rolo',
      place: '1st',
      totalVotes: '245114 votes',
      prize: '$1,037',
      prizeVotes: '1000 votes',
      id: uuidv4(),
    },
  ];
  const dogArray = [
    {
      imageSource: dogContest8,
      name: 'Rolo',
      place: '1st',
      totalVotes: '245114 votes',
      prize: '$1,037',
      prizeVotes: '1000 votes',
      id: uuidv4(),
    },
    {
      imageSource: dogContest5,
      name: 'Wendy',
      place: '1st',
      totalVotes: '245114 votes',
      prize: '$1,037',
      prizeVotes: '1000 votes',
      id: uuidv4(),
    },
    {
      imageSource: dogContest5,
      name: 'Wendy',
      place: '1st',
      totalVotes: '245114 votes',
      prize: '$1,037',
      prizeVotes: '1000 votes',
      id: uuidv4(),
    },
    {
      imageSource: dogContest5,
      name: 'Wendy',
      place: '1st',
      totalVotes: '245114 votes',
      prize: '$1,037',
      prizeVotes: '1000 votes',
      id: uuidv4(),
    },
    {
      imageSource: dogContest5,
      name: 'Wendy',
      place: '1st',
      totalVotes: '245114 votes',
      prize: '$1,037',
      prizeVotes: '1000 votes',
      id: uuidv4(),
    },
    {
      imageSource: dogContest6,
      name: 'Regina',
      place: '1st',
      totalVotes: '245114 votes',
      prize: '$1,037',
      prizeVotes: '1000 votes',
      id: uuidv4(),
    },
    {
      imageSource: dogContest7,
      name: 'Tanya',
      place: '1st',
      totalVotes: '245114 votes',
      prize: '$1,037',
      prizeVotes: '1000 votes',
      id: uuidv4(),
    },
    {
      imageSource: dogContest4,
      name: 'Rolo',
      place: '1st',
      totalVotes: '245114 votes',
      prize: '$1,037',
      prizeVotes: '1000 votes',
      id: uuidv4(),
    },
  ];

  const [activeTab, setActiveTab] = useState<string>('Dog');
  const [currentRegion, setCurrentRegion] = useState<string>(tabValuesRegions[0].key);
  const [currentBreed, setCurrentBreed] = useState<string>(tabValuesDogSpecies[0].key);
  const [tabs, setTabs] = useState<string[]>(['Dog', 'Cat']);
  const currentFeatures = activeTab === 'Dog' ? dogArray : catArray;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [participantsData, setParticipantsData] = useState<FeaturedGridListProps[]>([]);
  const [lastItemId, setLastItemId] = useState<string>('');
  const [hasNextPage, setHasNextPage] = useState<boolean>(false)

  const fetchParticipantsByFeatures = async () => {
    try {
      const response = await axios.get<FeaturedParticipants>(`http://localhost:8080/api/participants/getParticipantByFeatures?specie=${activeTab}&breed=${currentBreed}&region=${currentRegion}&limit=8&lastItemId=${lastItemId}`);
      if (!response.data) setIsError(true)
      setParticipantsData((prev) => {
        return prev ? [...prev, ...response.data.participants] : response.data.participants
      })
      setLastItemId(response.data.hasNextPage ? response.data.participants[response.data.participants.length - 1].id : '');
      setHasNextPage(response.data.hasNextPage);
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
    }
  }

  useEffect(() => {
    setParticipantsData([])
    fetchParticipantsByFeatures()
  }, [currentRegion, currentBreed, tabs,activeTab])

  const selectTab = (tab: string) => {
    setActiveTab(tab);
  };

  const selectDropdownBreed = (event: React.FormEvent<HTMLSelectElement>) => {
    setCurrentBreed(event.currentTarget.value);
  };
  const selectDropdownRegions = (event: React.FormEvent<HTMLSelectElement>) => {
    setCurrentRegion(event.currentTarget.value);
  };

  if (isLoading) return <Loader />;
  if (isError) return <ErreurComponent onRetry={fetchParticipantsByFeatures} />;

  return (
    <Container className={cn('py-4 py-md-5 bg-white', styles.Featured)}>
      <h2 className={cn(styles.Title, 'pb-3 pb-md-5')}>À LA UNE </h2>
      <div className={cn(styles.Tabs, 'pb-4')}>
        {tabs.map((tab) => (
          <ChoiceButton
            active={activeTab === tab}
            key={tab}
            onClick={() => selectTab(tab)}
          >
            {tab === 'Dog' ? 'Chien': 'Chat'}
          </ChoiceButton>
        ))}
      </div>
      <div className='flex'>
        <div className={cn('p-4', styles.DropdownContainer, 'flex-1')}>
          <div className="position-relative">
            <select
              name="region"
              value={currentRegion}
              onChange={selectDropdownRegions}
              className={cn(styles.Select)}
            >
              {tabValuesRegions.map((tab) => (
                <option key={tab.key} value={tab.key}>
                  {tab.value}
                </option>
              ))}
            </select>
            <div className={cn(styles.DropDownIcon)}>
              <DropDown />
            </div>
          </div>
        </div>
        <div className={cn('p-4', styles.DropdownContainer, 'flex-1')}>
          <div className="position-relative">
            <select
              name="species"
              value={currentBreed}
              onChange={selectDropdownBreed}
              className={cn(styles.Select)}
            >
              {activeTab == 'Dog' ? tabValuesDogSpecies.map((tab) => (
                <option key={tab.key} value={tab.key}>
                  {tab.value}
                </option>
              )) :
                tabValuesCatSpecies.map((tab) => (
                  <option key={tab.key} value={tab.key}>
                    {tab.value}
                  </option>))
              }
            </select>
            <div className={cn(styles.DropDownIcon)}>
              <DropDown />
            </div>
          </div>
        </div>
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        participantsData.length === 0 ? (
          <div className={styles.Wrapper}>
            <div
              className={cn(
                'row d-flex justify-content-center text-center pt-10 d-none d-md-block pb-md-3 pb-0',
                styles.ContestsText
              )}
            >
              <h2>Aucun participant ne correspond à ces critères</h2>


            </div>
          </div>
        ) :
          (
            <FeaturedGridList featuredGridData={participantsData} />
          )
      )}
      {hasNextPage && (
        <div className={cn(styles.ButtonContainer, 'mb-5')}>
          <Button label={'Load More'} orange icon={<Arrow down />} onClick={fetchParticipantsByFeatures} />
        </div>
      )}

    </Container>
  );
}

export default Featured;





