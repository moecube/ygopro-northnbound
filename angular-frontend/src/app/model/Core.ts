import * as configData from '../config.json'
import {User} from "./User";
let config = <any>configData;

export class Core {

  static playerStatus: any = null;

  static async Init() {
    let url: URL = new URL(`pick/${User.username}/status`, config.pickServerHost);
    let playerStatus = await fetch(url.toString());
    this.playerStatus = await playerStatus.json();
    console.log(this.playerStatus);
    return this.playerStatus;
  }

  static async Select(index: number) {
    let url: URL = new URL(`pick/${User.username}/next`, config.pickServerHost);
    let playerStatus = await fetch(url.toString(), { method: 'POST', body: index.toString() });
    this.playerStatus = await playerStatus.json();
    return this.playerStatus;
  }

  static async Drop() {
    let url: URL = new URL(`${User.username}`, config.pickServerHost);
    await fetch(url.toString(), { method: 'DELETE' });
    await this.Init();
  }

  static async Sort() {
    let url: URL = new URL(`pick/${User.username}/sort`, config.pickServerHost);
    let playerStatus = await fetch(url.toString());
    this.playerStatus = await playerStatus.json();
    return this.playerStatus;
  }
}
