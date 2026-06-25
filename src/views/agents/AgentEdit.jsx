import { useParams, Navigate } from 'react-router-dom';
import useSWR from 'swr';
import Spinner from 'react-bootstrap/Spinner';
import { fetcher } from 'api/client';
import AgentCreate from './AgentCreate';

const d = (s) => s ? s.split('T')[0] : '';

function apiToForm(a) {
  return {
    nomFamille: a.nom_famille || '',
    prenom: a.prenom || '',
    prenomSecondaire: a.prenom_secondaire || '',
    nomJeuneFile: a.nom_jeune_fille || '',
    sexe: a.sexe || '',
    dateNaissance: d(a.date_naissance),
    lieuNaissance: a.lieu_naissance || '',
    regionNaissance: a.region_naissance || '',
    paysNaissance: a.pays_naissance || '',
    nationalite: a.nationalite || '',
    autreNationalite: a.autre_nationalite || '',
    situationFamiliale: a.situation_familiale || '',
    nbEnfants: String(a.nb_enfants ?? '0'),
    groupeSanguin: a.groupe_sanguin || '',
    typePiece: a.type_piece || 'CIN',
    numeroPiece: a.numero_piece || '',
    dateExpiration: d(a.date_expiration_piece),
    numPasseport: a.num_passeport || '',
    adresseRue: a.adresse_rue || '',
    adresseVille: a.adresse_ville || '',
    adresseCodePostal: a.adresse_code_postal || '',
    adresseRegion: a.adresse_region || '',
    adressePays: a.adresse_pays || '',
    telephoneFixe: a.telephone_fixe || '',
    telephoneMobile: a.telephone_mobile || '',
    emailPro: a.email_pro || '',
    emailPersonnel: a.email_personnel || '',
    urgenceNom: a.urgence_nom || '',
    urgenceRelation: a.urgence_relation || '',
    urgenceTelephone: a.urgence_telephone || '',
    matricule: a.matricule || '',
    corps: a.corps || '',
    grade: a.grade || '',
    categorie: a.categorie || '',
    classe: a.classe || '',
    echelon: String(a.echelon || ''),
    indice: String(a.indice || ''),
    dateRecrutement: d(a.date_recrutement),
    datePriseFonction: d(a.date_prise_fonction),
    dateTitularisation: d(a.date_titularisation),
    modeRecrutement: a.mode_recrutement || '',
    numeroDecision: a.numero_decision || '',
    dateDecision: d(a.date_decision),
    referenceJO: a.reference_jo || '',
    ministereDOrigine: a.ministere_origine || '',
    niveauEtudes: a.niveau_etudes || '',
    diplome: a.diplome || '',
    specialite: a.specialite || '',
    etablissement: a.etablissement || '',
    paysFormation: a.pays_formation || '',
    anneeObtention: String(a.annee_obtention || ''),
    mention: a.mention || '',
    typeContrat: a.type_contrat || '',
    situationAdmin: a.situation_admin || 'En activité',
    numeroCnss: a.numero_cnss || '',
    numeroRetraite: a.numero_retraite || '',
    rib: a.rib || '',
    banque: a.banque || '',
    ministereAffectation: a.ministere_affectation || '',
    direction: a.direction || '',
    direction_id: a.direction_id || '',
    sousDirection: a.sous_direction || '',
    service: a.service || '',
    bureau: a.bureau || '',
    poste: a.poste || '',
    lieuAffectation: a.lieu_affectation || '',
    regionAffectation: a.region_affectation || '',
    photo_url: a.photo_url || null,
  };
}

export default function AgentEdit() {
  const { id } = useParams();
  const { data: agent, error, isLoading } = useSWR(`/agents/${id}`, fetcher);

  if (isLoading) return (
    <div className="text-center py-5">
      <Spinner animation="border" variant="primary" />
    </div>
  );

  if (error || !agent) return <Navigate to="/agents" replace />;

  return <AgentCreate agentData={apiToForm(agent)} agentId={agent.id} />;
}
