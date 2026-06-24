import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const fmt    = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';
const val    = (v) => (v !== null && v !== undefined && v !== '') ? String(v) : '—';
const COLOR_PRIMARY = [13, 110, 253];   // Bootstrap primary
const COLOR_DARK    = [33, 37, 41];
const COLOR_MUTED   = [108, 117, 125];
const COLOR_LIGHT   = [248, 249, 250];
const COLOR_BORDER  = [222, 226, 230];

/**
 * Génère et télécharge la fiche PDF d'un agent
 * @param {object} agent — données complètes de l'agent (depuis /api/agents/:id)
 */
export function exportAgentFiche(agent) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const PAGE_W = 210;
  const MARGIN  = 14;
  const COL_W   = (PAGE_W - MARGIN * 2 - 6) / 2;

  let y = 0;

  // ── En-tête ministère ─────────────────────────────────────────────────────
  doc.setFillColor(...COLOR_PRIMARY);
  doc.rect(0, 0, PAGE_W, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('RÉPUBLIQUE DU MALI', PAGE_W / 2, 8, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Un Peuple — Un But — Une Foi', PAGE_W / 2, 13, { align: 'center' });
  doc.text('Ministère de la Communication et des Médias  (MCM)', PAGE_W / 2, 18, { align: 'center' });

  y = 28;

  // ── Bandeau "FICHE AGENT" ─────────────────────────────────────────────────
  doc.setFillColor(...COLOR_LIGHT);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(MARGIN, y, PAGE_W - MARGIN * 2, 22, 2, 2, 'FD');

  // Avatar / initiales
  doc.setFillColor(...COLOR_PRIMARY);
  doc.circle(MARGIN + 11, y + 11, 9, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  const initials = `${(agent.prenom || '')[0] || ''}${(agent.nom_famille || '')[0] || ''}`.toUpperCase();
  doc.text(initials, MARGIN + 11, y + 14, { align: 'center' });

  // Nom complet + grade
  doc.setTextColor(...COLOR_DARK);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(`${agent.prenom || ''} ${agent.nom_famille || ''}`, MARGIN + 24, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_MUTED);
  doc.text(val(agent.grade), MARGIN + 24, y + 15);
  doc.text(`Matricule : ${val(agent.matricule)}`, MARGIN + 24, y + 20);

  // Badge situation
  const sit = agent.situation_admin || '';
  const sitColors = {
    'En activité': [25, 135, 84],
    'Suspendu':    [220, 53, 69],
    'À la retraite': [108, 117, 125],
  };
  const badgeColor = sitColors[sit] || [13, 110, 253];
  const sitW = doc.getTextWidth(sit) + 6;
  doc.setFillColor(...badgeColor);
  doc.roundedRect(PAGE_W - MARGIN - sitW - 2, y + 7, sitW + 2, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text(sit, PAGE_W - MARGIN - sitW / 2, y + 13, { align: 'center' });

  y += 28;

  // ── Fonction utilitaire : table à 2 colonnes ──────────────────────────────
  const addSection = (title, fields) => {
    // Titre de section
    doc.setFillColor(...COLOR_PRIMARY);
    doc.rect(MARGIN, y, PAGE_W - MARGIN * 2, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(title.toUpperCase(), MARGIN + 3, y + 4.2);
    y += 8;

    // Paires clé-valeur en 2 colonnes
    const pairs = fields;
    for (let i = 0; i < pairs.length; i += 2) {
      const left  = pairs[i];
      const right = pairs[i + 1];
      const rowH  = 7;

      // Fond alterné
      if (Math.floor(i / 2) % 2 === 0) {
        doc.setFillColor(250, 250, 252);
        doc.rect(MARGIN, y, PAGE_W - MARGIN * 2, rowH, 'F');
      }

      // Colonne gauche
      doc.setTextColor(...COLOR_MUTED);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text(left.label + ' :', MARGIN + 2, y + 3);
      doc.setTextColor(...COLOR_DARK);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text(val(left.value), MARGIN + 2, y + 6);

      // Colonne droite
      if (right) {
        doc.setTextColor(...COLOR_MUTED);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.text(right.label + ' :', MARGIN + COL_W + 8, y + 3);
        doc.setTextColor(...COLOR_DARK);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.text(val(right.value), MARGIN + COL_W + 8, y + 6);
      }

      // Ligne séparatrice légère
      doc.setDrawColor(...COLOR_BORDER);
      doc.setLineWidth(0.1);
      doc.line(MARGIN, y + rowH, PAGE_W - MARGIN, y + rowH);

      y += rowH;

      // Saut de page si nécessaire
      if (y > 265) {
        doc.addPage();
        y = 15;
      }
    }
    y += 4;
  };

  // ── Informations personnelles ─────────────────────────────────────────────
  addSection('Informations personnelles', [
    { label: 'Nom de famille',      value: agent.nom_famille },
    { label: 'Prénom(s)',           value: agent.prenom },
    { label: 'Sexe',               value: agent.sexe },
    { label: 'Date de naissance',  value: fmt(agent.date_naissance) },
    { label: 'Lieu de naissance',  value: agent.lieu_naissance },
    { label: 'Pays de naissance',  value: agent.pays_naissance },
    { label: 'Nationalité',        value: agent.nationalite },
    { label: 'Situation familiale',value: agent.situation_familiale },
    { label: "Nombre d'enfants",   value: agent.nb_enfants },
    { label: 'Groupe sanguin',     value: agent.groupe_sanguin },
    { label: 'Type de pièce',      value: agent.type_piece },
    { label: 'N° pièce',           value: agent.numero_piece },
  ]);

  // ── Informations administratives ──────────────────────────────────────────
  addSection('Informations administratives', [
    { label: 'Matricule',             value: agent.matricule },
    { label: 'Corps',                 value: agent.corps },
    { label: 'Grade',                 value: agent.grade },
    { label: 'Catégorie',            value: agent.categorie },
    { label: 'Classe',               value: agent.classe },
    { label: 'Échelon',              value: agent.echelon },
    { label: 'Indice',               value: agent.indice },
    { label: 'Type de contrat',      value: agent.type_contrat },
    { label: 'Date de recrutement',  value: fmt(agent.date_recrutement) },
    { label: 'Date de titularisation', value: fmt(agent.date_titularisation) },
    { label: 'Mode de recrutement',  value: agent.mode_recrutement },
    { label: 'N° Arrêté/Décision',  value: agent.numero_decision },
    { label: "N° CNSS",             value: agent.numero_cnss },
    { label: 'N° Caisse retraite',  value: agent.numero_retraite },
    { label: 'RIB / IBAN',          value: agent.rib },
    { label: 'Banque',              value: agent.banque },
  ]);

  // ── Affectation actuelle ──────────────────────────────────────────────────
  addSection('Affectation actuelle', [
    { label: 'Ministère',       value: agent.ministere_affectation },
    { label: 'Direction',       value: agent.direction_libelle },
    { label: 'Service',         value: agent.service },
    { label: 'Bureau',          value: agent.bureau },
    { label: 'Poste / Fonction', value: agent.poste },
    { label: "Lieu d'affectation", value: agent.lieu_affectation },
    { label: "Région",          value: agent.region_affectation },
    { label: '',                value: '' },
  ]);

  // ── Formation ─────────────────────────────────────────────────────────────
  addSection('Formation & Diplômes', [
    { label: "Niveau d'études",  value: agent.niveau_etudes },
    { label: 'Diplôme',         value: agent.diplome },
    { label: 'Spécialité',      value: agent.specialite },
    { label: 'Établissement',   value: agent.etablissement },
    { label: 'Pays de formation', value: agent.pays_formation },
    { label: "Année d'obtention", value: agent.annee_obtention },
  ]);

  // ── Coordonnées ───────────────────────────────────────────────────────────
  addSection('Coordonnées', [
    { label: 'Téléphone mobile', value: agent.telephone_mobile },
    { label: 'Téléphone fixe',  value: agent.telephone_fixe },
    { label: 'Email pro',       value: agent.email_pro },
    { label: 'Email personnel', value: agent.email_personnel },
    { label: 'Adresse',         value: agent.adresse_rue },
    { label: 'Ville / Région',  value: `${agent.adresse_ville || ''}${agent.adresse_region ? ' — ' + agent.adresse_region : ''}` },
  ]);

  // ── Zone signature ────────────────────────────────────────────────────────
  if (y > 235) { doc.addPage(); y = 20; }
  y += 8;

  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.3);

  const sigW = 60;
  const sig1X = MARGIN;
  const sig2X = PAGE_W / 2 - sigW / 2;
  const sig3X = PAGE_W - MARGIN - sigW;

  [
    { x: sig1X, label: "L'agent" },
    { x: sig2X, label: 'Le Chef de service' },
    { x: sig3X, label: 'Le Directeur des RH' },
  ].forEach(({ x, label }) => {
    doc.line(x, y + 18, x + sigW, y + 18);
    doc.setTextColor(...COLOR_MUTED);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.text(label, x + sigW / 2, y + 22, { align: 'center' });
  });

  // ── Pied de page ─────────────────────────────────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(...COLOR_PRIMARY);
    doc.rect(0, 287, PAGE_W, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(
      `SIRH — Ministère de la Communication et des Médias du Mali   |   Généré le ${new Date().toLocaleString('fr-FR')}   |   Page ${i}/${pageCount}`,
      PAGE_W / 2, 293, { align: 'center' }
    );
  }

  // ── Téléchargement ────────────────────────────────────────────────────────
  const safeName = `${agent.nom_famille || 'Agent'}_${agent.prenom || ''}_${agent.matricule || ''}`.replace(/\s+/g, '_');
  doc.save(`Fiche_Agent_${safeName}.pdf`);
}
