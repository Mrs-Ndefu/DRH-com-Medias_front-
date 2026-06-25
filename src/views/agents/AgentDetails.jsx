import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useSWR from 'swr';

// react-bootstrap
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

// project-imports
import MainCard from 'components/MainCard';
import { fetcher } from 'api/client';
import { exportAgentFiche } from 'utils/exportAgentPdf';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000';

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
  const { id }            = useParams();
  const [tab, setTab]     = useState('personal');
  const [pdfLoading, setPdfLoading] = useState(false);

  const { data: agent, error, isLoading } = useSWR(`/agents/${id}`, fetcher);

  const handlePdf = () => {
    if (!agent) return;
    setPdfLoading(true);
    setTimeout(() => {
      exportAgentFiche(agent);
      setPdfLoading(false);
    }, 50);
  };

  if (isLoading) return (
    <div className="text-center py-5">
      <Spinner animation="border" variant="primary" />
    </div>
  );

  if (error) return (
    <Alert variant="danger">
      <i className="ph ph-warning me-2" />Agent introuvable ou serveur inaccessible.
    </Alert>
  );

  if (!agent) return null;

  const fullName = `${agent.prenom} ${agent.nom_famille}`;
  const initials = `${agent.prenom?.[0] || ''}${agent.nom_famille?.[0] || ''}`;

  const renderPersonal = () => (
    <Row>
      <SectionTitle>Identité</SectionTitle>
      <InfoRow label="Nom de famille"          value={agent.nom_famille} />
      <InfoRow label="Prénom(s)"               value={agent.prenom} />
      <InfoRow label="Prénom secondaire"       value={agent.prenom_secondaire} />
      <InfoRow label="Nom de jeune fille"      value={agent.nom_jeune_fille} />
      <InfoRow label="Sexe"                    value={agent.sexe} />
      <InfoRow label="Date de naissance"       value={fmt(agent.date_naissance)} />
      <InfoRow label="Lieu de naissance"       value={agent.lieu_naissance} />
      <InfoRow label="Pays de naissance"       value={agent.pays_naissance} />
      <InfoRow label="Nationalité"             value={agent.nationalite} />
      <InfoRow label="Situation familiale"     value={agent.situation_familiale} />
      <InfoRow label="Nombre d'enfants"        value={agent.nb_enfants} />
      <InfoRow label="Groupe sanguin"          value={agent.groupe_sanguin} />

      <SectionTitle>Pièce d'identité</SectionTitle>
      <InfoRow label="Type de pièce"     value={agent.type_piece} />
      <InfoRow label="Numéro"            value={agent.numero_piece} />
      <InfoRow label="Date d'expiration" value={fmt(agent.date_expiration_piece)} />

      <SectionTitle>Adresse</SectionTitle>
      <InfoRow label="Rue / Quartier" value={agent.adresse_rue} wide />
      <InfoRow label="Ville"          value={agent.adresse_ville} />
      <InfoRow label="Région"         value={agent.adresse_region} />
      <InfoRow label="Pays"           value={agent.adresse_pays} />

      <SectionTitle>Coordonnées</SectionTitle>
      <InfoRow label="Téléphone mobile"      value={agent.telephone_mobile} />
      <InfoRow label="Téléphone fixe"        value={agent.telephone_fixe} />
      <InfoRow label="Email professionnel"   value={agent.email_pro} />
      <InfoRow label="Email personnel"       value={agent.email_personnel} />

      <SectionTitle>Contact d'urgence</SectionTitle>
      <InfoRow label="Nom"       value={agent.urgence_nom} />
      <InfoRow label="Relation"  value={agent.urgence_relation} />
      <InfoRow label="Téléphone" value={agent.urgence_telephone} />
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
      <InfoRow label="Date de recrutement"    value={fmt(agent.date_recrutement)} />
      <InfoRow label="Date prise de fonction" value={fmt(agent.date_prise_fonction)} />
      <InfoRow label="Date de titularisation" value={fmt(agent.date_titularisation)} />
      <InfoRow label="Mode de recrutement"    value={agent.mode_recrutement} />
      <InfoRow label="N° Arrêté / Décision"  value={agent.numero_decision} />
      <InfoRow label="Date de la décision"    value={fmt(agent.date_decision)} />
      <InfoRow label="Référence J.O."         value={agent.reference_jo} />
      <InfoRow label="Ministère d'origine"    value={agent.ministere_origine} wide />

      <SectionTitle>Formation principale</SectionTitle>
      <InfoRow label="Niveau d'études"   value={agent.niveau_etudes} />
      <InfoRow label="Diplôme"           value={agent.diplome} />
      <InfoRow label="Spécialité"        value={agent.specialite} />
      <InfoRow label="Établissement"     value={agent.etablissement} />
      <InfoRow label="Pays"              value={agent.pays_formation} />
      <InfoRow label="Année"             value={agent.annee_obtention} />

      <SectionTitle>Contrat & Statut</SectionTitle>
      <InfoRow label="Type de contrat"          value={agent.type_contrat} />
      <InfoRow label="Situation administrative" value={
        agent.situation_admin ? (
          <Badge bg={INFO_STATUT[agent.situation_admin] || 'secondary'}>{agent.situation_admin}</Badge>
        ) : '—'
      } />

      <SectionTitle>Rémunération & Banque</SectionTitle>
      <InfoRow label="N° CNSS"               value={agent.numero_cnss} />
      <InfoRow label="N° Caisse de retraite" value={agent.numero_retraite} />
      <InfoRow label="RIB / IBAN"            value={agent.rib} />
      <InfoRow label="Banque"                value={agent.banque} />
    </Row>
  );

  const renderAffectations = () => (
    <Row>
      <SectionTitle>Affectation actuelle</SectionTitle>
      <InfoRow label="Ministère"       value={agent.ministere_affectation} wide />
      <InfoRow label="Direction"       value={agent.direction_libelle} />
      <InfoRow label="Service"         value={agent.service} />
      <InfoRow label="Bureau"          value={agent.bureau} />
      <InfoRow label="Poste"           value={agent.poste} />
      <InfoRow label="Lieu"            value={agent.lieu_affectation} />
      <InfoRow label="Région"          value={agent.region_affectation} />

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
            <small className="text-muted">{fmt(agent.date_recrutement)} — {agent.mode_recrutement}</small>
            <div className="text-muted small">{agent.corps}</div>
          </div>
        </div>
      </Col>
      {agent.date_titularisation && (
        <Col xs={12} className="mb-3">
          <div className="d-flex align-items-center gap-3">
            <div className="border-start border-3 border-primary ps-3 py-1">
              <div className="fw-semibold">Titularisation</div>
              <small className="text-muted">{fmt(agent.date_titularisation)}</small>
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
          className="mx-auto mb-3 border rounded overflow-hidden bg-light d-flex align-items-center justify-content-center"
          style={{ width: 150, height: 190 }}
        >
          {agent.photo_url
            ? <img src={`${API_BASE}${agent.photo_url}`} alt={fullName} className="w-100 h-100" style={{ objectFit: 'cover' }} />
            : <div style={{ fontSize: 56, fontWeight: 700, color: 'var(--bs-primary)', opacity: 0.5 }}>{initials}</div>
          }
        </div>
        {!agent.photo_url && <p className="text-muted small">Aucune photo importée pour cet agent.</p>}
        <Button as={Link} to={`/agents/${id}/edit`} variant="outline-primary" size="sm">
          <i className="ph ph-camera me-2" />{agent.photo_url ? 'Modifier la photo' : 'Ajouter une photo'}
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
              className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 overflow-hidden bg-primary bg-opacity-10"
              style={{ width: 80, height: 80 }}
            >
              {agent.photo_url
                ? <img src={`${API_BASE}${agent.photo_url}`} alt={fullName} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                : <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--bs-primary)' }}>{initials}</span>
              }
            </div>
            <h5 className="mb-1">{fullName}</h5>
            <p className="text-muted small mb-2">{agent.grade}</p>
            <Badge bg={INFO_STATUT[agent.situation_admin] || 'secondary'} className="mb-3">
              {agent.situation_admin}
            </Badge>

            <div className="text-start border-top pt-3 mt-1">
              {[
                { icon: 'ph-identification-card', label: 'Matricule', val: agent.matricule },
                { icon: 'ph-buildings',           label: 'Ministère', val: agent.ministere_affectation },
                { icon: 'ph-briefcase',           label: 'Poste',     val: agent.poste },
                { icon: 'ph-map-pin',             label: 'Lieu',      val: agent.lieu_affectation },
                { icon: 'ph-phone',               label: 'Mobile',    val: agent.telephone_mobile },
                { icon: 'ph-envelope',            label: 'Email',     val: agent.email_pro },
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
              <Button
                variant="outline-danger"
                size="sm"
                disabled={pdfLoading}
                onClick={handlePdf}
                title="Télécharger la fiche agent en PDF"
              >
                {pdfLoading
                  ? <><Spinner size="sm" animation="border" className="me-1" />Génération…</>
                  : <><i className="ph ph-file-pdf me-2" />Fiche PDF</>
                }
              </Button>
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
              <Badge bg="light" text="dark" className="ms-2">{agent.type_contrat}</Badge>
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
