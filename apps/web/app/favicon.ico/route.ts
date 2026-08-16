const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#45d6e7"/><stop offset="1" stop-color="#5ea7ff"/></linearGradient></defs>
  <rect width="64" height="64" rx="16" fill="url(#g)"/>
  <text x="32" y="39" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" font-weight="800" fill="#06101d">DTS</text>
</svg>`;

export function GET() {
  return new Response(icon, {
    headers: {
      'Cache-Control': 'public, max-age=86400',
      'Content-Type': 'image/svg+xml',
    },
  });
}
