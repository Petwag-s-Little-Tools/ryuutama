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

ryuutama.dice = {
  none: {
    value: "ryuutama.dice.none",
    next: "d4",
    previous: "none",
  },
  d4: {
    value: "ryuutama.dice.d4",
    next: "d6",
    previous: "d4",
  },
  d6: {
    value: "ryuutama.dice.d6",
    next: "d8",
    previous: "d4",
  },
  d8: {
    value: "ryuutama.dice.d8",
    next: "d10",
    previous: "d6",
  },
  d10: {
    value: "ryuutama.dice.d10",
    next: "d12",
    previous: "d8",
  },
  d12: {
    value: "ryuutama.dice.d12",
    next: "d20",
    previous: "d10",
  },
  d20: {
    value: "ryuutama.dice.d20",
    next: "d20",
    previous: "d12",
  },
};
