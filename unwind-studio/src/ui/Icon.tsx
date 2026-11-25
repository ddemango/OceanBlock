const P: Record<string, string> = {
  home: 'M3 11l9-7 9 7M5 10v10h5v-6h4v6h5V10',
  explore: 'M12 21a9 9 0 100-18 9 9 0 000 18zM15.5 8.5l-2 5-5 2 2-5z',
  gallery: 'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M15 9.5a1 1 0 100-2 1 1 0 000 2z',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19 12a7 7 0 00-.1-1.3l2-1.5-2-3.4-2.3 1a7 7 0 00-2.2-1.3L14 3h-4l-.4 2.500a7 7 0 00-2.2 1.3l-2.300-1-2 3.400 2 1.500a7 7 0 000 2.600l-2 1.500 2 3.400 2.300-1a7 7 0 002.200 1.300L10 21h4l.4-2.500a7 7 0 002.200-1.300l2.300 1 2-3.400-2-1.500c.1-.4.1-.9.1-1.300z',
  back: 'M15 5l-7 7 7 7',
  heart: 'M12 20s-7-4.400-7-10a4 4 0 017-2.600A4 4 0 0119 10c0 5.600-7 10-7 10z',
  hint: 'M9 18h6M10 21h4M12 3a6 6 0 00-3.500 10.900c.6.5 1 1.300 1 2.100h5c0-.8.4-1.600 1-2.100A6 6 0 0012 3z',
  help: 'M12 21a9 9 0 100-18 9 9 0 000 18zM9.500 9.500a2.500 2.500 0 114 2c-.9.600-1.500 1.200-1.500 2.300M12 17v.01',
  soundOn: 'M4 9v6h4l5 4V5L8 9zM16.500 8.500a5 5 0 010 7M19 6a8.500 8.500 0 010 12',
  soundOff: 'M4 9v6h4l5 4V5L8 9zM17 9.500l5 5M22 9.500l-5 5',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  fit: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
  undo: 'M9 7L4 12l5 5M4 12h10a6 6 0 010 12h-2',
  redo: 'M15 7l5 5-5 5M20 12H10a6 6 0 000 12h2',
  check: 'M5 12.500l4.500 4.500L19 7.500',
  puzzle: 'M10 4a2 2 0 114 0v1h5v5h-1a2 2 0 100 4h1v5h-5v-1a2 2 0 10-4 0v1H5v-5h1a2 2 0 100-4H5V5h5z',
  paint: 'M4 20c3 0 4-1.500 4-3.500a2.500 2.500 0 015 0M11 14l8.500-9.500a1.800 1.800 0 012.500 2.500L13 15',
  find: 'M10.500 17a6.500 6.500 0 100-13 6.500 6.500 0 000 13zM15.500 15.500L21 21',
  eye: 'M2 12s3.500-7 10-7 10 7 10 7-3.500 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z',
  guide: 'M4 4h16v16H4zM4 12h16M12 4v16',
  edges: 'M4 4h16v16H4zM8 8h8v8H8z',
  download: 'M12 4v11M7 11l5 5 5-5M5 20h14',
  replay: 'M4 12a8 8 0 108-8H8M8 4l3-3M8 4l3 3',
  close: 'M6 6l12 12M18 6L6 18',
  trash: 'M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13',
  eraser: 'M4 16l9-9 6 6-6 6H8zM13 19h7',
  next: 'M9 5l7 7-7 7',
  search: 'M10.500 17a6.500 6.500 0 100-13 6.500 6.500 0 000 13zM15.500 15.500L21 21',
  sparkle: 'M12 3l1.800 5.200L19 10l-5.200 1.800L12 17l-1.800-5.200L5 10l5.200-1.800z',
  info: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 11v6M12 7.500v.01',
};

export function Icon({ name, size = 22, filled = false }: { name: string; size?: number; filled?: boolean }) {
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={P[name] ?? P.info} />
    </svg>
  );
}
