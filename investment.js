const companyData = {
  apple: {
    name: "Apple",
    summary: "Large-cap technology company with strong brand loyalty and durable cash generation.",
    marketCap: "$2.9T",
    revenueGrowth: "6%",
    profitMargin: "25%",
    peRatio: "29",
    revenue: "$383B",
    netIncome: "$97B",
    operatingMargin: "30%",
    currentRatio: "1.0",
    debtToEquity: "1.7",
    freeCashFlow: "$100B",
    strength: "Apple combines premium pricing, ecosystem retention, and reliable free cash flow.",
    risk: "Growth can slow when hardware upgrade cycles weaken or international demand cools.",
    accountingView:
      "Apple shows strong profitability and cash generation, though its current ratio is not especially high and leverage should still be monitored.",
    recommendation: "Buy",
    explanation:
      "Apple looks attractive because it pairs strong profitability with a resilient business model. The valuation is not cheap, but the company still shows enough quality and stability to support a buy recommendation.",
  },
  microsoft: {
    name: "Microsoft",
    summary: "Diversified technology leader with strong cloud demand and recurring enterprise revenue.",
    marketCap: "$3.1T",
    revenueGrowth: "15%",
    profitMargin: "36%",
    peRatio: "34",
    revenue: "$245B",
    netIncome: "$88B",
    operatingMargin: "45%",
    currentRatio: "1.8",
    debtToEquity: "0.4",
    freeCashFlow: "$74B",
    strength: "Its cloud, software, and AI-related businesses create multiple revenue streams with strong margins.",
    risk: "The stock can look expensive when investor expectations for AI growth run ahead of actual results.",
    accountingView:
      "Microsoft stands out for a strong balance sheet, excellent margins, and healthy liquidity, which is the kind of financial profile an accountant would like to see.",
    recommendation: "Buy",
    explanation:
      "Microsoft earns a buy rating because growth and profitability are both strong. Even with a richer valuation, the business quality and broad enterprise footprint make it compelling.",
  },
  nvidia: {
    name: "NVIDIA",
    summary: "Semiconductor company benefiting from heavy AI infrastructure demand.",
    marketCap: "$2.2T",
    revenueGrowth: "65%",
    profitMargin: "49%",
    peRatio: "58",
    revenue: "$61B",
    netIncome: "$30B",
    operatingMargin: "55%",
    currentRatio: "3.3",
    debtToEquity: "0.2",
    freeCashFlow: "$27B",
    strength: "NVIDIA has exceptional growth and industry leadership in high-demand AI chips.",
    risk: "Its valuation is elevated, so any slowdown in AI spending could pressure the stock sharply.",
    accountingView:
      "NVIDIA has very strong margins, liquidity, and low leverage, but the stock price already reflects a lot of that strength.",
    recommendation: "Hold",
    explanation:
      "NVIDIA looks strong operationally, but the stock is priced for very high expectations. That makes hold a more balanced call than buy for someone deciding today.",
  },
  doterra: {
    name: "doTERRA",
    summary: "Privately held wellness company, so public market investment statistics are limited.",
    marketCap: "Private",
    revenueGrowth: "N/A",
    profitMargin: "N/A",
    peRatio: "N/A",
    revenue: "Private",
    netIncome: "Private",
    operatingMargin: "N/A",
    currentRatio: "N/A",
    debtToEquity: "N/A",
    freeCashFlow: "N/A",
    strength: "The company has a recognized brand and global business presence.",
    risk: "Because it is private, investors cannot easily access the same public market data used for stock analysis.",
    accountingView:
      "An accountant would want audited statements, cash flow details, leverage data, and margin trends before making any serious investment judgment.",
    recommendation: "Avoid",
    explanation:
      "A buy recommendation is not appropriate here because doTERRA is not publicly traded in the same way as listed stocks. Without public valuation and reporting data, it is harder to make a normal investment decision from stock metrics.",
  },
};

const stockForm = document.getElementById("stockForm");
const companyInput = document.getElementById("companyInput");
const companyName = document.getElementById("companyName");
const companySummary = document.getElementById("companySummary");
const statsGrid = document.getElementById("statsGrid");
const statementGrid = document.getElementById("statementGrid");
const strengthNote = document.getElementById("strengthNote");
const riskNote = document.getElementById("riskNote");
const accountingNote = document.getElementById("accountingNote");
const recommendationText = document.getElementById("recommendationText");
const suggestionText = document.getElementById("suggestionText");
const recommendationBadge = document.getElementById("recommendationBadge");
const quickButtons = document.querySelectorAll(".quick-btn");

function recommendationClass(recommendation) {
  return recommendation.toLowerCase();
}

