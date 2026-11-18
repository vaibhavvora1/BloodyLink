import React, { useState } from 'react';
import { Accordion, Offcanvas } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const items = [
  ['dashboard', 'Dashboard', 'bi-speedometer2', '/admin/dashboard?section=dashboard'],
  ['requests', 'Requests & Matches', 'bi-diagram-3', '/admin/dashboard?section=requests'],
  ['donors', 'Donors', 'bi-heart-pulse', '/admin/dashboard?section=donors'],
  ['patients', 'Patients', 'bi-person-vcard', '/admin/dashboard?section=patients'],
  ['stock', 'Blood Bank', 'bi-droplet-half', '/admin/blood-stock'],
  ['hospitals', 'Hospitals', 'bi-hospital', '/admin/dashboard?section=hospitals'],
  ['messages', 'Messages', 'bi-chat-left-text', '/admin/dashboard?section=messages'],
  ['settings', 'Settings', 'bi-gear', '/admin/dashboard?section=settings']
];

function MenuContent({ onNavigate }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const selected = new URLSearchParams(location.search).get('section') || (location.pathname.endsWith('blood-stock') ? 'stock' : 'dashboard');
  return <>
    <div className="admin-menu-heading"><span className="admin-mark"><i className="bi bi-droplet-fill" /></span><div><strong>Bloodlink</strong><small>Admin workspace</small></div></div>
    <Accordion alwaysOpen defaultActiveKey={[selected]} className="admin-accordion">
      {items.map(([key, label, icon, href]) => <Accordion.Item eventKey={key} key={key}>
        <Accordion.Header><i className={`bi ${icon} me-2`} />{label}</Accordion.Header>
        <Accordion.Body className="p-0">
          <Link to={href} onClick={onNavigate} className={`admin-menu-link ${selected === key ? 'active' : ''}`}><i className={`bi ${icon} me-2`} />Open {label}</Link>
        </Accordion.Body>
      </Accordion.Item>)}
    </Accordion>
    <button className="admin-logout" onClick={async () => { await logout(); navigate('/login'); onNavigate?.(); }}><i className="bi bi-box-arrow-left me-2" />Logout</button>
  </>;
}

export default function AdminMenu() {
  const [show, setShow] = useState(false);
  return <>
    <aside className="admin-sidebar d-none d-lg-flex"><MenuContent /></aside>
    <div className="admin-mobile-bar d-lg-none"><button type="button" className="btn btn-blood-primary" onClick={() => setShow(true)}><i className="bi bi-list me-2" />Admin menu</button></div>
    <Offcanvas show={show} onHide={() => setShow(false)} className="admin-offcanvas">
      <Offcanvas.Header closeButton><Offcanvas.Title>Admin menu</Offcanvas.Title></Offcanvas.Header>
      <Offcanvas.Body className="p-0"><MenuContent onNavigate={() => setShow(false)} /></Offcanvas.Body>
    </Offcanvas>
  </>;
}
