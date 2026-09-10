import type { EquipmentLoadout } from "@/lib/types";

function slot(loadout: EquipmentLoadout, id: string): boolean {
  return Object.values(loadout).includes(id);
}

export function EquipmentLayers({ equipped }: { equipped: EquipmentLoadout }) {
  return (
    <g className="equipment-layers" aria-hidden="true">
      {slot(equipped, "gadget-balloon") && (
        <g className="gadget-balloon">
          <line x1="118" y1="52" x2="132" y2="18" stroke="#C4A574" strokeWidth="2" />
          <ellipse cx="138" cy="10" rx="14" ry="18" fill="#E86B6B" />
          <ellipse cx="133" cy="4" rx="4" ry="6" fill="#FFC4C4" opacity="0.7" />
        </g>
      )}
      {slot(equipped, "drop-cape") && (
        <path
          d="M42 92 C28 118, 34 148, 52 152 L80 150 C70 128, 72 108, 78 96 Z"
          fill="#2C2A4A"
        />
      )}
      {slot(equipped, "outfit-hoodie") && (
        <g>
          <path
            d="M46 86 C42 118, 50 146, 80 150 C110 146, 118 118, 114 86 C102 80, 58 80, 46 86 Z"
            fill="#C5D4E0"
          />
          <path d="M58 86 C68 78, 92 78, 102 86 L96 94 C88 88, 72 88, 64 94 Z" fill="#A9BCCB" />
        </g>
      )}
      {slot(equipped, "outfit-raincoat") && (
        <g>
          <path
            d="M44 84 C40 122, 52 148, 80 152 C108 148, 120 122, 116 84 C100 74, 60 74, 44 84 Z"
            fill="#F2C14E"
          />
          <path d="M48 90 C62 82, 98 82, 112 90 L108 100 C96 92, 64 92, 52 100 Z" fill="#F6D56A" />
          <path d="M78 78 C70 70, 58 78, 56 90 L80 86 Z" fill="#E3B13A" />
        </g>
      )}
      {slot(equipped, "drop-starrycoat") && (
        <g>
          <path
            d="M44 84 C40 122, 52 148, 80 152 C108 148, 120 122, 116 84 C100 74, 60 74, 44 84 Z"
            fill="#2C3A6E"
          />
          <circle cx="62" cy="108" r="2" fill="#F8F1C4" />
          <circle cx="90" cy="118" r="1.6" fill="#F8F1C4" />
          <circle cx="74" cy="128" r="1.2" fill="#F8F1C4" />
          <circle cx="102" cy="100" r="1.4" fill="#F8F1C4" />
        </g>
      )}
      {slot(equipped, "outfit-sproutcap") && (
        <g>
          <ellipse cx="80" cy="52" rx="28" ry="14" fill="#5A8A2C" />
          <path d="M92 44 C104 18, 128 28, 112 48 C104 42, 96 44, 92 44 Z" fill="#7CB342" />
        </g>
      )}
      {slot(equipped, "outfit-scarf") && (
        <g>
          <path d="M52 96 C70 108, 90 108, 110 94 L106 106 C88 116, 70 116, 54 106 Z" fill="#7E8CFF" />
          <path d="M108 96 C120 108, 118 132, 110 138" fill="none" stroke="#9AA4FF" strokeWidth="7" strokeLinecap="round" />
        </g>
      )}
      {slot(equipped, "drop-bell") && (
        <g>
          <path d="M80 28 C80 28, 64 44, 80 44 C96 44, 80 28, 80 28 Z" fill="#D4A017" />
          <circle cx="80" cy="46" r="4" fill="#F2D36B" />
        </g>
      )}
      {slot(equipped, "outfit-sunglasses") && (
        <g>
          <rect x="52" y="78" width="18" height="12" rx="4" fill="#1A1612" />
          <rect x="90" y="78" width="18" height="12" rx="4" fill="#1A1612" />
          <path d="M70 82 H90" stroke="#1A1612" strokeWidth="3" />
        </g>
      )}
      {slot(equipped, "gadget-umbrella") && (
        <g>
          <path d="M18 78 C18 58, 50 50, 58 74" fill="#5B8DEF" />
          <line x1="38" y1="74" x2="38" y2="118" stroke="#C4A574" strokeWidth="3" />
          <circle cx="38" cy="74" r="3" fill="#F2C14E" />
        </g>
      )}
      {slot(equipped, "gadget-camera") && (
        <g>
          <rect x="18" y="104" width="28" height="20" rx="4" fill="#4A4A4A" />
          <circle cx="32" cy="114" r="6" fill="#89D4E3" />
          <rect x="38" y="98" width="8" height="8" rx="2" fill="#6B6B6B" />
        </g>
      )}
      {slot(equipped, "gadget-broom") && (
        <g>
          <line x1="24" y1="70" x2="40" y2="128" stroke="#C4A574" strokeWidth="3" />
          <path d="M18 128 L40 122 L36 142 Z" fill="#E8C98A" />
        </g>
      )}
      {slot(equipped, "gadget-skateboard") && (
        <g>
          <rect x="44" y="156" width="72" height="8" rx="4" fill="#8B5A2B" />
          <circle cx="56" cy="166" r="5" fill="#2A2118" />
          <circle cx="104" cy="166" r="5" fill="#2A2118" />
        </g>
      )}
      {slot(equipped, "outfit-rainboots") && (
        <g>
          <rect x="58" y="148" width="14" height="16" rx="3" fill="#F2C14E" />
          <rect x="88" y="148" width="14" height="16" rx="3" fill="#F2C14E" />
        </g>
      )}
    </g>
  );
}
