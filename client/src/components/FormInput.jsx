function FormInput({ label, type = "text", value, onChange, error, ...rest }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-cine-muted mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full rounded-md bg-cine-surface2 border px-3.5 py-2.5 text-cine-text
          placeholder:text-cine-muted/60 outline-none transition-colors
          focus:ring-2 focus:ring-cine-gold/60 focus:border-cine-gold
          ${error ? "border-cine-danger" : "border-cine-border"}`}
        {...rest}
      />
      {error && <p className="mt-1 text-sm text-cine-danger">{error}</p>}
    </div>
  );
}

export default FormInput;
