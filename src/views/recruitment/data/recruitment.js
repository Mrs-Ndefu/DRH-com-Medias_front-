// ── Constantes ───────────────────────────────────────────────────────────────

export const TYPES_POSTE = {
  CONCOURS:  'Concours',
  CDI:       'CDI',
  CDD:       'CDD',
  STAGE:     'Stage',
};

export const STATUTS_OFFRE = {
  OUVERTE:  { label: 'Ouverte',   color: 'success'   },
  CLOTUREE: { label: 'Clôturée',  color: 'secondary' },
  ANNULEE:  { label: 'Annulée',   color: 'danger'    },
};

export const STATUTS_CANDIDAT = {
  EN_ATTENTE: { label: 'En attente',   color: 'warning'   },
  PRESENTE:   { label: 'Présenté',     color: 'info'      },
  RETENU:     { label: 'Retenu',       color: 'primary'   },
  ENTRETIEN:  { label: 'Entretien',    color: 'info'      },
  ACCEPTE:    { label: 'Accepté',      color: 'success'   },
  REJETE:     { label: 'Rejeté',       color: 'danger'    },
};

export const TYPES_ENTRETIEN = {
  RH:         'Ressources Humaines',
  TECHNIQUE:  'Technique',
  COMMISSION: 'Commission',
};

export const STATUTS_ENTRETIEN = {
  PLANIFIE: { label: 'Planifié',  color: 'primary'   },
  REALISE:  { label: 'Réalisé',  color: 'success'   },
  ANNULE:   { label: 'Annulé',   color: 'danger'    },
  REPORTE:  { label: 'Reporté',  color: 'warning'   },
};

export const STATUTS_INTEGRATION = {
  EN_COURS: { label: 'En cours',  color: 'info'      },
  TERMINEE: { label: 'Terminée',  color: 'success'   },
};

export const ETAPES_INTEGRATION = [
  { id: 'accueil',       label: 'Accueil et présentation du ministère' },
  { id: 'materiel',      label: 'Remise du matériel de travail'        },
  { id: 'formation',     label: 'Formation initiale au poste'          },
  { id: 'habilitation',  label: 'Habilitation et accès informatiques'  },
  { id: 'installation',  label: "Installation définitive au poste"     },
];

export const DIRECTIONS = ['DRH', 'DAF', 'DPL', 'DIT', 'DIJ', 'SG'];
export const CATEGORIES  = ['A', 'B', 'C', 'D'];

// ── Offres ───────────────────────────────────────────────────────────────────

export const FAKE_OFFRES = [
  {
    id: 'OFF001', reference: 'OFF-2026-001',
    titre: 'Administrateur Civil',
    direction: 'DRH', division: 'Division de la Gestion du Personnel',
    typePoste: 'CONCOURS', categorie: 'A', nbPostes: 2,
    datePublication: '2026-01-15', dateCloture: '2026-03-15',
    statut: 'OUVERTE',
    description: "Recrutement d'administrateurs civils pour renforcer la gestion des ressources humaines.",
    qualifications: "Bac+5 en droit public ou administration — Expérience souhaitée en GRH",
  },
  {
    id: 'OFF002', reference: 'OFF-2026-002',
    titre: 'Développeur Systèmes d\'Information',
    direction: 'DIT', division: "Division des Applications et Projets",
    typePoste: 'CDD', categorie: 'A', nbPostes: 1,
    datePublication: '2026-02-01', dateCloture: '2026-04-01',
    statut: 'OUVERTE',
    description: "Développeur pour la modernisation du système d'information du ministère.",
    qualifications: "Bac+4 en informatique — Maîtrise de Java, React, bases de données",
  },
  {
    id: 'OFF003', reference: 'OFF-2026-003',
    titre: 'Secrétaire Principal',
    direction: 'SG', division: 'Division des Affaires Générales',
    typePoste: 'CONCOURS', categorie: 'B', nbPostes: 3,
    datePublication: '2026-01-10', dateCloture: '2026-02-28',
    statut: 'CLOTUREE',
    description: "Recrutement de secrétaires principaux pour le Secrétariat Général.",
    qualifications: "Bac+2 en secrétariat ou administration — Maîtrise des outils bureautiques",
  },
  {
    id: 'OFF004', reference: 'OFF-2025-015',
    titre: 'Stagiaire en Comptabilité',
    direction: 'DAF', division: 'Division de la Comptabilité et du Budget',
    typePoste: 'STAGE', categorie: 'B', nbPostes: 2,
    datePublication: '2025-11-01', dateCloture: '2025-12-31',
    statut: 'CLOTUREE',
    description: "Stage de fin d'études en comptabilité publique.",
    qualifications: "Étudiant en Bac+3/4 en comptabilité ou finance",
  },
];

// ── Candidats ────────────────────────────────────────────────────────────────

