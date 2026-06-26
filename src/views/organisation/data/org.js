// ── Constantes ───────────────────────────────────────────────────────────────

export const CATEGORIES = ['A', 'B', 'C', 'D'];

export const NIVEAUX_HIERARCHIQUES = [
  { value: 1, label: '1 — Ministre' },
  { value: 2, label: '2 — Secrétaire général' },
  { value: 3, label: '3 — Directeur' },
  { value: 4, label: '4 — Chef de division' },
  { value: 5, label: '5 — Chef de bureau' },
  { value: 6, label: '6 — Agent de conception' },
  { value: 7, label: '7 — Agent d\'exécution' },
];

export const MINISTERE = {
  nom: 'Ministère de la Communication et des Médias',
  sigle: 'MCM',
  ministre: 'M. Idrissa Coulibaly',
  secretaireGeneral: 'M. Mamadou Koné',
  adresse: 'BP 1234, Bamako — République du Mali',
};

// ── Secrétariat Général ──────────────────────────────────────────────────────

export const SECRETARIAT_GENERAL = {
  sigle: 'SG',
  nom: "Secrétariat Général",
  titulaire: "M. Mamadou Koné",
  matricule: "2015001",
  telephoneOff: "+223 20 22 33 44",
  email: "sg@communication.gov.ml",
  effectif: 28,
  description: "Organe de coordination administrative et technique du Ministère. Le Secrétaire Général assiste le Ministre dans la direction et la coordination des services centraux.",
};

export const FAKE_SG_DIVISIONS = [
  { id: 'SGD001', code: 'DAG',  nom: "Division des Affaires Générales",                        chef: "Seydou Diallo", effectif: 12, active: true, description: "Gestion du courrier, des archives et de la documentation" },
  { id: 'SGD002', code: 'DAJ',  nom: "Division des Affaires Juridiques",                       chef: '',              effectif: 8,  active: true, description: "Contentieux, études juridiques et suivi des textes réglementaires" },
  { id: 'SGD003', code: 'DCRP', nom: "Division de la Communication et des Relations Publiques", chef: '',             effectif: 8,  active: true, description: "Communication institutionnelle et relations avec les partenaires" },
];

export const FAKE_SG_BUREAUX = [
  { id: 'SGB001', divisionId: 'SGD001', nom: "Bureau du Courrier et de la Liaison",        chef: '', effectif: 4, active: true },
  { id: 'SGB002', divisionId: 'SGD001', nom: "Bureau des Archives et de la Documentation", chef: '', effectif: 4, active: true },
  { id: 'SGB003', divisionId: 'SGD001', nom: "Bureau de la Reprographie",                  chef: '', effectif: 4, active: true },
  { id: 'SGB004', divisionId: 'SGD002', nom: "Bureau du Contentieux",                      chef: '', effectif: 4, active: true },
  { id: 'SGB005', divisionId: 'SGD002', nom: "Bureau des Études Juridiques",               chef: '', effectif: 4, active: true },
  { id: 'SGB006', divisionId: 'SGD003', nom: "Bureau de la Communication",                 chef: '', effectif: 4, active: true },
  { id: 'SGB007', divisionId: 'SGD003', nom: "Bureau des Relations Publiques",             chef: '', effectif: 4, active: true },
];

// ── Directions ───────────────────────────────────────────────────────────────

