import { DomainId } from '../types/kcna.ts';
import { DOMAINS } from '../data/kcnaReferenceData.ts';

interface DomainBadgeProps {
  domain: DomainId;
  showWeight?: boolean;
  size?: 'sm' | 'md';
}

export const DomainBadge = ({ domain, showWeight = true, size = 'sm' }: DomainBadgeProps) => {
  const info = DOMAINS[domain];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors ${
        info.badgeBg
      } ${info.badgeBorder} ${info.badgeText} ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{info.name}</span>
      {showWeight && (
        <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-black/30 border border-white/10">
          {info.weight}%
        </span>
      )}
    </span>
  );
};
