import React from 'react';
import { SKILL_CATEGORIES, CANDIDATE_STATUS } from '../../constants/categories';

export const Badge = ({ children, category, status, className = '' }) => {
  let badgeStyles = 'px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center ';

  if (category && SKILL_CATEGORIES[category]) {
    badgeStyles += SKILL_CATEGORIES[category].color;
  } else if (status && CANDIDATE_STATUS[status]) {
    badgeStyles += CANDIDATE_STATUS[status].color;
  } else {
    badgeStyles += 'bg-zinc-800 text-zinc-300 border border-zinc-700/50';
  }

  return (
    <span className={`${badgeStyles} ${className}`}>
      {children}
    </span>
  );
};
export default Badge;
