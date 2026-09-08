import { Search, X } from 'lucide-react';

export function SearchInput({ value, onChange, placeholder = 'Search…', autoFocus }: { value: string; onChange: (v: string) => void; placeholder?: string; autoFocus?: boolean }) {
  return (
    <div className="search-input">
      <Search size={14} />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoFocus={autoFocus} />
      {value && (
        <button type="button" className="icon-btn" style={{ width: 18, height: 18 }} onClick={() => onChange('')} aria-label="Clear search">
          <X size={12} />
        </button>
      )}
    </div>
  );
}
