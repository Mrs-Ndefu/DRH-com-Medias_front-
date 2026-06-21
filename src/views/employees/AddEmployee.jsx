import { useState, useRef } from 'react';
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
import FingerprintCapture from './components/FingerprintCapture';

// ─── Constantes ────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'personal',  icon: 'ph-user',          label: 'État civil & Coordonnées'    },
  { id: 'admin',     icon: 'ph-briefcase',      label: 'Informations administratives' },
  { id: 'formation', icon: 'ph-graduation-cap', label: 'Formation & Qualifications'  },
  { id: 'documents', icon: 'ph-files',          label: 'Documents'                   },
  { id: 'biometrie', icon: 'ph-fingerprint',    label: 'Biométrie'                   },
];

const SEXES               = ['Masculin', 'Féminin'];
const GROUPES_SANGUINS    = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const SITUATIONS_FAM      = ['Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf / Veuve', 'Séparé(e)'];
const CATEGORIES          = ['A', 'B', 'C', 'D'];
const CLASSES             = ['1ère classe', '2ème classe', '3ème classe'];
const CORPS = [
  'Administration générale',
  'Corps commun des administrations',
  'Enseignement',
  'Santé publique',
  'Sécurité publique',
  'Justice',
  'Finances publiques',
  'Diplomatie et relations extérieures',
  'Informatique et télécommunications',
  'Technique spécialisé',
  'Documentation et archives',
  'Autre',
];
const MODES_RECRUTEMENT = [
  'Concours externe',
  'Concours interne',
  'Examen professionnel',
  'Détachement',
  'Intégration directe',
  'Mutation',
  'Contrat direct',
];
const TYPES_CONTRAT = [
  'Fonctionnaire titulaire',
  'Fonctionnaire stagiaire',
  'Contractuel à durée déterminée (CDD)',
  'Contractuel à durée indéterminée (CDI)',
  'Vacataire',
];
const SITUATIONS_ADMIN = [
  'En activité',
  'En congé maladie',
  'En congé maternité',
  'En détachement',
  'En disponibilité',
  'Suspendu',
  'À la retraite',
];
const NIVEAUX_ETUDES = [
  'Sans diplôme',
  "Certificat d'études primaires",
  'Brevet',
  'Baccalauréat',
  'BTS / DUT / DEUG',
  'Licence (Bac+3)',
  "Master / DEA / DESS (Bac+5)",
  'Ingénieur (Bac+5)',
  'Doctorat (Bac+8)',
  "Habilitation à diriger des recherches",
];
const DOCS_CONFIG = [
  { id: 'photo',                label: "Photo d'identité (format passeport)",         accept: 'image/*',      required: true  },
  { id: 'copieCin',             label: 'Copie CIN — recto / verso',                   accept: '.pdf,image/*', required: true  },
  { id: 'extraitNaissance',     label: 'Extrait / Acte de naissance',                 accept: '.pdf,image/*', required: true  },
  { id: 'acteMarriage',         label: 'Acte de mariage (si applicable)',             accept: '.pdf,image/*', required: false },
  { id: 'casierJudiciaire',     label: 'Casier judiciaire (Bulletin N°3)',            accept: '.pdf,image/*', required: true  },
  { id: 'attestationResidence', label: 'Attestation de résidence',                   accept: '.pdf,image/*', required: false },
  { id: 'diplomes',             label: 'Diplôme(s) et relevés de notes',             accept: '.pdf,image/*', required: true  },
  { id: 'attestationTravail',   label: 'Attestation de travail antérieure',          accept: '.pdf,image/*', required: false },
  { id: 'arrete',               label: "Arrêté / Décision de nomination",            accept: '.pdf,image/*', required: true  },
  { id: 'visitesMedicales',     label: 'Certificat médical d\'aptitude au poste',    accept: '.pdf,image/*', required: false },
  { id: 'autresDocuments',      label: 'Autres documents complémentaires',           accept: '.pdf,image/*', required: false },
];

