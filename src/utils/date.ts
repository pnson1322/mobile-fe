export function formatDateToDisplay(date: string | null) {
  if (!date) return "Chưa cập nhật";

  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return date;

  return `${day}/${month}/${year}`;
}

export function calculateAge(date: string | null) {
  if (!date) return null;

  const birth = new Date(date);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

export function genderToVietnamese(gender: "Male" | "Female" | "Other" | null) {
  if (gender === "Male") return "Nam";
  if (gender === "Female") return "Nữ";
  if (gender === "Other") return "Khác";
  return "Chưa cập nhật";
}
