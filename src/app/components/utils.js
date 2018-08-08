const camelCasetoWords = str =>
  str
    .replace(/([A-Z])/g, match => ` ${match}`)
    .toLowerCase()
    .replace(/^./, match => match.toUpperCase());

export default camelCasetoWords;
