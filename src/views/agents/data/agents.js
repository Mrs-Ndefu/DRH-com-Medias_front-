// ── Constantes de formulaire ────────────────────────────────────────────────

export const SEXES            = ['Masculin', 'Féminin'];
export const GROUPES_SANGUINS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
export const SITUATIONS_FAM   = ['Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf / Veuve', 'Séparé(e)'];
export const CATEGORIES       = ['A', 'B', 'C', 'D'];
export const CLASSES          = ['1ère classe', '2ème classe', '3ème classe'];
export const TYPES_PIECES     = ['CIN', 'Passeport', 'Titre de séjour', 'Carte consulaire'];

export const CORPS = [
  'Administration générale',
  'Corps commun des administrations',
  'Enseignement',
  'Santé publique',
  'Sécurité publique',
  'Justice',
  'Finances publiques',
  'Diplomatie et relations extérieures',
  'Informatique et télécommunications',
  'Technique spécialisé',
  'Documentation et archives',
  'Autre',
];

export const MODES_RECRUTEMENT = [
  'Concours externe', 'Concours interne', 'Examen professionnel',
  'Détachement', 'Intégration directe', 'Mutation', 'Contrat direct',
];

export const TYPES_CONTRAT = [
  'Fonctionnaire titulaire', 'Fonctionnaire stagiaire',
  'Contractuel à durée déterminée (CDD)', 'Contractuel à durée indéterminée (CDI)', 'Vacataire',
];

export const SITUATIONS_ADMIN = [
  'En activité', 'En congé maladie', 'En congé maternité',
  'En détachement', 'En disponibilité', 'Suspendu', 'À la retraite',
];

export const NIVEAUX_ETUDES = [
  'Sans diplôme', "Certificat d'études primaires", 'Brevet', 'Baccalauréat',
  'BTS / DUT / DEUG', 'Licence (Bac+3)', 'Master / DEA / DESS (Bac+5)',
  'Ingénieur (Bac+5)', 'Doctorat (Bac+8)', 'Habilitation à diriger des recherches',
];

export const TYPES_EVENEMENTS = [
  'Recrutement', 'Titularisation', 'Promotion', 'Mutation', 'Détachement',
  'Disponibilité', 'Formation longue durée', 'Sanction disciplinaire',
  'Distinction / Médaille', 'Départ à la retraite', 'Autre',
];

export const DOCS_CONFIG = [
  { id: 'photoIdentite', label: "Photo d'identité (format passeport)", accept: 'image/*',      required: true  },
  { id: 'diplomes',      label: 'Diplôme(s) et relevés de notes',     accept: '.pdf,image/*', required: true  },
  { id: 'arrete',        label: 'Arrêté / Décision de nomination',    accept: '.pdf,image/*', required: true  },
];

export const INITIAL = {
  // Identité
  nomFamille: '', prenom: '', prenomSecondaire: '', nomJeuneFile: '',
  sexe: '', dateNaissance: '', lieuNaissance: '', regionNaissance: '', paysNaissance: '',
  nationalite: '', autreNationalite: '', situationFamiliale: '', nbEnfants: '0', groupeSanguin: '',
  // Pièce d'identité
  typePiece: 'CIN', numeroPiece: '', dateExpiration: '', numPasseport: '',
  // Adresse
  adresseRue: '', adresseVille: '', adresseCodePostal: '', adresseRegion: '', adressePays: '',
  // Contact
  telephoneFixe: '', telephoneMobile: '', emailPro: '', emailPersonnel: '',
  // Urgence
  urgenceNom: '', urgenceRelation: '', urgenceTelephone: '',
  // Administratif
  matricule: '', corps: '', grade: '', categorie: '', classe: '', echelon: '', indice: '',
  dateRecrutement: '', datePriseFonction: '', dateTitularisation: '',
  modeRecrutement: '', numeroDecision: '', dateDecision: '', referenceJO: '', ministereDOrigine: '',
  typeContrat: '', situationAdmin: 'En activité',
  numeroCnss: '', numeroRetraite: '', rib: '', banque: '',
  // Affectation courante
  ministereAffectation: '', direction: '', sousDirection: '', service: '', bureau: '',
  poste: '', lieuAffectation: '', regionAffectation: '',
  // Formation principale
  niveauEtudes: '', diplome: '', specialite: '', etablissement: '', paysFormation: '', anneeObtention: '', mention: '',
};

// ── Données fictives ─────────────────────────────────────────────────────────