export const FAKE_CANDIDATS = [
  { id: 'CAN001', nom: 'Traoré',   prenom: 'Aminata',  email: 'aminata.traore@email.ml',   telephone: '+223 76 12 34 56', dateNaissance: '1992-04-15', diplome: 'Master II Droit Public',      etablissement: "Université de Bamako",      experience: 3, offreId: 'OFF001', statut: 'ENTRETIEN',  dateDepot: '2026-01-22' },
  { id: 'CAN002', nom: 'Coulibaly', prenom: 'Ibrahim',  email: 'ibrahim.coulibaly@email.ml', telephone: '+223 66 98 76 54', dateNaissance: '1990-09-20', diplome: 'Master I Administration',    etablissement: "ENA de Bamako",             experience: 5, offreId: 'OFF001', statut: 'RETENU',     dateDepot: '2026-01-25' },
  { id: 'CAN003', nom: 'Diallo',   prenom: 'Fatoumata', email: 'fatoumata.diallo@email.ml',  telephone: '+223 79 45 67 89', dateNaissance: '1995-12-03', diplome: "Licence Droit des Affaires", etablissement: "Université de Ségou",       experience: 1, offreId: 'OFF001', statut: 'REJETE',     dateDepot: '2026-02-01' },
  { id: 'CAN004', nom: 'Koné',     prenom: 'Moussa',   email: 'moussa.kone@email.ml',       telephone: '+223 65 23 45 67', dateNaissance: '1993-06-18', diplome: 'Licence Informatique',       etablissement: "IUG de Bamako",             experience: 2, offreId: 'OFF002', statut: 'EN_ATTENTE', dateDepot: '2026-02-10' },
  { id: 'CAN005', nom: 'Sanogo',   prenom: 'Aïcha',    email: 'aicha.sanogo@email.ml',      telephone: '+223 70 87 65 43', dateNaissance: '1997-03-30', diplome: 'Master Systèmes Informatiques', etablissement: "Université de Bamako",   experience: 0, offreId: 'OFF002', statut: 'EN_ATTENTE', dateDepot: '2026-02-15' },
  { id: 'CAN006', nom: 'Barry',    prenom: 'Oumar',    email: 'oumar.barry@email.ml',       telephone: '+223 78 34 56 78', dateNaissance: '1991-11-07', diplome: 'BTS Secrétariat',            etablissement: "CFPP de Bamako",            experience: 4, offreId: 'OFF003', statut: 'ACCEPTE',    dateDepot: '2026-01-12' },
  { id: 'CAN007', nom: 'Keita',    prenom: 'Mariam',   email: 'mariam.keita@email.ml',      telephone: '+223 77 56 78 90', dateNaissance: '1999-08-22', diplome: 'BTS Comptabilité',           etablissement: "Lycée Technique de Bamako", experience: 0, offreId: 'OFF004', statut: 'PRESENTE',   dateDepot: '2025-11-15' },
  { id: 'CAN008', nom: 'Diabaté',  prenom: 'Seydou',   email: 'seydou.diabate@email.ml',    telephone: '+223 75 90 12 34', dateNaissance: '1994-02-14', diplome: "Master II Administration",   etablissement: "ENA de Bamako",             experience: 3, offreId: 'OFF001', statut: 'ENTRETIEN',  dateDepot: '2026-01-28' },
];

// ── Entretiens ────────────────────────────────────────────────────────────────

export const FAKE_ENTRETIENS = [
  { id: 'ENT001', candidatId: 'CAN001', offreId: 'OFF001', date: '2026-03-10', heure: '09:00', lieu: 'Salle A — Ministère',   type: 'RH',         statut: 'REALISE',  note: 15, appreciation: 'Très bon profil, solide expérience',         evaluateur: 'Mme Coulibaly'    },
  { id: 'ENT002', candidatId: 'CAN001', offreId: 'OFF001', date: '2026-03-17', heure: '10:00', lieu: 'Salle B — Ministère',   type: 'COMMISSION', statut: 'PLANIFIE', note: null, appreciation: '',                                        evaluateur: 'Commission DRH'   },
  { id: 'ENT003', candidatId: 'CAN002', offreId: 'OFF001', date: '2026-03-11', heure: '11:00', lieu: 'Salle A — Ministère',   type: 'RH',         statut: 'REALISE',  note: 17, appreciation: 'Excellent profil, très bonne maîtrise des textes', evaluateur: 'Mme Coulibaly' },
  { id: 'ENT004', candidatId: 'CAN008', offreId: 'OFF001', date: '2026-03-12', heure: '14:00', lieu: 'Bureau DRH',            type: 'RH',         statut: 'REALISE',  note: 13, appreciation: 'Profil correct, expérience limitée',        evaluateur: 'M. Diarra'        },
  { id: 'ENT005', candidatId: 'CAN004', offreId: 'OFF002', date: '2026-03-20', heure: '09:30', lieu: 'DIT — Salle Tech',      type: 'TECHNIQUE',  statut: 'PLANIFIE', note: null, appreciation: '',                                        evaluateur: 'Chef DIT'         },
];

// ── Intégrations ─────────────────────────────────────────────────────────────

const mkEtapes = (doneCount) =>
  ETAPES_INTEGRATION.map((e, i) => ({
    ...e,
    done: i < doneCount,
    date: i < doneCount ? '2026-04-01' : null,
    notes: '',
  }));

export const FAKE_INTEGRATIONS = [
  {
    id: 'INT001', nom: 'Barry', prenom: 'Oumar',
    poste: 'Secrétaire Principal', direction: 'SG', matricule: '2026001',
    dateIntegration: '2026-04-01', statut: 'EN_COURS',
    etapes: mkEtapes(2),
  },
  {
    id: 'INT002', nom: 'Coulibaly', prenom: 'Ibrahim',
    poste: 'Administrateur Civil', direction: 'DRH', matricule: '2026002',
    dateIntegration: '2026-04-15', statut: 'EN_COURS',
    etapes: mkEtapes(1),
  },
  {
    id: 'INT003', nom: 'Keita', prenom: 'Mariam',
    poste: 'Stagiaire Comptabilité', direction: 'DAF', matricule: '2025-STG-04',
    dateIntegration: '2025-12-01', statut: 'TERMINEE',
    etapes: mkEtapes(5),
  },
];
