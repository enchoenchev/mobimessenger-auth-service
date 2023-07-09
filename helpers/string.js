/**
 * Capitalize the first letter of a string
 * 
 * @param String str 
 * @returns String
 */
exports.capitalizeFirstLetter = (str) => {
  str = str.trim();
  return str
    ? str.charAt(0).toUpperCase() + str.slice(1)
    : "";
};

/**
 * Append a sentence closing character to a string
 * 
 * @param String str 
 * @param Character closingCharacter 
 * @returns String
 */
exports.closeSentence = (str, closingCharacter) => {
  str = str.trim();
  if (
    str &&
    str.slice(-1) !== "." &&
    str.slice(-1) !== "!" &&
    str.slice(-1) !== "?"
  ) {
    return str + (closingCharacter || ".");
  }

  return str;
};
