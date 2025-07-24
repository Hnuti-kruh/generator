const sanitizeValue = (value) => {
  if (value == "") {
    value = null;
  }

  return value;
};

export { sanitizeValue };
