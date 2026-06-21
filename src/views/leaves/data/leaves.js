export const LEAVE_TYPES = {
  ANNUEL:       { label: 'Congé annuel',      color: 'primary',   icon: 'ph-sun'           },
  MALADIE:      { label: 'Congé maladie',     color: 'warning',   icon: 'ph-first-aid-kit' },
  MATERNITE:    { label: 'Congé maternité',   color: 'info',      icon: 'ph-baby'          },
  PATERNITE:    { label: 'Congé paternité',   color: 'info',      icon: 'ph-baby'          },
  SANS_SOLDE:   { label: 'Sans solde',        color: 'secondary', icon: 'ph-money'         },
  EXCEPTIONNEL: { label: 'Exceptionnel',      color: 'danger',    icon: 'ph-star'          },
};

export const STATUSES = {
  PENDING_CHEF: { label: 'En attente chef', color: 'warning', step: 1 },
  PENDING_DRH:  { label: 'En attente DRH', color: 'info',    step: 2 },
  APPROVED:     { label: 'Approuvé',        color: 'success', step: 3 },
  REJECTED:     { label: 'Rejeté',          color: 'danger',  step: -1 },
};

export const FAKE_EMPLOYEES = [
  { id: 'EMP001', nom: 'Mamadou Koné',       poste: 'Directeur adjoint',         matricule: '2019045', service: 'Direction'      },
  { id: 'EMP002', nom: 'Aminata Traoré',     poste: 'Chef de service RH',        matricule: '2020112', service: 'RH'             },
  { id: 'EMP003', nom: 'Jean-Baptiste Yao',  poste: 'Administrateur principal',  matricule: '2018033', service: 'Administration' },
  { id: 'EMP004', nom: 'Fatoumata Camara',   poste: 'Secrétaire de direction',   matricule: '2021089', service: 'Direction'      },
  { id: 'EMP005', nom: 'Ousmane Diallo',     poste: 'Agent de bureau',           matricule: '2022156', service: 'Administration' },
  { id: 'EMP006', nom: 'Ndeye Sow',          poste: 'Chargée de mission',        matricule: '2020078', service: 'Planification'  },
  { id: 'EMP007', nom: 'Abdoulaye Barry',    poste: 'Inspecteur principal',      matricule: '2017022', service: 'Inspection'     },
  { id: 'EMP008', nom: 'Marie-Claire Bah',   poste: "Attachée d'administration", matricule: '2023201', service: 'Administration' },
];

const d = (offset) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + offset);
  return dt.toISOString().split('T')[0];
};

export const countBusinessDays = (start, end) => {
  let count = 0;
  const cur = new Date(start);
  const endDate = new Date(end);
  while (cur <= endDate) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
};

export const INITIAL_LEAVES = [
  {
    id: 'LV001',
    employeeId: 'EMP002', nom: 'Aminata Traoré', poste: 'Chef de service RH', matricule: '2020112', service: 'RH',
    type: 'ANNUEL', dateDebut: d(5), dateFin: d(14), nbJours: 8,
    motif: 'Congé annuel planifié',
    status: 'APPROVED', createdAt: d(-12),
    validationChef: { date: d(-10), validatedBy: 'M. Koné — Directeur adjoint', comment: 'Approuvé' },
    validationDRH:  { date: d(-8),  validatedBy: 'Administrateur RH',           comment: 'Dossier complet' },
    rejection: null,
  },
  {
    id: 'LV002',
    employeeId: 'EMP004', nom: 'Fatoumata Camara', poste: 'Secrétaire de direction', matricule: '2021089', service: 'Direction',
    type: 'MALADIE', dateDebut: d(-3), dateFin: d(1), nbJours: 3,
    motif: 'Arrêt maladie — certificat médical joint',
    status: 'APPROVED', createdAt: d(-5),
    validationChef: { date: d(-4), validatedBy: 'M. Koné — Directeur adjoint', comment: 'Urgent, approuvé' },
    validationDRH:  { date: d(-3), validatedBy: 'Administrateur RH',           comment: '' },
    rejection: null,
  },
  {
    id: 'LV003',
    employeeId: 'EMP005', nom: 'Ousmane Diallo', poste: 'Agent de bureau', matricule: '2022156', service: 'Administration',
    type: 'ANNUEL', dateDebut: d(20), dateFin: d(34), nbJours: 11,
    motif: 'Congé annuel — retour au village',
    status: 'PENDING_DRH', createdAt: d(-3),
    validationChef: { date: d(-1), validatedBy: 'Mme Traoré — Chef RH', comment: 'Validé au niveau service' },
    validationDRH: null, rejection: null,
  },
  {
    id: 'LV004',
    employeeId: 'EMP007', nom: 'Abdoulaye Barry', poste: 'Inspecteur principal', matricule: '2017022', service: 'Inspection',
    type: 'EXCEPTIONNEL', dateDebut: d(2), dateFin: d(4), nbJours: 3,
    motif: 'Décès beau-père',
    status: 'PENDING_CHEF', createdAt: d(-1),
    validationChef: null, validationDRH: null, rejection: null,
  },
  {
    id: 'LV005',
    employeeId: 'EMP006', nom: 'Ndeye Sow', poste: 'Chargée de mission', matricule: '2020078', service: 'Planification',
    type: 'MATERNITE', dateDebut: d(10), dateFin: d(100), nbJours: 65,
    motif: 'Congé maternité — accouchement prévu le ' + d(10),
    status: 'PENDING_CHEF', createdAt: d(0),
    validationChef: null, validationDRH: null, rejection: null,
  },
  {
    id: 'LV006',
    employeeId: 'EMP003', nom: 'Jean-Baptiste Yao', poste: 'Administrateur principal', matricule: '2018033', service: 'Administration',
    type: 'SANS_SOLDE', dateDebut: d(-20), dateFin: d(-11), nbJours: 8,
    motif: 'Raisons personnelles',
    status: 'REJECTED', createdAt: d(-25),
    validationChef: null, validationDRH: null,
    rejection: { date: d(-22), rejectedBy: 'M. Koné — Directeur adjoint', motif: 'Période de forte activité. Veuillez reporter après la clôture de l\'audit.' },
  },
  {
    id: 'LV007',
    employeeId: 'EMP008', nom: 'Marie-Claire Bah', poste: "Attachée d'administration", matricule: '2023201', service: 'Administration',
    type: 'ANNUEL', dateDebut: d(30), dateFin: d(44), nbJours: 11,
    motif: 'Congé annuel planifié',
    status: 'PENDING_CHEF', createdAt: d(0),
    validationChef: null, validationDRH: null, rejection: null,
  },
  {
    id: 'LV008',
    employeeId: 'EMP001', nom: 'Mamadou Koné', poste: 'Directeur adjoint', matricule: '2019045', service: 'Direction',
    type: 'ANNUEL', dateDebut: d(-30), dateFin: d(-16), nbJours: 11,
    motif: 'Congé annuel',
    status: 'APPROVED', createdAt: d(-40),
    validationChef: { date: d(-38), validatedBy: 'Direction générale', comment: '' },
    validationDRH:  { date: d(-37), validatedBy: 'Administrateur RH',  comment: 'RAS' },
    rejection: null,
  },
];
