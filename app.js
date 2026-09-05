// VIP Quotex Market Scanner
// Basic technical-analysis scanner

function calculateSMA(prices, period) {
  if (prices.length < period) return null;

  const recent = prices.slice(-period);
  return recent.reduce((sum, price) => sum + price, 0) / period;
}

function calculateRSI(prices, period = 14) {
  if (prices.length <= period) return null;

  let gains = 0;
  let losses = 0;

  for (let i = prices.length - period; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];

    if (change > 0) {
      gains += change;
    } else {
      losses += Math.abs(change);
    }
  }

  if (losses === 0) return 100;

  const rs = (gains / period) / (losses / period);
  return 100 - (100 / (1 + rs));
}

function scanMarket(prices) {
  if (!Array.isArray(prices) || prices.length < 15) {
    return {
      signal: "WAIT",
      message: "مزید market data درکار ہے۔"
    };
  }

  const price = prices[prices.length - 1];
  const sma = calculateSMA(prices, 14);
  const rsi = calculateRSI(prices, 14);

  let signal = "WAIT";
  let message = "واضح signal نہیں ملا۔";

  if (price > sma && rsi >= 50 && rsi < 70), {
    signal = "UP";
    message = "Market bullish دکھائی دے رہی ہے۔";
  } else if (price < sma && rsi <= 50 && rsi > 30) {
    signal = "DOWN";
    message = "Market bearish دکھائی دے رہی ہے۔";
  }

  return {
    price: Number(price.toFixed(6)),
    sma: Number(sma.toFixed(6)),
    rsi: Number(rsi.toFixed(2)),
    signal,
    message
  };
}

// Example:
// const prices = [1, 1.01, 1.02, ...];
// console.log(scanMarket(prices));
