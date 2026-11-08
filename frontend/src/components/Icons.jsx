// Íconos SVG simples para no depender de librerías externas

const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const IconHome = () => (
  <svg {...base}><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></svg>
)
export const IconList = () => (
  <svg {...base}><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="4.5" cy="6" r="1" /><circle cx="4.5" cy="12" r="1" /><circle cx="4.5" cy="18" r="1" /></svg>
)
export const IconClock = () => (
  <svg {...base}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
)
export const IconCheck = () => (
  <svg {...base}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
)
export const IconCheckCircle = () => (
  <svg {...base}><circle cx="12" cy="12" r="9" /><path d="m8 12.5 2.8 2.8L16.5 9.5" /></svg>
)
export const IconPlus = () => (
  <svg {...base}><path d="M12 5v14M5 12h14" /></svg>
)
export const IconEdit = () => (
  <svg {...base}><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="m13.5 6.5 4 4" /></svg>
)
export const IconTrash = () => (
  <svg {...base}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>
)
export const IconCalendar = () => (
  <svg {...base}><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>
)
export const IconLogout = () => (
  <svg {...base}><path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 8l-4 4 4 4M6 12h10" /></svg>
)
export const IconClose = () => (
  <svg {...base}><path d="M6 6l12 12M18 6 6 18" /></svg>
)
export const IconFlag = () => (
  <svg {...base}><path d="M5 21V4M5 4h11l-2 4 2 4H5" /></svg>
)
export const IconChevron = () => (
  <svg {...base} width={14} height={14}><path d="m6 9 6 6 6-6" /></svg>
)

export const Logo = () => (
  <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
    <defs>
      <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#8fa0ff" />
        <stop offset="1" stopColor="#3f5bff" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="28" height="28" rx="9" fill="url(#logo-g)" />
    <path d="m9.5 16.5 4.2 4.2L22.5 11" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
