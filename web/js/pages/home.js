/* Trang chủ: lộ trình 3 ngày + tiến độ */
(async function () {
  "use strict";
  const H = window.HSG;
  const { $, esc, Progress, History, Timer } = H;
  H.initPage("home");

  let roadmap, topics;
  try {
    [roadmap, topics] = await Promise.all([H.getJSON("/content/roadmap.json"), H.getJSON("/content/topics/index.json")]);
  } catch (e) { return; }
  const topicById = Object.fromEntries(topics.map((t) => [t.id, t]));

  $("#goal").textContent = "Mục tiêu: " + roadmap.goal + ". Ưu tiên những dạng chắc chắn ra đề và lấy điểm subtask.";
  $("#why").innerHTML = roadmap.why.map((w) => `<li>${esc(w)}</li>`).join("");

  const TYPE = { learn: ["Học", "acc"], practice: ["Làm bài", "pur"], break: ["Nghỉ", ""], review: ["Ôn lại", "warn"], exam: ["Thi thử", "bad"] };

  function blockLink(b) {
    if (b.link) return b.link;
    if (b.topic && topicById[b.topic] && topicById[b.topic].status === "ready") return "topic.html?id=" + b.topic;
    return null;
  }

  function render() {
    // ---- các ngày
    $("#days").innerHTML = roadmap.days.map((d) => {
      const work = d.blocks.filter((b) => b.type !== "break");
      const done = work.filter((b) => Progress.blockDone(b.id)).length;
      const pct = Math.round((100 * done) / work.length);
      return `<div class="card day">
        <div class="day-head"><h2>Ngày ${d.day}</h2><span class="small muted">${done}/${work.length} khối · ${pct}%</span></div>
        <div class="small muted" style="margin-bottom:6px">${esc(d.title.split("—")[1] || "")}</div>
        <div class="progress ok" style="margin-bottom:10px"><span style="width:${pct}%"></span></div>
        ${d.blocks.map((b) => {
          const link = blockLink(b);
          const t = TYPE[b.type];
          const soon = b.topic && topicById[b.topic] && topicById[b.topic].status !== "ready";
          const isBreak = b.type === "break";
          return `<div class="block ${isBreak ? "break" : ""} ${Progress.blockDone(b.id) ? "done" : ""}">
            ${isBreak ? "<span></span>" : `<input type="checkbox" data-b="${b.id}" ${Progress.blockDone(b.id) ? "checked" : ""} title="Đánh dấu đã xong">`}
            <span class="time">${esc(b.time)}</span>
            <span class="title">${link ? `<a href="${link}">${esc(b.title)}</a>` : esc(b.title)}
              ${t[1] ? `<span class="badge ${t[1]}">${t[0]}</span>` : ""} ${soon ? '<span class="badge">sắp có</span>' : ""}</span>
            <button class="btn sm ghost" data-t="${b.id}" title="Hẹn giờ ${b.min} phút">⏱ ${b.min}'</button>
          </div>`;
        }).join("")}
      </div>`;
    }).join("");

    // ---- chủ đề
    let sumPct = 0, readCnt = 0;
    $("#topics").innerHTML = topics.map((t) => {
      const pct = Progress.topicPercent(t);
      sumPct += pct;
      if (Progress.isRead(t.id)) readCnt++;
      const ready = t.status === "ready";
      return `<a class="card topic-card ${ready ? "" : "soon"}" href="${ready ? "topic.html?id=" + t.id : "#"}">
        <div class="row"><span class="badge">Ngày ${t.day}</span>${ready ? `<span class="badge acc">${t.problems.length} bài</span>` : '<span class="badge">sắp có</span>'}<span class="grow"></span><b class="small">${pct}%</b></div>
        <h3>${esc(t.title)}</h3>
        <div class="small muted">${esc(t.short)}</div>
        <div class="progress ok" style="margin-top:10px"><span style="width:${pct}%"></span></div>
      </a>`;
    }).join("");

    // ---- tổng quan
    const p = Progress.all();
    const ac = Object.values(p.best).filter((b) => b.score === b.max).length;
    const overall = Math.round(sumPct / topics.length);
    $("#overall-pct").textContent = overall + "%";
    $("#overall-bar").style.width = overall + "%";
    $("#st-ac").textContent = ac;
    $("#st-topic").textContent = readCnt + "/" + topics.length;
    $("#st-sub").textContent = History.all().length;

    // ---- việc tiếp theo
    const next = roadmap.days.flatMap((d) => d.blocks.map((b) => ({ ...b, day: d.day }))).find((b) => b.type !== "break" && !Progress.blockDone(b.id));
    if (next) {
      const link = blockLink(next);
      $("#next-title").textContent = next.title;
      $("#next-time").textContent = `Ngày ${next.day} · ${next.time} · ${next.min} phút`;
      $("#next-actions").innerHTML = (link ? `<a class="btn primary" href="${link}">Bắt đầu học</a>` : `<span class="badge">Nội dung sẽ có ở lượt sau</span>`) +
        `<button class="btn" data-t="${next.id}">⏱ Hẹn giờ ${next.min} phút</button><button class="btn" data-b2="${next.id}">Đánh dấu xong</button>`;
    } else {
      $("#next-title").textContent = "Bạn đã hoàn thành cả lộ trình!";
      $("#next-time").textContent = "Hãy làm lại đề thi thử và ôn sổ lỗi. Chúc bạn thi tốt!";
      $("#next-actions").innerHTML = "";
    }

    // ---- nộp bài gần đây
    const rec = History.all().slice(0, 6);
    $("#recent").innerHTML = rec.length ? `<table class="tbl"><tr><th>Thời điểm</th><th>Bài</th><th>Kết quả</th><th>Điểm</th></tr>${rec.map((r) =>
      `<tr><td>${H.fmtDate(r.ts)}</td><td><a href="problem.html?id=${r.pid}">${esc(r.title || r.pid)}</a></td><td class="v-${r.verdict}">${r.verdict}</td><td>${r.score}/${r.max}</td></tr>`).join("")}</table>`
      : '<div class="empty">Chưa nộp bài nào. Bắt đầu với chủ đề <a href="topic.html?id=complexity">Độ phức tạp</a> nhé!</div>';
  }

  const blocks = Object.fromEntries(roadmap.days.flatMap((d) => d.blocks).map((b) => [b.id, b]));
  document.addEventListener("change", (e) => {
    if (e.target.dataset.b) { Progress.toggleBlock(e.target.dataset.b, e.target.checked); render(); }
  });
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-t]");
    if (t) {
      const b = blocks[t.dataset.t];
      Timer.countdown(b.min, b.title);
      H.timerUI && H.timerUI.render();
      H.toast(`Đã hẹn giờ ${b.min} phút: ${b.title}`);
    }
    const d = e.target.closest("[data-b2]");
    if (d) { Progress.toggleBlock(d.dataset.b2, true); render(); }
  });
  render();
})();