export const FAKE_DIRECTIONS = [
  { id: 'DIR001', code: 'DG',   nom: 'Direction Générale',                           sigle: 'DG',   chef: '', chefMatricule: '', effectif: 12, active: true, dateCreation: '2010-03-01', description: 'Autorité suprême de direction du ministère' },
  { id: 'DIR002', code: 'IG',   nom: 'Inspection Générale',                          sigle: 'IG',   chef: '', chefMatricule: '', effectif: 10, active: true, dateCreation: '2010-03-01', description: 'Contrôle, audit interne et inspection des services' },
  { id: 'DIR003', code: 'DRH',  nom: 'Direction des Ressources Humaines',            sigle: 'DRH',  chef: 'Mamadou Koné', chefMatricule: '2019045', effectif: 45, active: true, dateCreation: '2010-03-01', description: 'Gestion du capital humain, des carrières et du bien-être des agents' },
  { id: 'DIR004', code: 'DAF',  nom: 'Direction Administrative et Financière',       sigle: 'DAF',  chef: 'Jean-Baptiste Yao', chefMatricule: '2018033', effectif: 30, active: true, dateCreation: '2010-03-01', description: 'Gestion administrative, budgétaire et comptable' },
  { id: 'DIR005', code: 'DEP',  nom: 'Direction Études et Planification',            sigle: 'DEP',  chef: 'Ndeye Sow', chefMatricule: '2020078', effectif: 18, active: true, dateCreation: '2012-06-01', description: 'Études sectorielles, planification stratégique et statistiques' },
  { id: 'DIR006', code: 'DAN',  nom: 'Direction Archives et NTIC',                   sigle: 'DAN',  chef: '', chefMatricule: '', effectif: 22, active: true, dateCreation: '2015-01-01', description: 'Archives, documentation et nouvelles technologies de l\'information' },
  { id: 'DIR007', code: 'DMA',  nom: 'Direction des Médias Audiovisuels',            sigle: 'DMA',  chef: '', chefMatricule: '', effectif: 25, active: true, dateCreation: '2010-03-01', description: 'Régulation, promotion et développement de l\'audiovisuel national' },
  { id: 'DIR008', code: 'DPE',  nom: 'Direction de la Presse Écrite',                sigle: 'DPE',  chef: '', chefMatricule: '', effectif: 18, active: true, dateCreation: '2010-03-01', description: 'Régulation, promotion et développement de la presse écrite' },
  { id: 'DIR009', code: 'DCI',  nom: 'Direction de la Communication Institutionnelle', sigle: 'DCI', chef: '', chefMatricule: '', effectif: 15, active: true, dateCreation: '2010-03-01', description: 'Communication de l\'État, relations publiques et protocole' },
  { id: 'DIR010', code: 'DCIN', nom: 'Direction du Cinéma',                          sigle: 'DCIN', chef: '', chefMatricule: '', effectif: 12, active: true, dateCreation: '2010-03-01', description: 'Promotion, développement et réglementation de l\'industrie cinématographique' },
  { id: 'DIR011', code: 'DPB',  nom: 'Direction de la Publicité',                    sigle: 'DPB',  chef: '', chefMatricule: '', effectif: 10, active: true, dateCreation: '2010-03-01', description: 'Réglementation de la publicité et des annonces légales' },
  { id: 'DIR012', code: 'SDEC', nom: 'Services Déconcentrés',                        sigle: 'SDEC', chef: '', chefMatricule: '', effectif: 55, active: true, dateCreation: '2010-03-01', description: 'Divisions provinciales et services régionaux déconcentrés' },
];

// ── Divisions ────────────────────────────────────────────────────────────────

