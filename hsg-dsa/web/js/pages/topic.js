/* Trang chủ đề: lý thuyết 8 mục + mô phỏng + danh sách bài */
(async function () {
  "use strict";
  const H = window.HSG;
  const { $, esc, Progress } = H;
  H.initPage("topic");

  const id = H.qs("id") || "complexity";
  let topics;
  try { topics = await H.getJSON("/content/topics/index.json"); } catch (e) { return; }
  const ready = topics.filter((t) => t.status === "ready");
  const topic = topics.find((t) => t.id === id);
  const pick = $("#topic-pick");
  pick.innerHTML = topics.map((t) => `<option value="${t.id}" ${t.status !== "ready" ? "disabled" : ""}>${t.status !== "ready" ? "(sắp có) " : ""}N${t.day} · ${esc(t.title)}</option>`).join("");
  pick.value = id;
  pick.onchange = () => (location.href = "topic.html?id=" + pick.value);
  if (!topic || topic.status !== "ready") {
    $("#content").innerHTML = '<div class="empty">Chủ đề này sẽ có ở lượt sau. <a href="index.html">Về lộ trình</a></div>';
    return;
  }
  document.title = topic.title + " — Ôn thi HSG";
  $("#day-badge").textContent = "Ngày " + topic.day;

  const src = await H.getText(`/content/topics/${id}.md`);
  const box = $("#content");
  box.innerHTML = H.md(src);
  H.wireCopy(box);

  // ---- mục lục
  $("#toc").innerHTML = Array.from(box.querySelectorAll("h2")).map((h) => `<a href="#${h.id}">${esc(h.textContent)}</a>`).join("");

  // ---- mô phỏng: nạp file js/sims/<id>.js rồi gắn vào các ô [[SIM:tên]]
  const simSlots = box.querySelectorAll('[data-slot="SIM"]');
  if (simSlots.length) {
    await new Promise((ok) => {
      const s = document.createElement("script");
      s.src = `js/sims/${id}.js`;
      s.onload = ok;
      s.onerror = ok;
      document.body.appendChild(s);
    });
    simSlots.forEach((slot) => {
      const f = window.SIMS[slot.dataset.arg];
      if (f) f(slot);
      else slot.innerHTML = `<div class="banner">Không tìm thấy mô phỏng "${esc(slot.dataset.arg)}"</div>`;
    });
  }

  // ---- danh sách bài tập
  let probs = [];
  try { probs = await H.api("/api/problems"); } catch (e) { /* server chưa chạy */ }
  const byId = Object.fromEntries(probs.map((p) => [p.id, p]));
  const stars = (d) => "★".repeat(d) + "☆".repeat(Math.max(0, 4 - d));
  box.querySelectorAll('[data-slot="PROBLEMS"]').forEach((slot) => {
    slot.innerHTML = `<p class="muted">Các bài được xếp từ dễ đến khó. Mỗi bài có subtask: hãy lấy điểm subtask nhỏ bằng cách làm trâu trước, rồi mới tối ưu.</p><div class="prob-list">` +
      topic.problems.map((pid, k) => {
        const p = byId[pid] || { title: pid, subtasks: [] };
        const b = Progress.best(pid);
        const sc = b ? `<span class="score ${b.score === b.max ? "v-AC" : b.score ? "v-TLE" : "v-WA"}">${b.score}/${b.max}</span>` : '<span class="score muted">chưa nộp</span>';
        return `<a class="prob-item" href="problem.html?id=${pid}"><b>Bài ${k + 1}.</b><span>${esc(p.title)}</span>
          <span class="small" style="color:var(--warn)" title="Độ khó">${stars(p.difficulty || 1)}</span>
          <span class="small muted">${p.subtasks.length} subtask</span>${sc}</a>`;
      }).join("") + "</div>";
  });

  // ---- tiến độ + nút đã học
  function refresh() {
    const pct = Progress.topicPercent(topic);
    $("#tp-bar").style.width = pct + "%";
    $("#tp-pct").textContent = pct + "%";
    const read = Progress.isRead(id);
    $("#read-btn").textContent = read ? "✓ Đã học lý thuyết" : "Đánh dấu đã học lý thuyết";
    $("#read-btn").className = read ? "btn ok" : "btn";
  }
  $("#read-btn").onclick = () => { Progress.markRead(id, !Progress.isRead(id)); refresh(); };
  refresh();

  // ---- chủ đề trước / sau
  const k = ready.findIndex((t) => t.id === id);
  $("#pager").innerHTML = (k > 0 ? `<a class="btn" href="topic.html?id=${ready[k - 1].id}">← ${esc(ready[k - 1].title)}</a>` : "<span></span>") +
    (k < ready.length - 1 ? `<a class="btn" href="topic.html?id=${ready[k + 1].id}">${esc(ready[k + 1].title)} →</a>` : `<a class="btn" href="index.html">Về lộ trình</a>`);

  if (location.hash) { const t = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (t) t.scrollIntoView(); }
})();
