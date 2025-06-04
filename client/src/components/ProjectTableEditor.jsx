// src/components/ProjectTableEditor.jsx
import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';  // TanStack Table + MUI wrapper
import { useDebounce } from '../hooks/useDebounce';
import { useTasks } from '../contexts/TaskStore';
// Import custom cell components (note: may need slight refactoring, see below)
import EditableCell from './EditorTableComponents/EditableCell';
import EditableCheckbox from './EditorTableComponents/EditableCheckbox';
import EditableNumberCell  from './EditorTableComponents/EditableNumberCell';
import ToggleBox from './EditorTableComponents/ToggleBox';

export default function ProjectTableEditor() {
  const { progress, api } = useTasks();
  const pendingRef = useRef({});  // pending patches pool for debounce
  
  // Convert progress data to array of rows (ensure each row has an `id` field)
  const rows = useMemo(() => {
    if (!progress) return [];
    if (Array.isArray(progress)) {
      return progress;
    }
    if (typeof progress === 'object' && progress !== null) {
      // Convert object map to array
      return Object.entries(progress).map(([id, record]) =>
        record.id ? record : { ...record, id }
      );
    }
    console.error('Invalid progress data format:', progress);
    return [];
  }, [progress]);

  // Debounced function to flush pending patches to server
  const flushPatches = useDebounce(() => {
    const allPatches = pendingRef.current;
    pendingRef.current = {};  // reset the patch pool
    // Send each accumulated patch to the server
    Object.entries(allPatches).forEach(([id, patch]) => {
      api.saveProgress(id, patch);
    });
  }, 1500);

  // Helper to queue a patch and trigger debounce
  const queuePatch = useCallback((id, newPatch) => {
    // Merge newPatch into pendingRef (deep merge to accumulate nested fields)
    pendingRef.current[id] = pendingRef.current[id]
      ? { ...pendingRef.current[id], ...newPatch }
      : newPatch;
    // Reset debounce timer
    flushPatches();
  }, [flushPatches]);

  // Field change handler – updates local state optimistically and queues patch
  const handleChange = useCallback((rowId, section, key, value) => {
    if (!rowId) return;
    const patch = key == null 
      ? { [section]: value } 
      : { [section]: { [key]: value } };
    api.mergeProgress(rowId, patch);    // optimistic UI update (local merge)
    queuePatch(rowId, patch);           // add to pending patches (debounced save)
  }, [api, queuePatch]);

  // Toggle "active" field handler for stages (pak/wtr/str)
  const handleToggleActive = useCallback((rowId, section) => {
    if (!rowId) return;
    const rowObj = progress.find(r => r.id === rowId);
    if (!rowObj) return;
    const newActive = !rowObj[section]?.active;
    const patch = { [section]: { active: newActive } };
    api.mergeProgress(rowId, patch);   // update active flag locally
    queuePatch(rowId, patch);          // queue patch to save active flag
  }, [api, queuePatch, progress]);

  // Load initial data on mount
  useEffect(() => {
    api.loadProgress();
  }, [api]);

  // Flush any remaining patches on unmount (to avoid losing unsaved changes)
  useEffect(() => {
    return () => {
      flushPatches.flush();
    };
  }, [flushPatches]);

  // Define table columns with custom cell renderers
  const columns = useMemo(() => [
    // Top-level text fields
    {
      header: 'LOCATION',
      accessorKey: 'location',
      // Use custom text editor cell (click to edit, saves on blur)
      Cell: ({ row }) => (
        <EditableCell 
          field="location" 
          value={row.original.location} 
          onChange={(field, _key, val) => handleChange(row.original.id, field, null, val)}
        />
      ),
    },
    {
      header: 'YEAR',
      accessorKey: 'year',
      Cell: ({ row }) => (
        <EditableCell 
          field="year" 
          value={row.original.year} 
          onChange={(field, _key, val) => handleChange(row.original.id, field, null, val)}
        />
      ),
    },
    {
      header: 'INSURANCE',
      accessorKey: 'insurance',
      Cell: ({ row }) => (
        <EditableCell 
          field="insurance" 
          value={row.original.insurance} 
          onChange={(field, _key, val) => handleChange(row.original.id, field, null, val)}
        />
      ),
    },
    // Standalone boolean fields
    {
      header: 'AROL',
      accessorKey: 'arol',
      Cell: ({ row }) => (
        <EditableCheckbox 
          value={row.original.arol || false}
          onChange={(e) => handleChange(row.original.id, 'arol', null, e.target.checked)}
        />
      ),
    },
    {
      header: 'TEST',
      accessorKey: 'test',
      Cell: ({ row }) => (
        <EditableCheckbox 
          value={row.original.test || false}
          onChange={(e) => handleChange(row.original.id, 'test', null, e.target.checked)}
        />
      ),
    },
    // PAK section (toggle + subfields + estimates group)
    {
      header: 'PAK',  // main toggle with date
      accessorKey: 'pak', 
      // minWidth ~110px as in original, to fit checkbox + date
      size: 110,
      Cell: ({ row }) => (
        <ToggleBox 
          section="pak"
          data={row.original.pak || {}} 
          onToggleActive={(sect) => handleToggleActive(row.original.id, sect)}
          onDateChange={(sect, key, val) => handleChange(row.original.id, sect, key, val)}
        />
      ),
    },
    {
      header: 'POUT',
      accessorKey: 'pak.pout',
      id: 'pak_pout',
      Cell: ({ row }) => (
        <EditableCheckbox 
          value={row.original.pak?.pout || false}
          disabled={!row.original.pak?.active}
          onChange={(e) => handleChange(row.original.id, 'pak', 'pout', e.target.checked)}
        />
      ),
    },
    {
      header: 'PACK',
      accessorKey: 'pak.pack',
      id: 'pak_pack',
      Cell: ({ row }) => (
        <EditableCheckbox 
          value={row.original.pak?.pack || false}
          disabled={!row.original.pak?.active}
          onChange={(e) => handleChange(row.original.id, 'pak', 'pack', e.target.checked)}
        />
      ),
    },
    // PAK ESTIMATE grouped columns (Send, Review, Agree)
    {
      header: 'PAK ESTIMATE',
      id: 'pak_estimate',
      columns: [
        {
          header: 'SEND',
          id: 'pak_est_send',
          // Each "estimate" cell contains a checkbox + number input
          Cell: ({ row }) => (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60, minHeight: 60 }}>
              <input 
                type="checkbox" 
                checked={row.original.pak?.estimateSend || false}
                disabled={!row.original.pak?.active}
                onChange={(e) => handleChange(row.original.id, 'pak', 'estimateSend', e.target.checked)}
                style={{ marginBottom: '4px' }}
              />
              <input 
                type="number" 
                value={row.original.pak?.estimateSendAmount ?? ''} 
                disabled={!row.original.pak?.active}
                onChange={(e) => handleChange(row.original.id, 'pak', 'estimateSendAmount', e.target.value)}
                style={{ width: '3.5rem', textAlign: 'center' }}
                onBlur={(e) => { /* optional: handle blur same as change to ensure save on focus loss */ }}
              />
            </div>
          ),
        },
        {
          header: 'REVIEW',
          id: 'pak_est_review',
          Cell: ({ row }) => (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60, minHeight: 60 }}>
              <input 
                type="checkbox" 
                checked={row.original.pak?.estimateReview || false}
                disabled={!row.original.pak?.active}
                onChange={(e) => handleChange(row.original.id, 'pak', 'estimateReview', e.target.checked)}
                style={{ marginBottom: '4px' }}
              />
              <input 
                type="number" 
                value={row.original.pak?.estimateReviewAmount ?? ''} 
                disabled={!row.original.pak?.active}
                onChange={(e) => handleChange(row.original.id, 'pak', 'estimateReviewAmount', e.target.value)}
                style={{ width: '3.5rem', textAlign: 'center' }}
                onBlur={(e) => {/* onBlur same as change, if needed */}}
              />
            </div>
          ),
        },
        {
          header: 'AGREE',
          id: 'pak_est_agree',
          Cell: ({ row }) => (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60, minHeight: 60 }}>
              <input 
                type="checkbox" 
                checked={row.original.pak?.estimateAgree || false}
                disabled={!row.original.pak?.active}
                onChange={(e) => handleChange(row.original.id, 'pak', 'estimateAgree', e.target.checked)}
                style={{ marginBottom: '4px' }}
              />
              <input 
                type="number" 
                value={row.original.pak?.estimateAgreeAmount ?? ''} 
                disabled={!row.original.pak?.active}
                onChange={(e) => handleChange(row.original.id, 'pak', 'estimateAgreeAmount', e.target.value)}
                style={{ width: '3.5rem', textAlign: 'center' }}
                onBlur={(e) => {/* onBlur logic if needed */}}
              />
            </div>
          ),
        },
      ],
    },
    // WTR section
    {
      header: 'WTR',
      accessorKey: 'wtr',
      size: 110,
      Cell: ({ row }) => (
        <ToggleBox 
          section="wtr"
          data={row.original.wtr || {}} 
          onToggleActive={(sect) => handleToggleActive(row.original.id, sect)}
          onDateChange={(sect, key, val) => handleChange(row.original.id, sect, key, val)}
        />
      ),
    },
    { 
      header: 'CTRC', 
      accessorKey: 'wtr.ctrc',
      id: 'wtr_ctrc',
      Cell: ({ row }) => (
        <EditableCheckbox 
          value={row.original.wtr?.ctrc || false}
          disabled={!row.original.wtr?.active}
          onChange={(e) => handleChange(row.original.id, 'wtr', 'ctrc', e.target.checked)}
        />
      ),
    },
    { 
      header: 'DEMO', 
      accessorKey: 'wtr.demo',
      id: 'wtr_demo',
      Cell: ({ row }) => (
        <EditableCheckbox 
          value={row.original.wtr?.demo || false}
          disabled={!row.original.wtr?.active}
          onChange={(e) => handleChange(row.original.id, 'wtr', 'demo', e.target.checked)}
        />
      ),
    },
    { 
      header: 'ITEL', 
      accessorKey: 'wtr.itel',
      id: 'wtr_itel',
      Cell: ({ row }) => (
        <EditableCheckbox 
          value={row.original.wtr?.itel || false}
          disabled={!row.original.wtr?.active}
          onChange={(e) => handleChange(row.original.id, 'wtr', 'itel', e.target.checked)}
        />
      ),
    },
    { 
      header: 'EQ', 
      accessorKey: 'wtr.eq',
      id: 'wtr_eq',
      Cell: ({ row }) => (
        <EditableCheckbox 
          value={row.original.wtr?.eq || false}
          disabled={!row.original.wtr?.active}
          onChange={(e) => handleChange(row.original.id, 'wtr', 'eq', e.target.checked)}
        />
      ),
    },
    { 
      header: 'PICK', 
      accessorKey: 'wtr.pick',
      id: 'wtr_pick',
      Cell: ({ row }) => (
        <EditableCheckbox 
          value={row.original.wtr?.pick || false}
          disabled={!row.original.wtr?.active}
          onChange={(e) => handleChange(row.original.id, 'wtr', 'pick', e.target.checked)}
        />
      ),
    },
    // WTR ESTIMATE grouped
    {
      header: 'WTR ESTIMATE',
      id: 'wtr_estimate',
      columns: [
        {
          header: 'SEND',
          id: 'wtr_est_send',
          Cell: ({ row }) => (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60, minHeight: 60 }}>
              <input 
                type="checkbox" 
                checked={row.original.wtr?.estimateSend || false}
                disabled={!row.original.wtr?.active}
                onChange={(e) => handleChange(row.original.id, 'wtr', 'estimateSend', e.target.checked)}
                style={{ marginBottom: '4px' }}
              />
              <input 
                type="number" 
                value={row.original.wtr?.estimateSendAmount ?? ''} 
                disabled={!row.original.wtr?.active}
                onChange={(e) => handleChange(row.original.id, 'wtr', 'estimateSendAmount', e.target.value)}
                style={{ width: '3.5rem', textAlign: 'center' }}
              />
            </div>
          ),
        },
        {
          header: 'REVIEW',
          id: 'wtr_est_review',
          Cell: ({ row }) => (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60, minHeight: 60 }}>
              <input 
                type="checkbox" 
                checked={row.original.wtr?.estimateReview || false}
                disabled={!row.original.wtr?.active}
                onChange={(e) => handleChange(row.original.id, 'wtr', 'estimateReview', e.target.checked)}
                style={{ marginBottom: '4px' }}
              />
              <input 
                type="number" 
                value={row.original.wtr?.estimateReviewAmount ?? ''} 
                disabled={!row.original.wtr?.active}
                onChange={(e) => handleChange(row.original.id, 'wtr', 'estimateReviewAmount', e.target.value)}
                style={{ width: '3.5rem', textAlign: 'center' }}
              />
            </div>
          ),
        },
        {
          header: 'AGREE',
          id: 'wtr_est_agree',
          Cell: ({ row }) => (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60, minHeight: 60 }}>
              <input 
                type="checkbox" 
                checked={row.original.wtr?.estimateAgree || false}
                disabled={!row.original.wtr?.active}
                onChange={(e) => handleChange(row.original.id, 'wtr', 'estimateAgree', e.target.checked)}
                style={{ marginBottom: '4px' }}
              />
              <input 
                type="number" 
                value={row.original.wtr?.estimateAgreeAmount ?? ''} 
                disabled={!row.original.wtr?.active}
                onChange={(e) => handleChange(row.original.id, 'wtr', 'estimateAgreeAmount', e.target.value)}
                style={{ width: '3.5rem', textAlign: 'center' }}
              />
            </div>
          ),
        },
      ],
    },
    // STR section
    {
      header: 'STR',
      accessorKey: 'str',
      size: 110,
      Cell: ({ row }) => (
        <ToggleBox 
          section="str"
          data={row.original.str || {}}
          onToggleActive={(sect) => handleToggleActive(row.original.id, sect)}
          onDateChange={(sect, key, val) => handleChange(row.original.id, sect, key, val)}
        />
      ),
    },
    { 
      header: 'CTRC', 
      accessorKey: 'str.ctrc',
      id: 'str_ctrc',
      Cell: ({ row }) => (
        <EditableCheckbox 
          value={row.original.str?.ctrc || false}
          disabled={!row.original.str?.active}
          onChange={(e) => handleChange(row.original.id, 'str', 'ctrc', e.target.checked)}
        />
      ),
    },
    // STR ESTIMATE grouped
    {
      header: 'STR ESTIMATE',
      id: 'str_estimate',
      columns: [
        {
          header: 'SEND',
          id: 'str_est_send',
          Cell: ({ row }) => (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60, minHeight: 60 }}>
              <input 
                type="checkbox" 
                checked={row.original.str?.estimateSend || false}
                disabled={!row.original.str?.active}
                onChange={(e) => handleChange(row.original.id, 'str', 'estimateSend', e.target.checked)}
                style={{ marginBottom: '4px' }}
              />
              <input 
                type="number" 
                value={row.original.str?.estimateSendAmount ?? ''} 
                disabled={!row.original.str?.active}
                onChange={(e) => handleChange(row.original.id, 'str', 'estimateSendAmount', e.target.value)}
                style={{ width: '3.5rem', textAlign: 'center' }}
              />
            </div>
          ),
        },
        {
          header: 'REVIEW',
          id: 'str_est_review',
          Cell: ({ row }) => (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60, minHeight: 60 }}>
              <input 
                type="checkbox" 
                checked={row.original.str?.estimateReview || false}
                disabled={!row.original.str?.active}
                onChange={(e) => handleChange(row.original.id, 'str', 'estimateReview', e.target.checked)}
                style={{ marginBottom: '4px' }}
              />
              <input 
                type="number" 
                value={row.original.str?.estimateReviewAmount ?? ''} 
                disabled={!row.original.str?.active}
                onChange={(e) => handleChange(row.original.id, 'str', 'estimateReviewAmount', e.target.value)}
                style={{ width: '3.5rem', textAlign: 'center' }}
              />
            </div>
          ),
        },
        {
          header: 'AGREE',
          id: 'str_est_agree',
          Cell: ({ row }) => (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60, minHeight: 60 }}>
              <input 
                type="checkbox" 
                checked={row.original.str?.estimateAgree || false}
                disabled={!row.original.str?.active}
                onChange={(e) => handleChange(row.original.id, 'str', 'estimateAgree', e.target.checked)}
                style={{ marginBottom: '4px' }}
              />
              <input 
                type="number" 
                value={row.original.str?.estimateAgreeAmount ?? ''} 
                disabled={!row.original.str?.active}
                onChange={(e) => handleChange(row.original.id, 'str', 'estimateAgreeAmount', e.target.value)}
                style={{ width: '3.5rem', textAlign: 'center' }}
              />
            </div>
          ),
        },
      ],
    },
    // Payment and Comments
    {
      header: 'PAYMENT',
      accessorKey: 'payment',
      Cell: ({ row }) => (
        <EditableNumberCell 
          value={row.original.payment} 
          onChange={(val) => handleChange(id, 'payment', null, val)} 
        />
      ),
    },
    {
      header: 'COMMENTS',
      accessorKey: 'comments',
      Cell: ({ row }) => (
        <EditableCell 
          field="comments" 
          value={row.original.comments} 
          onChange={(field, _key, val) => handleChange(row.original.id, field, null, val)}
        />
      ),
    },
  ], [handleChange, handleToggleActive]);

  return (
    <MaterialReactTable 
      columns={columns}
      data={rows}
      enableRowVirtualization={true}
      enablePagination={false}
      enableSorting={false}
      // Fill parent container height and allow scrolling
      muiTablePaperProps={{ sx: { height: '100%', display: 'flex', flexDirection: 'column' } }}
      muiTableContainerProps={{ sx: { flex: 1, height: '100%' } }}
      muiTableHeadCellProps={{ align: 'center' }}
      muiTableBodyCellProps={{ align: 'center' }}
      // Optionally, tweak virtualization options (e.g., overscan) if needed:
      // rowVirtualizerOptions={{ overscan: 5 }}
    />
  );
}
