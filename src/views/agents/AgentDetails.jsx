import { useParams, Navigate, Link } from 'react-router-dom';

// react-bootstrap
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import { useState } from 'react';

// project-imports
import MainCard from 'components/MainCard';
import { FAKE_AGENTS } from './data/agents';

const fmt = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';

const INFO_STATUT = {
  'En activité':        'success',
  'En congé maladie':   'warning',
  'En congé maternité': 'info',
  'En détachement':     'info',
  'En disponibilité':   'secondary',
  'Suspendu':           'danger',
  'À la retraite':      'dark',
};

const TABS = [
  { id: 'personal',     icon: 'ph-user',                    label: 'Informations personnelles'    },
  { id: 'admin',        icon: 'ph-briefcase',               label: 'Informations administratives' },
  { id: 'affectations', icon: 'ph-map-pin',                 label: 'Affectations'                 },
  { id: 'documents',    icon: 'ph-files',                   label: 'Documents'                    },
  { id: 'historique',   icon: 'ph-clock-counter-clockwise', label: 'Historique'                   },
  { id: 'photo',        icon: 'ph-camera',                  label: 'Photo'                        },
  { id: 'biometrie',    icon: 'ph-fingerprint',             label: 'Biométrie'                    },
];

// ── Helpers affichage ─────────────────────────────────────────────────────────

const InfoRow = ({ label, value, wide }) => (
  <Col xs={12} md={wide ? 12 : 6} lg={wide ? 12 : 4} className="mb-2">
    <small className="text-muted d-block">{label}</small>
    <span className="fw-semibold">{value || <span className="text-muted fst-italic">—</span>}</span>
  </Col>
);

const SectionTitle = ({ children }) => (
  <Col xs={12}>
    <p className="text-muted text-uppercase fw-semibold small border-bottom pb-2 mb-2 mt-3">{children}</p>
  </Col>
);

// ==============================|| AGENTS — DÉTAILS ||============================== //

