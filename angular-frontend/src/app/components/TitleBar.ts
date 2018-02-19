import { Component, AfterViewInit } from '@angular/core'
import { User } from "../model/User";


@Component({
  selector: "TitleBar",
  templateUrl: "./TitleBar.html"
})
export class TitleBar implements AfterViewInit {
  username: string = null;
  avatar: string = null;

  ngAfterViewInit(): void {
    if (User.username)
      this.username = User.username;
    if (User.avatar)
      this.avatar = User.avatar;
  }

  onLoginClick(): void {
    User.jump();
  }
}
