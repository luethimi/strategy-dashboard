async function loadSignals() {
    try {
        const response = await fetch("signals.json");

        if (!response.ok) {
            throw new Error("Could not load signals.json");
        }

        const data = await response.json();

        displayMarketInfo(data);
        displayStrategies(data);

    } catch (error) {
        console.error(error);

        document.getElementById("market-info").textContent =
            "Unable to load signal data";
    }
}


function displayMarketInfo(data) {
    document.getElementById("market-info").textContent =
        `${data.symbol} • ${data.timeframe}`;

    document.getElementById("btc-price").textContent =
        `$${data.strategies.strategy_01.price.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;

    const generatedAt = new Date(data.generated_at);

    document.getElementById("last-update").textContent =
        `Updated ${generatedAt.toLocaleString()}`;
}


function displayStrategies(data) {
    const container = document.getElementById("strategies");

    container.innerHTML = "";

    for (const [name, strategy] of Object.entries(data.strategies)) {

        const card = document.createElement("div");

        card.className = "strategy-card";

        card.innerHTML = `
            <div class="strategy-name">
                ${name.replace("_", " ").toUpperCase()}
            </div>

            <div class="signal">
                ${strategy.signal.replace("_", " ")}
            </div>

            <div class="card-info">
                Price: $${strategy.price.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}<br>

                Candle: ${new Date(strategy.candle_time).toLocaleString()}
            </div>
        `;

        container.appendChild(card);
    }
}


loadSignals();