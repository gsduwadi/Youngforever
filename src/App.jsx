import React, { useState, useMemo } from "react";

export default function App() {
  const steps = [
    { key: "quantity", label: "Enter Quantity" },
    { key: "moq", label: "Enter MOQ" },
    { key: "fabricCost", label: "Fabric Cost per piece" },
    { key: "laborCost", label: "Labor Cost per piece" },
    { key: "rawMaterialsCost", label: "Raw Materials Cost per piece" },
    { key: "overheadCost", label: "Overhead Cost per piece" },
    { key: "marginPercentage", label: "Margin Percentage (%)" },
    { key: "offerPercentage", label: "Offer / Discount (%)" },
  ];

  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState({});
  const [inputValue, setInputValue] = useState("");

  const currentStep = steps[stepIndex];

  const handleNext = () => {
    if (inputValue === "") return;

    setForm({ ...form, [currentStep.key]: Number(inputValue) });
    setInputValue("");

    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  const calc = useMemo(() => {
    if (stepIndex < steps.length - 1) return null;

    const rawCost =
      (form.fabricCost || 0) +
      (form.laborCost || 0) +
      (form.rawMaterialsCost || 0) +
      (form.overheadCost || 0);

    const quantity = form.quantity || 0;

    const totalCost = rawCost * quantity;
    const profitMargin = rawCost * ((form.marginPercentage || 0) / 100);
    const sellingBefore = rawCost + profitMargin;
    const discount = sellingBefore * ((form.offerPercentage || 0) / 100);
    const finalPrice = sellingBefore - discount;
    const totalFinal = finalPrice * quantity;
    const totalProfit = (finalPrice - rawCost) * quantity;

    return {
      rawCost,
      totalCost,
      finalPrice,
      totalFinal,
      totalProfit,
      moqStatus: quantity >= (form.moq || 0),
    };
  }, [form, stepIndex]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {stepIndex < steps.length ? (
          <>
            <h2>{currentStep.label}</h2>

            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={styles.input}
            />

            <div style={styles.buttons}>
              {stepIndex > 0 && (
                <button onClick={handleBack} style={styles.backBtn}>
                  Back
                </button>
              )}

              <button onClick={handleNext} style={styles.nextBtn}>
                Next
              </button>
            </div>
          </>
        ) : (
          <>
            <h2>Result</h2>

            <p>Raw Cost / Piece: Rs. {calc.rawCost}</p>
            <p>Final Selling Price: Rs. {calc.finalPrice}</p>
            <p>Total Amount: Rs. {calc.totalFinal}</p>
            <p>Total Profit: Rs. {calc.totalProfit}</p>

            <p
              style={{
                color: calc.moqStatus ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {calc.moqStatus
                ? "MOQ Accepted"
                : "Warning: Below MOQ"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    color: "#fff",
    fontFamily: "Arial",
  },
  card: {
    background: "#1e293b",
    padding: "40px",
    borderRadius: "20px",
    width: "350px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginTop: "20px",
    borderRadius: "10px",
    border: "none",
    fontSize: "16px",
  },
  buttons: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
  },
  nextBtn: {
    padding: "10px 20px",
    background: "#f97316",
    border: "none",
    color: "#fff",
    borderRadius: "10px",
    cursor: "pointer",
  },
  backBtn: {
    padding: "10px 20px",
    background: "#64748b",
    border: "none",
    color: "#fff",
    borderRadius: "10px",
    cursor: "pointer",
  },
};
