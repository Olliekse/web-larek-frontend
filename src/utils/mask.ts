export function formatPhone(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
  
  if (!match) return '';
  
  const groups = match.slice(1).filter(Boolean);
  if (groups.length === 0) return '';
  
  if (groups.length === 1) return `+${groups[0]}`;
  
  return `+${groups.join(' ')}`;
}