export const FAKE_DIVISIONS = [
  // Direction Générale
  { id: 'DIV001', directionId: 'DIR001', code: 'DG-CAB',  nom: 'Cabinet du Directeur Général',                    chef: '', effectif: 6,  active: true, description: 'Cabinet et secrétariat du DG' },
  { id: 'DIV002', directionId: 'DIR001', code: 'DG-SEC',  nom: 'Secrétariat de Direction',                        chef: '', effectif: 6,  active: true, description: 'Secrétariat central du ministère' },

  // Inspection Générale
  { id: 'DIV003', directionId: 'DIR002', code: 'IG-CTRL', nom: 'Division Contrôle et Vérification',               chef: '', effectif: 5,  active: true, description: 'Missions de contrôle et de vérification des services' },
  { id: 'DIV004', directionId: 'DIR002', code: 'IG-AUD',  nom: 'Division Audit Interne',                          chef: '', effectif: 5,  active: true, description: 'Audit interne et évaluation des performances' },

  // Direction des Ressources Humaines
  { id: 'DIV005', directionId: 'DIR003', code: 'DCH',     nom: 'Division Capital Humain',                         chef: 'Aminata Traoré', effectif: 15, active: true, description: 'Carrières, paie et qualité de vie au travail' },
  { id: 'DIV006', directionId: 'DIR003', code: 'DGDC',    nom: 'Division Gestion et Développement des Compétences', chef: '', effectif: 12, active: true, description: 'Formation, GPEEC et développement professionnel' },
  { id: 'DIV007', directionId: 'DIR003', code: 'DAS',     nom: 'Division Actions Sociales',                       chef: '', effectif: 10, active: true, description: 'Assistance sociale, activités culturelles et sportives' },

  // Direction Administrative et Financière
  { id: 'DIV008', directionId: 'DIR004', code: 'DAF-BCB', nom: 'Division Budget et Comptabilité',                 chef: '', effectif: 10, active: true, description: 'Exécution budgétaire et comptabilité' },
  { id: 'DIV009', directionId: 'DIR004', code: 'DAF-MPA', nom: 'Division Marchés Publics et Approvisionnement',   chef: '', effectif: 8,  active: true, description: 'Passation et suivi des marchés publics' },
  { id: 'DIV010', directionId: 'DIR004', code: 'DAF-PAT', nom: 'Division Patrimoine et Équipement',               chef: '', effectif: 8,  active: true, description: 'Gestion du patrimoine mobilier et immobilier' },

  // Direction Études et Planification
  { id: 'DIV011', directionId: 'DIR005', code: 'DEP-ETR', nom: 'Division Études et Recherche',                    chef: '', effectif: 6,  active: true, description: 'Études sectorielles et recherche appliquée' },
  { id: 'DIV012', directionId: 'DIR005', code: 'DEP-PSE', nom: 'Division Planification et Suivi-Évaluation',      chef: '', effectif: 6,  active: true, description: 'Planification stratégique et suivi-évaluation' },
  { id: 'DIV013', directionId: 'DIR005', code: 'DEP-STA', nom: 'Division Statistiques et Cartographie',           chef: '', effectif: 6,  active: true, description: 'Collecte et analyse des statistiques sectorielles' },

  // Direction Archives et NTIC
  { id: 'DIV014', directionId: 'DIR006', code: 'DAN-ARC', nom: 'Division Archives et Documentation',              chef: '', effectif: 10, active: true, description: 'Conservation et gestion des archives' },
  { id: 'DIV015', directionId: 'DIR006', code: 'DAN-NTI', nom: "Division NTIC et Systèmes d'Information",         chef: '', effectif: 12, active: true, description: 'Infrastructure numérique et systèmes d\'information' },

  // Direction des Médias Audiovisuels
  { id: 'DIV016', directionId: 'DIR007', code: 'DMA-TEL', nom: 'Division Télévision',                             chef: '', effectif: 6,  active: true, description: 'Régulation et promotion de la télévision' },
  { id: 'DIV017', directionId: 'DIR007', code: 'DMA-RAD', nom: 'Division Radio',                                  chef: '', effectif: 6,  active: true, description: 'Régulation et promotion de la radiodiffusion' },
  { id: 'DIV018', directionId: 'DIR007', code: 'DMA-NUM', nom: 'Division Médias Numériques',                      chef: '', effectif: 6,  active: true, description: 'Médias en ligne et transformation numérique' },
  { id: 'DIV019', directionId: 'DIR007', code: 'DMA-REG', nom: 'Division Réglementation Audiovisuelle',           chef: '', effectif: 7,  active: true, description: 'Réglementation du secteur audiovisuel' },

  // Direction de la Presse Écrite
  { id: 'DIV020', directionId: 'DIR008', code: 'DPE-PRE', nom: 'Division Presse et Publications',                 chef: '', effectif: 6,  active: true, description: 'Promotion de la presse et des publications' },
  { id: 'DIV021', directionId: 'DIR008', code: 'DPE-IMP', nom: 'Division Imprimerie et Édition',                  chef: '', effectif: 6,  active: true, description: 'Imprimerie nationale et édition' },
  { id: 'DIV022', directionId: 'DIR008', code: 'DPE-REG', nom: 'Division Réglementation de la Presse',            chef: '', effectif: 6,  active: true, description: 'Accréditation et réglementation de la presse' },

  // Direction de la Communication Institutionnelle
  { id: 'DIV023', directionId: 'DIR009', code: 'DCI-CGO', nom: 'Division Communication Gouvernementale',          chef: '', effectif: 5,  active: true, description: 'Communication officielle du gouvernement' },
  { id: 'DIV024', directionId: 'DIR009', code: 'DCI-REL', nom: 'Division Relations Publiques et Protocole',       chef: '', effectif: 5,  active: true, description: 'Relations publiques et gestion du protocole' },
  { id: 'DIV025', directionId: 'DIR009', code: 'DCI-MED', nom: 'Division Relations avec les Médias',              chef: '', effectif: 5,  active: true, description: 'Accréditation et relations avec les organes de presse' },

  // Direction du Cinéma
  { id: 'DIV026', directionId: 'DIR010', code: 'DCIN-PRD', nom: 'Division Production Cinématographique',          chef: '', effectif: 6,  active: true, description: 'Soutien à la production et au financement du cinéma' },
  { id: 'DIV027', directionId: 'DIR010', code: 'DCIN-DIF', nom: 'Division Distribution et Diffusion',             chef: '', effectif: 6,  active: true, description: 'Distribution et diffusion des œuvres cinématographiques' },

  // Direction de la Publicité
  { id: 'DIV028', directionId: 'DIR011', code: 'DPB-PUB', nom: 'Division Réglementation Publicitaire',            chef: '', effectif: 5,  active: true, description: 'Réglementation et contrôle de la publicité' },
  { id: 'DIV029', directionId: 'DIR011', code: 'DPB-ANN', nom: 'Division Annonces Légales',                       chef: '', effectif: 5,  active: true, description: 'Gestion des annonces légales et avis officiels' },

  // Services Déconcentrés — Divisions Provinciales
  { id: 'DIV030', directionId: 'DIR012', code: 'DP-BAM', nom: 'Division Provinciale de Bamako',         chef: '', effectif: 8, active: true, description: 'Services déconcentrés — District de Bamako' },
  { id: 'DIV031', directionId: 'DIR012', code: 'DP-KAY', nom: 'Division Provinciale de Kayes',          chef: '', effectif: 4, active: true, description: 'Services déconcentrés — Région de Kayes' },
  { id: 'DIV032', directionId: 'DIR012', code: 'DP-KOU', nom: 'Division Provinciale de Koulikoro',      chef: '', effectif: 4, active: true, description: 'Services déconcentrés — Région de Koulikoro' },
  { id: 'DIV033', directionId: 'DIR012', code: 'DP-SIK', nom: 'Division Provinciale de Sikasso',        chef: '', effectif: 4, active: true, description: 'Services déconcentrés — Région de Sikasso' },
  { id: 'DIV034', directionId: 'DIR012', code: 'DP-SEG', nom: 'Division Provinciale de Ségou',          chef: '', effectif: 4, active: true, description: 'Services déconcentrés — Région de Ségou' },
  { id: 'DIV035', directionId: 'DIR012', code: 'DP-MOP', nom: 'Division Provinciale de Mopti',          chef: '', effectif: 4, active: true, description: 'Services déconcentrés — Région de Mopti' },
  { id: 'DIV036', directionId: 'DIR012', code: 'DP-TOM', nom: 'Division Provinciale de Tombouctou',     chef: '', effectif: 4, active: true, description: 'Services déconcentrés — Région de Tombouctou' },
  { id: 'DIV037', directionId: 'DIR012', code: 'DP-GAO', nom: 'Division Provinciale de Gao',            chef: '', effectif: 4, active: true, description: 'Services déconcentrés — Région de Gao' },
  { id: 'DIV038', directionId: 'DIR012', code: 'DP-KID', nom: 'Division Provinciale de Kidal',          chef: '', effectif: 3, active: true, description: 'Services déconcentrés — Région de Kidal' },
  { id: 'DIV039', directionId: 'DIR012', code: 'DP-TAO', nom: 'Division Provinciale de Taoudéni',       chef: '', effectif: 3, active: true, description: 'Services déconcentrés — Région de Taoudéni' },
  { id: 'DIV040', directionId: 'DIR012', code: 'DP-MEN', nom: 'Division Provinciale de Ménaka',         chef: '', effectif: 3, active: true, description: 'Services déconcentrés — Région de Ménaka' },
];

