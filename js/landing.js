/* ImagiEndo · landing page. Script independente: não altera a plataforma. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* menu móvel */
  var burger = $("#burger"), menu = $("#menu");
  function setMenu(open) {
    menu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  }
  burger.addEventListener("click", function () { setMenu(!menu.classList.contains("open")); });
  $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  /* laboratório: alterna imagem, título e texto */
  var tabs = $$("#labTabs button"), img = $("#labImg"), ttl = $("#labTitle"), txt = $("#labText");
  tabs.forEach(function (b) {
    b.addEventListener("click", function () {
      tabs.forEach(function (x) { x.classList.toggle("on", x === b); x.setAttribute("aria-selected", x === b ? "true" : "false"); });
      img.classList.add("swap");
      setTimeout(function () {
        img.src = "assets/dente-" + b.dataset.img + ".svg";
        img.alt = "Ilustração esquemática: " + b.dataset.title;
        ttl.textContent = b.dataset.title; txt.textContent = b.dataset.text;
        img.classList.remove("swap");
      }, 180);
    });
  });

  /* composição 3D do hero: acompanha o ponteiro (só com mouse e sem "reduzir movimento") */
  var vis = $("#heroVisual"), scene = vis && $(".scene", vis);
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (scene && !reduce && window.matchMedia && matchMedia("(hover:hover)").matches) {
    var hero = $("#inicio");
    hero.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      scene.style.setProperty("--ry", (-18 + x * 14).toFixed(1) + "deg");
      scene.style.setProperty("--rx", (8 - y * 10).toFixed(1) + "deg");
    });
    hero.addEventListener("mouseleave", function () { scene.style.removeProperty("--ry"); scene.style.removeProperty("--rx"); });
  }

  /* revelar ao rolar (se o navegador não suportar, tudo fica visível) */
  var els = $$(".sec-head, .card, .pills, .ticks, .cta-box");
  if ("IntersectionObserver" in window && !reduce) {
    els.forEach(function (el) { el.classList.add("rv"); });
    var io = new IntersectionObserver(function (items) {
      items.forEach(function (it) { if (it.isIntersecting) { var t = it.target; t.classList.add("in"); io.unobserve(t); setTimeout(function () { t.classList.remove("rv", "in"); }, 800); } });
    }, { threshold: .12 });
    els.forEach(function (el) { io.observe(el); });
  }
})();
