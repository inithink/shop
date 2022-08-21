import {Fetch} from "./Fetch";
import {Cookie, CookieJar} from "tough-cookie";
import makeFetchCookie from "fetch-cookie";
import fetchOriginal from "node-fetch";

export class BaseApi {
  protected fetch: Fetch;
  protected cookieJar = new CookieJar();
  private cookiePromise: Promise<unknown> = Promise.resolve();

  constructor() {
    let fetch = makeFetchCookie(fetchOriginal, this.cookieJar);
    this.fetch = (url, init) => {
      return this.cookiePromise
        .then(() => {
          return fetch(url, init);
        });
    };
  }

  protected setCookies(url: string, key: string, value: string) {
    let cookie = new Cookie();
    cookie.key = key;
    cookie.value = value;
    let setCookiePromise = this.cookieJar.setCookie(cookie, url);
    this.cookiePromise = Promise<unknown>.all([this.cookiePromise, setCookiePromise]);
  }
}