// ── Bureaux ──────────────────────────────────────────────────────────────────

export const FAKE_BUREAUX = [
  // Division Capital Humain (DIV005 — DCH)
  { id: 'BUR001', divisionId: 'DIV005', nom: 'Bureau Carrières et Mutations',            chef: 'Fatoumata Camara', effectif: 5, active: true },
  { id: 'BUR002', divisionId: 'DIV005', nom: 'Bureau Paie et Rémunérations',             chef: '',                  effectif: 5, active: true },
  { id: 'BUR003', divisionId: 'DIV005', nom: 'Bureau Qualité de Vie au Travail',         chef: '',                  effectif: 5, active: true },
  // Division Gestion et Développement des Compétences (DIV006 — DGDC)
  { id: 'BUR004', divisionId: 'DIV006', nom: 'Bureau Formation et Perfectionnement',     chef: '',                  effectif: 6, active: true },
  { id: 'BUR005', divisionId: 'DIV006', nom: 'Bureau GPEEC',                             chef: '',                  effectif: 6, active: true },
  // Division Actions Sociales (DIV007 — DAS)
  { id: 'BUR006', divisionId: 'DIV007', nom: 'Bureau Assistance Sociale',                chef: '',                  effectif: 5, active: true },
  { id: 'BUR007', divisionId: 'DIV007', nom: 'Bureau Activités Culturelles et Sportives', chef: '',                 effectif: 5, active: true },
];

