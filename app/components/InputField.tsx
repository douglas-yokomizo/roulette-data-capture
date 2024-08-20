// InputField.tsx
import React from "react";

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  maxLength?: number;
  name: string;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  maxLength,
  name,
}) => (
  <div className="relative mb-6">
    <input
      id={id}
      type={type}
      placeholder=""
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      name={name}
      className={`input-field text-gray-500 ${name === "cpf" ? "cpf" : ""} ${
        name === "dob" ? "dob" : ""
      }`}
      autoComplete="off"
    />
    <label htmlFor={id} className="input-label">
      {label}
    </label>
    <span
      onClick={() => document.getElementById(id)?.focus()}
      className="input-placeholder"
    >
      {placeholder}
    </span>
  </div>
);

export default InputField;
