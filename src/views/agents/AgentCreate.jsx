import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// react-bootstrap
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

// project-imports
import MainCard from 'components/MainCard';
import FingerprintCapture from '../employees/components/FingerprintCapture';
import {
  CATEGORIES, CLASSES, CORPS, DOCS_CONFIG, GROUPES_SANGUINS,
  INITIAL, MODES_RECRUTEMENT, NIVEAUX_ETUDES, SEXES, SITUATIONS_ADMIN,
  SITUATIONS_FAM, TYPES_CONTRAT, TYPES_EVENEMENTS, TYPES_PIECES,
} from './data/agents';

// ── Onglets ──────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'personal',     icon: 'ph-user',                    label: 'Informations personnelles'    },
  { id: 'admin',        icon: 'ph-briefcase',               label: 'Informations administratives' },
  { id: 'affectations', icon: 'ph-map-pin',                 label: 'Affectations'                 },
  { id: 'documents',    icon: 'ph-files',                   label: 'Documents'                    },
  { id: 'historique',   icon: 'ph-clock-counter-clockwise', label: 'Historique'                   },
  { id: 'photo',        icon: 'ph-camera',                  label: 'Photo'                        },
  { id: 'biometrie',    icon: 'ph-fingerprint',             label: 'Biométrie'                    },
];

const EMPTY_AFFECTATION = { dateDebut: '', dateFin: '', ministere: '', direction: '', service: '', poste: '', lieu: '', motif: '' };
const EMPTY_EVENEMENT   = { date: '', type: 'Promotion', description: '', reference: '', observation: '' };

// ── Composant principal ───────────────────────────────────────────────────────

