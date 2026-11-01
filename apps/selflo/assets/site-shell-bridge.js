(() => {
  "use strict";
  // Shared navigation for legacy Public pages and Studio tools.
  // Core Public/Studio pages already render this same shell at build time.
  const root = "/apps/selflo/";
  const studioRoot = root + "studio/";
  const path = window.location.pathname;
  const studio = path.startsWith(studioRoot);
  const base = studio ? studioRoot : root;
  const firstParty = [
    {key:"home", label:"Trang chủ", url:base},
    {key:"perspectives", label:"Góc nhìn", url:base+"perspectives/"},
    {key:"support", label:"Hỗ trợ", url:base+"support/"},
    {key:"privacy", label:"Quyền riêng tư", url:base+"privacy/"}
  ];
  const sections = studio ? [...firstParty, {key:"developer",label:"Developer",url:studioRoot+"developer/"}] : firstParty;
  const active = path===base||path===base+"index.html" ? "home"
    : path.startsWith(base+"perspectives/") ? "perspectives"
    : path.startsWith(base+"support/") ? "support"
    : path.startsWith(base+"privacy/") || path.startsWith(root+"privacy-policy/") ? "privacy"
    : studio ? "developer" : null;

  function mount() {
    if (!document.body || document.querySelector("[data-selflo-bridge]")) return;
    const header = document.createElement("header");
    header.className = "selflo-site-header selflo-shell-bridge";
    header.dataset.selfloBridge = studio ? "studio" : "public";
    header.innerHTML = `
      <a class="selflo-shell-brand" href="${base}" aria-label="Selflo — Trang chủ">
        <img src="${root}assets/images/public/selflo-leaf-mark.svg" alt="" width="23" height="23">
        <span>Selflo</span>
      </a>
      <button class="selflo-shell-toggle" type="button" aria-label="Mở điều hướng"
        aria-expanded="false" aria-controls="selflo-bridge-navigation">☰</button>
      <nav id="selflo-bridge-navigation" aria-label="${studio ? "Điều hướng Studio" : "Điều hướng chính"}">
        ${sections.map(item => `<a href="${item.url}"${active===item.key?' class="active" aria-current="page"':''}>${item.label}</a>`).join("")}
      </nav>
      <span class="selflo-bridge-context">${studio ? "Studio · Công cụ" : "Selflo · Một khoảng lặng"}</span>`;
    document.body.prepend(header);
    document.body.classList.add("selflo-shell-bridged", studio ? "selflo-bridge-studio" : "selflo-bridge-public");
    const toggle = header.querySelector(".selflo-shell-toggle");
    const navigation = header.querySelector("nav");
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      navigation.classList.toggle("open", !open);
    });
    navigation.addEventListener("click", event => {
      if (event.target.closest("a")) {
        toggle.setAttribute("aria-expanded", "false");
        navigation.classList.remove("open");
      }
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        toggle.setAttribute("aria-expanded", "false");
        navigation.classList.remove("open");
      }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, {once:true});
  else mount();
})();
