export const someFunction = (someVal) => {
  return someVal + " sssss";
}

export const dashlessFilter = (input) => {
  if (input) {
    return input.replace(/-/g, ' ');
  }
  return input;
}

export const convertUnicode = (input) => {
  return input.replace(/\\u(\w{4,4})/g, function (a, b) {
    var charcode = parseInt(b, 16);
    return String.fromCharCode(charcode);
  });
}

export const musicalKeyFilter = (input, musical = false) => {
  const KeyCode = {
    Cmaj: 20,
    Cmin: 5,
    "C&#9839;maj": 27,
    "C&#9839;min": 28,
    Dmaj: 22,
    Dmin: 7,
    "D&#9839;maj": 29,
    "D&#9839;min": 30,
    Emaj: 24,
    Emin: 9,
    Fmaj: 19,
    Fmin: 4,
    "F&#9839;maj": 14,
    "F&#9839;min": 11,
    Gmaj: 21,
    Gmin: 6,
    "G&#9839;maj": 31,
    "G&#9839;min": 32,
    Amaj: 23,
    Amin: 8,
    "A&#9839;maj": 25,
    "A&#9839;min": 26,
    Bmaj: 13,
    Bmin: 10
  },
    KeyMusical = {
      4: "Fm",
      5: "Cm",
      6: "Gm",
      7: "Dm",
      8: "Am",
      9: "Em",
      10: "Bm",
      11: "F\u266fm",
      13: "B",
      14: "F\u266f",
      19: "F",
      20: "C",
      21: "G",
      22: "D",
      23: "A",
      24: "E",
      25: "B\u266d",
      26: "B\u266dm",
      27: "D\u266d",
      28: "C\u266fm",
      29: "E\u266d",
      30: "D\u266fm",
      31: "A\u266d",
      32: "G\u266fm"
    },
    KeyCamelot = {
      4: "4A",
      5: "5A",
      6: "6A",
      7: "7A",
      8: "8A",
      9: "9A",
      10: "10A",
      11: "11A",
      13: "12B",
      14: "2B",
      19: "7B",
      21: "9B",
      20: "8B",
      22: "10B",
      24: "12B",
      27: "3B",
      28: "12A",
      29: "5B",
      30: "2A",
      31: "4B",
      32: "1A",
      23: "11B",
      25: "6B",
      26: "3A"
    };

  if (input) {
    return musical ? KeyMusical[KeyCode[input]] : KeyCamelot[KeyCode[input]];
  }
}

export const slugify = (input) => {
  if (input) {
    return input.replace(/\s+/g, '-');
  }
};

export const deslugify = (input) => {
  if (input) {
    return input.replace(/-/g, ' ');
  }
}

export const splitByPeriod = (value) => {
  return value.split('.').join(' ');
}