export default function AgentCreate({ agentData = null }) {
  const editMode = !!agentData;

  const [activeTab,      setActiveTab]      = useState('personal');
  const [form,           setForm]           = useState(agentData ? { ...INITIAL, ...agentData } : INITIAL);
  const [histoAff,       setHistoAff]       = useState([]);
  const [histoCarriere,  setHistoCarriere]  = useState([]);
  const [documents,      setDocuments]      = useState({});
  const [empreintes,     setEmpreintes]     = useState({});
  const [photoPreview,   setPhotoPreview]   = useState(null);
  const [sigPreview,     setSigPreview]     = useState(null);
  const [submitted,      setSubmitted]      = useState(false);
  const fileRefs = useRef({});

  const currentIdx = TABS.findIndex((t) => t.id === activeTab);
  const hasPrev    = currentIdx > 0;
  const hasNext    = currentIdx < TABS.length - 1;

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  // ── Helpers ─────────────────────────────────────────────────────────────────

  const T = ({ children }) => (
    <Col xs={12}>
      <p className="text-muted text-uppercase fw-semibold small border-bottom pb-2 mb-1 mt-3">{children}</p>
    </Col>
  );

  const F = ({ id, label, type = 'text', required, xs = 12, md, placeholder = '' }) => (
    <Form.Group as={Col} xs={xs} md={md}>
      <Form.Label className="mb-1 small">{label}{required && <span className="text-danger ms-1">*</span>}</Form.Label>
      <Form.Control type={type} size="sm" value={form[id] || ''} placeholder={placeholder} onChange={(e) => set(id, e.target.value)} />
    </Form.Group>
  );

  const S = ({ id, label, options, required, xs = 12, md }) => (
    <Form.Group as={Col} xs={xs} md={md}>
      <Form.Label className="mb-1 small">{label}{required && <span className="text-danger ms-1">*</span>}</Form.Label>
      <Form.Select size="sm" value={form[id] || ''} onChange={(e) => set(id, e.target.value)}>
        <option value="">— Sélectionner —</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </Form.Select>
    </Form.Group>
  );

  // ── Historique affectations ──────────────────────────────────────────────────

  const addAff    = () => setHistoAff((p) => [...p, { ...EMPTY_AFFECTATION }]);
  const setAField = (i, k, v) => setHistoAff((p) => p.map((r, idx) => idx === i ? { ...r, [k]: v } : r));
  const rmAff     = (i) => setHistoAff((p) => p.filter((_, idx) => idx !== i));

  // ── Historique carrière ──────────────────────────────────────────────────────

  const addEvt    = () => setHistoCarriere((p) => [...p, { ...EMPTY_EVENEMENT }]);
  const setEField = (i, k, v) => setHistoCarriere((p) => p.map((r, idx) => idx === i ? { ...r, [k]: v } : r));
  const rmEvt     = (i) => setHistoCarriere((p) => p.filter((_, idx) => idx !== i));

  // ── Documents ───────────────────────────────────────────────────────────────

  const handleFile = (docId, e) => {
    const file = e.target.files?.[0];
    if (file) setDocuments((p) => ({ ...p, [docId]: file }));
  };
  const removeFile = (docId) => {
    setDocuments((p) => { const n = { ...p }; delete n[docId]; return n; });
    if (fileRefs.current[docId]) fileRefs.current[docId].value = '';
  };

  // ── Photo / signature preview ────────────────────────────────────────────────

  const handlePhotoChange = (e, setter) => {
    const file = e.target.files?.[0];
    if (file) {
      setter(URL.createObjectURL(file));
    }
  };

  // ── Submit ───────────────────────────────────────────────────────────────────

  const handleSubmit = () => {
    setSubmitted(true);
    console.log({ form, histoAff, histoCarriere, documents, empreintes });
  };

  // ─── RENDU ONGLETS ───────────────────────────────────────────────────────────

  const renderPersonal = () => (
    <Row className="g-3">
      <T>Identité</T>
      <F id="nomFamille"        label="Nom de famille"          required xs={12} md={4} />
      <F id="prenom"            label="Prénom(s)"               required xs={12} md={4} />
      <F id="prenomSecondaire"  label="Prénom secondaire"                xs={12} md={4} />
      <F id="nomJeuneFile"      label="Nom de jeune fille"               xs={12} md={4} />
      <S id="sexe"              label="Sexe"                    required options={SEXES}          xs={12} md={4} />
      <F id="dateNaissance"     label="Date de naissance"       required type="date"              xs={12} md={4} />
      <F id="lieuNaissance"     label="Lieu de naissance"       required                          xs={12} md={4} />
      <F id="regionNaissance"   label="Région / Province de naissance"                            xs={12} md={4} />
      <F id="paysNaissance"     label="Pays de naissance"       required                          xs={12} md={4} />
      <F id="nationalite"       label="Nationalité"             required                          xs={12} md={4} />
      <F id="autreNationalite"  label="Autre nationalité"                                         xs={12} md={4} />
      <S id="situationFamiliale" label="Situation familiale"    required options={SITUATIONS_FAM}  xs={12} md={4} />
      <F id="nbEnfants"         label="Nombre d'enfants"        type="number" placeholder="0"     xs={12} md={4} />
      <S id="groupeSanguin"     label="Groupe sanguin"          options={GROUPES_SANGUINS}         xs={12} md={4} />

      <T>Pièce d'identité</T>
      <S id="typePiece"     label="Type de pièce"    required options={TYPES_PIECES}  xs={12} md={3} />
      <F id="numeroPiece"   label="Numéro"           required                         xs={12} md={3} />
      <F id="dateExpiration" label="Date d'expiration" type="date"                    xs={12} md={3} />
      <F id="numPasseport"  label="N° Passeport"                                      xs={12} md={3} />

      <T>Adresse de résidence</T>
      <F id="adresseRue"        label="N° et Rue / Quartier" required xs={12} md={6} />
      <F id="adresseVille"      label="Ville"                required xs={12} md={3} />
      <F id="adresseCodePostal" label="Code postal"                   xs={12} md={3} />
      <F id="adresseRegion"     label="Région / Province"   required  xs={12} md={4} />
      <F id="adressePays"       label="Pays"                required  xs={12} md={4} />

      <T>Coordonnées</T>
      <F id="telephoneFixe"   label="Téléphone fixe"     type="tel"   xs={12} md={4} />
      <F id="telephoneMobile" label="Téléphone mobile"   type="tel" required xs={12} md={4} />
      <F id="emailPro"        label="Email professionnel" type="email" xs={12} md={4} />
      <F id="emailPersonnel"  label="Email personnel"     type="email" xs={12} md={4} />

      <T>Contact d'urgence</T>
      <F id="urgenceNom"       label="Nom complet"                   xs={12} md={4} />
      <F id="urgenceRelation"  label="Relation (époux, parent…)"    xs={12} md={4} />
      <F id="urgenceTelephone" label="Téléphone" type="tel"          xs={12} md={4} />
    </Row>
  );

  const renderAdmin = () => (
    <Row className="g-3">
      <T>Identification administrative</T>
      <F id="matricule"  label="Matricule"         required placeholder="Ex : 2024001" xs={12} md={3} />
      <S id="corps"      label="Corps"             required options={CORPS}            xs={12} md={5} />
      <F id="grade"      label="Grade"             required                            xs={12} md={4} />
      <S id="categorie"  label="Catégorie"         required options={CATEGORIES}       xs={12} md={2} />
      <S id="classe"     label="Classe"                     options={CLASSES}          xs={12} md={3} />
      <F id="echelon"    label="Échelon"           type="number"                       xs={12} md={2} />
      <F id="indice"     label="Indice de traitement" type="number"                    xs={12} md={3} />

      <T>Recrutement & Nomination</T>
      <F id="dateRecrutement"    label="Date de recrutement"    required type="date" xs={12} md={4} />
      <F id="datePriseFonction"  label="Date prise de fonction" required type="date" xs={12} md={4} />
      <F id="dateTitularisation" label="Date de titularisation"          type="date" xs={12} md={4} />
      <S id="modeRecrutement"    label="Mode de recrutement"   required options={MODES_RECRUTEMENT} xs={12} md={4} />
      <F id="numeroDecision"     label="N° Arrêté / Décision"  required              xs={12} md={4} />
      <F id="dateDecision"       label="Date de la décision"   required type="date"  xs={12} md={4} />
      <F id="referenceJO"        label="Référence Journal Officiel"                  xs={12} md={4} />
      <F id="ministereDOrigine"  label="Ministère d'origine"                         xs={12} md={8} />

      <T>Formation principale</T>
      <S id="niveauEtudes"   label="Niveau d'études"         required options={NIVEAUX_ETUDES} xs={12} md={4} />
      <F id="diplome"        label="Intitulé du diplôme"     required                          xs={12} md={8} />
      <F id="specialite"     label="Spécialité / Filière"    required                          xs={12} md={4} />
      <F id="etablissement"  label="Établissement"           required                          xs={12} md={4} />
      <F id="paysFormation"  label="Pays d'obtention"                                          xs={12} md={2} />
      <F id="anneeObtention" label="Année"                   required type="number" placeholder="AAAA" xs={12} md={2} />

      <T>Contrat & Statut</T>
      <S id="typeContrat"    label="Type de contrat"          required options={TYPES_CONTRAT}    xs={12} md={6} />
      <S id="situationAdmin" label="Situation administrative" required options={SITUATIONS_ADMIN}  xs={12} md={6} />

      <T>Rémunération & Banque</T>
      <F id="numeroCnss"    label="N° CNSS / Sécurité sociale" xs={12} md={4} />
      <F id="numeroRetraite" label="N° Caisse de retraite"     xs={12} md={4} />
      <F id="rib"           label="RIB / IBAN"                 xs={12} md={6} />
      <F id="banque"        label="Banque domiciliataire"      xs={12} md={6} />
    </Row>
  );

  const renderAffectations = () => (
    <Row className="g-3">
      <T>Affectation actuelle</T>
      <F id="ministereAffectation" label="Ministère d'affectation"  required xs={12} md={6} />
      <F id="direction"            label="Direction centrale"        required xs={12} md={6} />
      <F id="sousDirection"        label="Sous-direction"                     xs={12} md={4} />
      <F id="service"              label="Service / Division"                 xs={12} md={4} />
      <F id="bureau"               label="Bureau / Cellule"                   xs={12} md={4} />
      <F id="poste"                label="Intitulé du poste"        required  xs={12} md={4} />
      <F id="lieuAffectation"      label="Lieu d'affectation"       required  xs={12} md={4} />
      <F id="regionAffectation"    label="Région d'affectation"               xs={12} md={4} />

      <Col xs={12}>
        <div className="d-flex align-items-center justify-content-between mt-2 mb-2">
          <p className="text-muted text-uppercase fw-semibold small border-bottom pb-1 mb-0 flex-grow-1 me-3">
            Historique des affectations
          </p>
          <Button variant="outline-primary" size="sm" onClick={addAff}>
            <i className="ph ph-plus me-1" />Ajouter
          </Button>
        </div>
      </Col>

      <Col xs={12}>
        {histoAff.length === 0 ? (
          <p className="text-muted small">Aucune affectation antérieure. Cliquez sur <strong>Ajouter</strong>.</p>
        ) : (
          <div className="table-responsive">
            <Table bordered size="sm" className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Début</th><th>Fin</th><th>Ministère / Structure</th>
                  <th>Direction</th><th>Poste</th><th>Lieu</th><th>Motif</th>
                  <th style={{ width: 40 }} />
                </tr>
              </thead>
              <tbody>
                {histoAff.map((r, i) => (
                  <tr key={i}>
                    {['dateDebut', 'dateFin', 'ministere', 'direction', 'poste', 'lieu', 'motif'].map((k) => (
                      <td key={k}>
                        <Form.Control size="sm" type={k.startsWith('date') ? 'date' : 'text'} value={r[k]} onChange={(e) => setAField(i, k, e.target.value)} />
                      </td>
                    ))}
                    <td className="text-center">
                      <Button variant="link" size="sm" className="text-danger p-0" onClick={() => rmAff(i)}>
                        <i className="ph ph-trash" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Col>
    </Row>
  );

  const renderDocuments = () => (
    <>
      <Alert variant="info" className="mb-4">
        <i className="ph ph-info me-2" />
        Formats acceptés : <strong>JPG, PNG, PDF</strong> — 5 Mo max par document.
        Les champs <span className="text-danger">*</span> sont obligatoires.
      </Alert>
      <Row className="g-3">
        {DOCS_CONFIG.map((doc) => {
          const file = documents[doc.id];
          return (
            <Col key={doc.id} xs={12} md={6}>
              <div className="border rounded p-3 h-100">
                <p className="mb-2 small fw-semibold">
                  {doc.label}{doc.required && <span className="text-danger ms-1">*</span>}
                </p>
                <input ref={(el) => { fileRefs.current[doc.id] = el; }} type="file" accept={doc.accept} className="d-none" onChange={(e) => handleFile(doc.id, e)} />
                {file ? (
                  <div className="d-flex align-items-center gap-2 bg-light rounded px-3 py-2">
                    <i className="ph ph-file-text text-success" />
                    <span className="small text-truncate flex-grow-1">{file.name}</span>
                    <small className="text-muted">({(file.size / 1024).toFixed(0)} Ko)</small>
                    <Button variant="link" size="sm" className="text-danger p-0" onClick={() => removeFile(doc.id)}>
                      <i className="ph ph-trash" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline-secondary" size="sm" onClick={() => fileRefs.current[doc.id]?.click()}>
                    <i className="ph ph-upload-simple me-2" />Choisir un fichier
                  </Button>
                )}
              </div>
            </Col>
          );
        })}
      </Row>
    </>
  );

  const renderHistorique = () => (
    <Row className="g-3">
      <Col xs={12}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h6 className="mb-0">Historique de carrière</h6>
            <small className="text-muted">Promotions, mutations, distinctions, sanctions…</small>
          </div>
          <Button variant="outline-primary" size="sm" onClick={addEvt}>
            <i className="ph ph-plus me-1" />Ajouter un événement
          </Button>
        </div>
      </Col>

      <Col xs={12}>
        {histoCarriere.length === 0 ? (
          <div className="text-center py-5 text-muted border rounded">
            <i className="ph ph-clock-counter-clockwise f-36 d-block mb-2" />
            <p>Aucun événement de carrière. Cliquez sur <strong>Ajouter</strong>.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table bordered size="sm" className="align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 120 }}>Date</th>
                  <th style={{ width: 180 }}>Type d'événement</th>
                  <th>Description</th>
                  <th style={{ width: 140 }}>Référence</th>
                  <th>Observation</th>
                  <th style={{ width: 40 }} />
                </tr>
              </thead>
              <tbody>
                {histoCarriere.map((r, i) => (
                  <tr key={i}>
                    <td><Form.Control size="sm" type="date" value={r.date} onChange={(e) => setEField(i, 'date', e.target.value)} /></td>
                    <td>
                      <Form.Select size="sm" value={r.type} onChange={(e) => setEField(i, 'type', e.target.value)}>
                        {TYPES_EVENEMENTS.map((t) => <option key={t}>{t}</option>)}
                      </Form.Select>
                    </td>
                    {['description', 'reference', 'observation'].map((k) => (
                      <td key={k}><Form.Control size="sm" value={r[k]} onChange={(e) => setEField(i, k, e.target.value)} /></td>
                    ))}
                    <td className="text-center">
                      <Button variant="link" size="sm" className="text-danger p-0" onClick={() => rmEvt(i)}>
                        <i className="ph ph-trash" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Col>
    </Row>
  );

  const renderPhoto = () => (
    <Row className="g-4 justify-content-center">
      {/* Photo identité */}
      <Col xs={12} md={5}>
        <div className="text-center border rounded p-4">
          <h6 className="mb-3">Photo d'identité <span className="text-danger">*</span></h6>
          <div
            className="mx-auto mb-3 border rounded overflow-hidden bg-light d-flex align-items-center justify-content-center"
            style={{ width: 150, height: 190 }}
          >
            {photoPreview ? (
              <img src={photoPreview} alt="Photo" className="w-100 h-100" style={{ objectFit: 'cover' }} />
            ) : (
              <i className="ph ph-user f-48 text-muted" />
            )}
          </div>
          <small className="text-muted d-block mb-3">Format passeport — fond blanc</small>
          <input
            ref={(el) => { fileRefs.current['photoIdentite'] = el; }}
            type="file" accept="image/*" className="d-none"
            onChange={(e) => handlePhotoChange(e, setPhotoPreview)}
          />
          <div className="d-flex gap-2 justify-content-center">
            <Button variant="outline-primary" size="sm" onClick={() => fileRefs.current['photoIdentite']?.click()}>
              <i className="ph ph-upload-simple me-1" />Importer
            </Button>
            {photoPreview && (
              <Button variant="outline-danger" size="sm" onClick={() => { setPhotoPreview(null); fileRefs.current['photoIdentite'].value = ''; }}>
                <i className="ph ph-trash" />
              </Button>
            )}
          </div>
        </div>
      </Col>

      {/* Signature */}
      <Col xs={12} md={5}>
        <div className="text-center border rounded p-4">
          <h6 className="mb-3">Signature</h6>
          <div
            className="mx-auto mb-3 border rounded overflow-hidden bg-light d-flex align-items-center justify-content-center"
            style={{ width: 240, height: 100 }}
          >
            {sigPreview ? (
              <img src={sigPreview} alt="Signature" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            ) : (
              <span className="text-muted small fst-italic">Aucune signature</span>
            )}
          </div>
          <small className="text-muted d-block mb-3">PNG transparent ou fond blanc</small>
          <input
            ref={(el) => { fileRefs.current['signature'] = el; }}
            type="file" accept="image/*" className="d-none"
            onChange={(e) => handlePhotoChange(e, setSigPreview)}
          />
          <div className="d-flex gap-2 justify-content-center">
            <Button variant="outline-primary" size="sm" onClick={() => fileRefs.current['signature']?.click()}>
              <i className="ph ph-upload-simple me-1" />Importer
            </Button>
            {sigPreview && (
              <Button variant="outline-danger" size="sm" onClick={() => { setSigPreview(null); fileRefs.current['signature'].value = ''; }}>
                <i className="ph ph-trash" />
              </Button>
            )}
          </div>
        </div>
      </Col>
    </Row>
  );

  const renderBiometrie = () => (
    <>
      <Alert variant="info" className="mb-4">
        <i className="ph ph-info me-2" />
        Capture des <strong>pouces droit et gauche</strong> via le lecteur biométrique (WebAuthn / FIDO2).
      </Alert>
      <FingerprintCapture onChange={setEmpreintes} />
    </>
  );

  const renderTab = () => {
    switch (activeTab) {
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

  // ── Écran succès ──────────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <Row><Col xs={12}>
        <MainCard>
          <div className="text-center py-5">
            <i className="ph ph-check-circle f-64 text-success d-block mb-3" />
            <h4>{editMode ? 'Dossier mis à jour' : 'Dossier enregistré avec succès'}</h4>
            <p className="text-muted mb-4">
              Le dossier de l'agent {form.prenom} {form.nomFamille} a été {editMode ? 'mis à jour' : 'soumis pour validation'}.
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <Button as={Link} to="/agents" variant="outline-secondary">
                <i className="ph ph-list me-2" />Retour à la liste
              </Button>
              {!editMode && (
                <Button variant="primary" onClick={() => { setSubmitted(false); setForm(INITIAL); setHistoAff([]); setHistoCarriere([]); setDocuments({}); setEmpreintes({}); setPhotoPreview(null); setSigPreview(null); setActiveTab('personal'); }}>
                  <i className="ph ph-plus me-2" />Nouvel agent
                </Button>
              )}
            </div>
          </div>
        </MainCard>
      </Col></Row>
    );
  }

  return (
    <Row>
      <Col xs={12}>
        <MainCard
          title={
            <div className="d-flex align-items-center gap-3">
              <i className={`ph ${editMode ? 'ph-pencil' : 'ph-user-plus'} f-24 text-primary`} />
              <span>{editMode ? `Modifier — ${form.prenom} ${form.nomFamille}` : 'Nouvel agent'}</span>
              {editMode && form.matricule && <Badge bg="light" text="dark">Matricule {form.matricule}</Badge>}
            </div>
          }
          secondary={
            <Button as={Link} to="/agents" variant="outline-secondary" size="sm">
              <i className="ph ph-arrow-left me-2" />Retour
            </Button>
          }
        >
          {/* ── Onglets ── */}
          <Nav variant="tabs" className="mb-4 flex-nowrap overflow-auto" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
            {TABS.map((tab, idx) => (
              <Nav.Item key={tab.id} style={{ flexShrink: 0 }}>
                <Nav.Link eventKey={tab.id} className="d-flex align-items-center gap-2 py-2">
                  <Badge bg={activeTab === tab.id ? 'primary' : 'light'} text={activeTab === tab.id ? 'white' : 'dark'}>
                    {idx + 1}
                  </Badge>
                  <span className="d-none d-xl-inline">{tab.label}</span>
                  <i className={`ph ${tab.icon} d-inline d-xl-none`} />
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          {renderTab()}

          {/* ── Navigation ── */}
          <div className="d-flex justify-content-between mt-4 pt-3 border-top">
            <Button variant="outline-secondary" onClick={() => setActiveTab(TABS[currentIdx - 1].id)} disabled={!hasPrev}>
              <i className="ph ph-arrow-left me-2" />Précédent
            </Button>
            {hasNext ? (
              <Button variant="primary" onClick={() => setActiveTab(TABS[currentIdx + 1].id)}>
                Suivant<i className="ph ph-arrow-right ms-2" />
              </Button>
            ) : (
              <Button variant="success" onClick={handleSubmit}>
                <i className="ph ph-check me-2" />{editMode ? 'Enregistrer les modifications' : 'Enregistrer le dossier'}
              </Button>
            )}
          </div>
        </MainCard>
      </Col>
    </Row>
  );
}
