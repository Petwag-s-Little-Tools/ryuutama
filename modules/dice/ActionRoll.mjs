import { isNull } from "../utils.mjs";

export class ActionRoll extends Roll {
  get template() {
    return `systems/ryuutama/templates/dialog/action-roll.hbs`;
  }

  constructor(formula, data, options) {
    super(formula, data, options);
  }

  async getTooltip() {
    // TODO: use new type of roll instead of overriding the result
    const parts = this.dice.map((d) => d.getTooltipData());

    const overridenParts = parts.map((p) => {
      const rolls = p.rolls.map((r) => {
        const splittedClassed = r.classes.split(" ");

        if (!splittedClassed.includes("max") && r.result === "6") {
          splittedClassed.push("max");
        }
        return {
          ...r,
          classes: splittedClassed.join(" "),
        };
      });
      return {
        ...p,
        rolls,
      };
    });
    return renderTemplate(this.constructor.TOOLTIP_TEMPLATE, {
      parts: overridenParts,
    });
  }

  configureModifiers() {
    this._formula = this.constructor.getFormula(this.terms);
  }

  async configureDialog({ title }) {
    const content = await renderTemplate(this.template, {
      formula: `${this.formula} + @bonus`,
    });

    return new Promise((resolve) => {
      new Dialog({
        title,
        content,
        buttons: {
          roll: {
            label: game.i18n.localize("ryuutama.roll"),
            callback: (html) => resolve(this.onRollSubmit(html)),
          },
        },
        default: "roll",
        close: () => resolve(null),
      }).render(true);
    });
  }

  onRollSubmit(html) {
    const form = html[0].querySelector("form");

    if (!isNull(form.bonus.value)) {
      const bonus = new Roll(form.bonus.value, this.data);
      if (!(bonus.terms[0] instanceof OperatorTerm))
        this.terms.push(new OperatorTerm({ operator: "+" }));
      this.terms = this.terms.concat(bonus.terms);
    }

    this.configureModifiers();
    return this;
  }
}
