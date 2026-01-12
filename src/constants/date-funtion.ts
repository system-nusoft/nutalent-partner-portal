export const formatDate = (startDate: any, endDate: any) => {
  const startFormatted = `${startDate.toLocaleString("default", {
    month: "long",
  })} ${startDate.getFullYear()}`;
  const endFormatted = `${endDate.toLocaleString("default", {
    month: "long",
  })} ${endDate.getFullYear()}`;
  return [startFormatted, endFormatted];
};
