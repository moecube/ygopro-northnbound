export class User {
  static username: string = null;
  static avatar: string = null;
  static data: string = "";

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
    let name = this.getURLParameter('name', sso);
    let avatar = this.getURLParameter('avatar_url', sso);
    this.username = name;
    this.avatar = avatar;
    this.data = sso;
    return true;
  }

  static loadFromLocalStorage() : boolean {
    let sso: string = window.localStorage.getItem('sso');
    let sig: string = window.localStorage.getItem('sig');
    if (sso != null) {
      this.setFromSSO(sso);
      return true;
    }
    return false;
  }

  static loadFromURL() : boolean {
    let sso: string = this.getURLParameter('sso', null);
    let sig: string = this.getURLParameter('sig', null);
    if (sso != null) {
      sso = decodeURI(atob(sso));
      this.setFromSSO(sso);
      window.localStorage.setItem('sso', sso);
      window.localStorage.setItem('sig', sig);
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
}
