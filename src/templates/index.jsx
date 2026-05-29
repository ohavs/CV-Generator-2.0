import { lazy, Suspense } from 'react';

// One loader per template. Each uses a *literal* import string so Vite can
// statically rewrite it to the correct hashed chunk in production.
const loaders = {
  classic:   () => import('./Classic.jsx'),
  minimal:   () => import('./Minimal.jsx'),
  sidebar:   () => import('./SidebarTemplate.jsx'),
  nordic:    () => import('./Nordic.jsx'),
  executive: () => import('./Executive.jsx'),
  stripe:    () => import('./Stripe.jsx'),
  bold:      () => import('./Bold.jsx'),
  technical: () => import('./Technical.jsx'),
  academic:  () => import('./Academic.jsx'),
  editorial: () => import('./Editorial.jsx'),
  breeze:    () => import('./Breeze.jsx'),
  split:     () => import('./Split.jsx'),
  verse:     () => import('./Verse.jsx'),
  compact:   () => import('./Compact.jsx'),
  charter:   () => import('./Charter.jsx'),
};

// Lazy-load every template so only the active one is parsed on startup
const Templates = Object.fromEntries(
  Object.entries(loaders).map(([id, fn]) => [id, lazy(fn)])
);

// Preload remaining templates when the browser is idle, so switching is instant.
// Reuses the same loaders (correct hashed chunks) — never bare ".jsx" URLs.
if (typeof requestIdleCallback !== 'undefined') {
  requestIdleCallback(() => {
    Object.values(loaders).forEach(fn => fn().catch(() => {}));
  });
}

const PageBlank = <div style={{ width: '100%', height: '100%', background: 'white' }}/>;

export function TemplateRoot(props) {
  const Comp = Templates[props.template] || Templates.classic;
  return (
    <Suspense fallback={PageBlank}>
      <Comp {...props}/>
    </Suspense>
  );
}

