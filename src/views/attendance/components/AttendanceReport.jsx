import PropTypes from 'prop-types';
import { useState } from 'react';

// react-bootstrap
import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import MainCard from 'components/MainCard';

const todayStr  = () => new Date().toISOString().split('T')[0];
const fmtTime   = (d) => d ? new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '—';
const fmtDate   = (str) => new Date(str).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

const computeRows = (records, date) => {
  const dayRecords = records.filter((r) => r.date === date);
  const byEmployee = {};

  dayRecords.forEach((r) => {
    if (!byEmployee[r.employeeId]) {
      byEmployee[r.employeeId] = { ...r, ins: [], outs: [] };
    }
    if (r.type === 'IN')  byEmployee[r.employeeId].ins.push(new Date(r.timestamp));
    else                  byEmployee[r.employeeId].outs.push(new Date(r.timestamp));
  });

  return Object.values(byEmployee).map((emp) => {
    const ins  = emp.ins.sort((a, b) => a - b);
    const outs = emp.outs.sort((a, b) => a - b);
    const arrivee = ins[0]                      || null;
    const depart  = outs[outs.length - 1]       || null;

    let duree = '—';
    if (arrivee && depart) {
      const diff = depart - arrivee;
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      duree = `${h}h${String(m).padStart(2, '0')}`;
    }

    const retard = arrivee && arrivee.getHours() >= 8 && arrivee.getMinutes() > 15;

    return {
      employeeId: emp.employeeId,
      nom:        emp.nom,
      poste:      emp.poste,
      matricule:  emp.matricule,
      arrivee,
      depart,
      duree,
      retard,
      statut: depart ? 'Terminé' : 'En cours',
    };
  }).sort((a, b) => (a.arrivee || 0) - (b.arrivee || 0));
};

// ==============================|| POINTAGE — RAPPORT JOURNALIER ||============================== //

export default function AttendanceReport({ records }) {
  const [dateFilter, setDateFilter] = useState(todayStr());

  const rows      = computeRows(records, dateFilter);
  const enCours   = rows.filter((r) => r.statut === 'En cours').length;
  const termines  = rows.filter((r) => r.statut === 'Terminé').length;
  const retards   = rows.filter((r) => r.retard).length;
  const total     = rows.length;

  const kpis = [
    { label: 'Présents aujourd\'hui', value: total,    icon: 'ph-users',          color: 'primary'  },
    { label: 'En cours (non sortis)', value: enCours,  icon: 'ph-sign-in',        color: 'success'  },
    { label: 'Sorties enregistrées',  value: termines, icon: 'ph-sign-out',       color: 'secondary'},
    { label: 'Retards signalés',      value: retards,  icon: 'ph-warning-circle', color: 'warning'  },
  ];

  return (
    <>
      {/* ── Sélecteur de date ── */}
      <Row className="g-3 mb-4 align-items-end">
        <Col xs={12} sm={6} md={3}>
          <Form.Label className="small mb-1">Date du rapport</Form.Label>
          <Form.Control
            type="date"
            size="sm"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </Col>
        {dateFilter && (
          <Col xs={12} sm={6} md={5}>
            <p className="text-muted small mb-0">
              <i className="ph ph-calendar me-1" />{fmtDate(dateFilter)}
            </p>
          </Col>
        )}
      </Row>

      {/* ── KPI cards ── */}
      <Row className="g-3 mb-4">
        {kpis.map((kpi) => (
          <Col key={kpi.label} xs={6} xl={3}>
            <MainCard>
              <div className="d-flex align-items-center gap-3">
                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center bg-${kpi.color} bg-opacity-10 flex-shrink-0`}
                  style={{ width: 48, height: 48 }}
                >
                  <i className={`ph ${kpi.icon} f-20 text-${kpi.color}`} />
                </div>
                <div>
                  <h4 className="mb-0">{kpi.value}</h4>
                  <small className="text-muted">{kpi.label}</small>
                </div>
              </div>
            </MainCard>
          </Col>
        ))}
      </Row>

      {/* ── Tableau récapitulatif par employé ── */}
      <Table hover responsive className="align-middle">
        <thead className="table-light">
          <tr>
            <th>Matricule</th>
            <th>Nom & Prénom</th>
            <th>Poste</th>
            <th className="text-center">Arrivée</th>
            <th className="text-center">Départ</th>
            <th className="text-center">Durée</th>
            <th className="text-center">Statut</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center text-muted py-5">
                <i className="ph ph-chart-bar f-36 d-block mb-2" />
                Aucune donnée de présence pour cette date
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.employeeId}>
                <td><code className="text-muted">{row.matricule}</code></td>
                <td>
                  <span className="fw-semibold">{row.nom}</span>
                  {row.retard && (
                    <Badge bg="warning" text="dark" className="ms-2 small">
                      <i className="ph ph-clock me-1" />Retard
                    </Badge>
                  )}
                </td>
                <td className="text-muted small">{row.poste}</td>
                <td className="text-center">{fmtTime(row.arrivee)}</td>
                <td className="text-center">{fmtTime(row.depart)}</td>
                <td className="text-center fw-semibold">{row.duree}</td>
                <td className="text-center">
                  <Badge bg={row.statut === 'Terminé' ? 'secondary' : 'success'}>
                    {row.statut}
                  </Badge>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </>
  );
}

AttendanceReport.propTypes = { records: PropTypes.array.isRequired };
