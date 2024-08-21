interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  maxLength?: number;
  name: string;
  error?: string;
  onFocus?: (id: string) => void;
}

const InputField = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  maxLength,
  name,
  error,
  onFocus,
}: InputFieldProps) => (
  <div className="relative mb-6">
    <input
      id={id}
      type={type}
      placeholder=""
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      name={name}
      className={`input-field ${name === "cpf" ? "cpf" : ""} ${
        name === "dob" ? "dob" : ""
      } ${name === "name" ? "capitalize" : ""}`}
      autoComplete="off"
      onFocus={() => onFocus && onFocus(id)}
    />
    <label htmlFor={id} className="input-label">
      {label}
    </label>
    <span
      className="input-placeholder"
      onClick={() => document.getElementById(id)?.focus()}
    >
      {placeholder}
    </span>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default InputField;
