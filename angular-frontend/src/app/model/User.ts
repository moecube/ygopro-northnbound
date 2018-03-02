export class User {
  static username: string = null;
  static avatar: string = null;
  static token: string = "";
  static signature: string = "";

  static getJumpURI() : string {
    let params: URLSearchParams = new URLSearchParams();
    params.set('return_sso_url', window.location.href);
    let payload: string = btoa(params.toString());

    let url: URL = new URL('https://accounts.moecube.com');
    params = url['searchParams'];
    params.set('sso', payload);
    return url.toString();
  }

  static jump() : void {
    window.location.href = this.getJumpURI();
  }

  static setFromSSO(sso: string) {
    let name = this.getURLParameter('username', sso);
    let avatar = this.getURLParameter('avatar_url', sso);
    this.username = name;
    this.avatar = avatar;
    return true;
  }

  static loadFromLocalStorage() : boolean {
    let token: string = window.localStorage.getItem('token');
    let sig: string = window.localStorage.getItem('signature');
    if (token != null) {
      let sso = decodeURI(atob(token));
      this.setFromSSO(sso);
      this.token = token;
      this.signature = sig;
      return true;
    }
    return false;
  }

  static loadFromURL() : boolean {
    let token: string = this.getURLParameter('sso', null);
    let sig: string = this.getURLParameter('sig', null);
    if (token != null) {
      let sso = decodeURI(atob(token));
      this.setFromSSO(sso);
      window.localStorage.setItem('token', token);
      window.localStorage.setItem('signature', sig);
      this.token = token;
      this.signature = sig;
      return true;
    }
    return false;
  }

  static loadUser() {
    if (!this.loadFromLocalStorage())
      this.loadFromURL();
  }

  static getURLParameter(name: string, target: string): string {
    if (!target) target = window.location.search;
    return decodeURIComponent((new RegExp('[?|&]' + name + '=([^&;]+?)(&|#|;|$)').exec(target) || [null, ''])[1].replace(/\+/g, '%20')) || null;
  }

  static logOut() {
    this.username = null;
    this.avatar = null;
    this.token = null;
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('signature');
  }
}
