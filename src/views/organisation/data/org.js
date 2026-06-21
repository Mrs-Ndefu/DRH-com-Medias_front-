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
  nom: 'Ministère de la Fonction Publique et de la Réforme de l\'État',
  sigle: 'MFPRE',
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
  email: "sg@mfpre.gov.ml",
  effectif: 28,
  description: "Organe de coordination administrative et technique du Ministère. Le Secrétaire Général assiste le Ministre dans la direction et la coordination des services centraux.",
};

export const FAKE_SG_DIVISIONS = [
  { id: 'SGD001', code: 'DAG',  nom: "Division des Affaires Générales",                    chef: "Seydou Diallo", effectif: 12, active: true, description: "Gestion du courrier, des archives et de la documentation" },
  { id: 'SGD002', code: 'DAJ',  nom: "Division des Affaires Juridiques",                   chef: '',              effectif: 8,  active: true, description: "Contentieux, études juridiques et suivi des textes réglementaires" },
  { id: 'SGD003', code: 'DCRP', nom: "Division de la Communication et des Relations Publiques", chef: '',         effectif: 8,  active: true, description: "Communication institutionnelle et relations avec les partenaires" },
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
  { id: 'DIR001', code: 'DRH', nom: 'Direction des Ressources Humaines', sigle: 'DRH', chef: 'Mamadou Koné', chefMatricule: '2019045', effectif: 45, active: true, dateCreation: '2010-03-01', description: 'Gestion du personnel de la fonction publique' },
  { id: 'DIR002', code: 'DAF', nom: 'Direction des Affaires Financières', sigle: 'DAF', chef: 'Jean-Baptiste Yao', chefMatricule: '2018033', effectif: 30, active: true, dateCreation: '2010-03-01', description: 'Gestion des finances et du budget' },
  { id: 'DIR003', code: 'DPL', nom: 'Direction de la Planification', sigle: 'DPL', chef: 'Ndeye Sow', chefMatricule: '2020078', effectif: 18, active: true, dateCreation: '2012-06-01', description: 'Planification et études stratégiques' },
  { id: 'DIR004', code: 'DIT', nom: "Direction de l'Informatique et des Télécommunications", sigle: 'DIT', chef: '', chefMatricule: '', effectif: 22, active: true, dateCreation: '2015-01-01', description: 'Systèmes d\'information et infrastructure numérique' },
  { id: 'DIR005', code: 'DIJ', nom: 'Direction de l\'Inspection et du Juridique', sigle: 'DIJ', chef: 'Abdoulaye Barry', chefMatricule: '2017022', effectif: 15, active: true, dateCreation: '2010-03-01', description: 'Contrôle, inspection et contentieux juridique' },
];

// ── Divisions ────────────────────────────────────────────────────────────────

export const FAKE_DIVISIONS = [
  { id: 'DIV001', directionId: 'DIR001', code: 'DGP', nom: 'Division de la Gestion du Personnel', chef: 'Aminata Traoré', effectif: 12, active: true, description: 'Recrutement, carrières et gestion administrative' },
  { id: 'DIV002', directionId: 'DIR001', code: 'DCF', nom: 'Division des Carrières et de la Formation', chef: '', effectif: 10, active: true, description: 'Formations, évaluations et gestion des carrières' },
  { id: 'DIV003', directionId: 'DIR001', code: 'DRE', nom: 'Division de la Rémunération', chef: '', effectif: 8, active: true, description: 'Traitement des salaires et indemnités' },
  { id: 'DIV004', directionId: 'DIR002', code: 'DCB', nom: 'Division de la Comptabilité et du Budget', chef: '', effectif: 10, active: true, description: 'Exécution budgétaire et comptabilité' },
  { id: 'DIV005', directionId: 'DIR002', code: 'DMP', nom: 'Division des Marchés Publics', chef: '', effectif: 8, active: true, description: 'Passation et suivi des marchés' },
  { id: 'DIV006', directionId: 'DIR003', code: 'DPR', nom: 'Division de la Planification et des Études', chef: '', effectif: 6, active: true, description: 'Planification stratégique et études' },
  { id: 'DIV007', directionId: 'DIR003', code: 'DST', nom: 'Division des Statistiques', chef: '', effectif: 7, active: true, description: 'Collecte et analyse des données statistiques' },
  { id: 'DIV008', directionId: 'DIR004', code: 'DIS', nom: "Division des Infrastructures et Systèmes", chef: '', effectif: 10, active: true, description: 'Réseaux, serveurs et équipements' },
  { id: 'DIV009', directionId: 'DIR004', code: 'DAP', nom: 'Division des Applications et Projets', chef: '', effectif: 9, active: true, description: 'Développement et gestion de projets SI' },
  { id: 'DIV010', directionId: 'DIR005', code: 'DIC', nom: "Division de l'Inspection et du Contrôle", chef: 'Abdoulaye Barry', effectif: 8, active: true, description: 'Missions d\'inspection et de contrôle' },
];

