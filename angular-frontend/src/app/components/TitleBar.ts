import { Component, AfterViewInit } from '@angular/core'
import { User } from "../model/User";


@Component({
  selector: "TitleBar",
  templateUrl: "./TitleBar.html"
})
export class TitleBar implements AfterViewInit {
  username: string = null;
  avatar: string = null;

  onLogin: () => void = null;
  onLogout: () => void = null;

  ngAfterViewInit(): void {
    if (User.username)
      this.username = User.username;
    if (User.avatar)
      this.avatar = User.avatar;
  }

  onLoginClick(): void {
    if (this.onLogin != null) this.onLogin();
  }

  onLogoutClick() : void {
    if(this.onLogout != null) this.onLogout();
    this.username = null;
    this.avatar = null;
  }
}
