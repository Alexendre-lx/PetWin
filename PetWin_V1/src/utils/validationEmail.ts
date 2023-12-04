export function validerAdresseEmail(email: string): boolean {
  // Expression régulière pour la validation d'une adresse e-mail
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Vérification de l'adresse e-mail à l'aide de l'expression régulière
  const estValide = regexEmail.test(email);

  // Vérification supplémentaire pour les caractères spécifiques
  const caracteresInterdits = /[!?\;\/:=+\$`%'"\(\){}\[\]#&]/i;
  const caractereInterditTrouve = caracteresInterdits.test(email);

  return estValide && !caractereInterditTrouve;
}


