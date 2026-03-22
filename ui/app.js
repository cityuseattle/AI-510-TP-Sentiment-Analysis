const reviewText = document.getElementById("reviewText");
const minConfidence = document.getElementById("minConfidence");
const predictBtn = document.getElementById("predictBtn");
const sampleBtn = document.getElementById("sampleBtn");
const clearBtn = document.getElementById("clearBtn");
const loading = document.getElementById("loading");
const errorBox = document.getElementById("errorBox");

const deployEnv = document.getElementById("deployEnv");
const cloudProvider = document.getElementById("cloudProvider");
const artifactSource = document.getElementById("artifactSource");
const appVersion = document.getElementById("appVersion");

const sentimentValue = document.getElementById("sentimentValue");
const sourceValue = document.getElementById("sourceValue");
const confidenceValue = document.getElementById("confidenceValue");
const explanationText = document.getElementById("explanationText");

const confidenceBar = document.getElementById("confidenceBar");
const confidencePercent = document.getElementById("confidencePercent");

const healthStatus = document.getElementById("healthStatus");
const artifactsExist = document.getElementById("artifactsExist");
const modelLoaded = document.getElementById("modelLoaded");

function setLoading(isLoading) {
  loading.classList.toggle("hidden", !isLoading);
  predictBtn.disabled = isLoading;
}

function setError(message) {
  errorBox.textContent = message || "";
  errorBox.classList.toggle("hidden", !message);
}

function resetResult() {
  sentimentValue.textContent = "—";
  sentimentValue.className = "pill neutral";
  sourceValue.textContent = "—";
  confidenceValue.textContent = "—";
  explanationText.textContent = "No prediction yet.";
  confidenceBar.style.width = "0%";
  confidencePercent.textContent = "0%";
}

function sentimentClass(sentiment) {
  if (sentiment === "positive") return "positive";
  if (sentiment === "negative") return "negative";
  return "neutral";
}

async function loadInfo() {
  try {
    const res = await fetch("/info");
    const data = await res.json();

    deployEnv.textContent = data.deploy_env ?? "unknown";
    cloudProvider.textContent = data.cloud_provider ?? "unknown";
    artifactSource.textContent = data.artifact_source ?? "unknown";
    appVersion.textContent = data.version ?? "unknown";
    minConfidence.value = data.default_min_confidence ?? 0.55;
  } catch (err) {
    setError("Failed to load app info.");
  }
}

async function loadHealth() {
  try {
    const res = await fetch("/health");
    const data = await res.json();

    healthStatus.textContent = data.status ?? "unknown";
    artifactsExist.textContent = String(data.artifacts_exist);
    modelLoaded.textContent = String(data.model_loaded);
  } catch (err) {
    healthStatus.textContent = "unavailable";
    artifactsExist.textContent = "unavailable";
    modelLoaded.textContent = "unavailable";
  }
}

async function predictSentiment() {
  setError("");
  setLoading(true);

  try {
    const payload = {
      text: reviewText.value,
      min_confidence: parseFloat(minConfidence.value)
    };

    async function predict(text) {
    const res = await fetch(`${window.API_BASE}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    });
        return res.json();
    }   
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || "Prediction failed.");
    }

    const sentiment = data.sentiment || "neutral";
    const confidence = data.confidence;

    sentimentValue.textContent = sentiment;
    sentimentValue.className = `pill ${sentimentClass(sentiment)}`;

    sourceValue.textContent = data.source || "unknown";
    explanationText.textContent = data.explanation || "No explanation provided.";

    if (confidence === null || confidence === undefined) {
      confidenceValue.textContent = "N/A";
      confidenceBar.style.width = "0%";
      confidencePercent.textContent = "0%";
    } else {
      const pct = Math.round(Number(confidence) * 100);
      confidenceValue.textContent = confidence.toFixed(4);
      confidenceBar.style.width = `${pct}%`;
      confidencePercent.textContent = `${pct}%`;
    }

    await loadHealth();
  } catch (err) {
    setError(err.message || "Something went wrong.");
    resetResult();
  } finally {
    setLoading(false);
  }
}

predictBtn.addEventListener("click", predictSentiment);

sampleBtn.addEventListener("click", () => {
  reviewText.value = "I love this app. It is easy to use and works really well.";
});

clearBtn.addEventListener("click", () => {
  reviewText.value = "";
  setError("");
  resetResult();
});

loadInfo();
loadHealth();
resetResult();