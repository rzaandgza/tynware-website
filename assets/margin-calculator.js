/* No network requests or stored inputs: the calculator runs in this page. */
function calculateQuote(cost, targetMargin) {
  if (!Number.isFinite(cost) || cost < 0 || !Number.isFinite(targetMargin) || targetMargin < 0 || targetMargin >= 100) {
    return null;
  }
  const sellingPrice = cost / (1 - targetMargin / 100);
  const profit = sellingPrice - cost;
  const markup = cost === 0 ? null : (profit / cost) * 100;
  return Number.isFinite(sellingPrice) ? { sellingPrice, profit, markup } : null;
}

if (typeof module !== "undefined" && module.exports) module.exports = { calculateQuote };

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("[data-margin-calculator]");
    if (!form) return;
    const cost = form.querySelector("[name=cost]");
    const margin = form.querySelector("[name=margin]");
    const error = form.querySelector("[data-calculator-error]");
    const fields = Object.fromEntries([...form.querySelectorAll("[data-result]")].map((element) => [element.dataset.result, element]));
    const format = new Intl.NumberFormat("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const update = () => {
      const result = calculateQuote(cost.valueAsNumber, margin.valueAsNumber);
      const valid = Boolean(result) && cost.validity.valid && margin.validity.valid;
      error.hidden = valid;
      for (const key of Object.keys(fields)) fields[key].textContent = valid ? (result[key] === null ? "Not defined" : format.format(result[key]) + (key === "markup" ? "%" : "")) : "—";
    };
    form.addEventListener("input", update);
    form.addEventListener("submit", (event) => event.preventDefault());
    update();
  });
}