export function TemplateThumb({ id, accent }) {
  const W = 60, H = 80;
  const common = { width: '100%', height: '100%', viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'xMidYMid meet' };
  const txt = (y, w = 40, color = '#CFCBC2') =>
    <rect x="10" y={y} width={w} height="1.5" fill={color}/>;

  switch (id) {
    case 'classic':
      return (
        <svg {...common}>
          <rect width={W} height={H} fill="#FFFEFB"/>
          <text x={W/2} y="14" fontSize="6" fontFamily="serif" textAnchor="middle" fill="#1A1A1A" fontWeight="500">Name</text>
          <text x={W/2} y="19" fontSize="2.5" textAnchor="middle" fill={accent} letterSpacing="0.3">TITLE</text>
          <line x1="10" y1="23" x2={W-10} y2="23" stroke="#1A1A1A" strokeWidth="0.5"/>
          {[30, 50].map(y => <g key={y}>
            <text x="10" y={y} fontSize="3" fontWeight="600" fill={accent}>•</text>
            <line x1="14" y1={y-1} x2={W-10} y2={y-1} stroke="#1A1A1A" strokeWidth="0.3"/>
            {txt(y+3)}{txt(y+6, 35)}{txt(y+9, 30)}
          </g>)}
        </svg>
      );
    case 'minimal':
      return (
        <svg {...common}>
          <rect width={W} height={H} fill="#FFFEFB"/>
          <text x="10" y="20" fontSize="7" fontFamily="serif" fill="#1A1A1A" fontWeight="400">Name</text>
          {[34, 50, 66].map(y => <g key={y}>
            <text x="10" y={y} fontSize="2" fill="#999" letterSpacing="0.5">SECTION</text>
            {txt(y+3, 30)}{txt(y+6, 38)}{txt(y+9, 25)}
          </g>)}
        </svg>
      );
    case 'sidebar':
      return (
        <svg {...common}>
          <rect width={W} height={H} fill="#FFFEFB"/>
          <rect width={20} height={H} fill={accent}/>
          <circle cx="10" cy="13" r="5" fill="rgba(255,255,255,0.3)"/>
          {[24, 38, 52, 66].map(y => <rect key={y} x="3" y={y} width="14" height="1" fill="rgba(255,255,255,0.5)"/>)}
          {[24, 38, 52, 66].map(y => <g key={y}>
            <rect x="24" y={y-2} width="3" height="1" fill={accent}/>
            <rect x="24" y={y+1} width="30" height="1" fill="#CFCBC2"/>
            <rect x="24" y={y+4} width="26" height="1" fill="#CFCBC2"/>
          </g>)}
        </svg>
      );
    case 'nordic':
      return (
        <svg {...common}>
          <rect width={W} height={H} fill="#FFFEFB"/>
          <text x="8" y="16" fontSize="9" fontFamily="serif" fill="#1A1A1A" fontWeight="300" letterSpacing="-0.5">Name</text>
          <text x="8" y="21" fontSize="2.5" fill="#777">Title</text>
          <line x1="8" y1="25" x2={W-8} y2="25" stroke="#E8E3DC" strokeWidth="0.5"/>
          {[33, 48, 63].map(y => <g key={y}>
            <line x1="8" y1={y-1} x2="22" y2={y-1} stroke={accent} strokeWidth="0.8"/>
            <rect x="24" y={y-3} width="8" height="1.5" fill="#ddd"/>
            <rect x="24" y={y} width="28" height="1" fill="#CFCBC2"/>
            <rect x="24" y={y+3} width="22" height="1" fill="#CFCBC2"/>
          </g>)}
        </svg>
      );
    case 'executive':
      return (
        <svg {...common}>
          <rect width={W} height={H} fill="#FFFEFB"/>
          <line x1="8" y1="8" x2={W-8} y2="8" stroke="#1A1A1A" strokeWidth="1.5"/>
          <text x={W/2} y="16" fontSize="6" fontFamily="serif" textAnchor="middle" fill="#1A1A1A" fontWeight="600">Name</text>
          <line x1="8" y1="19" x2={W-8} y2="19" stroke="#1A1A1A" strokeWidth="0.5"/>
          <text x={W/2} y="24" fontSize="2.5" textAnchor="middle" fill={accent} letterSpacing="0.5">TITLE</text>
          <line x1="8" y1="27" x2={W-8} y2="27" stroke="#1A1A1A" strokeWidth="1.5"/>
          {[36, 52, 68].map(y => <g key={y}>
            <line x1="10" y1={y-1} x2="22" y2={y-1} stroke="#1A1A1A" strokeWidth="0.4"/>
            <text x={W/2} y={y} fontSize="2.5" textAnchor="middle" fill="#1A1A1A" letterSpacing="0.3" fontWeight="600">SECTION</text>
            <line x1="38" y1={y-1} x2={W-10} y2={y-1} stroke="#1A1A1A" strokeWidth="0.4"/>
            {txt(y+3)}{txt(y+6, 35)}
          </g>)}
        </svg>
      );
    case 'stripe':
      return (
        <svg {...common}>
          <rect width={W} height={H} fill="#FFFEFB"/>
          <text x="8" y="12" fontSize="7" fontFamily="sans-serif" fill="#111" fontWeight="600" letterSpacing="-0.3">Name</text>
          <text x="8" y="17" fontSize="2.5" fill={accent} fontWeight="500">Title</text>
          <line x1="8" y1="21" x2={W-8} y2="21" stroke="#111" strokeWidth="1"/>
          {[30, 46, 62].map(y => <g key={y}>
            <rect x="8" y={y-5} width="2" height="14" fill={accent} rx="1"/>
            <text x="13" y={y} fontSize="2.5" fill={accent} letterSpacing="0.3" fontWeight="700">SECTION</text>
            {txt(y+3, 38)}{txt(y+6, 30)}{txt(y+9, 34)}
          </g>)}
        </svg>
      );
    case 'bold':
      return (
        <svg {...common}>
          <rect width={W} height={H} fill="#FFFEFB"/>
          <rect x="0" y="0" width={W} height="26" fill={accent}/>
          <text x="8" y="14" fontSize="8" fontFamily="sans-serif" fill="#fff" fontWeight="800" letterSpacing="-0.3">Name</text>
          <text x="8" y="21" fontSize="2.5" fill="rgba(255,255,255,0.8)">Title</text>
          {[33, 49, 65].map(y => <g key={y}>
            <rect x="8" y={y-3} width="10" height="2" fill={accent} rx="1"/>
            <rect x="8" y={y-3} width="2" height="2" fill={accent}/>
            <text x="22" y={y} fontSize="2.5" fill="#1A1A1A" letterSpacing="0.3" fontWeight="800">SECTION</text>
            {txt(y+3, 38)}{txt(y+6, 30)}
          </g>)}
        </svg>
      );
    case 'technical':
      return (
        <svg {...common}>
          <rect width={W} height={H} fill="#FFFEFB"/>
          {Array.from({length: 12}).map((_, i) =>
            <line key={i} x1="0" y1={6 + i*6} x2={W} y2={6 + i*6} stroke="#F0EDE5" strokeWidth="0.3"/>
          )}
          <text x="10" y="15" fontSize="6" fontFamily="monospace" fontWeight="700" fill="#1A1A1A">Name</text>
          <text x="10" y="22" fontSize="2.5" fontFamily="monospace" fill={accent}>## role</text>
          {[30, 44, 58, 72].map(y => <g key={y}>
            <text x="10" y={y} fontSize="2.5" fontFamily="monospace" fill={accent}>##</text>
            <text x="15" y={y} fontSize="2.5" fontFamily="monospace" fill="#666">section</text>
            <text x="10" y={y+5} fontSize="2.5" fontFamily="monospace" fill={accent}>›</text>
            <rect x="14" y={y+3} width="38" height="1" fill="#CFCBC2"/>
          </g>)}
        </svg>
      );
    case 'academic':
      return (
        <svg {...common}>
          <rect width={W} height={H} fill="#FFFEFB"/>
          <text x={W/2} y="13" fontSize="5" fontFamily="serif" textAnchor="middle" fill="#1A1A1A">Name</text>
          <text x={W/2} y="17" fontSize="2.5" fontFamily="serif" fontStyle="italic" textAnchor="middle" fill="#666">Title</text>
          {[26, 40, 54, 68].map((y, idx) => <g key={y}>
            <text x="10" y={y} fontSize="3" fontFamily="serif" fontWeight="600" fill={accent}>{String(idx+1).padStart(2,'0')}</text>
            <text x="17" y={y} fontSize="3" fontFamily="serif" fontWeight="600" fill="#1A1A1A">Section</text>
            <line x1="10" y1={y+1.5} x2={W-10} y2={y+1.5} stroke="#1A1A1A" strokeWidth="0.4"/>
            {txt(y+4)}{txt(y+7, 38)}
          </g>)}
        </svg>
      );
    case 'editorial':
      return (
        <svg {...common}>
          <rect width={W} height={H} fill="#FFFEFB"/>
          <text x="10" y="22" fontSize="14" fontFamily="serif" fill="#1A1A1A" fontWeight="400" letterSpacing="-1">N</text>
          <text x="20" y="22" fontSize="14" fontFamily="serif" fill="#1A1A1A" fontWeight="400" letterSpacing="-1">a</text>
          <text x="29" y="22" fontSize="14" fontFamily="serif" fill="#1A1A1A" fontWeight="400" letterSpacing="-1">m</text>
          <text x="40" y="22" fontSize="14" fontFamily="serif" fill="#1A1A1A" fontWeight="400" letterSpacing="-1">e</text>
          <text x="10" y="28" fontSize="3" fontFamily="serif" fontStyle="italic" fill={accent}>title</text>
          <line x1="10" y1="32" x2={W-10} y2="32" stroke="#1A1A1A" strokeWidth="0.3"/>
          {[40, 52, 64].map(y => <g key={y}>
            <text x="10" y={y} fontSize="2" fill={accent} letterSpacing="0.3">SECTION</text>
            <rect x="10" y={y+2} width="18" height="0.8" fill="#CFCBC2"/>
            <rect x="10" y={y+4} width="15" height="0.8" fill="#CFCBC2"/>
            <text x="32" y={y} fontSize="2" fill={accent} letterSpacing="0.3">SECTION</text>
            <rect x="32" y={y+2} width="18" height="0.8" fill="#CFCBC2"/>
            <rect x="32" y={y+4} width="14" height="0.8" fill="#CFCBC2"/>
          </g>)}
        </svg>
      );
    case 'breeze':
      return (
        <svg {...common}>
          <rect width={W} height={H} fill="#FFFEFB"/>
          <text x="8" y="13" fontSize="8" fontFamily="sans-serif" fill="#111" fontWeight="600" letterSpacing="-0.3">Name</text>
          <text x="8" y="18" fontSize="2.5" fill="#666">Title</text>
          <line x1="8" y1="22" x2={W-8} y2="22" stroke="#D0CCC4" strokeWidth="0.5"/>
          {[31, 47, 63].map(y => <g key={y}>
            <text x="8" y={y} fontSize="2" fill={accent} letterSpacing="0.3" fontWeight="600">SECTION</text>
            <line x1="8" y1={y+1} x2="28" y2={y+1} stroke={accent} strokeWidth="0.4"/>
            {txt(y+4)}{txt(y+7, 35)}{txt(y+10, 28)}
          </g>)}
        </svg>
      );
    case 'split':
      return (
        <svg {...common}>
          <rect width={W} height={H} fill="#FFFEFB"/>
          <text x="8" y="13" fontSize="7" fontFamily="sans-serif" fill="#111" fontWeight="600">Name</text>
          <text x="8" y="18" fontSize="2.5" fill={accent}>Title</text>
          <line x1="8" y1="22" x2={W-8} y2="22" stroke="#111" strokeWidth="0.8"/>
          <line x1="27" y1="26" x2="27" y2={H-6} stroke="#E4DDD0" strokeWidth="0.5"/>
          {[30, 46, 62].map(y => <g key={y}>
            <text x="8" y={y} fontSize="2" fill={accent} letterSpacing="0.2">SECT</text>
            {[y+3, y+6].map(yy => <rect key={yy} x="8" y={yy} width="15" height="1" fill="#CFCBC2"/>)}
          </g>)}
          {[30, 46, 62].map(y => <g key={y}>
            <text x="30" y={y} fontSize="2" fill={accent} letterSpacing="0.2">SECTION</text>
            {[y+3, y+6, y+9].map(yy => <rect key={yy} x="30" y={yy} width="22" height="1" fill="#CFCBC2"/>)}
          </g>)}
        </svg>
      );
    case 'verse':
      return (
        <svg {...common}>
          <rect width={W} height={H} fill="#FFFEFB"/>
          <text x="8" y="14" fontSize="9" fontFamily="serif" fill="#1A1A1A" fontWeight="400" letterSpacing="-0.4">Name</text>
          <text x="8" y="19" fontSize="2.5" fontFamily="serif" fontStyle="italic" fill="#666">Title</text>
          <line x1="8" y1="23" x2={W-8} y2="23" stroke="#D0CCC4" strokeWidth="0.4"/>
          {[31, 46, 61].map(y => <g key={y}>
            <text x="8" y={y} fontSize="2" fill={accent} letterSpacing="0.2" textAnchor="end">SEC</text>
            <line x1="10" y1={y-5} x2="10" y2={y+8} stroke="#E8E3DC" strokeWidth="0.3"/>
            {txt(y, 32)}{txt(y+3, 38)}{txt(y+6, 26)}
          </g>)}
        </svg>
      );
    case 'compact':
      return (
        <svg {...common}>
          <rect width={W} height={H} fill="#FFFEFB"/>
          <text x="8" y="11" fontSize="6" fontFamily="sans-serif" fill="#111" fontWeight="700" letterSpacing="-0.2">Name</text>
          <text x="8" y="15" fontSize="2" fill={accent}>Title · email · phone</text>
          <line x1="8" y1="18" x2={W-8} y2="18" stroke="#111" strokeWidth="0.8"/>
          {[24, 36, 48, 60, 72].map(y => <g key={y}>
            <text x="8" y={y} fontSize="2" fill={accent} letterSpacing="0.2" fontWeight="700">SEC</text>
            <line x1="18" y1={y-1} x2={W-8} y2={y-1} stroke="#D0CCC4" strokeWidth="0.3"/>
            {[y+2, y+5].map(yy => <rect key={yy} x="8" y={yy} width="42" height="0.8" fill="#CFCBC2"/>)}
          </g>)}
        </svg>
      );
    case 'charter':
      return (
        <svg {...common}>
          <rect width={W} height={H} fill="#FFFEFB"/>
          <text x={W/2} y="13" fontSize="8" fontFamily="serif" textAnchor="middle" fill="#1A1A1A" fontWeight="400">Name</text>
          <text x={W/2} y="18" fontSize="2.5" fontFamily="serif" textAnchor="middle" fill="#777" letterSpacing="0.3">TITLE</text>
          <line x1="10" y1="22" x2={W-10} y2="22" stroke="#D0CCC4" strokeWidth="0.5"/>
          {[31, 47, 63].map(y => <g key={y}>
            <text x="10" y={y} fontSize="3" fontFamily="serif" fontWeight="600" fill={accent}>Section</text>
            <line x1="10" y1={y+1} x2="30" y2={y+1} stroke={accent} strokeWidth="0.8"/>
            {txt(y+4)}{txt(y+7, 36)}{txt(y+10, 28)}
          </g>)}
        </svg>
      );
    default: return null;
  }
}