function levenshteinDistance(first, second) {
  const rows = first.length + 1;
  const cols = second.length + 1;
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let row = 0; row < rows; row += 1) {
    matrix[row][0] = row;
  }

  for (let col = 0; col < cols; col += 1) {
    matrix[0][col] = col;
  }

  for (let row = 1; row < rows; row += 1) {
    for (let col = 1; col < cols; col += 1) {
      const cost = first[row - 1] === second[col - 1] ? 0 : 1;
      matrix[row][col] = Math.min(
        matrix[row - 1][col] + 1,
        matrix[row][col - 1] + 1,
        matrix[row - 1][col - 1] + cost,
      );
    }
  }

  return matrix[first.length][second.length];
}

function findSuggestions(name) {
  const search = name.trim().toLowerCase();
  if (!search) {
    return Object.values(companyData)
      .slice(0, 3)
      .map((company) => company.name);
  }

  return Object.values(companyData)
    .map((company) => ({
      name: company.name,
      score: levenshteinDistance(search, company.name.toLowerCase()),
    }))
    .sort((left, right) => left.score - right.score)
    .slice(0, 3)
    .map((company) => company.name);
}

function renderCompany(data) {
  companyName.textContent = data.name;
  companySummary.textContent = data.summary;
  strengthNote.textContent = data.strength;
  riskNote.textContent = data.risk;
  accountingNote.textContent = data.accountingView;
  recommendationText.textContent = data.explanation;
  suggestionText.textContent = `You can also compare ${findSuggestions(data.name).join(", ")}.`;
  recommendationBadge.textContent = data.recommendation;
  recommendationBadge.className = `recommendation ${recommendationClass(data.recommendation)}`;

  statsGrid.innerHTML = `
    <div class="stat-card"><span>Market Cap</span><strong>${data.marketCap}</strong></div>
    <div class="stat-card"><span>Revenue Growth</span><strong>${data.revenueGrowth}</strong></div>
    <div class="stat-card"><span>Profit Margin</span><strong>${data.profitMargin}</strong></div>
    <div class="stat-card"><span>P/E Ratio</span><strong>${data.peRatio}</strong></div>
  `;

  statementGrid.innerHTML = `
    <div class="stat-card"><span>Revenue</span><strong>${data.revenue}</strong></div>
    <div class="stat-card"><span>Net Income</span><strong>${data.netIncome}</strong></div>
    <div class="stat-card"><span>Operating Margin</span><strong>${data.operatingMargin}</strong></div>
    <div class="stat-card"><span>Current Ratio</span><strong>${data.currentRatio}</strong></div>
    <div class="stat-card"><span>Debt to Equity</span><strong>${data.debtToEquity}</strong></div>
    <div class="stat-card"><span>Free Cash Flow</span><strong>${data.freeCashFlow}</strong></div>
  `;
}

function lookupCompany(name) {
  const key = name.trim().toLowerCase();
  return companyData[key];
}

stockForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const match = lookupCompany(companyInput.value);

  if (!match) {
    const suggestions = findSuggestions(companyInput.value);
    companyName.textContent = "Company not found";
    companySummary.textContent = "No exact match was found in the sample list.";
    strengthNote.textContent = "Use one of the available example companies to view the sample analysis.";
    riskNote.textContent = "This page uses a small built-in dataset rather than live market data.";
    accountingNote.textContent = "For a full accounting review, the next step would be comparing audited statements and multi-year trends.";
    recommendationText.textContent =
      "No recommendation is available for a company outside the sample list yet.";
    suggestionText.textContent = `Closest matches: ${suggestions.join(", ")}.`;
    recommendationBadge.textContent = "N/A";
    recommendationBadge.className = "recommendation hold";
    statsGrid.innerHTML = `
      <div class="stat-card"><span>Market Cap</span><strong>N/A</strong></div>
      <div class="stat-card"><span>Revenue Growth</span><strong>N/A</strong></div>
      <div class="stat-card"><span>Profit Margin</span><strong>N/A</strong></div>
      <div class="stat-card"><span>P/E Ratio</span><strong>N/A</strong></div>
    `;
    statementGrid.innerHTML = `
      <div class="stat-card"><span>Revenue</span><strong>N/A</strong></div>
      <div class="stat-card"><span>Net Income</span><strong>N/A</strong></div>
      <div class="stat-card"><span>Operating Margin</span><strong>N/A</strong></div>
      <div class="stat-card"><span>Current Ratio</span><strong>N/A</strong></div>
      <div class="stat-card"><span>Debt to Equity</span><strong>N/A</strong></div>
      <div class="stat-card"><span>Free Cash Flow</span><strong>N/A</strong></div>
    `;
    return;
  }

  renderCompany(match);
});

quickButtons.forEach((button) => {
  button.addEventListener("click", () => {
    companyInput.value = button.dataset.company || "";
    const match = lookupCompany(companyInput.value);
    if (match) {
      renderCompany(match);
    }
  });
});

renderCompany(companyData.apple);
