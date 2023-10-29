import { isNull } from "../utils.mjs";

export class ActionRoll extends Roll {
  _isFumble = undefined;

  get template() {
    return `systems/ryuutama/templates/dialog/action-roll.hbs`;
  }

  get concentration() {
    return this.options.concentration ?? "";
  }

  get isFumble() {
    return true;
    if (this._isFumble === undefined) {
      this._isFumble = !this.terms.some((term) => {
        return term instanceof Die && term.total !== 1;
      });
    }
    return this._isFumble;
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

  configureModifiers(concentration = "") {
    this._formula = this.constructor.getFormula(this.terms);
    this.options = {
      ...this.options,
      concentration,
    };
    this._isFumble = undefined;
  }

  async configureDialog(title, concentrationFumble, concentrationMp) {
    const concentration = concentrationFumble || concentrationMp;
    const dualConcentration = concentrationFumble && concentrationMp;

    const content = await renderTemplate(this.template, {
      formula: `${this.formula} + @bonus`,
      concentration,
      concentrationFumble,
      concentrationMp,
      dualConcentration,
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

    const concentration = form.concentration?.value;
    let concentrationBonus = "";

    if (concentration === "fumble" || concentration === "mp")
      concentrationBonus = "1";
    if (concentration === "dual") concentrationBonus = "2";

    if (concentrationBonus !== "") {
      const bonus = new Roll(concentrationBonus, this.data);

      if (!(bonus.terms[0] instanceof OperatorTerm))
        this.terms.push(new OperatorTerm({ operator: "+" }));
      this.terms = this.terms.concat(bonus.terms);
    }

    if (!isNull(form.bonus.value)) {
      const bonus = new Roll(form.bonus.value, this.data);

      if (!(bonus.terms[0] instanceof OperatorTerm))
        this.terms.push(new OperatorTerm({ operator: "+" }));
      this.terms = this.terms.concat(bonus.terms);
    }

    this.configureModifiers(concentration);
    return this;
  }
}
