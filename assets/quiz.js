// Shared quiz renderer. A lesson defines `const QUIZ = [...]` inline (so
// tutor/build/check-quiz.js can gate it), adds <div class="quiz" id="quiz">,
// then loads this file after the QUIZ script.
(function () {
  const LAB = ["A", "B", "C", "D"];
  const root = document.getElementById("quiz");
  QUIZ.forEach((q, qi) => {
    const div = document.createElement("div");
    div.className = "q";
    div.innerHTML = `<p class="stem"><span class="qn">Q${qi + 1}</span>${q.stem}</p>` +
      `<div class="opts">` + q.opts.map((o, oi) => `<button class="opt" data-q="${qi}" data-o="${oi}"><span class="lab">${LAB[oi]}</span><span>${o}</span><span class="mk"></span></button>`).join("") + `</div>` +
      `<div class="fb" id="fb-${qi}"></div>`;
    root.appendChild(div);
  });
  root.addEventListener("click", e => {
    const btn = e.target.closest(".opt");
    if (!btn) return;
    const qi = +btn.dataset.q, oi = +btn.dataset.o, q = QUIZ[qi];
    const wrap = btn.closest(".q");
    if (wrap.dataset.done) return;
    wrap.dataset.done = "1";
    wrap.querySelectorAll(".opt").forEach((b, bi) => {
      b.disabled = true;
      if (bi === q.ok) { b.classList.add("correct"); b.querySelector(".mk").textContent = "✓"; }
      if (bi === oi && oi !== q.ok) { b.classList.add("wrong"); b.querySelector(".mk").textContent = "✗"; }
    });
    const fb = document.getElementById("fb-" + qi);
    fb.innerHTML = (oi === q.ok ? "<b>Correct.</b> " : "<b>Not quite.</b> ") + q.fb;
    fb.setAttribute("data-show", "1");
  });
})();
