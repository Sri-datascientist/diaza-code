export function DecorativeDivider1() {
  return (
    <div className="flex items-center justify-center w-full py-8" data-testid="divider-style-1">
      <svg className="w-64 h-8 text-[#8B7355]" viewBox="0 0 256 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="16" x2="110" y2="16" stroke="currentColor" strokeWidth="1" />
        <line x1="146" y1="16" x2="256" y2="16" stroke="currentColor" strokeWidth="1" />
        <rect x="124" y="12" width="8" height="8" fill="currentColor" transform="rotate(45 128 16)" />
      </svg>
    </div>
  );
}

export function DecorativeDivider2() {
  return (
    <div className="flex items-center justify-center w-full py-8" data-testid="divider-style-2">
      <svg className="w-80 h-10" viewBox="0 0 320 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="20" x2="130" y2="20" stroke="#8B7355" strokeWidth="1" />
        <line x1="190" y1="20" x2="320" y2="20" stroke="#8B7355" strokeWidth="1" />
        <path d="M160 8 L168 16 L160 24 L152 16 Z" fill="#8B7355" />
        <ellipse cx="148" cy="16" rx="3" ry="5" fill="#8B7355" transform="rotate(-30 148 16)" />
        <ellipse cx="172" cy="16" rx="3" ry="5" fill="#8B7355" transform="rotate(30 172 16)" />
        <ellipse cx="145" cy="20" rx="2.5" ry="4" fill="#8B7355" transform="rotate(-60 145 20)" />
        <ellipse cx="175" cy="20" rx="2.5" ry="4" fill="#8B7355" transform="rotate(60 175 20)" />
        <circle cx="160" cy="16" r="2" fill="#8B7355" />
      </svg>
    </div>
  );
}

export function DecorativeDivider3() {
  return (
    <div className="flex items-center justify-center w-full py-8" data-testid="divider-style-3">
      <svg className="w-72 h-12" viewBox="0 0 288 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="24" x2="115" y2="24" stroke="#8B7355" strokeWidth="1" />
        <line x1="173" y1="24" x2="288" y2="24" stroke="#8B7355" strokeWidth="1" />
        <path d="M 130 24 Q 135 18, 138 24 Q 135 30, 130 24" fill="#8B7355" />
        <path d="M 158 24 Q 153 18, 150 24 Q 153 30, 158 24" fill="#8B7355" />
        <path d="M 138 24 Q 140 20, 144 18 Q 148 20, 150 24 Q 148 28, 144 30 Q 140 28, 138 24" fill="#8B7355" />
        <circle cx="144" cy="24" r="1.5" fill="#fff" />
        <path d="M 126 20 Q 128 22, 126 24 Q 124 22, 126 20" fill="#8B7355" />
        <path d="M 162 20 Q 160 22, 162 24 Q 164 22, 162 20" fill="#8B7355" />
      </svg>
    </div>
  );
}
