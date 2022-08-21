export interface GetSellerMoneyHistoryResponse {
  returnCode: string,
  message: null | string,
  subMessages: null | string,
  dataCount: number,
  totalCount: number,
  pageNo: number,
  rowsPerPage: number,
  startIndex: number,
  data: SellerMoneyHistory[]
}

interface SellerMoneyHistory {
  "trNo": string, // LO10004836
  "type": "USE",
  "accmUseNo": string, // "202208100007708684"
  "smnyTypNo": string, //"32",
  "accmUseTypGrpNm": "광고비", // 사용유형
  "smnyTypNm": "클릭광고 광고비|+", // 거래내용

  "accmUseTypGrpCd": string, // "adcst"
  "accmUseDvsCd": string, // "03"
  "accmUseDttm": number, // 1660092145000
  "accmUseAmt": number, // -1276

  "smnyTmntDttm": null,
  "accmAmt": null,
  "accmBlnc": null,
  "accmTypGrpCd": null,
  "etc": "",
  "rfdAbleYn": "N",
  "regrNo": null,
  "regrNm": null,
  "regrId": null,
  "useRange": null,
  "vldPrd": null,
  "autoFilYn": "",
  "smnyFilMnsCd": null,
  "smnyFilMnsNm": null,
  "smnyFilMnsCdText": null,
  "filStdAmt": null,
  "autoFilAmt": null,
  "mmFilLmtAmt": null,
  "autoFilStupDttm": null,
  "slDpstSwitCd": "",
  "aplAmt": 0,
  "switAmt": 0,
  "aplDttm": null,
  "switDttm": null,
  "smnyFilDvs": null
}
