import PropTypes from 'prop-types';

// react-bootstrap
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import MainCard from 'components/MainCard';
import { LEAVE_TYPES, STATUSES } from '../data/leaves';

const fmt = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : '—';

const todayStr = new Date().toISOString().split('T')[0];
const monthStr = todayStr.substring(0, 7);

// ==============================|| CONGÉS — TABLEAU DE BORD ||============================== //

export default function LeavesDashboard({ leaves, onSelect, onNewRequest }) {
  const pending  = leaves.filter((l) => l.status === 'PENDING_CHEF' || l.status === 'PENDING_DRH');
  const approved = leaves.filter((l) => l.status === 'APPROVED');
  const rejected = leaves.filter((l) => l.status === 'REJECTED');
  const active   = approved.filter((l) => l.dateDebut <= todayStr && l.dateFin >= todayStr);

  const joursApprouvesThisMonth = approved
    .filter((l) => l.dateDebut.startsWith(monthStr) || l.dateFin.startsWith(monthStr))
    .reduce((sum, l) => sum + l.nbJours, 0);

  const byType = Object.entries(LEAVE_TYPES).map(([key, lt]) => ({
    key,
    ...lt,
    count: leaves.filter((l) => l.type === key).length,
  })).filter((t) => t.count > 0);

  const kpis = [
    { label: 'Total demandes',      value: leaves.length,    icon: 'ph-files',         color: 'primary'   },
    { label: 'En attente',          value: pending.length,   icon: 'ph-clock',         color: 'warning'   },
    { label: 'En congé (auj.)',     value: active.length,    icon: 'ph-beach',         color: 'success'   },
    { label: 'Jours approuvés / mois', value: joursApprouvesThisMonth, icon: 'ph-calendar', color: 'info' },
  ];

  return (
    <>
      {/* ── KPI ── */}
      <Row className="g-3 mb-4">
        {kpis.map((k) => (
          <Col key={k.label} xs={6} xl={3}>
            <MainCard>
              <div className="d-flex align-items-center gap-3">
                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center bg-${k.color} bg-opacity-10 flex-shrink-0`}
                  style={{ width: 52, height: 52 }}
                >
                  <i className={`ph ${k.icon} f-20 text-${k.color}`} />
                </div>
                <div>
                  <h4 className="mb-0">{k.value}</h4>
                  <small className="text-muted">{k.label}</small>
                </div>
              </div>
            </MainCard>
          </Col>
        ))}
      </Row>

      <Row className="g-3">
        {/* ── Demandes en attente ── */}
        <Col xs={12} lg={7}>
          <MainCard title="Demandes en attente de validation">
            {pending.length === 0 ? (
              <p className="text-muted text-center py-3">
                <i className="ph ph-check-circle f-36 d-block mb-2" />
                Aucune demande en attente
              </p>
            ) : (
              <Table hover responsive className="align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Employé</th>
                    <th>Type</th>
                    <th>Période</th>
                    <th className="text-center">Étape</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {pending.map((l) => {
                    const lt = LEAVE_TYPES[l.type];
                    const st = STATUSES[l.status];
                    return (
                      <tr key={l.id}>
                        <td>
                          <div className="fw-semibold">{l.nom}</div>
                          <small className="text-muted">{l.service}</small>
                        </td>
                        <td>
                          <Badge bg={lt.color} className="fw-normal">
                            <i className={`ph ${lt.icon} me-1`} />{lt.label}
                          </Badge>
                        </td>
                        <td className="small">
                          {fmt(l.dateDebut)} → {fmt(l.dateFin)}
                          <br /><span className="text-muted">{l.nbJours}j</span>
                        </td>
                        <td className="text-center">
                          <Badge bg={st.color}>{st.label}</Badge>
                        </td>
                        <td>
                          <Button variant="outline-primary" size="sm" onClick={() => onSelect(l)}>
                            Traiter
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </MainCard>
        </Col>

        {/* ── Répartition par type + statut ── */}
        <Col xs={12} lg={5}>
          <MainCard title="Répartition par type" className="mb-3">
            {byType.map((t) => (
              <div key={t.key} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                <span className="small">
                  <i className={`ph ${t.icon} me-2 text-${t.color}`} />{t.label}
                </span>
                <Badge bg={t.color}>{t.count}</Badge>
              </div>
            ))}
          </MainCard>

          <MainCard title="Résumé des statuts">
            {[
              { label: 'Approuvés',  count: approved.length, color: 'success' },
              { label: 'En attente', count: pending.length,  color: 'warning' },
              { label: 'Rejetés',    count: rejected.length, color: 'danger'  },
            ].map((s) => (
              <div key={s.label} className="mb-2">
                <div className="d-flex justify-content-between small mb-1">
                  <span>{s.label}</span>
                  <span className={`text-${s.color} fw-semibold`}>{s.count}</span>
                </div>
                <div className="progress" style={{ height: 6 }}>
                  <div
                    className={`progress-bar bg-${s.color}`}
                    style={{ width: `${leaves.length ? (s.count / leaves.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
            <Button variant="outline-primary" size="sm" className="w-100 mt-3" onClick={onNewRequest}>
              <i className="ph ph-plus me-2" />Nouvelle demande
            </Button>
          </MainCard>
        </Col>
      </Row>
    </>
  );
}

LeavesDashboard.propTypes = {
  leaves:       PropTypes.array.isRequired,
  onSelect:     PropTypes.func.isRequired,
  onNewRequest: PropTypes.func.isRequired,
};
