import { CharacterClass } from "./items/CharacterClass.mjs";
import { CharacterType } from "./items/CharacterType.mjs";
import { Item } from "./items/Item.mjs";
import { Skill } from "./items/Skill.mjs";
import { Spell } from "./items/Spell.mjs";
import { Xp } from "./items/Xp.mjs";

export const itemConfig = {
  characterClass: CharacterClass,
  characterType: CharacterType,
  item: Item,
  skill: Skill,
  spell: Spell,
  xp: Xp,
};
