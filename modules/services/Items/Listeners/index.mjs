import { SkillListener } from "./SkillListener.mjs";
import { SpellListener } from "./SpellListener.mjs";

export const activateItemsListeners = async (html) => {
  html.on("click", ".card-buttons button", (event) => onChatCardAction(event));
};

const onChatCardAction = async (event) => {
  const button = event.currentTarget;
  button.disabled = true;

  await getAction(button);

  button.disabled = false;
};

const getAction = async (button) => {
  const card = button.closest(".chat-card");

  const actor = await getActorFromChatCard(card);
  if (!actor) return;

  // Validate permission to proceed with the roll
  if (!(game.user.isGM || actor.isOwner)) return;

  const item = getItemFromChatCard(actor, card);
  if (!item) return;

  const dataset = button?.dataset;
  if (dataset === undefined) return;

  const type = item.type;

  switch (type) {
    case "skill":
      return await SkillListener.use(item, dataset);
    case "spell":
      return await SpellListener.use(item, dataset);
    default:
      return;
  }
};

const getActorFromChatCard = async (card) => {
  let actor;

  // Case 1 - a synthetic actor from a Token
  if (card.dataset.tokenId) {
    const token = await fromUuid(card.dataset.tokenId);
    if (!token) return null;
    actor = token.actor;
  } else {
    // Case 2 - use Actor ID directory
    const actorId = card.dataset.actorId;
    actor = game.actors.get(actorId) || null;
  }

  return actor;
};

const getItemFromChatCard = (actor, card) => {
  return actor.items.get(card.dataset.itemId);
};
