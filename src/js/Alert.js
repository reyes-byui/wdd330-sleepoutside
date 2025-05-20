export default class Alert {
  constructor(jsonPath = "./json/alerts.json") {
    this.jsonPath = jsonPath;
  }

  async showAlerts() {
    try {
      const response = await fetch(this.jsonPath);
      if (!response.ok) return;
      const alerts = await response.json();
      if (!alerts || !alerts.length) return;
      const section = document.createElement("section");
      section.className = "alert-list";
      alerts.forEach(alert => {
        const p = document.createElement("p");
        p.textContent = alert.message;
        p.style.background = alert.background;
        p.style.color = alert.color;
        section.appendChild(p);
      });
      const main = document.querySelector("main");
      if (main) {
        main.prepend(section);
      }
    } catch (e) {
    // Optionally log error
    console.error("Failed to load alerts:", e);
    }
  }
}