export default function AgentDetails() {
  const { id }        = useParams();
  const agent          = FAKE_AGENTS.find((a) => a.id === id);
  const [tab, setTab] = useState('personal');

  if (!agent) return <Navigate to="/agents" replace />;

  const fullName = `${agent.prenom} ${agent.nomFamille}`;
  const initials = `${agent.prenom[0]}${agent.nomFamille[0]}`;

  const renderPersonal = () => (
    <Row>
      <SectionTitle>Identité</SectionTitle>
      <InfoRow label="Nom de famille"          value={agent.nomFamille} />
      <InfoRow label="Prénom(s)"               value={agent.prenom} />
      <InfoRow label="Prénom secondaire"       value={agent.prenomSecondaire} />
      <InfoRow label="Nom de jeune fille"      value={agent.nomJeuneFile} />
      <InfoRow label="Sexe"                    value={agent.sexe} />
      <InfoRow label="Date de naissance"       value={fmt(agent.dateNaissance)} />
      <InfoRow label="Lieu de naissance"       value={agent.lieuNaissance} />
      <InfoRow label="Pays de naissance"       value={agent.paysNaissance} />
      <InfoRow label="Nationalité"             value={agent.nationalite} />
      <InfoRow label="Situation familiale"     value={agent.situationFamiliale} />
      <InfoRow label="Nombre d'enfants"        value={agent.nbEnfants} />
      <InfoRow label="Groupe sanguin"          value={agent.groupeSanguin} />

      <SectionTitle>Pièce d'identité</SectionTitle>
      <InfoRow label="Type de pièce"   value={agent.typePiece} />
      <InfoRow label="Numéro"          value={agent.numeroPiece} />
      <InfoRow label="Date d'expiration" value={fmt(agent.dateExpiration)} />

      <SectionTitle>Adresse</SectionTitle>
      <InfoRow label="Rue / Quartier" value={agent.adresseRue} wide />
      <InfoRow label="Ville"          value={agent.adresseVille} />
      <InfoRow label="Région"         value={agent.adresseRegion} />
      <InfoRow label="Pays"           value={agent.adressePays} />

      <SectionTitle>Coordonnées</SectionTitle>
      <InfoRow label="Téléphone mobile"      value={agent.telephoneMobile} />
      <InfoRow label="Téléphone fixe"        value={agent.telephoneFixe} />
      <InfoRow label="Email professionnel"   value={agent.emailPro} />
      <InfoRow label="Email personnel"       value={agent.emailPersonnel} />

      <SectionTitle>Contact d'urgence</SectionTitle>
      <InfoRow label="Nom"       value={agent.urgenceNom} />
      <InfoRow label="Relation"  value={agent.urgenceRelation} />
      <InfoRow label="Téléphone" value={agent.urgenceTelephone} />
    </Row>
  );

  const renderAdmin = () => (
    <Row>
      <SectionTitle>Identification administrative</SectionTitle>
      <InfoRow label="Matricule"     value={agent.matricule} />
      <InfoRow label="Corps"         value={agent.corps} />
      <InfoRow label="Grade"         value={agent.grade} />
      <InfoRow label="Catégorie"     value={agent.categorie} />
      <InfoRow label="Classe"        value={agent.classe} />
      <InfoRow label="Échelon"       value={agent.echelon} />
      <InfoRow label="Indice"        value={agent.indice} />

      <SectionTitle>Recrutement & Nomination</SectionTitle>
      <InfoRow label="Date de recrutement"    value={fmt(agent.dateRecrutement)} />
      <InfoRow label="Date prise de fonction" value={fmt(agent.datePriseFonction)} />
      <InfoRow label="Date de titularisation" value={fmt(agent.dateTitularisation)} />
      <InfoRow label="Mode de recrutement"    value={agent.modeRecrutement} />
      <InfoRow label="N° Arrêté / Décision"  value={agent.numeroDecision} />
      <InfoRow label="Date de la décision"    value={fmt(agent.dateDecision)} />
      <InfoRow label="Référence J.O."         value={agent.referenceJO} />
      <InfoRow label="Ministère d'origine"    value={agent.ministereDOrigine} wide />

      <SectionTitle>Formation principale</SectionTitle>
      <InfoRow label="Niveau d'études"   value={agent.niveauEtudes} />
      <InfoRow label="Diplôme"           value={agent.diplome} />
      <InfoRow label="Spécialité"        value={agent.specialite} />
      <InfoRow label="Établissement"     value={agent.etablissement} />
      <InfoRow label="Pays"              value={agent.paysFormation} />
      <InfoRow label="Année"             value={agent.anneeObtention} />

      <SectionTitle>Contrat & Statut</SectionTitle>
      <InfoRow label="Type de contrat"          value={agent.typeContrat} />
      <InfoRow label="Situation administrative" value={
        agent.situationAdmin ? (
          <Badge bg={INFO_STATUT[agent.situationAdmin] || 'secondary'}>{agent.situationAdmin}</Badge>
        ) : '—'
      } />

      <SectionTitle>Rémunération & Banque</SectionTitle>
      <InfoRow label="N° CNSS"             value={agent.numeroCnss} />
      <InfoRow label="N° Caisse de retraite" value={agent.numeroRetraite} />
      <InfoRow label="RIB / IBAN"          value={agent.rib} />
      <InfoRow label="Banque"              value={agent.banque} />
    </Row>
  );

  const renderAffectations = () => (
    <Row>
      <SectionTitle>Affectation actuelle</SectionTitle>
      <InfoRow label="Ministère"       value={agent.ministereAffectation} wide />
      <InfoRow label="Direction"       value={agent.direction} />
      <InfoRow label="Sous-direction"  value={agent.sousDirection} />
      <InfoRow label="Service"         value={agent.service} />
      <InfoRow label="Bureau"          value={agent.bureau} />
      <InfoRow label="Poste"           value={agent.poste} />
      <InfoRow label="Lieu"            value={agent.lieuAffectation} />
      <InfoRow label="Région"          value={agent.regionAffectation} />

      <SectionTitle>Historique des affectations</SectionTitle>
      <Col xs={12}>
        <p className="text-muted small fst-italic">Aucune affectation antérieure enregistrée dans ce dossier fictif.</p>
      </Col>
    </Row>
  );

  const renderDocuments = () => (
    <Row>
      <Col xs={12}>
        <div className="text-center py-5 text-muted">
          <i className="ph ph-files f-36 d-block mb-2" />
          <p>Les documents seront affichés ici une fois téléversés.</p>
          <Button as={Link} to={`/agents/${id}/edit`} variant="outline-primary" size="sm">
            <i className="ph ph-upload-simple me-2" />Ajouter des documents
          </Button>
        </div>
      </Col>
    </Row>
  );

  const renderHistorique = () => (
    <Row>
      <Col xs={12} className="mb-3">
        <div className="d-flex align-items-center gap-3">
          <div className="border-start border-3 border-success ps-3 py-1">
            <div className="fw-semibold">Recrutement</div>
            <small className="text-muted">{fmt(agent.dateRecrutement)} — {agent.modeRecrutement}</small>
            <div className="text-muted small">{agent.corps}</div>
          </div>
        </div>
      </Col>
      {agent.dateTitularisation && (
        <Col xs={12} className="mb-3">
          <div className="d-flex align-items-center gap-3">
            <div className="border-start border-3 border-primary ps-3 py-1">
              <div className="fw-semibold">Titularisation</div>
              <small className="text-muted">{fmt(agent.dateTitularisation)}</small>
            </div>
          </div>
        </Col>
      )}
      <Col xs={12}>
        <p className="text-muted small fst-italic mt-2">
          Les événements de carrière supplémentaires (promotions, mutations, distinctions) peuvent être ajoutés lors de la modification du dossier.
        </p>
      </Col>
    </Row>
  );

  const renderPhoto = () => (
    <Row className="justify-content-center">
      <Col xs={12} md={6} className="text-center">
        <div
          className="mx-auto mb-3 border rounded bg-light d-flex align-items-center justify-content-center"
          style={{ width: 150, height: 190 }}
        >
          <div style={{ fontSize: 56, fontWeight: 700, color: 'var(--bs-primary)', opacity: 0.5 }}>
            {initials}
          </div>
        </div>
        <p className="text-muted small">Aucune photo importée pour cet agent fictif.</p>
        <Button as={Link} to={`/agents/${id}/edit`} variant="outline-primary" size="sm">
          <i className="ph ph-camera me-2" />Ajouter une photo
        </Button>
      </Col>
    </Row>
  );

  const renderBiometrie = () => (
    <div className="text-center py-5 text-muted">
      <i className="ph ph-fingerprint f-48 d-block mb-3 text-muted" />
      <h6>Empreintes digitales</h6>
      <p className="small">
        {agent.prenom} {agent.nomFamille} — Aucune empreinte enregistrée dans ce dossier fictif.
      </p>
      <Button as={Link} to={`/agents/${id}/edit`} variant="outline-primary" size="sm">
        <i className="ph ph-fingerprint me-2" />Aller à la biométrie
      </Button>
    </div>
  );

  const renderContent = () => {
    switch (tab) {
      case 'personal':     return renderPersonal();
      case 'admin':        return renderAdmin();
      case 'affectations': return renderAffectations();
      case 'documents':    return renderDocuments();
      case 'historique':   return renderHistorique();
      case 'photo':        return renderPhoto();
      case 'biometrie':    return renderBiometrie();
      default:             return null;
    }
  };

  return (
    <Row>
      {/* ── Carte de profil ── */}
      <Col xs={12} lg={3} className="mb-4 mb-lg-0">
        <MainCard>
          <div className="text-center py-2">
            <div
              className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 bg-primary bg-opacity-10"
              style={{ width: 80, height: 80, fontSize: 28, fontWeight: 700, color: 'var(--bs-primary)' }}
            >
              {initials}
            </div>
            <h5 className="mb-1">{fullName}</h5>
            <p className="text-muted small mb-2">{agent.grade}</p>
            <Badge bg={INFO_STATUT[agent.situationAdmin] || 'secondary'} className="mb-3">
              {agent.situationAdmin}
            </Badge>

            <div className="text-start border-top pt-3 mt-1">
              {[
                { icon: 'ph-identification-card', label: 'Matricule', val: agent.matricule },
                { icon: 'ph-buildings',           label: 'Ministère', val: agent.ministereAffectation },
                { icon: 'ph-briefcase',           label: 'Poste',     val: agent.poste },
                { icon: 'ph-map-pin',             label: 'Lieu',      val: agent.lieuAffectation },
                { icon: 'ph-phone',               label: 'Mobile',    val: agent.telephoneMobile },
                { icon: 'ph-envelope',            label: 'Email',     val: agent.emailPro },
              ].map(({ icon, label, val }) => (
                val ? (
                  <div key={label} className="d-flex gap-2 mb-2 align-items-start">
                    <i className={`ph ${icon} text-muted mt-1 flex-shrink-0`} />
                    <div>
                      <small className="text-muted d-block">{label}</small>
                      <span className="small">{val}</span>
                    </div>
                  </div>
                ) : null
              ))}
            </div>

            <div className="d-grid gap-2 mt-3">
              <Button as={Link} to={`/agents/${id}/edit`} variant="primary" size="sm">
                <i className="ph ph-pencil me-2" />Modifier le dossier
              </Button>
              <Button as={Link} to="/agents" variant="outline-secondary" size="sm">
                <i className="ph ph-arrow-left me-2" />Retour à la liste
              </Button>
            </div>
          </div>
        </MainCard>
      </Col>

      {/* ── Détails ── */}
      <Col xs={12} lg={9}>
        <MainCard
          title={
            <div className="d-flex align-items-center gap-2">
              <i className="ph ph-folder-open text-primary" />
              <span>Dossier de l'agent</span>
              <Badge bg="light" text="dark" className="ms-2">{agent.typeContrat}</Badge>
            </div>
          }
        >
          <Nav variant="tabs" className="mb-4 flex-nowrap overflow-auto" activeKey={tab} onSelect={setTab}>
            {TABS.map((t) => (
              <Nav.Item key={t.id} style={{ flexShrink: 0 }}>
                <Nav.Link eventKey={t.id} className="d-flex align-items-center gap-2 py-2">
                  <i className={`ph ${t.icon}`} />
                  <span className="d-none d-md-inline">{t.label}</span>
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          {renderContent()}
        </MainCard>
      </Col>
    </Row>
  );
}
