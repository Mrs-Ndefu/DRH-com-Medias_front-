// ── Constantes ───────────────────────────────────────────────────────────────

export const MOIS_NOMS = ['Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

export const STATUTS_BULLETIN = {
  CALCULE:  { label: 'Calculé',   color: 'secondary' },
  VALIDE:   { label: 'Validé',    color: 'primary'   },
  VIRE:     { label: 'Viré',      color: 'success'   },
  REJETE:   { label: 'Rejeté',    color: 'danger'    },
};

export const STATUTS_VIREMENT = {
  EN_ATTENTE: { label: 'En attente', color: 'warning'   },
  TRAITE:     { label: 'Traité',     color: 'success'   },
  REJETE:     { label: 'Rejeté',     color: 'danger'    },
};

export const STATUTS_DECLARATION = {
  EN_ATTENTE: { label: 'En attente', color: 'warning'   },
  SOUMISE:    { label: 'Soumise',    color: 'info'      },
  VALIDEE:    { label: 'Validée',    color: 'success'   },
  REJETEE:    { label: 'Rejetée',    color: 'danger'    },
};

export const TYPES_ELEMENT = {
  PRIME:      { label: 'Prime',        color: 'success' },
  INDEMNITE:  { label: 'Indemnité',    color: 'info'    },
  RETENUE:    { label: 'Retenue',      color: 'danger'  },
  COTISATION: { label: 'Cotisation',   color: 'warning' },
};

export const MODES_PAIEMENT = ['VIREMENT', 'ESPECES'];
export const BANQUES = ['BDM-SA', 'BNDA', 'Ecobank', 'Coris Bank', 'UBA Mali'];

// ── Taux de référence (FCFA) ──────────────────────────────────────────────────

export const TAUX_INDICE      = 2000;   // FCFA par point d'indice
export const TAUX_INPS        = 0.036;  // 3,6 % sur salaire de base
export const TAUX_CANAM       = 0.015;  // 1,5 % sur salaire de base

// ── Éléments de paie ─────────────────────────────────────────────────────────

export const FAKE_ELEMENTS = [
  { id: 'EL001', code: 'SB',   designation: 'Salaire de base',            type: 'PRIME',      base: 'INDICE',   taux: 2000,   imposable: true,  active: true  },
  { id: 'EL002', code: 'IFO',  designation: 'Indemnité de fonction',       type: 'INDEMNITE',  base: 'FIXE',     taux: 250000, imposable: false, active: true  },
  { id: 'EL003', code: 'ILG',  designation: 'Indemnité de logement',       type: 'INDEMNITE',  base: 'FIXE',     taux: 120000, imposable: false, active: true  },
  { id: 'EL004', code: 'ITR',  designation: 'Indemnité de transport',      type: 'INDEMNITE',  base: 'FIXE',     taux: 40000,  imposable: false, active: true  },
  { id: 'EL005', code: 'IFA',  designation: 'Indemnité familiale',         type: 'INDEMNITE',  base: 'FIXE',     taux: 15000,  imposable: false, active: true  },
  { id: 'EL006', code: 'IREP', designation: 'Indemnité de représentation', type: 'INDEMNITE',  base: 'FIXE',     taux: 200000, imposable: false, active: true  },
  { id: 'EL007', code: 'PPR',  designation: 'Prime de performance',        type: 'PRIME',      base: '% BASE',   taux: 15,     imposable: true,  active: true  },
  { id: 'EL008', code: 'INPS', designation: "Cotisation INPS (retraite)",  type: 'COTISATION', base: '% BASE',   taux: 3.6,    imposable: false, active: true  },
  { id: 'EL009', code: 'CAN',  designation: 'Cotisation CANAM (santé)',    type: 'COTISATION', base: '% BASE',   taux: 1.5,    imposable: false, active: true  },
  { id: 'EL010', code: 'IR',   designation: 'Impôt sur le revenu',         type: 'RETENUE',    base: '% BRUT',   taux: 0,      imposable: false, active: true  },
  { id: 'EL011', code: 'AVA',  designation: 'Avance sur salaire',          type: 'RETENUE',    base: 'FIXE',     taux: 0,      imposable: false, active: true  },
  { id: 'EL012', code: 'ABS',  designation: 'Retenue pour absence',        type: 'RETENUE',    base: 'FIXE',     taux: 0,      imposable: false, active: false },
];

// ── Calcul IR simplifié (barème progressif Mali) ──────────────────────────────

export function calculIR(revenuImposable) {
  // Barème mensuel simplifié (FCFA)
  if (revenuImposable <= 150000)  return 0;
  if (revenuImposable <= 300000)  return Math.round((revenuImposable - 150000) * 0.05);
  if (revenuImposable <= 600000)  return Math.round(7500 + (revenuImposable - 300000) * 0.10);
  if (revenuImposable <= 1000000) return Math.round(37500 + (revenuImposable - 600000) * 0.15);
  if (revenuImposable <= 2000000) return Math.round(97500 + (revenuImposable - 1000000) * 0.22);
  return Math.round(317500 + (revenuImposable - 2000000) * 0.30);
}

// ── Agents de paie ────────────────────────────────────────────────────────────

const mkBulletin = (id, agent) => {
  const salaireBase   = agent.indice * TAUX_INDICE;
  const primes        = [
    { code: 'SB',   designation: 'Salaire de base',          montant: salaireBase   },
    ...(agent.chefDivision ? [{ code: 'IFO', designation: 'Indemnité de fonction', montant: 250000 }] : []),
    { code: 'ILG',  designation: 'Indemnité de logement',    montant: agent.categ === 'A' ? 150000 : agent.categ === 'B' ? 100000 : 80000 },
    { code: 'ITR',  designation: 'Indemnité de transport',   montant: 40000 },
    ...(agent.nbEnfants > 0 ? [{ code: 'IFA', designation: 'Indemnité familiale', montant: agent.nbEnfants * 15000 }] : []),
  ];

  const salaireBrut   = primes.reduce((s, p) => s + p.montant, 0);
  const revImposable  = salaireBase;
  const cotINPS       = Math.round(salaireBase * TAUX_INPS);
  const cotCANAM      = Math.round(salaireBase * TAUX_CANAM);
  const impotRevenu   = calculIR(revImposable);
  const avance        = agent.avance || 0;

  const retenues = [
    { code: 'INPS', designation: "Cotisation INPS (3,6%)", montant: cotINPS  },
    { code: 'CAN',  designation: 'Cotisation CANAM (1,5%)', montant: cotCANAM },
    { code: 'IR',   designation: 'Impôt sur le revenu',     montant: impotRevenu },
    ...(avance > 0 ? [{ code: 'AVA', designation: 'Remboursement avance', montant: avance }] : []),
  ];

  const totalRetenues = retenues.reduce((s, r) => s + r.montant, 0);
  const salaireNet    = salaireBrut - totalRetenues;

  return {
    id,
    agentId:     agent.id,
    matricule:   agent.matricule,
    nom:         agent.nom,
    prenom:      agent.prenom,
    direction:   agent.direction,
    grade:       agent.grade,
    categorie:   agent.categ,
    mois:        6,
    annee:       2026,
    periode:     'Juin 2026',
    indice:      agent.indice,
    salaireBase,
    primes,
    retenues,
    salaireBrut,
    totalRetenues,
    salaireNet,
    modePaiement: agent.modePaiement,
    banque:       agent.banque || '',
    numCompte:    agent.numCompte || '',
    statut:       agent.statut,
    dateGeneration: '2026-06-25',
    dateValidation: agent.statut !== 'CALCULE' ? '2026-06-27' : null,
    reference:    `BUL-2026-06-${id.replace('BUL','').padStart(4,'0')}`,
  };
};

const AGENTS_BASE = [
  { id: 'A001', matricule: '2019045', nom: 'Koné',      prenom: 'Mamadou',    direction: 'DRH', grade: 'Administrateur civil principal', categ: 'A', indice: 950, chefDivision: true,  nbEnfants: 3, avance: 0,      modePaiement: 'VIREMENT', banque: 'BDM-SA',  numCompte: 'ML19BDM000001', statut: 'VIRE'     },
  { id: 'A002', matricule: '2018033', nom: 'Yao',       prenom: 'Jean-Baptiste', direction: 'DAF', grade: 'Administrateur civil principal', categ: 'A', indice: 900, chefDivision: true, nbEnfants: 2, avance: 0,     modePaiement: 'VIREMENT', banque: 'BNDA',    numCompte: 'ML19BND000002', statut: 'VIRE'     },
  { id: 'A003', matricule: '2020078', nom: 'Sow',       prenom: 'Ndeye',      direction: 'DPL', grade: 'Administrateur civil', categ: 'A', indice: 700, chefDivision: true,  nbEnfants: 1, avance: 0,      modePaiement: 'VIREMENT', banque: 'Ecobank', numCompte: 'ML19ECO000003', statut: 'VIRE'     },
  { id: 'A004', matricule: '2017022', nom: 'Barry',     prenom: 'Abdoulaye',  direction: 'DIJ', grade: "Attaché principal d'administration", categ: 'A', indice: 550, chefDivision: false, nbEnfants: 4, avance: 100000, modePaiement: 'VIREMENT', banque: 'BDM-SA', numCompte: 'ML19BDM000004', statut: 'VALIDE'   },
  { id: 'A005', matricule: '2021034', nom: 'Traoré',    prenom: 'Aminata',    direction: 'DRH', grade: "Attaché d'administration", categ: 'A', indice: 450, chefDivision: false, nbEnfants: 2, avance: 0,     modePaiement: 'VIREMENT', banque: 'BDM-SA',  numCompte: 'ML19BDM000005', statut: 'VALIDE'   },
  { id: 'A006', matricule: '2019067', nom: 'Camara',    prenom: 'Fatoumata',  direction: 'DRH', grade: 'Secrétaire principal', categ: 'B', indice: 340, chefDivision: false, nbEnfants: 0, avance: 0,      modePaiement: 'VIREMENT', banque: 'Coris Bank', numCompte: 'ML19COR000006', statut: 'VALIDE' },
  { id: 'A007', matricule: '2022011', nom: 'Diallo',    prenom: 'Oumar',      direction: 'DIT', grade: 'Secrétaire', categ: 'B', indice: 280, chefDivision: false, nbEnfants: 1, avance: 50000, modePaiement: 'VIREMENT', banque: 'UBA Mali', numCompte: 'ML19UBA000007', statut: 'CALCULE'  },
  { id: 'A008', matricule: '2023005', nom: 'Coulibaly', prenom: 'Ibrahim',    direction: 'DRH', grade: 'Agent de bureau', categ: 'C', indice: 200, chefDivision: false, nbEnfants: 0, avance: 0,      modePaiement: 'ESPECES',  banque: '',         numCompte: '',              statut: 'CALCULE'  },
];

export const FAKE_BULLETINS = AGENTS_BASE.map((a, i) => mkBulletin(`BUL${String(i+1).padStart(3,'0')}`, a));

// ── Virements ─────────────────────────────────────────────────────────────────

export const FAKE_VIREMENTS = [
  {
    id: 'VIR001', reference: 'ORD-2026-06-001', mois: 6, annee: 2026, periode: 'Juin 2026',
    dateVirement: '2026-06-30', montantTotal: FAKE_BULLETINS.filter(b => b.statut === 'VIRE').reduce((s,b) => s+b.salaireNet, 0),
    nbBeneficiaires: FAKE_BULLETINS.filter(b => b.statut === 'VIRE').length,
    banque: 'BDM-SA / BNDA / Ecobank', statut: 'TRAITE', fichier: 'virement-juin-2026.xlsx',
  },
  {
    id: 'VIR002', reference: 'ORD-2026-06-002', mois: 6, annee: 2026, periode: 'Juin 2026',
    dateVirement: '2026-06-30', montantTotal: FAKE_BULLETINS.filter(b => b.statut === 'VALIDE').reduce((s,b) => s+b.salaireNet, 0),
    nbBeneficiaires: FAKE_BULLETINS.filter(b => b.statut === 'VALIDE').length,
    banque: 'BDM-SA / Coris Bank', statut: 'EN_ATTENTE', fichier: null,
  },
  {
    id: 'VIR003', reference: 'ORD-2026-05-001', mois: 5, annee: 2026, periode: 'Mai 2026',
    dateVirement: '2026-05-30', montantTotal: 87450000,
    nbBeneficiaires: 130, banque: 'Toutes banques', statut: 'TRAITE', fichier: 'virement-mai-2026.xlsx',
  },
];

// ── Déclarations sociales ────────────────────────────────────────────────────

const masseBase = FAKE_BULLETINS.reduce((s,b) => s + b.salaireBase, 0);

export const FAKE_DECLARATIONS = [
  {
    id: 'DEC001', type: 'INPS', libelle: 'Déclaration INPS — Juin 2026', periode: 'Juin 2026',
    montant: Math.round(masseBase * TAUX_INPS),
    cotisationPatronale: Math.round(masseBase * 0.072), // 7,2% patronal
    montantTotal: Math.round(masseBase * (TAUX_INPS + 0.072)),
    dateLimite: '2026-07-15', dateDeclaration: null, reference: null,
    statut: 'EN_ATTENTE',
  },
  {
    id: 'DEC002', type: 'CANAM', libelle: 'Déclaration CANAM — Juin 2026', periode: 'Juin 2026',
    montant: Math.round(masseBase * TAUX_CANAM),
    cotisationPatronale: Math.round(masseBase * 0.03), // 3% patronal
    montantTotal: Math.round(masseBase * (TAUX_CANAM + 0.03)),
    dateLimite: '2026-07-15', dateDeclaration: null, reference: null,
    statut: 'EN_ATTENTE',
  },
  {
    id: 'DEC003', type: 'IMPOTS', libelle: 'Déclaration IR — Juin 2026', periode: 'Juin 2026',
    montant: FAKE_BULLETINS.reduce((s,b) => s + b.retenues.find(r=>r.code==='IR')?.montant, 0),
    cotisationPatronale: 0, montantTotal: FAKE_BULLETINS.reduce((s,b) => s + b.retenues.find(r=>r.code==='IR')?.montant, 0),
    dateLimite: '2026-07-20', dateDeclaration: null, reference: null,
    statut: 'EN_ATTENTE',
  },
  {
    id: 'DEC004', type: 'INPS', libelle: 'Déclaration INPS — Mai 2026', periode: 'Mai 2026',
    montant: 3650000, cotisationPatronale: 7300000, montantTotal: 10950000,
    dateLimite: '2026-06-15', dateDeclaration: '2026-06-12', reference: 'INPS-2026-06-0789',
    statut: 'VALIDEE',
  },
  {
    id: 'DEC005', type: 'CANAM', libelle: 'Déclaration CANAM — Mai 2026', periode: 'Mai 2026',
    montant: 1520000, cotisationPatronale: 3040000, montantTotal: 4560000,
    dateLimite: '2026-06-15', dateDeclaration: '2026-06-12', reference: 'CAN-2026-06-0234',
    statut: 'VALIDEE',
  },
];

export const TAUX_INPS_EXPORT = TAUX_INPS;
export const TAUX_CANAM_EXPORT = TAUX_CANAM;
