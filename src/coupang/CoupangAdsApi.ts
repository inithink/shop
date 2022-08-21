import {BaseApi} from "../common/BaseApi";
import {LoginError} from "../common/IdPasswordNotMatchedError";
import puppeteer from "puppeteer";

function getTabId(html: string) {
  let matches = html.match(/tab_id=([^&]+)/);
  if (!matches) {
    throw new LoginError();
  }
  return matches[1];
}

function getSessionCode(html: string) {
  let matches = html.match(/session_code=([^&]+)/);
  if (!matches) {
    throw new LoginError();
  }
  return matches[1];
}

function getExecution(html: string) {
  let matches = html.match(/"execution": "(.+)",/);
  if (!matches) {
    throw new LoginError();
  }
  return matches[1];
}

export class CoupangAdsApi extends BaseApi {
  async login(id: string, password: string, authCode: string = '', authType: 'EML' | '' = 'EML') {
    const browser = await puppeteer.launch({
      headless: false,
    });
    let page = await browser.newPage();
    await page.goto('https://supplier.coupang.com/');
    let url = page.url();
    if (!url.startsWith('https://supplier.coupang.com/')) {
      await page.type('input[name="username"]', id);
      await page.type('input[name="password"]', password);
      await page.click('button[type="submit"]');
      await page.waitForNetworkIdle();
    }
    let cookies = await page.cookies('https://supplier.coupang.com', 'https://xauth.coupang.com/');
    for (const cookie of cookies) {

      this.setCookies(`https://${cookie.domain}`, cookie.name, cookie.value);
    }
    await browser.close();
    // await sleep(100000);
  }

  async getPAReport() {

    let res = await this.fetch("https://supplier.coupang.com/marketing/cmg-api/report/PA", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "content-type": "application/json",
      },
      "body": "{\"start\":1659538800000,\"end\":1660057200000}",
      "method": "POST"
    });
    let text = await res.text();
    console.log(text);
    // if (json.errorCode) {
    //   throw new Error(JSON.stringify(json, null, 2));
    // }
    // return json;
  }
}

