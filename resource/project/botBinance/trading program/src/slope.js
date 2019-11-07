var slopes = {};


slopes['ETHBTC'] = [
    {inf : -1000, sup : -0.128, pctBuy : -3, pctSell : 0.25, pctSellSecurity : -1},
    {inf : -0.128, sup : -0.032, pctBuy : -1, pctSell : 1, pctSellSecurity : -2},
    {inf : -0.032, sup : 0.044, pctBuy : -0.5, pctSell : 0.5, pctSellSecurity : -2},
    {inf : 0.044, sup : 0.137, pctBuy : -0.5, pctSell : 0.75, pctSellSecurity : -2},
    {inf : 0.137, sup : 1000, pctBuy : -0.5, pctSell : 0.5, pctSellSecurity : -3}
];
slopes['LTCBTC'] = [
    {inf : -1000, sup : -0.128, pctBuy : -1, pctSell : 0.5, pctSellSecurity : -3},
    {inf : -0.128, sup : -0.032, pctBuy : -0.5, pctSell : 1, pctSellSecurity : -3},
    {inf : -0.032, sup : 0.044, pctBuy : -0.5, pctSell : 1, pctSellSecurity : -3},
    {inf : 0.044, sup : 0.137, pctBuy : -0.5, pctSell : 0.5, pctSellSecurity : -3},
    {inf : 0.137, sup : 1000, pctBuy : -1, pctSell : 1, pctSellSecurity : -3}
];
slopes['BTCUSDT'] = [
    { inf: -1000, sup: -0.128, pctBuy: -1, pctSell: 0.75, pctSellSecurity: -3},
    { inf: -0.128, sup: -0.032, pctBuy: -1, pctSell: 0.5, pctSellSecurity: -1 },
    { inf: -0.032, sup: 0.044, pctBuy: -0.25, pctSell: 0.25, pctSellSecurity: -3},
    { inf: 0.044, sup: 0.137, pctBuy: -0.5, pctSell: 0.5, pctSellSecurity: -3},
    { inf: 0.137, sup: 1000, pctBuy: -0.25, pctSell: 1, pctSellSecurity: -3}
];
slopes['NANOBTC'] = [
    {inf : -1000, sup : -0.128, pctBuy : -2, pctSell : 1, pctSellSecurity : -2},
    {inf : -0.128, sup : -0.032, pctBuy : -1, pctSell : 1, pctSellSecurity : -3},
    {inf : -0.032, sup : 0.044, pctBuy : -1, pctSell : 1, pctSellSecurity : -3},
    {inf : 0.044, sup : 0.137, pctBuy : -0.5, pctSell : 1, pctSellSecurity : -3},
    {inf : 0.137, sup : 1000, pctBuy : -2, pctSell : 1, pctSellSecurity : -3}
];
slopes['ICXBTC'] = [
    {inf : -1000, sup : -0.128, pctBuy : -3, pctSell : 1, pctSellSecurity : -3},
    {inf : -0.128, sup : -0.032, pctBuy : -0.5, pctSell : 0.75, pctSellSecurity : -3},
    {inf : -0.032, sup : 0.044, pctBuy : -0.25, pctSell : 0.75, pctSellSecurity : -3},
    {inf : 0.044, sup : 0.137, pctBuy : -0.5, pctSell : 1, pctSellSecurity : -3},
    {inf : 0.137, sup : 1000, pctBuy : -2, pctSell : 0.75, pctSellSecurity : -3}
];
slopes['TRXBTC'] = [
    {inf : -1000, sup : -0.128, pctBuy : -1, pctSell : 0.25, pctSellSecurity : -3},
    {inf : -0.128, sup : -0.032, pctBuy : -0.5, pctSell : 0.5, pctSellSecurity : -3},
    {inf : -0.032, sup : 0.044, pctBuy : -1, pctSell : 0.75, pctSellSecurity : -1},
    {inf : 0.044, sup : 0.137, pctBuy : -0.25, pctSell : 1, pctSellSecurity : -3},
    {inf : 0.137, sup : 1000, pctBuy : -2, pctSell : 0.75, pctSellSecurity : -3}
];

module.exports = slopes;
