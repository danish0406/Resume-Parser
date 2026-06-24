export const scoreColor = (score) => {
  if (score >= 80) return '#10B981'; // Success (Emerald)
  if (score >= 60) return '#FF763D'; // Primary (Vibrant Orange)
  if (score >= 40) return '#FFA37A'; // Secondary (Warm Orange)
  return '#8A9CA8'; // Muted (Slate/Cool Gray-Blue)
};

export const scoreBgColor = (score) => {
  if (score >= 80) return 'text-[#10B981] border-[#10B981]/30 bg-[#10B981]/10';
  if (score >= 60) return 'text-[#FF763D] border-[#FF763D]/30 bg-[#FF763D]/10';
  if (score >= 40) return 'text-[#FFA37A] border-[#FFA37A]/30 bg-[#FFA37A]/10';
  return 'text-[#8A9CA8] border-[#8A9CA8]/30 bg-[#8A9CA8]/10';
};
