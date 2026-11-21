// A label + input pair used by every form.
function TextField({ label, value, onChange, type = 'text', placeholder, autoFocus, maxLength }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        autoFocus={autoFocus}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

export default TextField
