export const activateSkillListeners = (html) => {
  html.on("click", ".card-buttons button", (event) => onChatCardAction(event));
};

const onChatCardAction = async (event) => {
  const button = event.currentTarget;
  button.disabled = true;

  const dataset = button?.dataset;

  if (dataset === undefined) return;

  const card = button.closest(".chat-card");
  const messageId = card.closest(".message").dataset.messageId;
  const message = game.messages.get(messageId);

  const actor = await getActorFromChatCard(card);
  if (!actor) return;

  // Validate permission to proceed with the roll
  if (!(game.user.isGM || actor.isOwner)) return;

  const item = actor.items.get(card.dataset.itemId);
  if (!item) return;

  const action = dataset.action;

  switch (action) {
    case "roll":
      const { idx } = dataset;
      await item.useSkill(idx);
      break;

    default:
      break;
  }

  button.disabled = false;
};

const getActorFromChatCard = async (card) => {
  // Case 1 - a synthetic actor from a Token
  if (card.dataset.tokenId) {
    const token = await fromUuid(card.dataset.tokenId);
    if (!token) return null;
    return token.actor;
  }

  // Case 2 - use Actor ID directory
  const actorId = card.dataset.actorId;
  return game.actors.get(actorId) || null;
};
