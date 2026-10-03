/* Trang thi thử: đếm ngược, nhiều bài, chấm từng bài, tổng kết */
(async function () {
  "use strict";
  const H = window.HSG;
  const { $, esc, Store } = H;
  H.initPage("exam", { timer: false });
  const main = $("#main");
  const LETTERS = "ABCDEFGH";

  let exams = [], probs = [], topics = [];
  try {
    [exams, probs, topics] = await Promise.all([H.getJSON("/content/exams.json"), H.api("/api/problems"), H.getJSON("/content/topics/index.json")]);
  } catch (e) { return; }
  const byId = Object.fromEntries(probs.map((p) => [p.id, p]));

  const getActive = () => Store.get("exam.active", null);
  const setActive = (a) => Store.set("exam.active", a);

  function start(title, pids, minutes) {
    setActive({ title, problems: pids, start: Date.now(), dur: minutes * 60000, best: {}, finished: false, cur: 0 });
    render();
  }

  // ------------------------------------------------------------ màn hình chọn đề
  function renderLobby() {
    $("#exam-bar").hidden = true;
    const past = Store.get("exam.history", []);
    const avail = topics.filter((t) => t.status === "ready").flatMap((t) => t.problems.map((pid) => ({ pid, topic: t.title }))).filter((x) => byId[x.pid]);
    main.innerHTML = `<div class="wrap narrow" style="padding:0">
      <h1 style="margin-top:0">Thi thử</h1>
      <p class="muted">Mô phỏng phòng thi thật: đồng hồ đếm ngược, không xem được lời giải, mỗi bài nộp nhiều lần và lấy điểm cao nhất. Đồng hồ vẫn chạy kể cả khi bạn tải lại trang.</p>
      <div class="card" style="margin-bottom:16px">
        <h2 style="margin:0 0 8px;font-size:18px">Đề chính thức</h2>
        ${exams.map((x) => `<div class="row" style="padding:8px 0;border-top:1px dashed var(--border)">
          <b>${esc(x.title)}</b><span class="badge">${x.duration} phút</span>
          ${x.status === "ready" ? `<span class="badge acc">${x.problems.length} bài</span><span class="grow"></span><button class="btn primary" data-exam="${x.id}">Bắt đầu thi</button>`
            : `<span class="badge">sắp có</span><div class="small muted" style="flex-basis:100%">${esc(x.note || "")}</div>`}
        </div>`).join("")}
      </div>
      <div class="card" style="margin-bottom:16px">
        <h2 style="margin:0 0 8px;font-size:18px">Tự tạo đề luyện</h2>
        <p class="small muted" style="margin:0">Chọn 2–4 bài bạn <b>chưa làm</b> từ các chủ đề đã học, rồi đặt thời gian để luyện phân bổ giờ.</p>
        <div class="pick-list">${avail.map((x) => {
          const b = H.Progress.best(x.pid);
          return `<label><input type="checkbox" value="${x.pid}"> ${esc(byId[x.pid].title)} <span class="small muted">· ${esc(x.topic)}</span>${b ? ` <span class="badge">${b.score}đ</span>` : ""}</label>`;
        }).join("")}</div>
        <div class="row"><span>Thời gian</span><select id="dur">${[30, 45, 60, 90, 120, 180].map((m) => `<option value="${m}" ${m === 60 ? "selected" : ""}>${m} phút</option>`).join("")}</select>
          <button class="btn primary" id="custom-start">Bắt đầu</button></div>
      </div>
      <div class="card"><h2 style="margin:0 0 8px;font-size:18px">Các lần thi trước</h2>
        ${past.length ? `<table class="tbl"><tr><th>Ngày</th><th>Đề</th><th>Điểm</th><th>Thời gian dùng</th></tr>${past.map((p) =>
          `<tr><td>${H.fmtDate(p.start)}</td><td>${esc(p.title)}</td><td><b>${p.score}/${p.max}</b></td><td>${H.fmtTime(p.used)}</td></tr>`).join("")}</table>` : '<div class="empty">Chưa thi lần nào.</div>'}
      </div></div>`;
    main.querySelectorAll("[data-exam]").forEach((b) => (b.onclick = () => {
      const x = exams.find((e) => e.id === b.dataset.exam);
      if (confirm(`Bắt đầu "${x.title}" — ${x.duration} phút? Đồng hồ sẽ chạy ngay.`)) start(x.title, x.problems, x.duration);
    }));
    $("#custom-start").onclick = () => {
      const pids = Array.from(main.querySelectorAll(".pick-list input:checked")).map((i) => i.value);
      if (pids.length < 1) { H.toast("Hãy chọn ít nhất 1 bài"); return; }
      if (pids.length > 6) { H.toast("Tối đa 6 bài"); return; }
      start("Đề tự chọn (" + pids.length + " bài)", pids, +$("#dur").value);
    };
  }

  // ------------------------------------------------------------ đang thi
  let ws = null, tick = null;
  const remain = (a) => a.dur - (Date.now() - a.start);
  const total = (a) => a.problems.reduce((s, pid) => s + ((a.best[pid] && a.best[pid].score) || 0), 0);
  const maxTotal = (a) => a.problems.reduce((s, pid) => s + byId[pid].subtasks.reduce((x, t) => x + t.points, 0), 0);

  function finish(reason) {
    const a = getActive();
    if (!a || a.finished) return;
    a.finished = true;
    a.endedAt = Math.min(Date.now(), a.start + a.dur);
    setActive(a);
    const past = Store.get("exam.history", []);
    past.unshift({ title: a.title, start: a.start, score: total(a), max: maxTotal(a), used: a.endedAt - a.start });
    Store.set("exam.history", past.slice(0, 50));
    if (reason === "time") { H.beep(); H.toast("Hết giờ làm bài!"); }
    render();
  }

  function renderTabs(a) {
    $("#exam-tabs").innerHTML = a.problems.map((pid, k) => {
      const b = a.best[pid];
      return `<button data-k="${k}" class="${k === a.cur ? "on" : ""}">${LETTERS[k]}<small>${b ? b.score : "–"}</small></button>`;
    }).join("");
    $("#exam-total").textContent = `Tổng: ${total(a)}/${maxTotal(a)}`;
  }

  async function renderExam(a) {
    $("#exam-bar").hidden = false;
    $("#exam-title").textContent = a.title;
    renderTabs(a);
    const pid = a.problems[a.cur];
    main.innerHTML = `<div class="prob-layout"><section class="card" id="statement"><span class="spinner"></span></section><section class="right-col" id="right"></section></div>`;
    const p = await WS.loadProblem(pid);
    const samples = WS.renderStatement($("#statement"), p, { noSolution: true, noTimer: true, prefix: "Bài " + LETTERS[a.cur] + ". " });
    ws = new WS.Workspace({
      problem: p, samples, right: $("#right"), draftKey: `examdraft.${a.start}.${pid}`, historyTag: "exam",
      canSubmit: () => { const x = getActive(); if (!x || x.finished || remain(x) <= 0) { H.toast("Đã hết giờ, không nộp được nữa"); return false; } return true; },
      onJudged: (r) => {
        const x = getActive();
        if (!x || x.finished) return;
        const old = x.best[pid];
        if (!old || r.score > old.score) x.best[pid] = { score: r.score, max: r.max_score };
        setActive(x);
        renderTabs(x);
      },
    });
  }

  function renderSummary(a) {
    $("#exam-bar").hidden = true;
    const rows = a.problems.map((pid, k) => {
      const b = a.best[pid];
      const max = byId[pid].subtasks.reduce((x, t) => x + t.points, 0);
      return `<tr><td><b>${LETTERS[k]}</b></td><td><a href="problem.html?id=${pid}">${esc(byId[pid].title)}</a></td><td><b>${b ? b.score : 0}</b>/${max}</td></tr>`;
    }).join("");
    main.innerHTML = `<div class="wrap narrow" style="padding:0"><div class="card">
      <h1 style="margin-top:0">Kết quả: ${total(a)}/${maxTotal(a)} điểm</h1>
      <p class="muted">${esc(a.title)} · dùng ${H.fmtTime(a.endedAt - a.start)} / ${H.fmtTime(a.dur)}</p>
      <table class="tbl"><tr><th>Bài</th><th>Tên</th><th>Điểm</th></tr>${rows}</table>
      <p class="small muted">Bấm vào tên bài để xem lời giải và làm lại ở chế độ luyện tập. Hãy ghi những lỗi mắc phải vào sổ lỗi.</p>
      <div class="row"><button class="btn primary" id="new-exam">Về trang thi thử</button></div></div></div>`;
    $("#new-exam").onclick = () => { setActive(null); render(); };
  }

  function render() {
    clearInterval(tick);
    const a = getActive();
    if (!a) return renderLobby();
    if (a.finished) return renderSummary(a);
    renderExam(a);
    const draw = () => {
      const x = getActive();
      if (!x || x.finished) return;
      const r = remain(x);
      $("#clock").textContent = H.fmtTime(r);
      $("#clock").classList.toggle("low", r < 10 * 60000);
      if (r <= 0) finish("time");
    };
    draw();
    tick = setInterval(draw, 500);
  }

  $("#exam-tabs").addEventListener("click", (e) => {
    const b = e.target.closest("[data-k]");
    if (!b) return;
    const a = getActive();
    a.cur = +b.dataset.k;
    setActive(a);
    renderExam(a);
  });
  $("#exam-end").onclick = () => { if (confirm("Kết thúc bài thi ngay bây giờ? Bạn sẽ không nộp thêm được nữa.")) finish("user"); };
  render();
})();
