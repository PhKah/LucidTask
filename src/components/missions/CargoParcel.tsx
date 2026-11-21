import React from 'react';

interface CargoParcelProps {
  code: string;
  tons: number;
}

/**
 * Small vector carton shown while dragging a shipment.
 * Rendering it in a fixed, pointer-events-none overlay (instead of an HTML5
 * drag image) prevents Chrome from showing a screenshot of the full lot card.
 */
const CargoParcel: React.FC<CargoParcelProps> = ({ code, tons }) => {
  const lotLabel = code.replace(/^Lô\s*#?/i, '').trim() || code;
  return (
    <svg
      viewBox="0 0 104 105"
      width="80"
      height="80"
      role="img"
      aria-label={`Kiện hàng lô ${lotLabel}, ${tons} tấn`}
      className="lt-cargo-parcel"
    >
      <g style={{ filter: 'drop-shadow(1px 5px 3px rgba(63, 43, 22, 0.3))' }} stroke="#7c470c" strokeWidth="2" strokeLinejoin="round">
        <path d="M10 29 51 9 93 29 52 51Z" fill="#f8c46b" />
        <path d="M10 29 52 51 52 92 10 69Z" fill="#f2a12b" />
        <path d="M52 51 93 29 93 70 52 92Z" fill="#d88317" />
      </g>
      <path d="m30 19 42 22 0 42" fill="none" stroke="#9b611f" strokeWidth="8" opacity="0.45" />
      <path d="m30 19 42 22 0 42" fill="none" stroke="#f8d69a" strokeWidth="5" opacity="0.85" />
      <path d="m10 46 42 22" stroke="#b16c16" strokeWidth="1.2" opacity="0.4" />
      <rect x="13" y="48" width="39" height="28" rx="2" fill="#fffaf0" stroke="#7c470c" strokeWidth="1.5" />
      <text x="32" y="60" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="12" fill="#543311">LÔ {lotLabel}</text>
      <text x="32" y="72" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="14" fill="#543311">{tons}t</text>
    </svg>
  );
};

export default CargoParcel;
