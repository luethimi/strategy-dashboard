async function loadSignals() {

    try {

        // Add timestamp to prevent caching
        const response = await fetch(
            "signals.json?t=" + Date.now()
        );

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


/* =========================
   MARKET INFORMATION
   ========================= */

function displayMarketInfo(data) {

    document.getElementById("market-info").textContent =
        `${data.symbol} • ${data.timeframe}`;


    // Get price from the first strategy
    const firstStrategy =
        Object.values(data.strategies)[0];


    if (firstStrategy) {

        document.getElementById("btc-price").textContent =
            `$${firstStrategy.price.toLocaleString(
                "en-US",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            )}`;
    }


    // Last update time
    const generatedAt =
        new Date(data.generated_at);


    document.getElementById("last-update").textContent =
        `Updated ${generatedAt.toLocaleString()}`;
}


/* =========================
   STRATEGY CARDS
   ========================= */

function displayStrategies(data) {

    const container =
        document.getElementById("strategies");


    // Clear existing cards
    container.innerHTML = "";


    // Create one card per strategy
    for (
        const [name, strategy]
        of Object.entries(data.strategies)
    ) {

        const card =
            document.createElement("div");


        card.className =
            "strategy-card";


        card.innerHTML = `

            <div class="strategy-name">
                ${name
                    .replace("_", " ")
                    .toUpperCase()}
            </div>

            <div class="signal">
                ${strategy.signal
                    .replace("_", " ")}
            </div>

            <div class="card-info">

                Price:
                $${strategy.price.toLocaleString(
                    "en-US",
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }
                )}

                <br>

                Candle:
                ${new Date(
                    strategy.candle_time
                ).toLocaleString()}

            </div>
        `;


        container.appendChild(card);
    }
}


/* =========================
   INITIAL LOAD
   ========================= */

// Load immediately
loadSignals();


/* =========================
   REFRESH EVERY 5 MINUTES
   ========================= */

setInterval(
    loadSignals,
    5 * 60 * 1000
);