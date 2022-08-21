import {LoginError} from "../common/IdPasswordNotMatchedError";
import {ESMSellBalanceResponse} from "./types/ESMSellBalanceResponse";
import {ESMOrder} from "./types/ESMOrder";
import {ESMNewOrderResponse} from "./types/ESMNewOrderResponse";
import {BaseApi} from "../common/BaseApi";
import {toTwoDigit} from "../common/toTwoDigit";

export class ESMApi extends BaseApi {
  private masterId: string = '';

  async login(id: string, password: string) {
    let body = {
      Type: 'E',
      Id: id,
      Password: password,
    };

    await this.fetch("https://www.esmplus.com/Member/SignIn/LogOn?ReturnValue=-7", {
      "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      },
      "method": "GET"
    });
    let res = await this.fetch("https://www.esmplus.com/Member/SignIn/Authenticate", {
      "headers": {
        "content-type": "application/json",
      },
      "body": JSON.stringify(body),
      "method": "POST"
    });
    let content = await res.text();
    if (content.indexOf('로그인에 실패') !== -1) {
      throw new LoginError();
    }

    let htmlRes = await this.fetch('https://www.esmplus.com/Escrow/Order/NewOrder?menuCode=TDM105');
    let html = await htmlRes.text();
    let matches = html.match(/var masterID = "(\d+)";/);
    if (!matches) {
      throw new Error('unexpected');
    }
    this.masterId = matches[1];
  }

  async getNewOrders(page: number, limit: number, startDate: string, endDate: string): Promise<ESMNewOrderResponse> {
    let res = await this.fetch("https://www.esmplus.com/Escrow/Order/NewOrderSearch", {
      "headers": {
        "accept": "application/json",
        "content-type": "application/x-www-form-urlencoded",
      },
      "body": `page=${page}&limit=${limit}&siteGbn=0&searchAccount=${this.masterId}&searchDateType=ODD&searchSDT=${startDate}&searchEDT=${endDate}&searchKey=ON&searchKeyword=&searchDistrType=AL&searchAllYn=N&SortFeild=PayDate&SortType=Desc&start=0&searchTransPolicyType=`,
      "method": "POST"
    });
    return await res.json() as any;
  }


  async confirmOrders(order: ESMOrder[]) {
    let body = new URLSearchParams({
      mID: `${this.masterId}`,
      orderInfo: order.map(it => `${it.OrderNo},${it.SiteIDValue},${it.SellerID}`).join('^'), //'3926966560,2,128327886^3926919392,1,nasil001'
    });
    let res = await this.fetch("https://www.esmplus.com/Escrow/Order/OrderCheck", {
      "headers": {
        "accept": "application/json",
        "content-type": "application/x-www-form-urlencoded",
      },
      "body": body,
      "method": "POST"
    });
    let json: any, text: any;
    try {
      text = await res.text();
      json = JSON.parse(text);
    } catch (e) {
      throw new Error(`주문확인 실패: ${text}`);
    }
    if (!json.success) {
      throw new Error(`주문확인 실패: ${json.message}`);
    }
  }

  async getGMarketSellBalanceHistory(
    startYear: number, startMonth: number, startDate: number,
    endYear: number, endMonth: number, endDate: number,
    page: number, size: number,
    sellerId: string = process.env['ESM_SELLER_ID']!,
  ): Promise<ESMSellBalanceResponse> {
    let startDateString = `${startYear}-${toTwoDigit(startMonth)}-${toTwoDigit(startDate)}`;
    let endDateString = `${endYear}-${toTwoDigit(endMonth)}-${toTwoDigit(endDate)}`;

    let body = new URLSearchParams({
      page: `${page}`,
      limit: `${size}`,
      searchAccount: sellerId,
      searchType: '',
      searchSDT: startDateString,
      searchEDT: endDateString,
      searchKey: '0',
      searchKeyword: '',
      SortFeild: 'TransDate',
      SortType: 'Asc',
      start: '0',
    });
    let res = await this.fetch("https://www.esmplus.com/Member/Settle/GmktSellBalanceUseListSearch", {
      "headers": {
        "accept": "application/json",
        "content-type": "application/x-www-form-urlencoded",
      },
      body,
      "method": "POST"
    });
    return await res.json() as any;
  }

  async getAuctionSellBalanceHistory(
    startYear: number, startMonth: number, startDate: number,
    endYear: number, endMonth: number, endDate: number,
    page: number, size: number,
    sellerId: string = process.env['AUCTION_SELLER_ID']!,): Promise<ESMSellBalanceResponse> {

    let startDateString = `${startYear}-${toTwoDigit(startMonth)}-${toTwoDigit(startDate)}`;
    let endDateString = `${endYear}-${toTwoDigit(endMonth)}-${toTwoDigit(endDate)}`;

    let body = new URLSearchParams({
      page: `${page}`,
      limit: `${size}`,
      searchAccount: sellerId,
      searchType: '0',
      searchSDT: startDateString,
      searchEDT: endDateString,
      searchKey: '0',
      searchKeyword: '',
      SortFeild: 'TransDate',
      SortType: 'Asc',
      start: '0',
    });
    let res = await this.fetch("https://www.esmplus.com/Member/Settle/IacSellBalanceUseListSearch", {
      "headers": {
        "accept": "application/json",
        "content-type": "application/x-www-form-urlencoded",
      },
      body,
      "method": "POST"
    });
    return await res.json() as any;
  }
}

