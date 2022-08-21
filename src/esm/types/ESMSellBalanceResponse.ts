import {ESMSellBalanceHistory} from "./ESMSellBalanceHistory";

export interface ESMSellBalanceResponse {
  message: string;
  success: boolean;
  total: number;
  data: ESMSellBalanceHistory[];
}
