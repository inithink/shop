import {LoginError} from "../common/IdPasswordNotMatchedError";
import {toTwoDigit} from "../common/toTwoDigit";
import {BaseApi} from "../common/BaseApi";

export class WeMakePriceAdsApi extends BaseApi {
  async login(id: string, encryptPassword: string) {
    await this.fetch("https://ad.wemakeprice.com/api/sso/salt", {
      "headers": {
        "accept": "*/*",
        "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
      },
      "method": "GET"
    });

    let body = new URLSearchParams({
      type: 'SELLER',
      userId: id,
      password: '',
      encryptPassword,
    });
    let res = await this.fetch("https://ad.wemakeprice.com/loginProcess", {
      "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/x-www-form-urlencoded",
      },
      body,
      "method": "POST"
    });
    let text = await res.text();
    if (text.indexOf('10분간 로그인이 불가합니다.') !== -1) {
      throw new LoginError();
    }
  }

  async getPointChangeHistory(
    startYear: number, startMonth: number, startDate: number,
    endYear: number, endMonth: number, endDate: number,
    page: number, size: number,
  ): Promise<WMPPointHistoryResponse> {
    let start = `${startYear}-${toTwoDigit(startMonth)}-${toTwoDigit(startDate)}`;
    let end = `${endYear}-${toTwoDigit(endMonth)}-${toTwoDigit(endDate)}`;

    let res = await this.fetch(`https://ad.wemakeprice.com/api/point/points/use?page=${page - 1}&size=${size}&start=${start}&end=${end}`, {
      "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "ajax": "true",
        "content-type": "application/json",
      },
      "method": "GET"
    });
    return await res.json();
  }
}

interface WMPPointHistoryResponse {
  total: number,
  rows: WMPPointHistory[]
}

interface WMPPointHistory {
  date: string, // 2022-08-02 22:00:00 ~ 2022-08-02 22:59:59
  type: '5' | '1', // '5'-> 사용 '1' -> 충전
  adProductDetail: string, // CHARGE, AI_BOARD, AI_PLUS, PUSH_AD(PUSH 광고), PROGRAM_AD(노출지원 프로그램), CATEGORY_PICK(전시입찰), TARGET_BRAND_CPC(타겟브랜드 CPC), TARGET_BRAND_CPC_BID, TARGET_BRAND_CPP, TARGET_CLICK, TARGET_PLUS
  accDate: string,
  transactionType: null,
  chargePayPoint: number,
  chargeFreePoint: number,
  refundPayPoint: number,
  refundFreePoint: number,
  usePayPoint: number,
  useFreePoint: number
}
