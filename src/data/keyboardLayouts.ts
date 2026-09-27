// Keyboard layouts for different languages

export type KeyboardLayout = 'qwerty' | 'qwertz' | 'azerty' | 'dvorak' | 'colemak' | 'hindi' | 'russian' | 'spanish' | 'french' | 'german';

export interface LayoutConfig {
  name: string;
  language: string;
  rows: string[][];
}

export const keyboardLayouts: Record<KeyboardLayout, LayoutConfig> = {
  qwerty: {
    name: "QWERTY",
    language: "English (US)",
    rows: [
      ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
      ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
      ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
      ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
      ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Ctrl'],
    ],
  },
  qwertz: {
    name: "QWERTZ",
    language: "German",
    rows: [
      ['^', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'ß', '´', 'Backspace'],
      ['Tab', 'q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p', 'ü', '+', '#'],
      ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', 'ä', 'Enter'],
      ['Shift', 'y', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '-', 'Shift'],
      ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Ctrl'],
    ],
  },
  azerty: {
    name: "AZERTY",
    language: "French",
    rows: [
      ['²', '&', 'é', '"', "'", '(', '-', 'è', '_', 'ç', 'à', ')', '=', 'Backspace'],
      ['Tab', 'a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '^', '$', '*'],
      ['Caps', 'q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'ù', 'Enter'],
      ['Shift', 'w', 'x', 'c', 'v', 'b', 'n', ',', ';', ':', '!', 'Shift'],
      ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Ctrl'],
    ],
  },
  dvorak: {
    name: "Dvorak",
    language: "English (Dvorak)",
    rows: [
      ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '[', ']', 'Backspace'],
      ['Tab', "'", ',', '.', 'p', 'y', 'f', 'g', 'c', 'r', 'l', '/', '=', '\\'],
      ['Caps', 'a', 'o', 'e', 'u', 'i', 'd', 'h', 't', 'n', 's', '-', 'Enter'],
      ['Shift', ';', 'q', 'j', 'k', 'x', 'b', 'm', 'w', 'v', 'z', 'Shift'],
      ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Ctrl'],
    ],
  },
  colemak: {
    name: "Colemak",
    language: "English (Colemak)",
    rows: [
      ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
      ['Tab', 'q', 'w', 'f', 'p', 'g', 'j', 'l', 'u', 'y', ';', '[', ']', '\\'],
      ['Caps', 'a', 'r', 's', 't', 'd', 'h', 'n', 'e', 'i', 'o', "'", 'Enter'],
      ['Shift', 'z', 'x', 'c', 'v', 'b', 'k', 'm', ',', '.', '/', 'Shift'],
      ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Ctrl'],
    ],
  },
  hindi: {
    name: "Hindi (InScript)",
    language: "हिंदी",
    rows: [
      ['ॊ', '१', '२', '३', '४', '५', '६', '७', '८', '९', '०', '-', 'ृ', 'Backspace'],
      ['Tab', 'ौ', 'ै', 'ा', 'ी', 'ू', 'ब', 'ह', 'ग', 'द', 'ज', 'ड', '़', 'ॉ'],
      ['Caps', 'ो', 'े', '्', 'ि', 'ु', 'प', 'र', 'क', 'त', 'च', 'ट', 'Enter'],
      ['Shift', 'ॆ', 'ं', 'म', 'न', 'व', 'ल', 'स', ',', '.', 'य', 'Shift'],
      ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Ctrl'],
    ],
  },
  russian: {
    name: "Russian",
    language: "Русский",
    rows: [
      ['ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
      ['Tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', '\\'],
      ['Caps', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'Enter'],
      ['Shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', 'Shift'],
      ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Ctrl'],
    ],
  },
  spanish: {
    name: "Spanish",
    language: "Español",
    rows: [
      ['º', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', "'", '¡', 'Backspace'],
      ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '`', '+', 'ç'],
      ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ', '´', 'Enter'],
      ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '-', 'Shift'],
      ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Ctrl'],
    ],
  },
  french: {
    name: "French",
    language: "Français",
    rows: [
      ['²', '&', 'é', '"', "'", '(', '-', 'è', '_', 'ç', 'à', ')', '=', 'Backspace'],
      ['Tab', 'a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '^', '$', '*'],
      ['Caps', 'q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'ù', 'Enter'],
      ['Shift', 'w', 'x', 'c', 'v', 'b', 'n', ',', ';', ':', '!', 'Shift'],
      ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Ctrl'],
    ],
  },
  german: {
    name: "German",
    language: "Deutsch",
    rows: [
      ['^', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'ß', '´', 'Backspace'],
      ['Tab', 'q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p', 'ü', '+', '#'],
      ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', 'ä', 'Enter'],
      ['Shift', 'y', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '-', 'Shift'],
      ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Ctrl'],
    ],
  },
};

export const getLayoutForLanguage = (language: string): KeyboardLayout => {
  const languageMap: Record<string, KeyboardLayout> = {
    'en': 'qwerty',
    'en-US': 'qwerty',
    'en-GB': 'qwerty',
    'de': 'qwertz',
    'de-DE': 'qwertz',
    'fr': 'azerty',
    'fr-FR': 'azerty',
    'hi': 'hindi',
    'hi-IN': 'hindi',
    'ru': 'russian',
    'ru-RU': 'russian',
    'es': 'spanish',
    'es-ES': 'spanish',
  };
  
  return languageMap[language] || 'qwerty';
};