const EMPTY_FORMATION = { diplome: '', specialite: '', etablissement: '', pays: '', annee: '', mention: '' };

const INITIAL = {
  // État civil
  prenom: '', prenomSecondaire: '', nomFamille: '', nomJeuneFile: '',
  sexe: '', dateNaissance: '', lieuNaissance: '', regionNaissance: '', paysNaissance: '',
  nationalite: '', autreNationalite: '', situationFamiliale: '', nbEnfants: '0',
  // Pièces d'identité
  typePiece: 'CIN', numeroPiece: '', dateExpiration: '', numPasseport: '', groupeSanguin: '',
  // Adresse
  adresseRue: '', adresseVille: '', adresseCodePostal: '', adresseRegion: '', adressePays: '',
  // Contact
  telephoneFixe: '', telephoneMobile: '', emailPro: '', emailPersonnel: '',
  // Urgence
  urgenceNom: '', urgenceRelation: '', urgenceTelephone: '',
  // Administratif
  matricule: '', corps: '', grade: '', categorie: '', classe: '', echelon: '', indice: '',
  dateRecrutement: '', datePriseFonction: '', dateTitularisation: '',
  modeRecrutement: '', numeroDecision: '', dateDecision: '', referenceJO: '', ministereDOrigine: '',
  ministereAffectation: '', direction: '', sousDirection: '', service: '', bureau: '',
  poste: '', lieuAffectation: '', regionAffectation: '',
  typeContrat: '', situationAdmin: 'En activité',
  // Rémunération
  numeroCnss: '', numeroRetraite: '', rib: '', banque: '',
  // Formation principale
  niveauEtudes: '', diplome: '', specialite: '', etablissement: '', paysFormation: '', anneeObtention: '', mention: '',
};

// ─── Composant principal ────────────────────────────────────────────────────────

