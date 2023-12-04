import styles from './editPetProfile.module.scss';
import { Col, Modal, Row } from 'react-bootstrap';
import { EditPetProfileProps } from '@petwin/components/common/EditPetProfileModal/EditPetProfile.props';
import Button from '@petwin/components/common/Button/Button';
import React, { useState, useContext, useEffect} from 'react';
import cn from 'classnames';
import { UserContext, UserContextType } from '@petwin/context/userContext';
import axios from 'axios';



const EditPetProfile = ({
  openModal,
  handleClose,
  participantId,
  participantName,
  participantDescription,
  ownerId,
  participantSpecie,
}: EditPetProfileProps) => {

  const [tabValuesDogSpecies, setTabValuesDogSpecies] = useState<
    { key: string; value: string }[]
  >([
    { key: 'race', value: 'Race' },
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
    {
      key: 'american-staffordshire-terrier',
      value: 'American Staffordshire Terrier',
    },
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
    {
      key: 'bouledogue-americain',
      value: 'Bouledogue Américain (American Bulldog)',
    },
    {
      key: 'bouledogue-francais',
      value: 'Bouledogue Français (French Bulldog)',
    },
    { key: 'bouledogue-ingles', value: 'Bouledogue Inglés (English Bulldog)' },
    { key: 'boxer', value: 'Boxer' },
    { key: 'boykin-spaniel', value: 'Boykin Spaniel' },
    { key: 'brabancon', value: 'Brabançon' },
    { key: 'briard', value: 'Briard' },
    { key: 'brittany-spaniel', value: 'Brittany Spaniel' },
    { key: 'bull-terrier', value: 'Bull Terrier' },
    { key: 'bulldog-anglais', value: 'Bulldog Anglais (English Bulldog)' },
    {
      key: 'bulldog-australien',
      value: 'Bulldog Australien (Australian Bulldog)',
    },
    { key: 'bulldog-francais', value: 'Bulldog Français (French Bulldog)' },
    { key: 'bullmastiff', value: 'Bullmastiff' },
    { key: 'cairn-terrier', value: 'Cairn Terrier' },
    { key: 'canaan-dog', value: 'Canaan Dog' },
    { key: 'cane-corso', value: 'Cane Corso' },
    {
      key: 'cavalier-king-charles-spaniel',
      value: 'Cavalier King Charles Spaniel',
    },
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
    {
      key: 'grand-basset-griffon-vendeen',
      value: 'Grand Basset Griffon Vendéen',
    },
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
    {
      key: 'king-charles-spaniel',
      value: 'King Charles Spaniel (Cavalier King Charles Spaniel)',
    },
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
    {
      key: 'nova-scotia-duck-tolling-retriever',
      value: 'Nova Scotia Duck Tolling Retriever',
    },
    { key: 'old-english-sheepdog', value: 'Old English Sheepdog' },
    { key: 'otterhound', value: 'Otterhound' },
    { key: 'papillon', value: 'Papillon' },
    { key: 'parson-russell-terrier', value: 'Parson Russell Terrier' },
    { key: 'pekingese', value: 'Pekingese (Pékinois)' },
    { key: 'pembroke-welsh-corgi', value: 'Pembroke Welsh Corgi' },
    {
      key: 'petit-basset-griffon-vendeen',
      value: 'Petit Basset Griffon Vendéen',
    },
    { key: 'pharaoh-hound', value: 'Pharaoh Hound' },
    {
      key: 'pit-bull-terrier',
      value: 'Pit Bull Terrier (American Pit Bull Terrier)',
    },
    { key: 'plott-hound', value: 'Plott Hound' },
    { key: 'pointer', value: 'Pointer' },
    { key: 'polish-lowland-sheepdog', value: 'Polish Lowland Sheepdog' },
    { key: 'pomeranian', value: 'Pomeranian' },
    { key: 'poodle', value: 'Poodle (Caniche)' },
    { key: 'portuguese-water-dog', value: 'Portuguese Water Dog' },
  ]);

  const [tabValuesCatSpecies, setTabValuesCatSpecies] = useState<
    { key: string; value: string }[]
  >([
    { key: 'race', value: 'Race' },
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

  const [newName, setNewName] = useState(participantName);
  const [newBreed, setNewBreed] = useState('');
  const [newDescription, setNewDescription] = useState<string>(participantDescription);
  const [isError, setIsError] = useState<boolean>(false);

  const { getUserToken, currentUser } = useContext(UserContext) as UserContextType;
  const [userToken, setUserToken] = useState<string>('')


  const updateParticipant = async (
    participantId: string,
    newName: string,
    newBreed: string,
    newDescription: string,
    userId: string,
    userToken: string,
  ) => {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/participants/updateParticipant',
        {
          participantId,
          newName,
          newBreed,
          newDescription,
          userId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: userToken,
          },
        }
      );
  
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

  const selectDropdownBreed = (event: React.FormEvent<HTMLSelectElement>) => {
    setNewBreed(event.currentTarget.value);
  };

  const handleUpdateParticipant = async () => {
      await updateParticipant(
        participantId,
        newName,
        newBreed,
        newDescription,
        ownerId,
        userToken
      );
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
          Modifier le Profile
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col className={styles.InputForm}>
            <div className={styles.Label}>Prénom</div>
            <input
              type="text"
              className={styles.Input}
              placeholder={participantName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </Col>
        </Row>
        <Row>
          <Col className={styles.InputForm}>
            <div className={styles.Label}>Race</div>
            <div className="position-relative">
              <select
                name="species"
                value={newBreed}
                onChange={selectDropdownBreed}
                className={cn(styles.Select, styles.Input)}
              >
                {participantSpecie === 'Dog'
                  ? tabValuesDogSpecies.map((tab) => (
                      <option key={tab.key} value={tab.key}>
                        {tab.value}
                      </option>
                    ))
                  : tabValuesCatSpecies.map((tab) => (
                      <option key={tab.key} value={tab.key}>
                        {tab.value}
                      </option>
                    ))}
              </select>
              <div className={cn(styles.DropDownIcon)}></div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className={styles.InputForm}>
            <div className={styles.Label}>Description</div>
            <textarea
              rows={3}
              className={styles.Input}
              placeholder={participantDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
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

export default EditPetProfile;
