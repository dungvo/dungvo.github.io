(() => {
  "use strict";
  const status = document.getElementById("libraryStatus");
  const quoteMetric = document.getElementById("quoteMetric");
  const storyMetric = document.getElementById("storyMetric");

  async function start() {
    try {
      const manifestResponse = await fetch("perspective-library/authoring/vi/manifest.json", { cache: "no-store" });
      if (!manifestResponse.ok) throw new Error(String(manifestResponse.status));
      const manifest = await manifestResponse.json();
      const quoteDescriptors = manifest.files.filter(file => file.kind === "quote_pack");
      const storyCount = manifest.files.filter(file => file.kind === "story").length;
      const quotePacks = await Promise.all(quoteDescriptors.map(async descriptor => {
        const response = await fetch(`perspective-library/authoring/vi/${descriptor.path}`, { cache: "no-store" });
        if (!response.ok) throw new Error(String(response.status));
        return response.json();
      }));
      const quoteCount = quotePacks.reduce((total, pack) => total + pack.quotes.length, 0);
      quoteMetric.textContent = `${quoteCount} quote`;
      storyMetric.textContent = `${storyCount} story`;
      status.textContent = `Authoring r${manifest.library_revision} · ${quoteCount} quote · ${storyCount} story`;
    } catch {
      status.textContent = "Authoring Library tạm thời chưa kết nối";
    }
  }
  start();
})();
