// Past-miss cards: open every collapsed "other two options" before printing,
// so a printed lesson always shows the full question.
addEventListener("beforeprint", () => document.querySelectorAll(".mc details").forEach(d => { d.open = true; }));
