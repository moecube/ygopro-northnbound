import { Component } from '@angular/core'
import * as configData from '../config.json'
let config = <any>configData;

@Component({
  selector: "CardDetail",
  templateUrl: "./CardDetail.html",
  styleUrls: ["./CardDetail.css"]
})
export class CardDetail {
  card: any;
  public async loadCardInfo(id: number) {
    if (id < 0) {
      this.card = null;
      return;
    }
    let url = new URL("card/zh-CN/" + id.toString() , config.pickServerHost.toString());
    let response = await fetch(url.toString(), {
      method: 'POST',
      body: JSON.stringify({
        translateAttribute: true,
        translateType: true,
        translateRace: true
      })
    });
    this.card = await response.json();
  }

  generateMonsterCardDescription(): string {
    if (!this.card) return "";
    if (this.card.atk != null)
    {
      return this.card.name + "<br />" +
        this.card.attribute + "/" +
        this.card.originLevel + "/" +
        this.card.race + "/" +
        this.card.type + "/" +
        this.renderNumber(this.card.atk) + "/" +
        this.renderNumber(this.card.def)
    }
    else return this.card.name + "  " + this.card.type;
  }

  renderCardDesc() : string {
    return this.card.desc.replace(/\n/g, "<br />")
  }

  renderNumber(value: number):string {
    return value == -2 ? "？" : value.toString();
  }
}
