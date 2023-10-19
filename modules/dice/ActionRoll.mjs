export class ActionRoll extends Roll {
  get template() {
    return `systems/ryuutama/templates/dialog/action-roll.hbs`;
  }

  constructor(formula, data, options) {
    super(formula, data, options);
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
            callback: (html) => resolve(this._onRollSubmit(html)),
          },
        },
        default: "roll",
        close: () => resolve(null),
      }).render(true);
    });
  }

  _onRollSubmit(html) {
    const form = html[0].querySelector("form");

    if (form.bonus.value) {
      const bonus = new Roll(form.bonus.value, this.data);
      if (!(bonus.terms[0] instanceof OperatorTerm))
        this.terms.push(new OperatorTerm({ operator: "+" }));
      this.terms = this.terms.concat(bonus.terms);
    }

    return this;
  }
}