export default function AddEmployee() {
  const [activeTab,  setActiveTab]  = useState('personal');
  const [form,       setForm]       = useState(INITIAL);
  const [formations, setFormations] = useState([]);
  const [documents,  setDocuments]  = useState({});
  const [empreintes, setEmpreintes] = useState({});
  const [submitted,  setSubmitted]  = useState(false);
  const fileRefs = useRef({});

  const currentIdx = TABS.findIndex(t => t.id === activeTab);
  const hasPrev    = currentIdx > 0;
  const hasNext    = currentIdx < TABS.length - 1;

  // ── Helpers ──
  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const F = ({ id, label, type = 'text', required = false, placeholder = '', xs = 12, md, lg }) => (
    <Form.Group as={Col} xs={xs} md={md} lg={lg}>
      <Form.Label className="mb-1 small">
        {label}{required && <span className="text-danger ms-1">*</span>}
      </Form.Label>
      <Form.Control
        type={type}
        size="sm"
        value={form[id]}
        placeholder={placeholder}
        onChange={e => set(id, e.target.value)}
      />
    </Form.Group>
  );

  const S = ({ id, label, options, required = false, xs = 12, md, lg }) => (
    <Form.Group as={Col} xs={xs} md={md} lg={lg}>
      <Form.Label className="mb-1 small">
        {label}{required && <span className="text-danger ms-1">*</span>}
      </Form.Label>
      <Form.Select size="sm" value={form[id]} onChange={e => set(id, e.target.value)}>
        <option value="">— Sélectionner —</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </Form.Select>
    </Form.Group>
  );

  const SectionTitle = ({ children }) => (
    <Col xs={12}>
      <p className="text-muted text-uppercase fw-semibold small border-bottom pb-2 mb-1 mt-3">{children}</p>
    </Col>
  );

  // ── Formation table ──
  const addFormation    = () => setFormations(p => [...p, { ...EMPTY_FORMATION }]);
  const setFField       = (i, k, v) => setFormations(p => p.map((f, idx) => idx === i ? { ...f, [k]: v } : f));
  const removeFormation = (i) => setFormations(p => p.filter((_, idx) => idx !== i));

  // ── Documents ──
  const handleFile = (docId, e) => {
    const file = e.target.files?.[0];
    if (file) setDocuments(p => ({ ...p, [docId]: file }));
  };
  const removeFile = (docId) => {
    setDocuments(p => { const n = { ...p }; delete n[docId]; return n; });
    if (fileRefs.current[docId]) fileRefs.current[docId].value = '';
  };

  const handleSubmit = () => {
    setSubmitted(true);
    // TODO: POST vers l'API RH avec { form, formations, documents, empreintes }
    console.log({ form, formations, documents, empreintes });
  };

  // ─── Onglet 1 : État civil & Coordonnées ──────────────────────────────────────
  const renderPersonal = () => (
    <Row className="g-3">
      <SectionTitle>Identité</SectionTitle>
      <F id="nomFamille"       label="Nom de famille"         required xs={12} md={4} />
      <F id="prenom"           label="Prénom(s)"              required xs={12} md={4} />
      <F id="prenomSecondaire" label="Prénom secondaire"               xs={12} md={4} />
      <F id="nomJeuneFile"     label="Nom de jeune fille"              xs={12} md={4} />
      <S id="sexe"             label="Sexe"                   required options={SEXES}            xs={12} md={4} />
      <F id="dateNaissance"    label="Date de naissance"      required type="date"                xs={12} md={4} />
      <F id="lieuNaissance"    label="Lieu de naissance"      required                            xs={12} md={4} />
      <F id="regionNaissance"  label="Région / Province de naissance"                             xs={12} md={4} />
      <F id="paysNaissance"    label="Pays de naissance"      required                            xs={12} md={4} />
      <F id="nationalite"      label="Nationalité"            required                            xs={12} md={4} />
      <F id="autreNationalite" label="Autre nationalité"               xs={12} md={4} />
      <S id="situationFamiliale" label="Situation familiale"  required options={SITUATIONS_FAM}   xs={12} md={4} />
      <F id="nbEnfants"        label="Nombre d'enfants à charge" type="number" placeholder="0"   xs={12} md={4} />

      <SectionTitle>Pièce d'identité</SectionTitle>
      <S id="typePiece"    label="Type de pièce"     required options={['CIN', 'Passeport', 'Titre de séjour', 'Carte consulaire']} xs={12} md={3} />
      <F id="numeroPiece"  label="Numéro"            required                  xs={12} md={3} />
      <F id="dateExpiration" label="Date d'expiration" type="date"             xs={12} md={3} />
      <F id="numPasseport" label="N° Passeport"                                xs={12} md={3} />
      <S id="groupeSanguin" label="Groupe sanguin"   options={GROUPES_SANGUINS} xs={12} md={3} />

      <SectionTitle>Adresse de résidence</SectionTitle>
      <F id="adresseRue"        label="N° et Rue / Quartier / BP" required xs={12} md={6} />
      <F id="adresseVille"      label="Ville"                     required xs={12} md={3} />
      <F id="adresseCodePostal" label="Code postal"                        xs={12} md={3} />
      <F id="adresseRegion"     label="Province / Wilaya / Région" required xs={12} md={4} />
      <F id="adressePays"       label="Pays"                      required xs={12} md={4} />

      <SectionTitle>Coordonnées professionnelles & personnelles</SectionTitle>
      <F id="telephoneFixe"    label="Téléphone fixe"    type="tel"   xs={12} md={4} />
      <F id="telephoneMobile"  label="Téléphone mobile"  type="tel"   required xs={12} md={4} />
      <F id="emailPro"         label="Email professionnel" type="email" xs={12} md={4} />
      <F id="emailPersonnel"   label="Email personnel"    type="email" xs={12} md={4} />

      <SectionTitle>Contact d'urgence</SectionTitle>
      <F id="urgenceNom"       label="Nom complet"                                xs={12} md={4} />
      <F id="urgenceRelation"  label="Relation (conjoint, parent…)"               xs={12} md={4} />
      <F id="urgenceTelephone" label="Téléphone"         type="tel"               xs={12} md={4} />
    </Row>
  );

  // ─── Onglet 2 : Informations administratives ──────────────────────────────────
  const renderAdmin = () => (
    <Row className="g-3">
      <SectionTitle>Identification administrative</SectionTitle>
      <F id="matricule"  label="Matricule"           required placeholder="Ex : 2024001"  xs={12} md={3} />
      <S id="corps"      label="Corps"               required options={CORPS}             xs={12} md={5} />
      <F id="grade"      label="Grade / Échelon hiérarchique" required                   xs={12} md={4} />
      <S id="categorie"  label="Catégorie"           required options={CATEGORIES}        xs={12} md={2} />
      <S id="classe"     label="Classe"                       options={CLASSES}           xs={12} md={3} />
      <F id="echelon"    label="Échelon"                      type="number"               xs={12} md={2} />
      <F id="indice"     label="Indice de traitement"         type="number"               xs={12} md={3} />

      <SectionTitle>Recrutement & Nomination</SectionTitle>
      <F id="dateRecrutement"   label="Date de recrutement"      required type="date"   xs={12} md={4} />
      <F id="datePriseFonction" label="Date de prise de fonction" required type="date"  xs={12} md={4} />
      <F id="dateTitularisation" label="Date de titularisation"           type="date"   xs={12} md={4} />
      <S id="modeRecrutement"   label="Mode de recrutement"      required options={MODES_RECRUTEMENT} xs={12} md={4} />
      <F id="numeroDecision"    label="N° Arrêté / Décision de nomination" required    xs={12} md={4} />
      <F id="dateDecision"      label="Date de la décision"      required type="date"  xs={12} md={4} />
      <F id="referenceJO"       label="Référence Journal Officiel"                     xs={12} md={4} />
      <F id="ministereDOrigine" label="Ministère / Administration d'origine"           xs={12} md={8} />

      <SectionTitle>Affectation</SectionTitle>
      <F id="ministereAffectation" label="Ministère d'affectation"  required          xs={12} md={6} />
      <F id="direction"            label="Direction centrale / Région" required       xs={12} md={6} />
      <F id="sousDirection"        label="Sous-direction"                             xs={12} md={4} />
      <F id="service"              label="Service / Division"                         xs={12} md={4} />
      <F id="bureau"               label="Bureau / Cellule"                           xs={12} md={4} />
      <F id="poste"                label="Intitulé du poste occupé"  required         xs={12} md={4} />
      <F id="lieuAffectation"      label="Lieu d'affectation"        required         xs={12} md={4} />
      <F id="regionAffectation"    label="Région / Province d'affectation"            xs={12} md={4} />

      <SectionTitle>Contrat & Statut</SectionTitle>
      <S id="typeContrat"   label="Type de contrat"         required options={TYPES_CONTRAT}    xs={12} md={6} />
      <S id="situationAdmin" label="Situation administrative" required options={SITUATIONS_ADMIN} xs={12} md={6} />

      <SectionTitle>Rémunération & Banque</SectionTitle>
      <F id="numeroCnss"    label="N° CNSS / Sécurité sociale"  xs={12} md={4} />
      <F id="numeroRetraite" label="N° Caisse de retraite"      xs={12} md={4} />
      <F id="rib"           label="RIB / IBAN"                  xs={12} md={6} />
      <F id="banque"        label="Banque domiciliataire"       xs={12} md={6} />
    </Row>
  );

  // ─── Onglet 3 : Formation ──────────────────────────────────────────────────────
  const renderFormation = () => (
    <Row className="g-3">
      <SectionTitle>Diplôme principal</SectionTitle>
      <S id="niveauEtudes"    label="Niveau d'études"              required options={NIVEAUX_ETUDES} xs={12} md={4} />
      <F id="diplome"         label="Intitulé exact du diplôme"    required                          xs={12} md={8} />
      <F id="specialite"      label="Spécialité / Filière"         required                          xs={12} md={4} />
      <F id="etablissement"   label="Établissement d'obtention"    required                          xs={12} md={4} />
      <F id="paysFormation"   label="Pays d'obtention"                                               xs={12} md={2} />
      <F id="anneeObtention"  label="Année d'obtention"            required type="number" placeholder="AAAA" xs={12} md={2} />
      <F id="mention"         label="Mention / Résultat"                                             xs={12} md={3} />

      <Col xs={12}>
        <div className="d-flex align-items-center justify-content-between mt-2 mb-2">
          <p className="text-muted text-uppercase fw-semibold small border-bottom pb-1 mb-0 flex-grow-1 me-3">
            Formations complémentaires & Certifications
          </p>
          <Button variant="outline-primary" size="sm" onClick={addFormation}>
            <i className="ph ph-plus me-1" /> Ajouter
          </Button>
        </div>
      </Col>

      <Col xs={12}>
        {formations.length === 0 ? (
          <p className="text-muted small">
            Aucune formation complémentaire. Cliquez sur <strong>Ajouter</strong> pour en saisir.
          </p>
        ) : (
          <div className="table-responsive">
            <Table bordered size="sm" className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Diplôme / Certification</th>
                  <th>Spécialité</th>
                  <th>Établissement</th>
                  <th>Pays</th>
                  <th style={{ width: 80 }}>Année</th>
                  <th>Mention</th>
                  <th style={{ width: 40 }}></th>
                </tr>
              </thead>
              <tbody>
                {formations.map((f, i) => (
                  <tr key={i}>
                    {['diplome', 'specialite', 'etablissement', 'pays', 'annee', 'mention'].map(k => (
                      <td key={k}>
                        <Form.Control
                          size="sm"
                          value={f[k]}
                          type={k === 'annee' ? 'number' : 'text'}
                          placeholder={k === 'annee' ? 'AAAA' : ''}
                          onChange={e => setFField(i, k, e.target.value)}
                        />
                      </td>
                    ))}
                    <td className="text-center">
                      <Button variant="link" size="sm" className="text-danger p-0" onClick={() => removeFormation(i)}>
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

  // ─── Onglet 4 : Documents ─────────────────────────────────────────────────────
  const renderDocuments = () => (
    <>
      <Alert variant="info" className="mb-4">
        <i className="ph ph-info me-2" />
        Formats acceptés : <strong>JPG, PNG, PDF</strong>. Taille maximale recommandée : <strong>5 Mo</strong> par document.
        Les champs marqués <span className="text-danger">*</span> sont obligatoires.
      </Alert>
      <Row className="g-3">
        {DOCS_CONFIG.map(doc => {
          const file = documents[doc.id];
          return (
            <Col key={doc.id} xs={12} md={6}>
              <div className="border rounded p-3 h-100">
                <p className="mb-2 small fw-semibold">
                  {doc.label}
                  {doc.required && <span className="text-danger ms-1">*</span>}
                </p>
                <input
                  ref={el => { fileRefs.current[doc.id] = el; }}
                  type="file"
                  accept={doc.accept}
                  className="d-none"
                  onChange={e => handleFile(doc.id, e)}
                />
                {file ? (
                  <div className="d-flex align-items-center gap-2 bg-light rounded px-3 py-2">
                    <i className="ph ph-file-text text-success flex-shrink-0" />
                    <span className="small text-truncate flex-grow-1">{file.name}</span>
                    <small className="text-muted flex-shrink-0">
                      ({(file.size / 1024).toFixed(0)} Ko)
                    </small>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-danger p-0 flex-shrink-0"
                      onClick={() => removeFile(doc.id)}
                    >
                      <i className="ph ph-trash" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => fileRefs.current[doc.id]?.click()}
                  >
                    <i className="ph ph-upload-simple me-2" />
                    Choisir un fichier
                  </Button>
                )}
              </div>
            </Col>
          );
        })}
      </Row>
    </>
  );

  // ─── Onglet 5 : Biométrie ─────────────────────────────────────────────────────
  const renderBiometrie = () => (
    <>
      <Alert variant="info" className="mb-4">
        <i className="ph ph-info me-2" />
        Capture des <strong>pouces droit et gauche</strong> via le lecteur biométrique connecté au poste
        (API WebAuthn / FIDO2 — compatible Windows Hello, lecteurs USB certifiés).
        En l'absence de périphérique, contactez le service informatique du ministère.
      </Alert>
      <FingerprintCapture onChange={setEmpreintes} />
    </>
  );

  const renderTab = () => {
    switch (activeTab) {
      case 'personal':  return renderPersonal();
      case 'admin':     return renderAdmin();
      case 'formation': return renderFormation();
      case 'documents': return renderDocuments();
      case 'biometrie': return renderBiometrie();
      default:          return null;
    }
  };

  if (submitted) {
    return (
      <Row>
        <Col xs={12}>
          <MainCard>
            <div className="text-center py-5">
              <i className="ph ph-check-circle f-64 text-success d-block mb-3" />
              <h4>Dossier enregistré avec succès</h4>
              <p className="text-muted mb-4">
                Le dossier de l'employé a été soumis pour validation administrative.
              </p>
              <div className="d-flex gap-3 justify-content-center">
                <Button as={Link} to="/employees" variant="outline-secondary">
                  <i className="ph ph-list me-2" />Retour à la liste
                </Button>
                <Button variant="primary" onClick={() => { setSubmitted(false); setForm(INITIAL); setFormations([]); setDocuments({}); setEmpreintes({}); setActiveTab('personal'); }}>
                  <i className="ph ph-plus me-2" />Nouvel employé
                </Button>
              </div>
            </div>
          </MainCard>
        </Col>
      </Row>
    );
  }

  return (
    <Row>
      <Col xs={12}>
        <MainCard
          title={
            <div className="d-flex align-items-center gap-3">
              <i className="ph ph-user-plus f-24 text-primary" />
              <span>Ajouter un employé</span>
            </div>
          }
          secondary={
            <Button as={Link} to="/employees" variant="outline-secondary" size="sm">
              <i className="ph ph-arrow-left me-2" />Retour
            </Button>
          }
        >
          {/* ── Navigation par onglets ── */}
          <Nav variant="tabs" className="mb-4" activeKey={activeTab} onSelect={k => setActiveTab(k)}>
            {TABS.map((tab, idx) => (
              <Nav.Item key={tab.id}>
                <Nav.Link eventKey={tab.id} className="d-flex align-items-center gap-2 py-2">
                  <Badge
                    bg={activeTab === tab.id ? 'primary' : 'light'}
                    text={activeTab === tab.id ? 'white' : 'dark'}
                  >
                    {idx + 1}
                  </Badge>
                  <span className="d-none d-lg-inline">{tab.label}</span>
                  <i className={`ph ${tab.icon} d-inline d-lg-none`} />
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          {/* ── Contenu de l'onglet actif ── */}
          {renderTab()}

          {/* ── Boutons de navigation ── */}
          <div className="d-flex justify-content-between mt-4 pt-3 border-top">
            <Button
              variant="outline-secondary"
              onClick={() => setActiveTab(TABS[currentIdx - 1].id)}
              disabled={!hasPrev}
            >
              <i className="ph ph-arrow-left me-2" />Précédent
            </Button>

            {hasNext ? (
              <Button variant="primary" onClick={() => setActiveTab(TABS[currentIdx + 1].id)}>
                Suivant<i className="ph ph-arrow-right ms-2" />
              </Button>
            ) : (
              <Button variant="success" onClick={handleSubmit}>
                <i className="ph ph-check me-2" />Enregistrer le dossier
              </Button>
            )}
          </div>
        </MainCard>
      </Col>
    </Row>
  );
}
