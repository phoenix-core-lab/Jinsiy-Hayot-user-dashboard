export const formatUzPhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  const trimmed = digits.startsWith("998") ? digits.slice(3) : digits;
  return (
    "+998 " +
    trimmed.replace(/^(\d{2})(\d{3})(\d{2})(\d{0,2}).*/, "$1 $2 $3 $4").trim()
  );
};
