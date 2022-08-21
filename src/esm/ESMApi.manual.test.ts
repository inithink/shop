import {ESMApi} from "./ESMApi";

require('dotenv').config();

jest.setTimeout(3 * 60 * 1000);
test('ESMApi', async () => {
  let esmApi = new ESMApi();
  let id = process.env['ESM_USERNAME']!;
  let password = process.env['ESM_PASSWORD']!;
  await esmApi.login(id, password);

  let histories = await esmApi.getGMarketSellBalanceHistory(
    2022, 7, 6,
    2022, 8, 6,
    1, 1000,
  );
  console.log(histories);

  histories = await esmApi.getAuctionSellBalanceHistory(
    2022, 7, 6,
    2022, 8, 6,
    1, 1000,
  );
  console.log(histories);
});
