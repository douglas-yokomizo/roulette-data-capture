import toast from "react-hot-toast";

export const formatCpf = (value: string): string => {
  value = value.replace(/\D/g, "");

  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  const invalidCpfs = [
    "000.000.000-00",
    "111.111.111-11",
    "222.222.222-22",
    "333.333.333-33",
    "444.444.444-44",
    "555.555.555-55",
    "666.666.666-66",
    "777.777.777-77",
    "888.888.888-88",
    "999.999.999-99",
  ];

  if (invalidCpfs.includes(value)) {
    toast.error("CPF inválido");
    return "";
  }

  return value;
};

export const formatPhone = (value: string): string => {
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d)/, "($1) $2");
  value = value.replace(/(\d{5})(\d)/, "$1-$2");
  return value;
};

export const formatDate = (value: string): string => {
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d)/, "$1/$2");
  value = value.replace(/(\d{2})(\d)/, "$1/$2");
  value = value.replace(/(\d{4})(\d{1,2})$/, "$1");

  const [day, month, year] = value.split("/").map(Number);

  if (day > 31) {
    value = value.replace(/^(\d{2})/, "31");
  } else if (day === 0) {
    value = value.replace(/^(\d{2})/, "01");
  }

  if (month > 12) {
    value = value.replace(/\/(\d{2})\//, "/12/");
  } else if (month === 0) {
    value = value.replace(/\/(\d{2})\//, "/01/");
  }

  if (year > 2024) {
    value = value.replace(/\/(\d{4})$/, "/2024");
  } else if (year === 0) {
    value = value.replace(/\/(\d{4})$/, "/1900");
  }

  return value;
};