export const FAKE_AGENTS = [
  {
    id: 'AGT001', matricule: '2019045',
    nomFamille: 'Koné', prenom: 'Mamadou', prenomSecondaire: 'Ibrahim', nomJeuneFile: '',
    sexe: 'Masculin', dateNaissance: '1978-05-12', lieuNaissance: 'Bamako', regionNaissance: 'Bamako', paysNaissance: 'Mali',
    nationalite: 'Malienne', situationFamiliale: 'Marié(e)', nbEnfants: '3', groupeSanguin: 'O+',
    typePiece: 'CIN', numeroPiece: 'CIN19045A', dateExpiration: '2029-05-12',
    adresseRue: 'Quartier Hippodrome, BP 123', adresseVille: 'Bamako', adresseRegion: 'Bamako', adressePays: 'Mali',
    telephoneMobile: '+223 76 00 00 01', emailPro: 'mkone@ministere.ml',
    urgenceNom: 'Fatoumata Koné', urgenceRelation: 'Épouse', urgenceTelephone: '+223 76 00 00 02',
    corps: 'Administration générale', grade: 'Administrateur civil principal', categorie: 'A', classe: '1ère classe', echelon: '5', indice: '840',
    dateRecrutement: '2019-03-15', datePriseFonction: '2019-04-01', dateTitularisation: '2020-04-01',
    modeRecrutement: 'Concours externe', numeroDecision: 'ADP-2019-0145', dateDecision: '2019-03-10',
    typeContrat: 'Fonctionnaire titulaire', situationAdmin: 'En activité',
    numeroCnss: '00123456', rib: 'ML12 0001 0001 0000123456789', banque: 'BDM-SA',
    ministereAffectation: 'Ministère de la Communication et des Médias', direction: 'Direction des Ressources Humaines',
    sousDirection: 'Sous-direction du Personnel', service: 'Service de Gestion', bureau: 'Bureau des carrières',
    poste: 'Directeur adjoint', lieuAffectation: 'Bamako', regionAffectation: 'Bamako',
    niveauEtudes: 'Master / DEA / DESS (Bac+5)', diplome: 'Master en Droit Public',
    specialite: 'Administration publique', etablissement: 'USJPB', paysFormation: 'Mali', anneeObtention: '2004',
  },
  {
    id: 'AGT002', matricule: '2020112',
    nomFamille: 'Traoré', prenom: 'Aminata', prenomSecondaire: '', nomJeuneFile: 'Diallo',
    sexe: 'Féminin', dateNaissance: '1985-11-20', lieuNaissance: 'Sikasso', regionNaissance: 'Sikasso', paysNaissance: 'Mali',
    nationalite: 'Malienne', situationFamiliale: 'Marié(e)', nbEnfants: '2', groupeSanguin: 'A+',
    typePiece: 'CIN', numeroPiece: 'CIN20112B', dateExpiration: '2030-11-20',
    adresseRue: 'ACI 2000, Rue 405', adresseVille: 'Bamako', adresseRegion: 'Bamako', adressePays: 'Mali',
    telephoneMobile: '+223 76 00 00 03', emailPro: 'atraore@ministere.ml',
    corps: 'Administration générale', grade: "Attachée principale d'administration", categorie: 'A', classe: '2ème classe', echelon: '3', indice: '620',
    dateRecrutement: '2020-01-06', datePriseFonction: '2020-02-01', dateTitularisation: '2021-02-01',
    modeRecrutement: 'Concours interne', typeContrat: 'Fonctionnaire titulaire', situationAdmin: 'En activité',
    ministereAffectation: 'Ministère de la Communication et des Médias', direction: 'Direction des Ressources Humaines',
    service: 'Service RH', poste: 'Chef de service RH', lieuAffectation: 'Bamako', regionAffectation: 'Bamako',
    niveauEtudes: 'Licence (Bac+3)', diplome: 'Licence en Sciences de Gestion', specialite: 'RH', etablissement: 'FSEG', paysFormation: 'Mali', anneeObtention: '2007',
  },
  {
    id: 'AGT003', matricule: '2018033',
    nomFamille: 'Yao', prenom: 'Jean-Baptiste', prenomSecondaire: '', nomJeuneFile: '',
    sexe: 'Masculin', dateNaissance: '1974-03-08', lieuNaissance: 'Ségou', regionNaissance: 'Ségou', paysNaissance: 'Mali',
    nationalite: 'Malienne', situationFamiliale: 'Marié(e)', nbEnfants: '4', groupeSanguin: 'B+',
    typePiece: 'CIN', numeroPiece: 'CIN18033C', dateExpiration: '2028-03-08',
    adresseRue: 'Hamdallaye ACI 2000', adresseVille: 'Bamako', adresseRegion: 'Bamako', adressePays: 'Mali',
    telephoneMobile: '+223 76 00 00 04', emailPro: 'jbyao@ministere.ml',
    corps: 'Administration générale', grade: 'Administrateur civil', categorie: 'A', classe: '1ère classe', echelon: '7', indice: '920',
    dateRecrutement: '2018-07-01', datePriseFonction: '2018-08-01', dateTitularisation: '2019-08-01',
    modeRecrutement: 'Mutation', typeContrat: 'Fonctionnaire titulaire', situationAdmin: 'En activité',
    ministereAffectation: 'Ministère de la Communication et des Médias', direction: "Direction de l'Administration",
    poste: 'Administrateur principal', lieuAffectation: 'Bamako', regionAffectation: 'Bamako',
    niveauEtudes: 'Master / DEA / DESS (Bac+5)', diplome: 'DEA en Droit Administratif', specialite: 'Droit public', etablissement: 'Paris I Panthéon-Sorbonne', paysFormation: 'France', anneeObtention: '1999',
  },
  {
    id: 'AGT004', matricule: '2021089',
    nomFamille: 'Camara', prenom: 'Fatoumata', prenomSecondaire: '', nomJeuneFile: 'Keita',
    sexe: 'Féminin', dateNaissance: '1990-07-15', lieuNaissance: 'Kayes', regionNaissance: 'Kayes', paysNaissance: 'Mali',
    nationalite: 'Malienne', situationFamiliale: 'Célibataire', nbEnfants: '0', groupeSanguin: 'O-',
    typePiece: 'CIN', numeroPiece: 'CIN21089D', dateExpiration: '2031-07-15',
    adresseRue: 'Quinzambougou, Rue 320', adresseVille: 'Bamako', adresseRegion: 'Bamako', adressePays: 'Mali',
    telephoneMobile: '+223 76 00 00 05', emailPro: 'fcamara@ministere.ml',
    corps: 'Corps commun des administrations', grade: 'Secrétaire', categorie: 'B', classe: '2ème classe', echelon: '2', indice: '380',
    dateRecrutement: '2021-03-01', datePriseFonction: '2021-04-01', dateTitularisation: '2022-04-01',
    modeRecrutement: 'Concours externe', typeContrat: 'Fonctionnaire titulaire', situationAdmin: 'En activité',
    ministereAffectation: 'Ministère de la Communication et des Médias', direction: 'Direction générale',
    poste: 'Secrétaire de direction', lieuAffectation: 'Bamako', regionAffectation: 'Bamako',
    niveauEtudes: 'BTS / DUT / DEUG', diplome: 'BTS Secrétariat de direction', specialite: 'Secrétariat', etablissement: 'CFPA Bamako', paysFormation: 'Mali', anneeObtention: '2012',
  },
  {
    id: 'AGT005', matricule: '2022156',
    nomFamille: 'Diallo', prenom: 'Ousmane', prenomSecondaire: '', nomJeuneFile: '',
    sexe: 'Masculin', dateNaissance: '1995-01-30', lieuNaissance: 'Mopti', regionNaissance: 'Mopti', paysNaissance: 'Mali',
    nationalite: 'Malienne', situationFamiliale: 'Célibataire', nbEnfants: '0', groupeSanguin: 'AB+',
    typePiece: 'CIN', numeroPiece: 'CIN22156E', dateExpiration: '2032-01-30',
    adresseRue: 'Magnambougou, BP 456', adresseVille: 'Bamako', adresseRegion: 'Bamako', adressePays: 'Mali',
    telephoneMobile: '+223 76 00 00 06', emailPro: 'odiallo@ministere.ml',
    corps: 'Corps commun des administrations', grade: 'Agent de bureau', categorie: 'C', classe: '3ème classe', echelon: '1', indice: '260',
    dateRecrutement: '2022-06-01', datePriseFonction: '2022-07-01',
    modeRecrutement: 'Concours externe', typeContrat: 'Fonctionnaire stagiaire', situationAdmin: 'En activité',
    ministereAffectation: 'Ministère de la Communication et des Médias', direction: "Direction de l'Administration",
    poste: 'Agent de bureau', lieuAffectation: 'Bamako', regionAffectation: 'Bamako',
    niveauEtudes: 'Baccalauréat', diplome: 'Baccalauréat série G', specialite: 'Gestion', etablissement: 'Lycée Prosper Kamara', paysFormation: 'Mali', anneeObtention: '2015',
  },
  {
    id: 'AGT006', matricule: '2020078',
    nomFamille: 'Sow', prenom: 'Ndeye', prenomSecondaire: '', nomJeuneFile: 'Ba',
    sexe: 'Féminin', dateNaissance: '1988-09-05', lieuNaissance: 'Gao', regionNaissance: 'Gao', paysNaissance: 'Mali',
    nationalite: 'Malienne', situationFamiliale: 'Marié(e)', nbEnfants: '1', groupeSanguin: 'A-',
    typePiece: 'Passeport', numeroPiece: 'PA2020078', dateExpiration: '2027-09-05',
    adresseRue: 'Badalabougou Est, Rue 12', adresseVille: 'Bamako', adresseRegion: 'Bamako', adressePays: 'Mali',
    telephoneMobile: '+223 76 00 00 07', emailPro: 'nsow@ministere.ml',
    corps: 'Administration générale', grade: 'Chargée de mission', categorie: 'A', classe: '2ème classe', echelon: '4', indice: '680',
    dateRecrutement: '2020-09-01', datePriseFonction: '2020-10-01', dateTitularisation: '2021-10-01',
    modeRecrutement: 'Intégration directe', typeContrat: 'Fonctionnaire titulaire', situationAdmin: 'En activité',
    ministereAffectation: 'Ministère de la Communication et des Médias', direction: 'Direction de la Planification',
    poste: 'Chargée de mission', lieuAffectation: 'Bamako', regionAffectation: 'Bamako',
    niveauEtudes: 'Master / DEA / DESS (Bac+5)', diplome: 'Master en Planification du Développement', specialite: 'Planification', etablissement: 'ENA Bamako', paysFormation: 'Mali', anneeObtention: '2012',
  },
  {
    id: 'AGT007', matricule: '2017022',
    nomFamille: 'Barry', prenom: 'Abdoulaye', prenomSecondaire: 'Moussa', nomJeuneFile: '',
    sexe: 'Masculin', dateNaissance: '1970-12-22', lieuNaissance: 'Tombouctou', regionNaissance: 'Tombouctou', paysNaissance: 'Mali',
    nationalite: 'Malienne', situationFamiliale: 'Marié(e)', nbEnfants: '5', groupeSanguin: 'B-',
    typePiece: 'CIN', numeroPiece: 'CIN17022F', dateExpiration: '2027-12-22',
    adresseRue: 'Kalaban Coura, Rue 47', adresseVille: 'Bamako', adresseRegion: 'Bamako', adressePays: 'Mali',
    telephoneMobile: '+223 76 00 00 08', emailPro: 'abarry@ministere.ml',
    corps: 'Administration générale', grade: 'Inspecteur principal', categorie: 'A', classe: '1ère classe', echelon: '9', indice: '1050',
    dateRecrutement: '2017-01-10', datePriseFonction: '2017-02-01', dateTitularisation: '2018-02-01',
    modeRecrutement: 'Examen professionnel', typeContrat: 'Fonctionnaire titulaire', situationAdmin: 'En activité',
    ministereAffectation: 'Ministère de la Communication et des Médias', direction: 'Inspection Générale',
    poste: 'Inspecteur principal', lieuAffectation: 'Bamako', regionAffectation: 'Bamako',
    niveauEtudes: 'Master / DEA / DESS (Bac+5)', diplome: 'Master en Audit & Contrôle de Gestion', specialite: 'Inspection', etablissement: 'CESAG Dakar', paysFormation: 'Sénégal', anneeObtention: '1995',
  },
  {
    id: 'AGT008', matricule: '2023201',
    nomFamille: 'Bah', prenom: 'Marie-Claire', prenomSecondaire: '', nomJeuneFile: 'Coulibaly',
    sexe: 'Féminin', dateNaissance: '1993-04-18', lieuNaissance: 'Koulikoro', regionNaissance: 'Koulikoro', paysNaissance: 'Mali',
    nationalite: 'Malienne', situationFamiliale: 'Célibataire', nbEnfants: '0', groupeSanguin: 'O+',
    typePiece: 'CIN', numeroPiece: 'CIN23201G', dateExpiration: '2033-04-18',
    adresseRue: 'Niarela, BP 789', adresseVille: 'Bamako', adresseRegion: 'Bamako', adressePays: 'Mali',
    telephoneMobile: '+223 76 00 00 09', emailPro: 'mcbah@ministere.ml',
    corps: 'Corps commun des administrations', grade: "Attachée d'administration", categorie: 'B', classe: '1ère classe', echelon: '1', indice: '420',
    dateRecrutement: '2023-02-01', datePriseFonction: '2023-03-01',
    modeRecrutement: 'Concours externe', typeContrat: 'Fonctionnaire stagiaire', situationAdmin: 'En activité',
    ministereAffectation: 'Ministère de la Communication et des Médias', direction: "Direction de l'Administration",
    poste: "Attachée d'administration", lieuAffectation: 'Bamako', regionAffectation: 'Bamako',
    niveauEtudes: 'Licence (Bac+3)', diplome: 'Licence en Administration des Entreprises', specialite: 'Administration', etablissement: 'FSEG', paysFormation: 'Mali', anneeObtention: '2016',
  },
];
