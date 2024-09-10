import toast from "react-hot-toast";

export const formatCpf = (value: string): string => {
  value = value.replace(/\D/g, "");

  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  if (value.length === 14 && !validateCPF(value)) {
    toast.error("CPF inválido");
    return "";
  }

  return value;
};

export const formatPhone = (value: string): string => {
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d)/, "($1) $2");
  value = value.replace(/(\d{5})(\d)/, "$1-$2");

  if (value.length === 15 && !validatePhone(value)) {
    toast.error("Número de telefone inválido");
    return "";
  }

  return value;
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
  return phoneRegex.test(phone);
};

export const formatDate = (value: string): string => {
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d)/, "$1/$2");
  value = value.replace(/(\d{2})(\d)/, "$1/$2");

  if (value.length === 10 && !validateDate(value)) {
    toast.error("Data inválida");
    return "";
  }

  return value;
};

export const validateCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11) return true; // Allow incomplete CPFs

  if (/^(\d)\1+$/.test(cpf)) return false;

  const calculateDigit = (base: string, factor: number) => {
    let total = 0;
    for (let i = 0; i < base.length; i++) {
      total += parseInt(base[i]) * factor--;
    }
    const remainder = total % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const base = cpf.substring(0, 9);
  const digit1 = calculateDigit(base, 10);
  const digit2 = calculateDigit(base + digit1, 11);

  return cpf.endsWith(`${digit1}${digit2}`);
};

export const validateDate = (date: string): boolean => {
  const [day, month, year] = date.split("/").map(Number);

  if (day > 31 || day < 1) return false;
  if (month > 12 || month < 1) return false;
  if (year < 1900 || year > new Date().getFullYear()) return false;

  const isLeapYear = (year: number) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const daysInMonth = [
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  return day <= daysInMonth[month - 1];
};
