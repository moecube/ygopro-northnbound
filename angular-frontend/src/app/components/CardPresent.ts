import {Component} from '@angular/core'
import {Core} from "../model/Core";

@Component({
  selector: "CardPresent",
  templateUrl: "./CardPresent.html",
  styleUrls: ["./CardPresent.css"]
})
export class CardPresent {
  cards: number[] = [];
  mouseOnSide: number = 0;
  mouseon: (id: number) => void = null;
  click: (index: number) => void = null;

  constructor() {

  }

  setValue(card: number[]) {
    this.cards = card;
  }

  mouseEnterCard(id: number, side: number) {
    if (this.mouseon != null)
      this.mouseon(id);
    this.mouseOnSide = side;
  }

  mouseLeaveCard() {
    this.mouseOnSide = 0;
  }

  async selectCard(id: number) {
    let index = this.cards.indexOf(id);
    if (this.click != null)
      this.click(index);
  }

  sideCards(num: number) {
    if (this.cards.length % 2 != 0) return [];
    let length = this.cards.length / 2;
    return this.cards.slice(length * num, length * (num + 1))
  }
}
