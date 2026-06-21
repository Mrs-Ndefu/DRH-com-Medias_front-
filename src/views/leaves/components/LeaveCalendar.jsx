import PropTypes from 'prop-types';
import { useState } from 'react';

// react-bootstrap
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { LEAVE_TYPES, STATUSES } from '../data/leaves';

const DAY_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const monthLabel = (year, month) =>
  new Date(year, month, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

const pad2 = (n) => String(n).padStart(2, '0');

const dateStr = (year, month, day) => `${year}-${pad2(month + 1)}-${pad2(day)}`;

const todayStr = new Date().toISOString().split('T')[0];

const leavesOnDay = (leaves, ds) =>
  leaves.filter(
    (l) => l.status !== 'REJECTED' && ds >= l.dateDebut && ds <= l.dateFin
  );

// ==============================|| CONGÉS — CALENDRIER MENSUEL ||============================== //

export default function LeaveCalendar({ leaves }) {
  const now = new Date();
  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const prevMonth = () => {
    if (month === 0) { setYear((y) => y - 1); setMonth(11); }
    else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setYear((y) => y + 1); setMonth(0); }
    else setMonth((m) => m + 1);
  };

  const firstDay     = new Date(year, month, 1);
  const startOffset  = (firstDay.getDay() + 6) % 7; // 0=Mon
  const daysInMonth  = new Date(year, month + 1, 0).getDate();

  const cells = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  // Legend: unique types present this month
  const monthLeaves = leaves.filter(
    (l) => l.status !== 'REJECTED' &&
      (l.dateDebut.startsWith(`${year}-${pad2(month + 1)}`) || l.dateFin.startsWith(`${year}-${pad2(month + 1)}`))
  );
  const presentTypes = [...new Set(monthLeaves.map((l) => l.type))];

  return (
    <>
      {/* ── Navigation ── */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <Button variant="outline-secondary" size="sm" onClick={prevMonth}>
          <i className="ph ph-caret-left" />
        </Button>
        <h5 className="mb-0 text-capitalize">{monthLabel(year, month)}</h5>
        <Button variant="outline-secondary" size="sm" onClick={nextMonth}>
          <i className="ph ph-caret-right" />
        </Button>
      </div>

      {/* ── Légende ── */}
      {presentTypes.length > 0 && (
        <Row className="g-2 mb-3">
          {presentTypes.map((type) => {
            const lt = LEAVE_TYPES[type];
            return (
              <Col key={type} xs="auto">
                <Badge bg={lt.color} className="fw-normal">
                  <i className={`ph ${lt.icon} me-1`} />{lt.label}
                </Badge>
              </Col>
            );
          })}
          {leaves.filter((l) => l.status === 'PENDING_CHEF' || l.status === 'PENDING_DRH').length > 0 && (
            <Col xs="auto">
              <Badge bg="warning" text="dark" className="fw-normal">
                <i className="ph ph-clock me-1" />En attente (inclus)
              </Badge>
            </Col>
          )}
        </Row>
      )}

      {/* ── Grille calendrier ── */}
      <div className="table-responsive">
        <table className="table table-bordered mb-0" style={{ tableLayout: 'fixed' }}>
          <thead>
            <tr className="table-light text-center">
              {DAY_LABELS.map((d) => (
                <th key={d} className="small fw-semibold py-2" style={{ width: '14.28%' }}>
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, wi) => (
              <tr key={wi}>
                {week.map((day, di) => {
                  const ds          = day ? dateStr(year, month, day) : null;
                  const isToday     = ds === todayStr;
                  const isWeekend   = di === 5 || di === 6;
                  const dayLeaves   = ds ? leavesOnDay(leaves, ds) : [];
                  const MAX_VISIBLE = 2;

                  return (
                    <td
                      key={di}
                      style={{
                        verticalAlign: 'top',
                        minHeight: 80,
                        height: 90,
                        backgroundColor: !day ? '#f8f9fa' : isWeekend ? '#fafafa' : undefined,
                        padding: '4px 6px',
                      }}
                    >
                      {day && (
                        <>
                          <div
                            className="fw-semibold mb-1 text-end"
                            style={{ fontSize: 13 }}
                          >
                            <span
                              className={isToday ? 'd-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white' : ''}
                              style={isToday ? { width: 22, height: 22, fontSize: 12 } : {}}
                            >
                              {day}
                            </span>
                          </div>

                          {dayLeaves.slice(0, MAX_VISIBLE).map((l) => {
                            const lt = LEAVE_TYPES[l.type];
                            const st = STATUSES[l.status];
                            const isPending = l.status === 'PENDING_CHEF' || l.status === 'PENDING_DRH';
                            return (
                              <div
                                key={l.id}
                                title={`${l.nom} — ${lt.label} (${st.label})`}
                                className={`rounded mb-1 px-1 text-truncate small bg-${lt.color} ${isPending ? 'bg-opacity-50' : 'bg-opacity-75'} text-white`}
                                style={{ fontSize: 11, cursor: 'default', userSelect: 'none' }}
                              >
                                {l.nom.split(' ')[0]}
                              </div>
                            );
                          })}

                          {dayLeaves.length > MAX_VISIBLE && (
                            <div className="text-muted" style={{ fontSize: 10 }}>
                              +{dayLeaves.length - MAX_VISIBLE} autre{dayLeaves.length - MAX_VISIBLE > 1 ? 's' : ''}
                            </div>
                          )}
                        </>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Absences du mois ── */}
      {monthLeaves.length > 0 && (
        <div className="mt-4">
          <h6 className="text-muted mb-3">Absences ce mois</h6>
          <Row className="g-2">
            {monthLeaves.map((l) => {
              const lt = LEAVE_TYPES[l.type];
              const st = STATUSES[l.status];
              return (
                <Col key={l.id} xs={12} sm={6} md={4}>
                  <div className={`border-start border-3 border-${lt.color} ps-3 py-1`}>
                    <div className="fw-semibold small">{l.nom}</div>
                    <div className="text-muted" style={{ fontSize: 11 }}>
                      <Badge bg={lt.color} className="me-1 fw-normal">{lt.label}</Badge>
                      <Badge bg={st.color} className="fw-normal">{st.label}</Badge>
                    </div>
                    <div className="text-muted" style={{ fontSize: 11 }}>
                      {new Date(l.dateDebut).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} →{' '}
                      {new Date(l.dateFin).toLocaleDateString('fr-FR',   { day: '2-digit', month: 'short' })}
                      {' '}({l.nbJours}j)
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </div>
      )}
    </>
  );
}

LeaveCalendar.propTypes = { leaves: PropTypes.array.isRequired };
