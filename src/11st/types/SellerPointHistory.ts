export interface SellerPointHistoryResponse {
  totCnt: number;
  Record: Array<SellerPointHistory>;
}

interface SellerPointHistory {
  index: string;
  pntDlTypNm: string,
  exprDy: string,
  pnt: string,
  pntDlClfCd: string,
  pntDlTypCd: string,
  dlTypCd: string,
  dlDt: string,
  dlCont: string,
  totPnt: string,
  pntSelObjNo1: number,
  pntSelNo: number,
  cardRefundableYn: string
}
