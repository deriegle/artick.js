const PLURAL = {
  '(quiz)$': '$1zes',
  '^(ox)$': "$1en",
  '([m|l])ouse$': "$1ice",
  '(matr|vert|ind)ix|ex$': "$1ices",
  '(x|ch|ss|sh)$': "$1es",
  '([^aeiouy]|qui)y$': "$1ies",
  '(hive)$': "$1s",
  '(?:([^f])fe|([lr])f)$': "$1$2ves",
  '(shea|lea|loa|thie)f$': "$1ves",
  'sis$': "ses",
  '([ti])um$': "$1a",
  '(tomat|potat|ech|her|vet)o$': "$1oes",
  '(bu)s$': "$1ses",
  '(alias)$': "$1es",
  '(octop)us$': "$1i",
  '(ax|test)is$': "$1es",
  '(us)$': "$1es",
  's$': "$1s",
  '$': "s"
};

const SINGULAR = {
  '(quiz)zes$': "$1",
  '(matr)ices$': "$1ix",
  '(vert|ind)ices$': "$1ex",
  '^(ox)en$': "$1",
  '(alias)es$': "$1",
  '(octop|vir)i$': "$1us",
  '(cris|ax|test)es$': "$1is",
  '(shoe)s$': "$1",
  '(o)es$': "$1",
  '(bus)es$': "$1",
  '([m|l])ice$': "$1ouse",
  '(x|ch|ss|sh)es$': "$1",
  '(m)ovies$': "$1ovie",
  '(s)eries$': "$1eries",
  '([^aeiouy]|qu)ies$': "$1y",
  '([lr])ves$': "$1f",
  '(tive)s$': "$1",
  '(hive)s$': "$1",
  '(li|wi|kni)ves$': "$1fe",
  '(shea|loa|lea|thie)ves$': "$1f",
  '(^analy)ses$': "$1sis",
  '((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$': "$1$2sis",
  '([ti])a$': "$1um",
  '(n)ews$': "$1ews",
  '(h|bl)ouses$': "$1ouse",
  '(corpse)s$': "$1",
  '(us)es$': "$1",
  '(us|ss)$': "$1",
  's$': "",
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
  'deer',
  'equipment',
  'fish',
  'information',
  'money',
  'rice',
  'series',
  'sheep',
  'species',
];

class Inflector {
  constructor() {
    this.singularCache = {};
    this.pluralCache = {};

    this.CACHES = {
      SINGULAR: this.singularCache,
      PLURAL: this.pluralCache,
    };
  }

  plural(value) {
    if (this.pluralCache[value]) {
      return this.pluralCache[value];
    }

    if (UNCOUNTABLE.includes(value.toLowerCase())) {
      this.pluralCache[value] = value;

      return value;
    }
    const irregularMatch = this._findMatch(value, IRREGULAR, this.CACHES.PLURAL);

    if (irregularMatch) { return irregularMatch; }

    return this._findMatch(value, PLURAL, this.CACHES.PLURAL);
  }

  singular(value) {
    if (this.singularCache[value]) {
      return this.singularCache[value];
    }

    if (UNCOUNTABLE.includes(value.toLowerCase())) {
      this.singularCache[value] = value;
      return value;
    }

    const irregularMatch = this._findMatch(value, swap(IRREGULAR), this.CACHES.SINGULAR);

    if (irregularMatch) { return irregularMatch; }

    return this._findMatch(value, SINGULAR, this.CACHES.SINGULAR);
  }

  pluralIf(value, count) {
    return count > 1 ? this.plural(value) : value;
  }

  _findMatch(value, options, cache) {
    for (let [pattern, replacement] of Object.entries(options)) {
      const regex = new RegExp(pattern, 'i');

      if (value.match(regex)) {
        cache[value] = value.replace(regex, replacement);
        return cache[value];
      }
    }

    return null;
  }
}

module.exports = new Inflector();

  function swap(json){
    var ret = {};
    for(var key in json){
      ret[json[key]] = key;
    }
    return ret;
  }