// ── Grades ───────────────────────────────────────────────────────────────────

export const FAKE_GRADES = [
  // Catégorie A
  { id: 'GRD001', categorie: 'A', code: 'A-HC1', nom: 'Administrateur Civil Hors Classe',        echelons: 3, indiceMin: 1000, indiceMax: 1200, active: true },
  { id: 'GRD002', categorie: 'A', code: 'A-P1',  nom: 'Administrateur Civil 1ère Classe',         echelons: 5, indiceMin: 800,  indiceMax: 1000, active: true },
  { id: 'GRD003', categorie: 'A', code: 'A-P2',  nom: 'Administrateur Civil 2ème Classe',         echelons: 7, indiceMin: 600,  indiceMax: 800,  active: true },
  { id: 'GRD004', categorie: 'A', code: 'A-AHC', nom: "Attaché d'Administration Hors Classe",     echelons: 3, indiceMin: 700,  indiceMax: 900,  active: true },
  { id: 'GRD005', categorie: 'A', code: 'A-A1',  nom: "Attaché d'Administration 1ère Classe",     echelons: 5, indiceMin: 550,  indiceMax: 700,  active: true },
  { id: 'GRD006', categorie: 'A', code: 'A-A2',  nom: "Attaché d'Administration 2ème Classe",     echelons: 7, indiceMin: 400,  indiceMax: 550,  active: true },
  { id: 'GRD007', categorie: 'A', code: 'A-IHC', nom: 'Ingénieur Hors Classe',                    echelons: 3, indiceMin: 900,  indiceMax: 1100, active: true },
  { id: 'GRD008', categorie: 'A', code: 'A-I1',  nom: 'Ingénieur 1ère Classe',                    echelons: 5, indiceMin: 700,  indiceMax: 900,  active: true },
  { id: 'GRD009', categorie: 'A', code: 'A-I2',  nom: 'Ingénieur 2ème Classe',                    echelons: 7, indiceMin: 500,  indiceMax: 700,  active: true },
  // Catégorie B
  { id: 'GRD010', categorie: 'B', code: 'B-THC', nom: 'Technicien Supérieur Hors Classe',         echelons: 3, indiceMin: 400,  indiceMax: 550,  active: true },
  { id: 'GRD011', categorie: 'B', code: 'B-T1',  nom: 'Technicien Supérieur 1ère Classe',         echelons: 5, indiceMin: 320,  indiceMax: 420,  active: true },
  { id: 'GRD012', categorie: 'B', code: 'B-T2',  nom: 'Technicien Supérieur 2ème Classe',         echelons: 5, indiceMin: 250,  indiceMax: 340,  active: true },
  { id: 'GRD013', categorie: 'B', code: 'B-AAP', nom: 'Adjoint Administratif Principal',          echelons: 4, indiceMin: 300,  indiceMax: 400,  active: true },
  { id: 'GRD014', categorie: 'B', code: 'B-AA1', nom: 'Adjoint Administratif 1ère Classe',        echelons: 5, indiceMin: 250,  indiceMax: 320,  active: true },
  { id: 'GRD015', categorie: 'B', code: 'B-AA2', nom: 'Adjoint Administratif 2ème Classe',        echelons: 5, indiceMin: 200,  indiceMax: 270,  active: true },
  { id: 'GRD016', categorie: 'B', code: 'B-SAP', nom: "Secrétaire d'Administration Principale",   echelons: 4, indiceMin: 280,  indiceMax: 380,  active: true },
  { id: 'GRD017', categorie: 'B', code: 'B-SA',  nom: "Secrétaire d'Administration",              echelons: 5, indiceMin: 230,  indiceMax: 310,  active: true },
  // Catégorie C
  { id: 'GRD018', categorie: 'C', code: 'C-AHC', nom: 'Agent Technique Hors Classe',              echelons: 3, indiceMin: 220,  indiceMax: 280,  active: true },
  { id: 'GRD019', categorie: 'C', code: 'C-AT1', nom: 'Agent Technique 1ère Classe',              echelons: 3, indiceMin: 190,  indiceMax: 240,  active: true },
  { id: 'GRD020', categorie: 'C', code: 'C-AT2', nom: 'Agent Technique 2ème Classe',              echelons: 4, indiceMin: 160,  indiceMax: 210,  active: true },
  { id: 'GRD021', categorie: 'C', code: 'C-CAP', nom: "Commis d'Administration Principal",        echelons: 3, indiceMin: 200,  indiceMax: 260,  active: true },
  { id: 'GRD022', categorie: 'C', code: 'C-CA',  nom: "Commis d'Administration",                  echelons: 4, indiceMin: 170,  indiceMax: 220,  active: true },
  { id: 'GRD023', categorie: 'C', code: 'C-SDP', nom: 'Sténo-Dactylographe Principal',            echelons: 3, indiceMin: 185,  indiceMax: 235,  active: true },
  { id: 'GRD024', categorie: 'C', code: 'C-SD',  nom: 'Sténo-Dactylographe',                      echelons: 4, indiceMin: 155,  indiceMax: 195,  active: true },
  // Catégorie D
  { id: 'GRD025', categorie: 'D', code: 'D-HP',  nom: 'Huissier Principal',                       echelons: 3, indiceMin: 140,  indiceMax: 180,  active: true },
  { id: 'GRD026', categorie: 'D', code: 'D-H',   nom: 'Huissier',                                 echelons: 3, indiceMin: 120,  indiceMax: 155,  active: true },
  { id: 'GRD027', categorie: 'D', code: 'D-CVP', nom: 'Chauffeur de Véhicule Principal',          echelons: 3, indiceMin: 145,  indiceMax: 185,  active: true },
  { id: 'GRD028', categorie: 'D', code: 'D-CV',  nom: 'Chauffeur de Véhicule',                    echelons: 3, indiceMin: 120,  indiceMax: 155,  active: true },
  { id: 'GRD029', categorie: 'D', code: 'D-ASP', nom: 'Agent de Service Principal',               echelons: 3, indiceMin: 130,  indiceMax: 165,  active: true },
  { id: 'GRD030', categorie: 'D', code: 'D-AS',  nom: 'Agent de Service',                         echelons: 3, indiceMin: 110,  indiceMax: 145,  active: true },
  { id: 'GRD031', categorie: 'D', code: 'D-GP',  nom: 'Gardien Principal',                        echelons: 3, indiceMin: 135,  indiceMax: 170,  active: true },
  { id: 'GRD032', categorie: 'D', code: 'D-G',   nom: 'Gardien',                                  echelons: 3, indiceMin: 110,  indiceMax: 140,  active: true },
];

