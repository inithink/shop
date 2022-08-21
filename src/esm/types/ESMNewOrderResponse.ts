import {ESMOrder} from "./ESMOrder";

export interface ESMNewOrderResponse {
  success: boolean;
  message: string;
  total: number;
  data: ESMOrder[];
}
