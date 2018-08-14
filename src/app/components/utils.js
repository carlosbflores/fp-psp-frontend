import red from '../../static/images/red-dot.svg';
import green from '../../static/images/green-dot.svg';
import yellow from '../../static/images/yellow-dot.svg';

export function camelCasetoWords(str) {
  return str
    .replace(/([A-Z])/g, match => ` ${match}`)
    .toLowerCase()
    .replace(/^./, match => match.toUpperCase());
}

export function selectColor(color) {
  switch (color) {
    case 'GREEN':
      return green;
    case 'YELLOW':
      return yellow;
    case 'RED':
      return red;
    default:
      return '';
  }
}

export default { camelCasetoWords, selectColor };
