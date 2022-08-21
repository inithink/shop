import {_BizMoneyHistory} from "./types/_BizMoneyHistory";
import {TokenInfo} from "./types/TokenInfo";
import {dayjs} from "@inithink/utils";
import {BizMoneyHistory} from "./types/BizMoneyHistory";
import {BaseApi} from "../common/BaseApi";

export class SmartStoreAdsApi extends BaseApi {
  private tokenInfo?: TokenInfo;

  async login(id: string, password: string) {
    let res = await this.fetch("https://searchad.naver.com/auth/login", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "content-type": "application/json",
      },
      "body": JSON.stringify({
        "loginId": id,
        "loginPwd": password
      }),
      "method": "POST"
    });

    if (res.status !== 200) {
      throw new Error('login failed');
    }
    this.tokenInfo = await res.json();
  }

  async getBizMoney(
    startYear: number, startMonth: number, startDate: number,
    endYear: number, endMonth: number, endDate: number,
  ): Promise<BizMoneyHistory[]> {
    if (!this.tokenInfo) {
      throw new Error('login first');
    }
    const fullStartDate = 1000 * startYear + 10 * startMonth + startDate;
    const fullEndDate = 1000 * endYear + 10 * endMonth + endDate;
    let res = await this.fetch(`https://manage.searchad.naver.com/api/bizmoney/histories/period?searchStartDt=${fullStartDate}&searchEndDt=${fullEndDate}`, {
      headers: {
        Authorization: `Bearer ${this.tokenInfo.token}`
      },
      "method": "GET"
    });
    let json = await res.json() as Array<_BizMoneyHistory>;

    return json.map(it => {
      return {
        ...it,
        settleDt: dayjs(it.settleDt).toDate(),
        regTm: dayjs(it.regTm).toDate(),
      };
    });
  }
}
