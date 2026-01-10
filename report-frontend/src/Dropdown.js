import React from 'react';

export default function Dropdown({ label, options, value, onChange }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label>{label}</label><br />
      <select value={value} onChange={e => onChange(e.target.value)} style={{ width: '100%' }}>
        <option value="">Select {label}</option>
        {options.map(opt => (
          <option key={opt.id} value={opt.id}>{opt.name}</option>
        ))}
      </select>
    </div>
  );
}
