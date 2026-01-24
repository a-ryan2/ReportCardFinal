import React from 'react';

export default function Dropdown({ label, options, value, onChange, disabled }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label>{label}</label><br />
      <select value={value} onChange={e => onChange(e.target.value)} style={{ width: '100%' }} disabled={disabled}>
        <option value="">Select {label}</option>
        {options.map(opt => (
          <option key={opt.id} value={opt.id}>{opt.name}</option>
        ))}
      </select>
    </div>
  );
}
