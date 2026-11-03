/* feezify landing — native JS, no dependencies. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Hero chat: user asks, copilot "types", the read appears. */
  var chat = document.querySelector(".f-chat");
  if (chat) {
    var user = chat.querySelector('[data-stage="1"]');
    var typing = chat.querySelector('[data-stage="2"]');
    var read = chat.querySelector('[data-stage="3"]');
    if (reduced) {
      [user, read].forEach(function (el) { el.classList.add("is-on"); });
      typing.classList.add("is-off");
    } else {
      setTimeout(function () { user.classList.add("is-on"); }, 400);
      setTimeout(function () { typing.classList.add("is-on"); }, 1000);
      setTimeout(function () {
        typing.classList.remove("is-on");
        typing.classList.add("is-off");
        read.classList.add("is-on");
      }, 2600);
    }
  }

  /* The crossing rule, demonstrated: the subjective gates the objective. */
  var demo = document.getElementById("rule-demo");
  if (demo) {
    var scenarios = JSON.parse(demo.querySelector("script[type='application/json']").textContent);
    var buttons = demo.querySelectorAll("[data-scenario]");
    var light = demo.querySelector('[data-role="light"]');
    var verdict = demo.querySelector('[data-role="verdict"]');
    var why = demo.querySelector('[data-role="why"]');

    function show(key) {
      var s = scenarios[key];
      if (!s) return;
      light.className = "f-light f-light--" + s.light;
      verdict.textContent = s.verdict;
      why.textContent = s.why;
      buttons.forEach(function (b) {
        var on = b.dataset.scenario === key;
        b.setAttribute("aria-pressed", String(on));
        b.classList.toggle("c-button--dark", on);
        b.classList.toggle("c-button--dark-outline", !on);
      });
    }

    buttons.forEach(function (b) {
      b.addEventListener("click", function () { show(b.dataset.scenario); });
    });
  }
})();
