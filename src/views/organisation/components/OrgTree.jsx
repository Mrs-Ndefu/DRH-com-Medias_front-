import PropTypes from 'prop-types';
import { useState } from 'react';

// react-bootstrap
import Accordion from 'react-bootstrap/Accordion';
import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { MINISTERE, SECRETARIAT_GENERAL } from '../data/org';

// ==============================|| ORGANISATION — ORGANIGRAMME ||============================== //

export default function OrgTree({ directions, divisions, bureaux, sgDivisions, sgBureaux }) {
  const [openDir, setOpenDir] = useState(directions[0]?.id || null);

  const totalAgents   = directions.reduce((s, d) => s + (d.effectif || 0), 0) + (SECRETARIAT_GENERAL.effectif || 0);
  const totalDivisions = divisions.length;
  const totalBureaux  = bureaux.length;

  const kpis = [
    { label: 'Directions',   value: directions.filter(d => d.active).length, icon: 'ph-buildings',    color: 'primary'   },
    { label: 'Divisions',    value: totalDivisions,                           icon: 'ph-layout',       color: 'info'      },
    { label: 'Bureaux',      value: totalBureaux,                             icon: 'ph-door',         color: 'secondary' },
    { label: 'Agents (est.)',value: totalAgents,                              icon: 'ph-users',        color: 'success'   },
  ];

  return (
    <>
      {/* ── Bannière ministère ── */}
      <div className="bg-primary bg-opacity-10 border border-primary border-opacity-25 rounded p-4 mb-4 text-center">
        <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white mb-3" style={{ width: 56, height: 56 }}>
          <i className="ph ph-bank f-24" />
        </div>
        <h5 className="mb-1 text-primary">{MINISTERE.nom}</h5>
        <Badge bg="primary" className="me-2">{MINISTERE.sigle}</Badge>
        <Badge bg="light" text="dark" className="me-2">Ministre : {MINISTERE.ministre}</Badge>
        <Badge bg="light" text="dark">SG : {MINISTERE.secretaireGeneral}</Badge>
        <p className="text-muted small mt-2 mb-0">
          <i className="ph ph-map-pin me-1" />{MINISTERE.adresse}
        </p>
      </div>

      {/* ── KPIs ── */}
      <Row className="g-3 mb-4">
        {kpis.map((k) => (
          <Col key={k.label} xs={6} md={3}>
            <div className={`border border-${k.color} border-opacity-25 rounded p-3 text-center bg-${k.color} bg-opacity-10`}>
              <i className={`ph ${k.icon} f-24 text-${k.color} d-block mb-1`} />
              <h4 className={`mb-0 text-${k.color}`}>{k.value}</h4>
              <small className="text-muted">{k.label}</small>
            </div>
          </Col>
        ))}
      </Row>

      {/* ── Secrétariat Général ── */}
      <div className="position-relative ps-4 mb-4" style={{ borderLeft: '2px solid var(--bs-warning)' }}>
        <div className="position-relative mb-2">
          <div style={{ position: 'absolute', left: -36, top: 20, width: 34, height: 2, backgroundColor: 'var(--bs-warning)' }} />
          <div className="border border-warning rounded p-3 bg-warning bg-opacity-10">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div className="d-flex align-items-center gap-3">
                <div className="rounded d-flex align-items-center justify-content-center bg-warning text-white flex-shrink-0"
                  style={{ width: 40, height: 40 }}>
                  <i className="ph ph-user-gear f-18" />
                </div>
                <div>
                  <div className="fw-semibold">{SECRETARIAT_GENERAL.nom}</div>
                  <small className="text-muted">
                    <Badge bg="warning" text="dark" className="me-1">{SECRETARIAT_GENERAL.sigle}</Badge>
                    <i className="ph ph-user me-1" />{SECRETARIAT_GENERAL.titulaire}
                  </small>
                </div>
              </div>
              <div className="d-flex gap-2 flex-wrap">
                {SECRETARIAT_GENERAL.telephoneOff && (
                  <span className="small text-muted"><i className="ph ph-phone me-1" />{SECRETARIAT_GENERAL.telephoneOff}</span>
                )}
                <Badge bg="light" text="dark">{SECRETARIAT_GENERAL.effectif} agents</Badge>
                <Badge bg="light" text="dark">{sgDivisions.filter(d => d.active).length} divisions</Badge>
              </div>
            </div>

            {/* Divisions du SG */}
            {sgDivisions.filter(d => d.active).length > 0 && (
              <div className="ms-5 mt-3 position-relative" style={{ borderLeft: '2px dashed var(--bs-warning)' }}>
                {sgDivisions.filter(d => d.active).map((div) => {
                  const divBur = sgBureaux.filter(b => b.divisionId === div.id && b.active);
                  return (
                    <div key={div.id} className="ms-3 mb-2 position-relative">
                      <div style={{ position: 'absolute', left: -22, top: 14, width: 20, height: 2, backgroundColor: 'var(--bs-warning)' }} />
                      <Accordion flush>
                        <Accordion.Item eventKey={div.id} className="border rounded overflow-hidden">
                          <Accordion.Header>
                            <div className="d-flex align-items-center gap-2 w-100 me-3">
                              <i className="ph ph-layout text-warning f-18" />
                              <span className="fw-semibold">{div.nom}</span>
                              {div.chef && <small className="text-muted ms-2"><i className="ph ph-user me-1" />{div.chef}</small>}
                              <Badge bg="warning" text="dark" className="ms-auto me-2">{divBur.length} bureau{divBur.length > 1 ? 'x' : ''}</Badge>
                            </div>
                          </Accordion.Header>
                          {divBur.length > 0 && (
                            <Accordion.Body className="p-2">
                              {divBur.map((b) => (
                                <div key={b.id} className="d-flex align-items-center gap-2 py-1 px-2 rounded">
                                  <i className="ph ph-door text-secondary" />
                                  <span className="small">{b.nom}</span>
                                  {b.chef && <small className="text-muted ms-auto"><i className="ph ph-user me-1" />{b.chef}</small>}
                                  {b.effectif && <Badge bg="light" text="dark" className="ms-1">{b.effectif}</Badge>}
                                </div>
                              ))}
                            </Accordion.Body>
                          )}
                        </Accordion.Item>
                      </Accordion>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Arbre : Directions → Divisions → Bureaux ── */}
      <div className="position-relative ps-4" style={{ borderLeft: '2px solid var(--bs-primary)' }}>

        {directions.filter(d => d.active).map((dir) => {
          const dirDivisions = divisions.filter(dv => dv.directionId === dir.id && dv.active);
          const isOpen       = openDir === dir.id;

          return (
            <div key={dir.id} className="mb-4 position-relative">
              {/* Connecteur horizontal */}
              <div style={{ position: 'absolute', left: -36, top: 20, width: 34, height: 2, backgroundColor: 'var(--bs-primary)' }} />

              {/* Carte direction ── */}
              <div
                className={`border rounded p-3 cursor-pointer ${isOpen ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary bg-light'}`}
                style={{ cursor: 'pointer', userSelect: 'none' }}
                onClick={() => setOpenDir(isOpen ? null : dir.id)}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div className={`rounded d-flex align-items-center justify-content-center bg-${isOpen ? 'primary' : 'secondary'} text-white flex-shrink-0`}
                      style={{ width: 40, height: 40 }}>
                      <i className="ph ph-buildings f-18" />
                    </div>
                    <div>
                      <div className="fw-semibold">{dir.nom}</div>
                      <small className="text-muted">
                        <Badge bg="light" text="dark" className="me-1">{dir.sigle}</Badge>
                        {dir.chef && <><i className="ph ph-user me-1" />{dir.chef}</>}
                      </small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <Badge bg="light" text="dark">{dir.effectif} agents</Badge>
                    <Badge bg="light" text="dark">{dirDivisions.length} div.</Badge>
                    <i className={`ph ph-caret-${isOpen ? 'up' : 'down'} text-muted`} />
                  </div>
                </div>
              </div>

              {/* Divisions ── */}
              {isOpen && dirDivisions.length > 0 && (
                <div className="ms-5 mt-2 position-relative" style={{ borderLeft: '2px dashed var(--bs-info)' }}>
                  {dirDivisions.map((div) => {
                    const divBureaux = bureaux.filter(b => b.divisionId === div.id && b.active);
                    return (
                      <div key={div.id} className="ms-3 mb-3 position-relative">
                        <div style={{ position: 'absolute', left: -22, top: 14, width: 20, height: 2, backgroundColor: 'var(--bs-info)' }} />

                        {/* Carte division */}
                        <Accordion flush>
                          <Accordion.Item eventKey={div.id} className="border rounded overflow-hidden">
                            <Accordion.Header>
                              <div className="d-flex align-items-center gap-2 w-100 me-3">
                                <i className="ph ph-layout text-info f-18" />
                                <span className="fw-semibold">{div.nom}</span>
                                {div.chef && <small className="text-muted ms-2"><i className="ph ph-user me-1" />{div.chef}</small>}
                                <Badge bg="info" className="ms-auto me-2">{divBureaux.length} bureau{divBureaux.length > 1 ? 'x' : ''}</Badge>
                              </div>
                            </Accordion.Header>
                            {divBureaux.length > 0 && (
                              <Accordion.Body className="p-2">
                                {divBureaux.map((b) => (
                                  <div key={b.id} className="d-flex align-items-center gap-2 py-1 px-2 rounded hover-bg">
                                    <i className="ph ph-door text-secondary" />
                                    <span className="small">{b.nom}</span>
                                    {b.chef && <small className="text-muted ms-auto"><i className="ph ph-user me-1" />{b.chef}</small>}
                                    {b.effectif && <Badge bg="light" text="dark" className="ms-1">{b.effectif}</Badge>}
                                  </div>
                                ))}
                              </Accordion.Body>
                            )}
                          </Accordion.Item>
                        </Accordion>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

OrgTree.propTypes = {
  directions:  PropTypes.array.isRequired,
  divisions:   PropTypes.array.isRequired,
  bureaux:     PropTypes.array.isRequired,
  sgDivisions: PropTypes.array.isRequired,
  sgBureaux:   PropTypes.array.isRequired,
};
