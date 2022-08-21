import {CookieJar, JSDOM} from "jsdom";
import {sleep} from "@inithink/utils";

jest.setTimeout(10000000);
test('examples of some things', async () => {
  let {jsdom, window, document} = await goto('https://supplier.coupang.com');
  ({jsdom, window, document} = await goto(jsdom.window.location.href, jsdom.cookieJar));

  // setInterval(() => {
  //   console.log(jsdom.window.location.href);
  //   console.log(jsdom.window.document.body.innerHTML);
  // }, 1000);
  await sleep(10000);
});

async function type(selector: string, value: string) {


}

async function goto(url: string, jar?: CookieJar) {
  let jsdom = await JSDOM.fromURL(url, {
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true,
    cookieJar: jar,
  });

  let window = jsdom.window;
  let document = jsdom.window.document;

  let result = {
    jsdom, window, document,
  };
  return new Promise<typeof result>(resolve => {
    document.addEventListener("DOMContentLoaded", () => {
      resolve(result);
    });
  });
}
