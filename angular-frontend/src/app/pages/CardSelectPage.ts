import { Component, AfterViewInit, OnInit, ViewChild } from "@angular/core"
import {CardDetail} from "../components/CardDetail";
import {CardPresent} from "../components/CardPresent";
import {CardDeck} from "../components/CardDeck";
import {Core} from "../model/Core";
import {User} from "../model/User";
import {TitleBar} from "../components/TitleBar";

@Component({
  selector: "CardSelectPage",
  templateUrl: "./CardSelectPage.html",
  styleUrls: ["./CardSelectPage.css"]
})
export class CardSelectPage implements AfterViewInit, OnInit {
  @ViewChild('card_detail') detail: CardDetail;
  @ViewChild('card_present') present: CardPresent;
  @ViewChild('card_deck') deck: CardDeck;
  @ViewChild('title_bar') title: TitleBar;

  showWelcomeMessage: boolean;
  showCongratulationMessage: boolean;

  constructor() {

  }

  ngOnInit(): void {
    User.loadUser();
  }

  ngAfterViewInit(): void {
    if (this.present) {
      this.present.mouseon = this.mouseOnCard.bind(this);
      this.present.click = this.presentSelectCard.bind(this);
    }
    this.deck.mouseon = this.mouseOnCard.bind(this);
    this.title.onLogin = this.login.bind(this);
    this.title.onLogout = this.logout.bind(this);

    this.Initialize();
  }

  async Initialize() {
    await Core.Init();
    this.syncFromStatus(Core.playerStatus);
  }

  mouseOnCard(id: number): void {
    this.detail.loadCardInfo(id)
  }

  async presentSelectCard(index: number) {
    await Core.Select(index);
    this.syncFromStatus(Core.playerStatus);
  }

  async dropDeck() {
    await Core.Drop();
    this.syncFromStatus(Core.playerStatus);
  }

  syncFromStatus(playerStatus: any) {
    if (!playerStatus) {
      this.showWelcomeMessage = true;
      return;
    }
    console.log(playerStatus);
    switch (playerStatus.status) {
      case 0:
        this.present.setValue(playerStatus.choices);
        this.detail.loadCardInfo(playerStatus.choices[0]);
        this.showCongratulationMessage = false;
        this.showWelcomeMessage = false;
        break;
      case 1:
      case 10:
        this.present.setValue([]);
        this.detail.loadCardInfo(playerStatus.deck.main[0]);
        this.showWelcomeMessage = false;
        this.showCongratulationMessage = true;
    }
    this.deck.syncFromCoreStatus();
  }

  login() {
    User.jump();
  }

  logout() {
    User.logOut();
    this.Initialize();
    this.present.setValue([]);
    this.detail.card = null;
  }
}