// ── Bureaux ──────────────────────────────────────────────────────────────────

export const FAKE_BUREAUX = [
  { id: 'BUR001', divisionId: 'DIV001', nom: 'Bureau des Carrières', chef: 'Fatoumata Camara', effectif: 4, active: true },
  { id: 'BUR002', divisionId: 'DIV001', nom: 'Bureau des Recrutements', chef: '', effectif: 4, active: true },
  { id: 'BUR003', divisionId: 'DIV001', nom: 'Bureau des Congés et Absences', chef: '', effectif: 4, active: true },
  { id: 'BUR004', divisionId: 'DIV002', nom: 'Bureau de la Formation', chef: '', effectif: 5, active: true },
  { id: 'BUR005', divisionId: 'DIV002', nom: "Bureau des Évaluations et Notation", chef: '', effectif: 5, active: true },
  { id: 'BUR006', divisionId: 'DIV003', nom: 'Bureau des Traitements', chef: '', effectif: 4, active: true },
  { id: 'BUR007', divisionId: 'DIV003', nom: 'Bureau des Indemnités', chef: '', effectif: 4, active: true },
  { id: 'BUR008', divisionId: 'DIV004', nom: 'Bureau du Budget', chef: '', effectif: 5, active: true },
  { id: 'BUR009', divisionId: 'DIV004', nom: 'Bureau de la Comptabilité', chef: '', effectif: 5, active: true },
];

// ── Grades ───────────────────────────────────────────────────────────────────

export const FAKE_GRADES = [
  { id: 'GRD001', categorie: 'A', code: 'A-HC', nom: 'Administrateur civil hors classe', echelons: 3, indiceMin: 1000, indiceMax: 1200, active: true },
  { id: 'GRD002', categorie: 'A', code: 'A-PC', nom: 'Administrateur civil principal', echelons: 5, indiceMin: 750, indiceMax: 950, active: true },
  { id: 'GRD003', categorie: 'A', code: 'A-CL', nom: 'Administrateur civil', echelons: 7, indiceMin: 500, indiceMax: 750, active: true },
  { id: 'GRD004', categorie: 'A', code: 'A-PA', nom: "Attaché principal d'administration", echelons: 5, indiceMin: 400, indiceMax: 600, active: true },
  { id: 'GRD005', categorie: 'A', code: 'A-AD', nom: "Attaché d'administration", echelons: 5, indiceMin: 350, indiceMax: 500, active: true },
  { id: 'GRD006', categorie: 'B', code: 'B-SP', nom: 'Secrétaire principal', echelons: 4, indiceMin: 280, indiceMax: 380, active: true },
  { id: 'GRD007', categorie: 'B', code: 'B-SE', nom: 'Secrétaire', echelons: 4, indiceMin: 240, indiceMax: 320, active: true },
  { id: 'GRD008', categorie: 'C', code: 'C-AB', nom: 'Agent de bureau principal', echelons: 3, indiceMin: 200, indiceMax: 260, active: true },
  { id: 'GRD009', categorie: 'C', code: 'C-AG', nom: 'Agent de bureau', echelons: 3, indiceMin: 170, indiceMax: 220, active: true },
  { id: 'GRD010', categorie: 'D', code: 'D-OP', nom: 'Opérateur de saisie', echelons: 3, indiceMin: 140, indiceMax: 200, active: true },
];

// ── Fonctions ────────────────────────────────────────────────────────────────

export const FAKE_FONCTIONS = [
  { id: 'FCT001', code: 'MIN', nom: 'Ministre', niveau: 1, description: "Chef du département ministériel", active: true },
  { id: 'FCT002', code: 'SG',  nom: 'Secrétaire général', niveau: 2, description: "Coordination des activités du ministère", active: true },
  { id: 'FCT003', code: 'DIR', nom: 'Directeur', niveau: 3, description: "Chef d'une direction centrale", active: true },
  { id: 'FCT004', code: 'DA',  nom: 'Directeur adjoint', niveau: 3, description: "Adjoint au directeur", active: true },
  { id: 'FCT005', code: 'CD',  nom: 'Chef de division', niveau: 4, description: "Responsable d'une division", active: true },
  { id: 'FCT006', code: 'CB',  nom: 'Chef de bureau', niveau: 5, description: "Responsable d'un bureau", active: true },
  { id: 'FCT007', code: 'CE',  nom: "Chargé d'études", niveau: 5, description: "Agent d'études et de planification", active: true },
  { id: 'FCT008', code: 'ADM', nom: 'Administrateur', niveau: 6, description: "Agent de conception catégorie A", active: true },
  { id: 'FCT009', code: 'AGT', nom: "Agent d'exécution", niveau: 7, description: "Agent d'exécution catégories B, C et D", active: true },
];
