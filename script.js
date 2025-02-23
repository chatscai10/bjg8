const apiUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true";

async function fetchCryptoData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        updateTable(data);
    } catch (error) {
        console.error("獲取數據失敗:", error);
    }
}

function updateTable(data) {
    const tableBody = document.getElementById("crypto-table");
    tableBody.innerHTML = "";

    data.forEach(coin => {
        let { rsi, macd, bollinger, movingAverage, atr } = calculateTechnicalIndicators(coin.sparkline_in_7d.price);

        // 計算綜合買賣機率
        let buyProbability = 0;
        let sellProbability = 0;
        let suggestion = "";

        if (rsi < 30) buyProbability += 70;
        if (rsi > 70) sellProbability += 70;

        if (macd === "黃金交叉") buyProbability += 75;
        if (macd === "死亡交叉") sellProbability += 75;

        if (bollinger === "下軌") buyProbability += 65;
        if (bollinger === "上軌") sellProbability += 65;

        if (movingAverage === "黃金交叉") buyProbability += 80;
        if (movingAverage === "死亡交叉") sellProbability += 80;

        if (atr === "高波動") sellProbability += 70;

        if (buyProbability > sellProbability) {
            suggestion = `<span class='buy'>買進 (${buyProbability}%)</span>`;
        } else if (sellProbability > buyProbability) {
            suggestion = `<span class='sell'>賣出 (${sellProbability}%)</span>`;
        } else {
            suggestion = "<span class='observe'>持續觀察 (50%)</span>";
        }

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${coin.name} (${coin.symbol.toUpperCase()})</td>
            <td>$${coin.current_price.toFixed(2)}</td>
            <td>${coin.price_change_percentage_24h.toFixed(2)}%</td>
            <td>$${(coin.market_cap / 1e9).toFixed(2)}B</td>
            <td>${suggestion}</td>
            <td>${generateBacktestResult()}</td>
        `;
        tableBody.appendChild(row);
    });
}

function calculateTechnicalIndicators(priceData) {
    let rsi = calculateRSI(priceData);
    let macd = calculateMACD(priceData);
    let bollinger = calculateBollingerBands(priceData);
    let movingAverage = calculateMovingAverages(priceData);
    let atr = calculateATR(priceData);
    return { rsi, macd, bollinger, movingAverage, atr };
}

function calculateRSI(priceData) {
    let gains = 0, losses = 0;
    for (let i = 1; i < 14; i++) {
        let change = priceData[i] - priceData[i - 1];
        if (change > 0) gains += change;
        else losses -= change;
    }
    let avgGain = gains / 14;
    let avgLoss = losses / 14;
    let rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
}

function calculateMACD(priceData) {
    let ema12 = calculateEMA(priceData, 12);
    let ema26 = calculateEMA(priceData, 26);
    return ema12 > ema26 ? "黃金交叉" : "死亡交叉";
}

function calculateBollingerBands(priceData) {
    let mean = priceData.reduce((a, b) => a + b) / priceData.length;
    let stdDev = Math.sqrt(priceData.map(x => (x - mean) ** 2).reduce((a, b) => a + b) / priceData.length);
    let upperBand = mean + (2 * stdDev);
    let lowerBand = mean - (2 * stdDev);
    let currentPrice = priceData[priceData.length - 1];

    if (currentPrice > upperBand) return "上軌";
    if (currentPrice < lowerBand) return "下軌";
    return "中軌";
}

setInterval(fetchCryptoData, 10000);
fetchCryptoData();
