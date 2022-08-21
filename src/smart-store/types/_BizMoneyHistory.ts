export interface _BizMoneyHistory {
  settleDt: number;
  customerId: number;
  refundableAmt: number; // 잔액
  nonRefundableAmt: number;
  useRefundableAmt: number; // 소진액
  useNonRefundableAmt: number;
  addRefundableAmt: number;
  addNonRefundableAmt: number;
  refundRefundableAmt: number;
  refundNonRefundableAmt: number;
  returnRefundableAmt: number;
  regTm: number;
}
