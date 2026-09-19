interface VentureLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export function VentureLogo({ size = 'md', showTagline = false, className = '', onClick }: VentureLogoProps) {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        {/* Subtle background container with warm stone border */}
        <div className="w-full h-full rounded-md bg-[#FAF7F2] border border-[#E7DFD5] flex items-center justify-center shadow-xs">
          {/* Subtle Flame / Wick + Upward Growth mark */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4/5 h-4/5 text-[#D96B27]"
          >
            {/* The vertical foundational wick/stem with subtle gradient */}
            <path
              d="M12 21V11"
              stroke="#262220"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
            {/* The primary ascending flame petal (growth & spark) */}
            <path
              d="M12 3C12 3 7.5 7.5 7.5 11.5C7.5 13.9 9.5 15.5 12 15.5C14.5 15.5 16.5 13.9 16.5 11.5C16.5 7.5 12 3 12 3Z"
              fill="#E8732A"
              fillOpacity="0.85"
            />
            {/* Inner radiant wick facet */}
            <path
              d="M12 7C12 7 9.8 10 9.8 12C9.8 13.2 10.8 14 12 14C13.2 14 14.2 13.2 14.2 12C14.2 10 12 7 12 7Z"
              fill="#F5B270"
            />
            {/* Ascending strategic trajectory accent */}
            <path
              d="M16 5.5L18.5 3M18.5 3H16M18.5 3V5.5"
              stroke="#D96B27"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className="flex flex-col">
        <span className={`font-serif tracking-tight text-[#191716] font-semibold leading-tight ${textSizes[size]}`}>
          Venture <span className="font-normal italic text-[#D96B27]">Wicks</span>
        </span>
        {showTagline && (
          <span className="text-[10px] tracking-wider uppercase text-[#736B63] font-medium mt-0.5">
            Light the way from idea to pitch
          </span>
        )}
      </div>
    </div>
  );
}
