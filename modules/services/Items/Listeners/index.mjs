import { activateSkillListeners } from "./activateSkillListeners.mjs";
import { activateSpellListeners } from "./activateSpellListeners.mjs";

export const activateItemsListeners = (html) => {
  activateSkillListeners(html);
  activateSpellListeners(html);
};
