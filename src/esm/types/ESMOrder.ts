export interface ESMOrder {
  OrderNo: string,
  SellerID: string,
  SiteOrderNo: string,
  SiteIDValue: string,

  BuyerName: string
  OrderAmnt: string // 가격
  OrderQty: number

  GoodsNo: string
  GoodsName: string  // html 상품명 '<span title="대용량 약산성 트리플에스 탈모샴푸 1350ml">대용량 약산성 트리플에스 탈모샴푸 1350ml</span>',
  CartNo: string // 장바구니번호(결제번호)

  // 배송 관련 정보
  DistrType: string // 주문종류: 스마일배송주문, 일반주문
  DeliveryFeeType: string // 선불
  RcverName: string
  RcverInfoCp: string
  RcverInfoHt: string
  ZipCode: string
  RcverInfoAd: string // html 주소 ex <span title="충청북도 청주시 청원구 오창읍 2산단로 167 (오창모아미래도와이드시티) 403동 501호">충청북도 청주시 청원구 오창읍 2산단로 167 (오창모아미래도와이드시티) 403동 501호</span>
  DeliveryMemo: string
  TransDueDate: string // 발송마감일 TransDueDate
}