// ── Fonctions ────────────────────────────────────────────────────────────────

export const FAKE_FONCTIONS = [
  { id: 'FCT001', code: 'MIN',     nom: 'Ministre',                   niveau: 1, description: "Chef du département ministériel",                         active: true },
  { id: 'FCT002', code: 'SG',      nom: 'Secrétaire Général',         niveau: 2, description: "Coordination des activités du ministère",                 active: true },
  { id: 'FCT003', code: 'DG-MIN',  nom: 'Directeur Général',          niveau: 3, description: "Directeur général du ministère",                         active: true },
  { id: 'FCT004', code: 'DIR',     nom: 'Directeur',                  niveau: 3, description: "Chef d'une direction centrale",                          active: true },
  { id: 'FCT005', code: 'ADJ-DIR', nom: 'Directeur Adjoint',          niveau: 3, description: "Adjoint au directeur",                                   active: true },
  { id: 'FCT006', code: 'IG',      nom: 'Inspecteur Général',         niveau: 3, description: "Chef de l'Inspection Générale",                          active: true },
  { id: 'FCT007', code: 'INSP',    nom: 'Inspecteur',                 niveau: 4, description: "Inspecteur des services",                                active: true },
  { id: 'FCT008', code: 'CH-DIV',  nom: 'Chef de Division',           niveau: 4, description: "Responsable d'une division",                             active: true },
  { id: 'FCT009', code: 'CH-BUR',  nom: 'Chef de Bureau',             niveau: 5, description: "Responsable d'un bureau",                                active: true },
  { id: 'FCT010', code: 'CON-RH',  nom: 'Conseiller en RH',           niveau: 5, description: "Expert en gestion des ressources humaines",               active: true },
  { id: 'FCT011', code: 'CON-JUR', nom: 'Conseiller Juridique',       niveau: 5, description: "Expert en droit public et administratif",                active: true },
  { id: 'FCT012', code: 'TECH-RH', nom: 'Technicien RH',              niveau: 6, description: "Agent de gestion administrative RH",                     active: true },
  { id: 'FCT013', code: 'REDAC',   nom: 'Rédacteur',                  niveau: 6, description: "Agent de rédaction et d'analyse administrative",         active: true },
  { id: 'FCT014', code: 'AGT-ADM', nom: "Agent Administratif",        niveau: 7, description: "Agent d'exécution administrative",                       active: true },
  { id: 'FCT015', code: 'SECR',    nom: 'Secrétaire',                 niveau: 7, description: "Secrétaire de direction ou de division",                 active: true },
  { id: 'FCT016', code: 'CHAUF',   nom: 'Chauffeur',                  niveau: 7, description: "Chauffeur de service",                                   active: true },
];
