import { RyuutamaItem } from "../../documents/RyuutamaItem.mjs";
import { displayInChat } from "./displayInChat.mjs";

/**
 *
 * @param {RyuutamaItem} item
 * @returns
 */
export const useSpell = async (item) => {
  return await displayInChat(item);
};
