export const ryuutama = {};

ryuutama.magicTypes = {
  none: "ryuutama.magicTypes.none",
  incantation: "ryuutama.magicTypes.incantation",
  spring: "ryuutama.magicTypes.spring",
  summer: "ryuutama.magicTypes.summer",
  autumn: "ryuutama.magicTypes.autumn",
  winter: "ryuutama.magicTypes.winter",
};

ryuutama.spellTypes = {
  none: "ryuutama.spellTypes.none",
  normal: "ryuutama.spellTypes.normal",
  ritual: "ryuutama.spellTypes.ritual",
};

ryuutama.durationUnits = {
  none: {
    value: "ryuutama.durationUnits.none",
    hasNumericValue: false,
  },
  round: {
    value: "ryuutama.durationUnits.round",
    hasNumericValue: true,
  },
  minute: {
    value: "ryuutama.durationUnits.minute",
    hasNumericValue: true,
  },
  hour: {
    value: "ryuutama.durationUnits.hour",
    hasNumericValue: true,
  },
  day: {
    value: "ryuutama.durationUnits.day",
    hasNumericValue: true,
  },
  permanent: {
    value: "ryuutama.durationUnits.permanent",
    hasNumericValue: false,
  },
  instant: {
    value: "ryuutama.durationUnits.instant",
    hasNumericValue: false,
  },
  untilCured: {
    value: "ryuutama.durationUnits.untilCured",
    hasNumericValue: false,
  },
  flightDuration: {
    value: "ryuutama.durationUnits.flightDuration",
    hasNumericValue: false,
  },
  ritualLength: {
    value: "ryuutama.durationUnits.ritualLength",
    hasNumericValue: false,
  },
  overnight: {
    value: "ryuutama.durationUnits.overnight",
    hasNumericValue: false,
  },
  unknown: {
    value: "ryuutama.durationUnits.unknown",
    hasNumericValue: false,
  },
};

ryuutama.spellLevels = {
  none: "ryuutama.spellLevels.none",
  low: "ryuutama.spellLevels.low",
  mid: "ryuutama.spellLevels.mid",
  high: "ryuutama.spellLevels.high",
};

ryuutama.itemTypes = {
  armor: "ryuutama.itemTypes.armor",
  gear: "ryuutama.itemTypes.gear",
  shield: "ryuutama.itemTypes.shield",
  weapon: "ryuutama.itemTypes.weapon",
  other: "ryuutama.itemTypes.other",
};

ryuutama.dice = {
  0: {
    value: "ryuutama.dice.d0",
    next: 4,
    previous: 0,
  },
  4: {
    value: "ryuutama.dice.d4",
    next: 6,
    previous: 4,
  },
  6: {
    value: "ryuutama.dice.d6",
    next: 8,
    previous: 4,
  },
  8: {
    value: "ryuutama.dice.d8",
    next: 10,
    previous: 6,
  },
  10: {
    value: "ryuutama.dice.d10",
    next: 12,
    previous: 8,
  },
  12: {
    value: "ryuutama.dice.d12",
    next: 20,
    previous: 10,
  },
  20: {
    value: "ryuutama.dice.d20",
    next: 20,
    previous: 12,
  },
};

ryuutama.stats = {
  none: {},
  dex: {
    statuses: ["injury", "sickness", "shock"],
  },
  str: {
    statuses: ["poison", "sickness", "shock"],
  },
  int: {
    statuses: ["muddled", "sickness", "shock"],
  },
  spi: {
    statuses: ["exhaustion", "sickness", "shock"],
  },
};

ryuutama.maxLevel = 10;
ryuutama.levels = [
  { untilXp: 99, level: 1, bonuses: [] },
  {
    untilXp: 599,
    level: 2,
    bonuses: ["Stat increase", "Feint and Search Combat Actions"],
  },
  { untilXp: 1199, level: 3, bonuses: ["Terrain/Weather Specialty"] },
  {
    untilXp: 1999,
    level: 4,
    bonuses: ["Stat increase", " Status Effect Immunity"],
  },
  { untilXp: 2999, level: 5, bonuses: ["Extra Class"] },
  { untilXp: 4199, level: 6, bonuses: ["Stat increase", "Extra Type"] },
  { untilXp: 5799, level: 7, bonuses: ["Terrain/Weather Specialty"] },
  { untilXp: 7499, level: 8, bonuses: ["Stat increase"] },
  { untilXp: 9999, level: 9, bonuses: ["Favor of the Seasonal Dragons"] },
  {
    untilXp: 10000,
    level: 10,
    bonuses: ["Stat Increase", "Embark on Legendary Journey"],
  },
];
