import * as XLSX from 'xlsx';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '';

/**
 * Exporte la liste des agents vers un fichier Excel (.xlsx)
 */
export function exportAgentsToExcel(agents, filename) {
  const today = new Date().toLocaleDateString('fr-FR');

  // ── Ligne de titre ──
  const titleRow    = [['MINISTÈRE DE LA COMMUNICATION ET DES MÉDIAS (MCM) — SIRH', '', '', '', '', '', '', '', '', '', '', '', '', '']];
  const subtitleRow = [[`Liste des agents — Exporté le ${today}`, '', '', '', '', '', '', '', '', '', '', '', '', '']];
  const emptyRow  = [['']];

  // ── En-têtes ──
  const headers = [
    'Matricule', 'Nom', 'Prénom', 'Sexe', 'Date naissance',
    'Corps', 'Grade', 'Catégorie', 'Classe', 'Échelon',
    'Poste', 'Direction / Service', 'Situation administrative',
    'Date recrutement', 'Téléphone', 'Email pro',
  ];

  // ── Données ──
  const rows = agents.map((a) => [
    a.matricule           || '',
    a.nom_famille         || '',
    a.prenom              || '',
    a.sexe                || '',
    fmtDate(a.date_naissance),
    a.corps               || '',
    a.grade               || '',
    a.categorie           || '',
    a.classe              || '',
    a.echelon             || '',
    a.poste               || '',
    a.direction_libelle   || '',
    a.situation_admin     || '',
    fmtDate(a.date_recrutement),
    a.telephone_mobile    || '',
    a.email_pro           || '',
  ]);

  // ── Construction du workbook ──
  const wsData = [...titleRow, ...subtitleRow, ...emptyRow, headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Fusion des cellules pour le titre
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 13 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 13 } },
  ];

  // Largeurs des colonnes
  ws['!cols'] = [
    { wch: 14 }, { wch: 20 }, { wch: 20 }, { wch: 10 }, { wch: 16 },
    { wch: 22 }, { wch: 22 }, { wch: 10 }, { wch: 10 }, { wch: 9 },
    { wch: 25 }, { wch: 28 }, { wch: 22 }, { wch: 16 }, { wch: 16 }, { wch: 28 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Agents');

  const name = filename || `Liste_Agents_SIRH_${today.replace(/\//g, '-')}.xlsx`;
  XLSX.writeFile(wb, name);
}
