export const convertDateFormat = (date: string) => {
  const dateParts = date.split("/");
  return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
};
