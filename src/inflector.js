const PLURAL = {
  '/(quiz)$/i': "$1zes",
  '/^(ox)$/i': "$1en",
  '/([m|l])ouse$/i': "$1ice",
  '/(matr|vert|ind)ix|ex$/i': "$1ices",
  '/(x|ch|ss|sh)$/i': "$1es",
  '/([^aeiouy]|qu)y$/i': "$1ies",
  '/(hive)$/i': "$1s",
  '/(?:([^f])fe|([lr])f)$/i': "$1$2ves",
  '/(shea|lea|loa|thie)f$/i': "$1ves",
  '/sis$/i': "ses",
  '/([ti])um$/i': "$1a",
  '/(tomat|potat|ech|her|vet)o$/i': "$1oes",
  '/(bu)s$/i': "$1ses",
  '/(alias)$/i': "$1es",
  '/(octop)us$/i': "$1i",
  '/(ax|test)is$/i': "$1es",
  '/(us)$/i': "$1es",
  '/s$/i': "s",
  '/$/': "s"
};

/**
 * Singular word forms.
 *
 * @var array
 */
const SINGULAR = {
  '/(quiz)zes$/i': "$1",
  '/(matr)ices$/i': "$1ix",
  '/(vert|ind)ices$/i': "$1ex",
  '/^(ox)en$/i': "$1",
  '/(alias)es$/i': "$1",
  '/(octop|vir)i$/i': "$1us",
  '/(cris|ax|test)es$/i': "$1is",
  '/(shoe)s$/i': "$1",
  '/(o)es$/i': "$1",
  '/(bus)es$/i': "$1",
  '/([m|l])ice$/i': "$1ouse",
  '/(x|ch|ss|sh)es$/i': "$1",
  '/(m)ovies$/i': "$1ovie",
  '/(s)eries$/i': "$1eries",
  '/([^aeiouy]|qu)ies$/i': "$1y",
  '/([lr])ves$/i': "$1f",
  '/(tive)s$/i': "$1",
  '/(hive)s$/i': "$1",
  '/(li|wi|kni)ves$/i': "$1fe",
  '/(shea|loa|lea|thie)ves$/i': "$1f",
  '/(^analy)ses$/i': "$1sis",
  '/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/i': "$1$2sis",
  '/([ti])a$/i': "$1um",
  '/(n)ews$/i': "$1ews",
  '/(h|bl)ouses$/i': "$1ouse",
  '/(corpse)s$/i': "$1",
  '/(us)es$/i': "$1",
  '/(us|ss)$/i': "$1",
  '/s$/i': "",
};

const IRREGULAR = {
  'move': 'moves',
  'foot': 'feet',
  'goose': 'geese',
  'sex': 'sexes',
  'child': 'children',
  'man': 'men',
  'tooth': 'teeth',
  'person': 'people',
};

const UNCOUNTABLE = [
  'sheep',
  'fish',
  'deer',
  'series',
  'species',
  'money',
  'rice',
  'information',
  'equipment',
];

class Inflector {
  constructor() {
    this.singularCache = {};
    this.pluralCache = {};
  }

  plural(value) {
    console.log({
      message: `Trying to pluralize: ${value}`
    });

    if (this.pluralCache[value]) {
      return this.pluralCache[value];
    }

    if (UNCOUNTABLE.includes(value.toLowerCase())) {
      this.pluralCache[value] = value;

      return value;
    }

    for (const [pattern, irregular] of Object.entries(IRREGULAR)) {
      const regex = new RegExp(`/${pattern}/i`);

      if (value.match(regex)) {
        this.pluralCache[value] = value.replace(regex, irregular);
        return this.pluralCache[value];
      }
    }

    for (const [pattern, plural] of Object.entries(PLURAL)) {
      if (value.match(pattern)) {
        this.pluralCache[value] = value.replace(pattern, plural);
      } else {
        this.pluralCache[value] = value;
      }
    }

    return this.pluralCache[value];
  }

  singular(value) {
    if (this.singularCache[value]) {
      return this.singularCache[value];
    }

    if (UNCOUNTABLE.includes(value.toLowerCase())) {
      this.singularCache[value] = value;
      return value;
    }

    for (const [pattern, irregular] of Object.entries(IRREGULAR)) {
      const regex = new RegExp(`/${pattern}/i`);

      if (value.match(regex)) {
        this.singularCache[value] = value.replace(regex, irregular);

        return this.singularCache[value];
      }
    }


    for (const [pattern, singular] of Object.entries(SINGULAR)) {
      if (value.match(pattern)) {
        this.singularCache[value] = value.replace(pattern, singular);
      } else {
        this.singularCache[value] = value;
      }
    }

    return this.singularCache[value];
  }

  pluralIf(value, count) {
    return count.length > 1 ? this.plural(value) : value;
  }
}

module.exports = new Inflector();
