import { isNull } from "../utils.mjs";

export class ActionRoll extends Roll {
  get template() {
    return `systems/ryuutama/templates/dialog/action-roll.hbs`;
  }

  constructor(formula, data, options) {
    super(formula, data, options);
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
      console.log(this.terms);
    }

    this.configureModifiers();
    return this;
  }
}
