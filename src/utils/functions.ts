import dayjs from "dayjs";
import moment from "moment";

export const interviewLimits = [30, 60];

export const formatDate = (startDate: any, endDate: any) => {
  const startFormatted = `${startDate.toLocaleString("default", {
    month: "long",
  })} ${startDate.getFullYear()}`;
  const endFormatted = `${endDate.toLocaleString("default", {
    month: "long",
  })} ${endDate.getFullYear()}`;
  return [startFormatted, endFormatted];
};

export const updateResourceStatus = (
  data: { items: [{ id: string; value: boolean }] },
  id: string,
  value: boolean
) => {
  const newData = data?.items?.map((item: any) => {
    if (item?.id === id) {
      return { ...item, isActive: !value };
    }
    return item;
  });

  return newData;
};
export const updateResourceList = (
  data: { items: [{ id: string; value: boolean }] },
  id: string
) => {
  const newData = data?.items?.filter((item: any) => item?.id !== id);

  return newData;
};

export const dateOptions: any = {
  dateStyle: "medium",
};

export const dateFormat = (date: Date) => {
  const tempDate = new Date(date);
  return tempDate?.toLocaleDateString("en-US", dateOptions);
};

export const returnMonthAndYear = (myDate: string) => {
  const date = dayjs(myDate);

  if (myDate) return date.format("MMMM YYYY");
  else return "Current";
};
export const returnDateMonthAndYear = (myDate: string) => {
  const date = dayjs(myDate);

  if (myDate) return date.format("DD MMMM YYYY");
  else return "Current";
};
export const returnTime = (myDate: string | null) => {
  if (!myDate) {
    return "Current";
  }
  const date = dayjs(myDate);

  if (myDate) return date.format("HH:mm:ss");
  else return "Current";
};

export const returnYear = (myDate: string) => {
  const date = dayjs(myDate);
  return date.format("YYYY");
};

export const colorsList = [
  "#E8F2E8",
  "#D9F2D9",
  "#C8F2C8",
  "#B3E0B3",
  "#A5E3A5",
  "#95D895",
  "#E8F2F5",
  "#F2F5E8",
  "#E8F2D1",
  "#D1F2E8",
  "#C2E8E8",
  "#B2E8D9",
  "#A1F2E0",
];

export const getRandomColor = (name: string) => {
  if (name) {
    const hash = name
      ?.split("")
      .reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return colorsList[hash % colorsList.length];
  }
  return colorsList[0];
};

export const returnTimeAndDate = (newDate: string) => {
  const date = new Date(newDate);
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return time;
};

const greetList = [
  "Hello",
  "Bonjour",
  "Ciao",
  "Marhaba",
  "Hola",
  "Salām",
  "Nǐ hǎo",
];

export const getRandomGreeting = () => {
  const randomIndex = Math.floor(Math.random() * greetList.length);
  return greetList[randomIndex];
};

export function formatToMonthYear(
  date: Date | null | undefined
): string | null {
  if (!date) {
    return null;
  }
  return moment(date).format("MMMM, YYYY");
}

export function formatCustomText(text: string) {
  const bulletPoint = "•";

  // Step 1: Replace all "\n" (actual newline character) with "<br/>"
  let formatted = text.replace(/\n/g, "<br/>");

  // Step 2: Replace lines that start with "- " (but not hyphenated words) with bullet points
  formatted = formatted.replace(/<br\/>\s*-\s+/g, "<br/>" + bulletPoint + " ");

  // Also check if the text starts with "- "
  formatted = formatted.replace(/^- /, bulletPoint + " ");

  return formatted;
}
