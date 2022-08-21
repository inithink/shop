import {LotteOnAdsApi} from "./LotteOnAdsApi";

require('dotenv').config();

jest.setTimeout(3 * 60 * 1000);
test('LotteOnAdsApi', async () => {
  let id = process.env['LOTTE_ON_USERNAME']!;
  let password = process.env['LOTTE_ON_PASSWORD']!;
  let api = new LotteOnAdsApi(4468355230);
  await api.login(id, password);

  let json = await api.getSellerMoneyHistory(
    2022, 8, 4,
    2022, 8, 8,
  );
  console.log(json);
});
