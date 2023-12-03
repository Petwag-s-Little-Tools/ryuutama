import { RyuutamaItem } from "../../../documents/RyuutamaItem.mjs";

/**
 *
 * @param {RyuutamaItem} item
 * @returns
 */
export const displaySkill = async (item) => {
  return await displayInChat(item);
};

/**
 * Display the item card
 * @param {RyuutamaItem} item
 * @param {{}} [setup={}]
 * @returns {ChatMessage}
 */
const displayInChat = async (item, setup = {}) => {
  const token = item.actor.token;

  const templateData = {
    actor: item.actor,
    item: item,
    tokenId: token?.uuid || null,
    system: item.system,
    setup,
  };

  const html = await renderTemplate(
    "systems/ryuutama/templates/chat/skill-card.hbs",
    templateData
  );

  // create chat message
  const chatData = {
    user: game.user.id,
    type: CONST.CHAT_MESSAGE_TYPES.OTHER,
    content: html,
    flavor: item.system.flavor,
    speaker: ChatMessage.getSpeaker({ actor: item.actor, token }),
    flags: { "core.canPopout": true },
  };

  // Apply correct visibility
  ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));

  // Create the card
  const card = await ChatMessage.create(chatData);

  return card;
};
