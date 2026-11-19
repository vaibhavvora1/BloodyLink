import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function SidebarContent({ navItems, roleLabel, onNavigate }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="dashboard-sidebar-inner">
      <div className="dashboard-brand">
        <span className="dashboard-brand-mark"><i className="bi bi-droplet-fill" /></span>
        <div>
          <strong>Bloodlink</strong>
          <small>{roleLabel}</small>
        </div>
      </div>
      <nav className="dashboard-nav" aria-label={`${roleLabel} navigation`}>
        {navItems.map((item) => {
          const active = item.active
            ? item.active(location)
            : location.pathname === item.to.split('?')[0];
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`dashboard-nav-link ${active ? 'active' : ''}`}
              aria-current={active ? 'page' : undefined}
              onClick={onNavigate}
            >
              <i className={`bi ${item.icon}`} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        className="dashboard-logout"
        onClick={async () => {
          await logout();
          navigate('/login');
          onNavigate?.();
        }}
      >
        <i className="bi bi-box-arrow-left" aria-hidden="true" />
        <span>Logout</span>
      </button>
    </div>
  );
}

export default function DashboardLayout({ title, roleLabel, navItems, children, onRefresh, loading }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setDrawerOpen(false), [location.pathname, location.search]);

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setDrawerOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    document.body.classList.add('dashboard-drawer-open');
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.classList.remove('dashboard-drawer-open');
    };
  }, [drawerOpen]);

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar" aria-label={`${roleLabel} sidebar`}>
        <SidebarContent navItems={navItems} roleLabel={roleLabel} />
      </aside>

      {drawerOpen && (
        <button
          type="button"
          className="dashboard-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setDrawerOpen(false)}
        />
      )}
      <aside
        id="dashboard-navigation-drawer"
        className={`dashboard-drawer ${drawerOpen ? 'open' : ''}`}
        aria-label={`${roleLabel} navigation drawer`}
        aria-hidden={!drawerOpen}
      >
        <div className="dashboard-drawer-header">
          <span>{roleLabel}</span>
          <button type="button" className="dashboard-close" aria-label="Close navigation menu" onClick={() => setDrawerOpen(false)}>
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </div>
        <SidebarContent navItems={navItems} roleLabel={roleLabel} onNavigate={() => setDrawerOpen(false)} />
      </aside>

      <div className="dashboard-workspace">
        <header className="dashboard-topbar">
          <button
            type="button"
            className="dashboard-menu-button"
            aria-label="Open navigation menu"
            aria-expanded={drawerOpen}
            aria-controls="dashboard-navigation-drawer"
            onClick={() => setDrawerOpen(true)}
          >
            <i className="bi bi-list" aria-hidden="true" />
            <span>Menu</span>
          </button>
          <h1>{title}</h1>
          {onRefresh && (
            <button type="button" className="btn btn-outline-secondary dashboard-refresh" onClick={onRefresh} disabled={loading}>
              <i className="bi bi-arrow-clockwise" aria-hidden="true" />
              <span>Refresh</span>
            </button>
          )}
        </header>
        <main className="dashboard-main">{children}</main>
      </div>
    </div>
  );
}
