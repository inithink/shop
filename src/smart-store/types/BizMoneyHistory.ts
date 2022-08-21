export interface BizMoneyHistory {
  settleDt: Date; // 기간
  customerId: number;
  refundableAmt: number; // 잔액
  nonRefundableAmt: number;
  useRefundableAmt: number; // 소진액
  useNonRefundableAmt: number;
  addRefundableAmt: number; // 충전액
  addNonRefundableAmt: number;
  refundRefundableAmt: number; // 환불...?
  refundNonRefundableAmt: number;
  returnRefundableAmt: number;
  regTm: Date;
}
