import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function svgProps(size: number, props: IconProps) {
  const { size: _size, ...rest } = props;
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': 'true' as const,
    ...rest,
  };
}

export function PhoneIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...svgProps(size, props)}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

export function WhatsappIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...svgProps(size, props)}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

export function MailIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...svgProps(size, props)}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export function MapPinIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...svgProps(size, props)}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function MenuIcon({ size = 22, ...props }: IconProps) {
  return (
    <svg {...svgProps(size, props)}>
      <line x1="3" y1="7" x2="21" y2="7" />
      <line x1="3" y1="17" x2="21" y2="17" />
    </svg>
  );
}

export function CloseIcon({ size = 22, ...props }: IconProps) {
  return (
    <svg {...svgProps(size, props)}>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

export function CheckIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...svgProps(size, props)}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg {...svgProps(size, props)}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function ChevronRightIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg {...svgProps(size, props)}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function ChevronLeftIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg {...svgProps(size, props)}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export function ArrowRightIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg {...svgProps(size, props)}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function ArrowUpRightIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg {...svgProps(size, props)}>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

export function FilterIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...svgProps(size, props)}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

export function FuelIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...svgProps(size, props)}>
      <line x1="3" y1="22" x2="15" y2="22" />
      <line x1="4" y1="9" x2="14" y2="9" />
      <path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18" />
      <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5" />
    </svg>
  );
}

export function GaugeIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...svgProps(size, props)}>
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>
  );
}

export function CalendarIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...svgProps(size, props)}>
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export function CogIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...svgProps(size, props)}>
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}

export function CarIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...svgProps(size, props)}>
      <path d="M19 17h2a1 1 0 0 0 1-1v-3a1 1 0 0 0-.293-.707l-1.414-1.414A1 1 0 0 0 19.586 10.5L17.5 5.5A1 1 0 0 0 16.586 5H7.414A1 1 0 0 0 6.5 5.5L4.414 10.5a1 1 0 0 0-.707.293L2.293 12.207A1 1 0 0 0 2 12.914V16a1 1 0 0 0 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}

export function ShieldIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...svgProps(size, props)}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export function SearchIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...svgProps(size, props)}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function ExpandIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...svgProps(size, props)}>
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}
