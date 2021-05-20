export const indent = (string: string, w = 2) => {
  const text = new Array(w + 1).join(' ');
  return string.replace(/^(?!$)/gm, text);
};
