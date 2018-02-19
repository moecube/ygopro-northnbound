import { Component } from '@angular/core'
import {Deck} from "../model/Deck";
import {Core} from "../model/Core";

@Component({
  selector: "CardDeck",
  templateUrl: "./CardDeck.html",
  styleUrls: ["./CardDeck.css"]
})
export class CardDeck {
  deck: Deck = new Deck([], [], []);
  mouseon: (number) => void = null;

  calculateCssClass(length: number, line: number) {
    return "line" + Math.ceil(length / line);
  }

  mouseEnterCard(id: number) {
    if (this.mouseon)
      this.mouseon(id);
  }

  async sortDeck() {
    await Core.Sort();
    this.syncFromCoreStatus();
  }

  public syncFromCoreStatus() {
    if (Core.playerStatus != null)
    {
      this.deck.main = Core.playerStatus.deck.main ? Core.playerStatus.deck.main : [];
      this.deck.ex = Core.playerStatus.deck.ex ? Core.playerStatus.deck.ex : [];
    }
  }
}
