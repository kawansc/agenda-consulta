const P = {
  home:<path d="M3 11l9-8 9 8v10h-6v-6H9v6H3z"/>,
  cal:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></>,
  user:<><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></>,
  search:<><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></>,
  bell:<path d="M6 16V11a6 6 0 0112 0v5l2 2H4zM10 21h4"/>,
  back:<path d="M15 5l-7 7 7 7"/>,
  plus:<path d="M12 5v14M5 12h14"/>,
  next:<path d="M9 5l7 7-7 7"/>,
};
const Icon = ({ n, s = 22 }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{P[n]}</svg>
);

export default Icon;
