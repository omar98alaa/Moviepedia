document.querySelector("form")?.addEventListener("submit", (ev) => {
  ev.preventDefault();

  window.location.replace("/index.html");
});
