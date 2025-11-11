export const getError = (error: any) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    error.error ||
    "Something went wrong, please try again"
  );
};

export function splitTextIntoLines(text: string): string[] {
  if (!text) return [];

  return text
    .split(/\r?\n|\r/g)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}
