import {SellerPointHistoryResponse} from "./types/SellerPointHistory";
import {toTwoDigit} from "../common/toTwoDigit";
import {BaseApi} from "../common/BaseApi";

const rsa = require('./rsa');
const iconv = require('iconv-lite');

// TFA_SO_P, aIq5RNJZZxqry%2BEAJeN9MtaGPfgvhQ25ePHleaQPmbc%3D

export class Shop11stAdsApi extends BaseApi {
  constructor(private tfaSoP: string) {
    super();
    this.setCookies('https://login.11st.co.kr', 'TFA_SO_P', tfaSoP);
  }

  async login(id: string, password: string) {
    await this.fetch("https://login.11st.co.kr/auth/front/selleroffice/login.tmall?returnURL=https%3A%2F%2Fsoffice.11st.co.kr%2F", {
      "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      },
    });
    let ftrkey = 'H6e2OANNaUdxbXIJ';
    let res = await this.fetch("https://login.11st.co.kr/auth/front/selleroffice/logincheck.tmall", {
      "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/x-www-form-urlencoded",
      },
      "body": `encryptedLoginName=${rsa.encrypt(id)}&encryptedPassWord=${rsa.encrypt(password)}&crypto=true&ftrkey=${ftrkey}&priority=118&authMethod=login&returnURL=https%3A%2F%2Fsoffice.11st.co.kr%2F&loginName=&passWord=`,
      "method": "POST"
    });
    let utf8Str = iconv.decode(await res.buffer(), 'euc-kr') as string;
    if (utf8Str.indexOf(`location.replace('https://soffice.11st.co.kr/');`) === -1) {
      throw new Error('login failed');
    }
  }

  async getSellerPointHistory(
    startYear: number, startMonth: number, startDate: number,
    endYear: number, endMonth: number, endDate: number,
    page: number, limit: number
  ): Promise<SellerPointHistoryResponse[]> {
    let start = `${startYear}/${toTwoDigit(startMonth)}/${toTwoDigit(startDate)}`;
    let end = `${endYear}/${toTwoDigit(endMonth)}/${toTwoDigit(endDate)}`;
    const res = await this.fetch(`https://soffice.11st.co.kr/loyalty/AuthSellerPointCondition.tmall?method=getSellerPointDtlsList&start=${(page - 1) * limit}&limit=${limit}&startDate=${start}&endDate=${end}&searchApplyDt=TODAY&pntDlClfCd=00&method=getSellerPointDtlsList&isPaging=Y`, {
      "headers": {
        "accept": "text/plain, */*; q=0.01",
        "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      },
      "method": "POST"
    });
    return await res.json();
  }
}

