const archContent = {
  sensor: {
    title: "Sensor Layer",
    copy: "Low-profile modules capture acceleration, angular velocity, plantar pressure, and local muscle activation. Timestamp alignment keeps each movement phase comparable across athletes."
  },
  edge: {
    title: "Edge Hub",
    copy: "A compact sideline hub denoises streams, segments strides, extracts impact windows, and transmits only structured movement features when bandwidth is constrained."
  },
  model: {
    title: "Deep Model",
    copy: "A CNN-LSTM backbone learns local movement patterns and longer fatigue trends, while an attention head highlights the sequence moments that drive the forecast."
  },
  action: {
    title: "Action Layer",
    copy: "Risk states become coach alerts, medical review notes, athlete trend cards, and return-to-play evidence for prevention-focused decision making."
  }
};

const hotspotContent = {
  imu: {
    label: "Primary sensor",
    title: "6-axis IMU pod",
    copy: "Tracks tibial acceleration, knee rotation velocity, landing shock, and deceleration spikes during cutting and jump landings."
  },
  valgus: {
    label: "Strain zone",
    title: "Valgus tension band",
    copy: "Elastic conductive paths estimate medial-lateral knee loading and help flag risky collapse patterns under fatigue."
  },
  emg: {
    label: "Muscle input",
    title: "Surface EMG patch",
    copy: "Measures hamstring and quadriceps activation timing so the model can detect neuromuscular delay before high-risk movement."
  },
  pressure: {
    label: "Foot sync",
    title: "Pressure-linked stride phase",
    copy: "Foot pressure synchronization marks heel strike, toe-off, and landing phases for cleaner temporal windows."
  }
};

const pipelineContent = {
  1: ["Acquire multimodal streams", "Collect synchronized IMU, pressure, EMG, and fatigue markers at session level, with athlete metadata separated from model inputs for privacy-aware analysis."],
  2: ["Clean and calibrate", "Apply sensor drift correction, outlier filtering, stride normalization, and missing-sample interpolation before feature learning."],
  3: ["Create movement windows", "Segment landings, pivots, sprint decelerations, and cutting maneuvers into short windows with pre-event and post-event context."],
  4: ["Train temporal models", "Compare CNN-LSTM, transformer encoder, and hybrid attention networks against athlete-independent validation folds."],
  5: ["Forecast intervention states", "Output safe, caution, or intervention alerts with confidence, trend direction, and explanatory signal contributions."]
};

const dashboardContent = {
  training: ["Training load scan", "Monitors drill intensity and flags asymmetry when repeated cuts increase tibial rotation beyond personal baseline."],
  match: ["Match intervention view", "Prioritizes fast sideline alerts, player location, and short-term risk spikes during high-speed play transitions."],
  rehab: ["Return-to-play evidence", "Tracks controlled workload progression, movement confidence, and residual asymmetry across rehab sessions."]
};

const progressBar = document.querySelector("#progressBar");
const riskRing = document.querySelector(".risk-ring");
const riskValue = document.querySelector("#riskValue");
const riskLabel = document.querySelector("#riskLabel");
const valgusMetric = document.querySelector("#valgusMetric");
const impulseMetric = document.querySelector("#impulseMetric");
const fatigueMetric = document.querySelector("#fatigueMetric");

function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
  progressBar.style.width = `${percent}%`;
}

function bindChoiceButtons(selector, content, render) {
  document.querySelectorAll(selector).forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(selector).forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      render(content[button.dataset.arch || button.dataset.hotspot || button.dataset.stage || button.dataset.mode]);
    });
  });
}

bindChoiceButtons(".arch-node", archContent, (item) => {
  document.querySelector("#archDetail").innerHTML = `<h3>${item.title}</h3><p>${item.copy}</p>`;
});

bindChoiceButtons(".hotspot", hotspotContent, (item) => {
  document.querySelector("#hotspotPanel").innerHTML = `<span>${item.label}</span><h3>${item.title}</h3><p>${item.copy}</p>`;
});

bindChoiceButtons(".stage", pipelineContent, (item) => {
  document.querySelector("#pipelineDetail").innerHTML = `<h3>${item[0]}</h3><p>${item[1]}</p>`;
});

bindChoiceButtons(".dash-toolbar button", dashboardContent, (item) => {
  document.querySelector("#dashTitle").textContent = item[0];
  document.querySelector("#dashCopy").textContent = item[1];
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const target = entry.target;
    const finalValue = Number(target.dataset.count);
    let current = 0;
    const step = Math.max(1, Math.ceil(finalValue / 38));
    const timer = setInterval(() => {
      current = Math.min(finalValue, current + step);
      target.textContent = current;
      if (current === finalValue) clearInterval(timer);
    }, 28);
    countObserver.unobserve(target);
  });
}, { threshold: 0.5 });

document.querySelectorAll("[data-count]").forEach((item) => countObserver.observe(item));

setInterval(() => {
  const risk = Math.round(34 + Math.random() * 38);
  const label = risk > 58 ? "Elevated" : risk > 43 ? "Moderate" : "Stable";
  riskRing.style.setProperty("--risk", risk);
  riskValue.textContent = `${risk}%`;
  riskLabel.textContent = label;
  riskLabel.style.color = risk > 58 ? "#ff6b5f" : risk > 43 ? "#1fb7b0" : "#5f9f28";
  valgusMetric.textContent = `${(8 + Math.random() * 8).toFixed(1)} deg`;
  impulseMetric.textContent = `${(1.6 + Math.random() * 1.1).toFixed(1)} kN`;
  fatigueMetric.textContent = `${Math.round(12 + Math.random() * 20)}%`;
}, 2400);

const navLinks = [...document.querySelectorAll(".section-nav a")];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-40% 0px -55% 0px" });

document.querySelectorAll("section[id]").forEach((section) => sectionObserver.observe(section));
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();
