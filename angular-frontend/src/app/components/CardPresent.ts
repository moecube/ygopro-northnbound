import {Component} from '@angular/core'
import {Core} from "../model/Core";

@Component({
  selector: "CardPresent",
  templateUrl: "./CardPresent.html",
  styleUrls: ["./CardPresent.css"]
})
export class CardPresent {
  cards: number[] = [];
  mouseon: (id: number) => void = null;
  click: (index: number) => void = null;

  constructor() {

  }

  setValue(card: number[]) {
    this.cards = card;
  }

  mouseEnterCard(id: number) {
    if (this.mouseon != null)
      this.mouseon(id);
  }

  async selectCard(id: number) {
    let index = this.cards.indexOf(id);
    if (this.click != null)
      this.click(index);
  }
}
