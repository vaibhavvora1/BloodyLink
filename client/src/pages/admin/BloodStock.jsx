import React, { useState, useEffect, useMemo } from 'react';
import {
  useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel
} from '@tanstack/react-table';
import { toast } from 'react-toastify';
import api from '../../services/api';
import StockSummary from '../../components/stock/StockSummary';
import StockStatusBadge from '../../components/stock/StockStatusBadge';
import StockSkeleton from '../../components/stock/StockSkeleton';
import StockEmpty from '../../components/stock/StockEmpty';
import StockError from '../../components/stock/StockError';
import StockFilters from '../../components/stock/StockFilters';
import StockTable from '../../components/stock/StockTable';
import { AddStockModal, UpdateUnitsModal } from '../../components/stock/StockModals';

export default function BloodStock() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ search: '', bloodGroup: '', status: '' });
  const [sorting, setSorting] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [listRes, sumRes] = await Promise.all([
        api.getStockList(filters),
        api.getStockSummary()
      ]);
      setData(listRes.data);
      setSummary(sumRes.data);
    } catch { setError('Failed to fetch blood stock records.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [filters]);

  const handleAdd = async (newStock) => {
    try {
      await api.addStock(newStock);
      toast.success('Stock batch added successfully');
      loadData();
    } catch { toast.error('Failed to add stock batch'); }
  };

  const handleUpdate = async (id, units) => {
    try {
      await api.updateStock(id, units);
      toast.success('Units updated successfully');
      loadData();
    } catch { toast.error('Failed to update units'); }
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'bloodGroup',
      header: 'Group',
      cell: (info) => <span className="blood-badge">{info.getValue()}</span>
    },
    { accessorKey: 'component', header: 'Component' },
    {
      accessorKey: 'units',
      header: 'Units',
      cell: (info) => <span className="fw-bold">{info.getValue()}</span>
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => <StockStatusBadge status={info.getValue()} />
    },
    {
      accessorKey: 'expiryDate',
      header: 'Expiry Date',
      cell: ({ row }) => (
        <span className={row.original.isExpiring ? 'text-danger fw-semibold' : ''}>
          {row.original.expiryDate}
          {row.original.isExpiring && <i className="bi bi-exclamation-circle ms-1" title="Expiring soon"></i>}
        </span>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary py-0 px-2"
          onClick={() => setEditItem(row.original)}
        >
          <i className="bi bi-pencil me-1"></i> Edit
        </button>
      )
    }
  ], []);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <div className="container app-container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Blood Stock Inventory</h1>
          <p className="text-muted small mb-0">Monitor units, safety thresholds, and batch expiries</p>
        </div>
        <button type="button" className="btn btn-blood-primary" onClick={() => setShowAdd(true)}>
          <i className="bi bi-plus-lg me-1"></i> Add Stock Batch
        </button>
      </div>

      <StockSummary summary={summary} />

      <div className="premium-card p-3 mb-4">
        <StockFilters filters={filters} onChange={setFilters} />
        {loading ? (
          <StockSkeleton count={5} type="table" />
        ) : error ? (
          <StockError message={error} onRetry={loadData} />
        ) : data.length === 0 ? (
          <StockEmpty onReset={() => setFilters({ search: '', bloodGroup: '', status: '' })} />
        ) : (
          <StockTable table={table} dataLength={data.length} />
        )}
      </div>

      <AddStockModal show={showAdd} onHide={() => setShowAdd(false)} onAdd={handleAdd} />
      {editItem && (
        <UpdateUnitsModal
          show={!!editItem}
          item={editItem}
          onHide={() => setEditItem(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
