/* ============================================================
   Khu làm bài dùng chung (trang Bài tập + trang Thi thử):
   đề bài, editor, chạy thử, nộp bài, bảng kết quả chấm, lịch sử.
   ============================================================ */
(function () {
  "use strict";
  const H = window.HSG;
  const { $, esc, Store, Progress, History } = H;

  async function loadProblem(pid) {
    return H.api("/api/problem/" + encodeURIComponent(pid));
  }

  /** Vẽ đề bài vào el. Trả về danh sách ví dụ [{input, output}] */
  function renderStatement(el, p, opts = {}) {
    const lim = `<div class="limits">
      <span class="badge acc">Thời gian: ${p.time_limit} giây</span>
      <span class="badge acc">Bộ nhớ: ${p.memory_limit} MB</span>
      <span class="badge">Mã bài: ${esc(p.code || p.id)}</span>
      <span class="badge">Nhập/xuất: bàn phím/màn hình</span></div>`;
    el.innerHTML = `<div class="prob-head"><h1>${esc(opts.prefix || "")}${esc(p.title)}</h1>
        ${opts.noTimer ? "" : '<span class="badge warn" id="ptime" title="Thời gian bạn đã ở trang bài này">⏱ 00:00</span>'}</div>
      ${lim}<div class="md">${H.md(p.statement)}</div>
      ${opts.noSolution ? "" : `<details class="card" style="margin-top:24px" id="sol-box"><summary style="cursor:pointer"><b>Xem lời giải</b> <span class="small muted">(hãy tự làm ít nhất 20–30 phút trước khi mở)</span></summary><div id="sol-body" class="md"><span class="spinner"></span></div></details>`}`;
    H.wireCopy(el);
    const ins = Array.from(el.querySelectorAll('[data-sample="input"] pre')).map((x) => x.textContent);
    const outs = Array.from(el.querySelectorAll('[data-sample="output"] pre')).map((x) => x.textContent);
    if (!opts.noSolution) {
      $("#sol-box", el).addEventListener("toggle", async function once() {
        this.removeEventListener("toggle", once);
        try {
          const s = await H.api("/api/solution/" + p.id);
          $("#sol-body", el).innerHTML = H.md(
            "### Lời giải chuẩn\n```cpp\n" + s.code + "\n```\n" +
            (s.brute ? "### Lời giải trâu (lấy điểm subtask nhỏ)\nTrong phòng thi, nếu chưa nghĩ ra cách tối ưu thì hãy nộp cách này trước để chắc điểm.\n```cpp\n" + s.brute + "\n```\n" : ""));
          H.wireCopy($("#sol-body", el));
        } catch (e) { $("#sol-body", el).textContent = "Không tải được lời giải: " + e.message; }
      });
    }
    return ins.map((input, k) => ({ input, output: outs[k] || "" }));
  }

  /** Bộ đếm thời gian làm từng bài (chỉ đếm khi trang đang mở) */
  function problemClock(pid, el) {
    const key = "ptime." + pid;
    let acc = Store.get(key, 0), last = Date.now();
    setInterval(() => {
      const now = Date.now();
      if (!document.hidden) acc += now - last;
      last = now;
      Store.set(key, acc);
      if (el) el.textContent = "⏱ " + H.fmtTime(acc, false);
    }, 1000);
    return () => acc;
  }

  function renderResult(box, r, opts = {}) {
    if (r.verdict === "CE") {
      const first = (r.compile_error.split("\n").find((l) => /error/i.test(l)) || "").replace(/^.*?main\.cpp:/, "dòng ");
      box.innerHTML = `<div class="result-head"><span class="big v-CE">Lỗi biên dịch (CE)</span><b>0/${r.max_score} điểm</b></div>
        ${first ? `<p>Lỗi đầu tiên: <code>${esc(first)}</code></p>` : ""}
        <p class="small muted">Mẹo: sửa lỗi <b>đầu tiên</b> trước, vì các lỗi sau thường là hệ quả của nó. Hay gặp nhất: thiếu dấu <code>;</code>, sai tên biến, thiếu dấu <code>}</code>.</p>
        <pre class="ce">${esc(r.compile_error)}</pre>`;
      return;
    }
    const pct = Math.round((100 * r.score) / r.max_score);
    const nAC = r.tests.filter((t) => t.verdict === "AC").length;
    let h = `<div class="result-head"><span class="big v-${r.verdict}">${H.VERDICT_VI[r.verdict]}</span>
        <b style="font-size:20px">${r.score}/${r.max_score} điểm</b>
        <span class="muted small">${nAC}/${r.tests.length} test đúng · chạy lâu nhất ${r.max_time_ms} ms (giới hạn ${r.time_limit_ms} ms) · chấm trong ${r.total_s}s</span></div>
      <div class="progress ${pct === 100 ? "ok" : ""}" style="margin:10px 0"><span style="width:${pct}%"></span></div>
      <table class="tbl"><tr><th>Subtask</th><th>Giới hạn</th><th>Test đúng</th><th>Điểm</th></tr>
      ${r.subtasks.map((s) => `<tr><td>${s.index}</td><td>${esc(s.desc)}</td><td>${s.passed}/${s.total}</td><td class="${s.got ? "v-AC" : "v-WA"}">${s.got}/${s.points}</td></tr>`).join("")}</table>
      <p class="small muted" style="margin:8px 0 0">Mỗi subtask được tính điểm khi <b>đúng tất cả</b> test của subtask đó.</p>
      <div class="tests-grid">${r.tests.map((t) => `<div class="tbox ${t.verdict}" title="Test ${t.name} · subtask ${t.subtask} · ${esc(t.note)}">#${+t.name}<br>${t.verdict}<br>${t.verdict === "TLE" ? ">" + r.time_limit_ms : t.time_ms}ms</div>`).join("")}</div>`;
    const d = r.detail;
    if (d) {
      h += `<div class="card" style="padding:12px 14px;margin-top:8px"><b>Test nhỏ nhất bị <span class="v-${d.verdict}">${d.verdict}</span>: #${+d.name}</b>
        <span class="small muted">(subtask ${d.subtask}${d.note ? " · " + esc(d.note) : ""})</span>
        ${d.verdict === "TLE" ? '<p class="small">Chương trình chạy quá thời gian. Hãy xem lại độ phức tạp: với n lớn nhất, vòng lặp chạy bao nhiêu lần? Bạn đã thêm <code>ios::sync_with_stdio(false)</code> chưa?</p>' : ""}
        ${d.verdict === "RE" ? `<p class="small">Chương trình bị lỗi khi chạy: <b>${esc(d.error || "")}</b>. Hãy kiểm tra chỉ số mảng, chia cho 0, và mảng lớn khai báo trong hàm (nên khai báo toàn cục).</p>` : ""}
        <div class="diff" style="margin-top:8px">
          <div><div class="small muted">Input</div><pre>${esc(d.input)}</pre></div>
          <div><div class="small muted">Đáp án đúng</div><pre>${esc(d.expected)}</pre></div>
          <div><div class="small muted">Bạn in ra</div><pre>${esc(d.output || "(không in gì)")}</pre></div>
        </div>
        <div class="row" style="margin-top:8px"><button class="btn sm" data-use-input>Chép input này vào ô Chạy thử</button></div></div>`;
    }
    box.innerHTML = h;
    const b = box.querySelector("[data-use-input]");
    if (b && opts.onUseInput) b.onclick = () => opts.onUseInput(d.input);
  }

  /**
   * Khu làm bài.
   * opts: {problem, samples, right (element), draftKey, onJudged(result), historyTag}
   */
  class Workspace {
    constructor(opts) {
      this.o = opts;
      const p = opts.problem;
      const right = opts.right;
      right.innerHTML = `
        <div class="ws-editor"></div>
        <div class="row">
          <button class="btn" data-run title="F9">▶ Chạy thử (F9)</button>
          <button class="btn primary" data-submit title="Ctrl+Enter">Nộp bài (Ctrl+Enter)</button>
          <span class="small muted ws-status"></span>
        </div>
        <div class="card" style="padding:10px 14px">
          <div class="tabs"><button data-tab="run" class="on">Chạy thử</button><button data-tab="res">Kết quả chấm</button><button data-tab="hint">Gợi ý code <span class="badge ws-hint-n"></span></button><button data-tab="his">Lịch sử nộp</button></div>
          <div data-pane="hint" hidden><div class="ws-hint"><div class="empty">Gõ code, trợ lý sẽ tự phân tích sau khi bạn ngừng gõ.</div></div></div>
          <div data-pane="run">
            <div class="row small" style="margin-bottom:6px">${(opts.samples || []).map((s, k) => `<button class="btn sm" data-sample="${k}">Dùng ví dụ ${k + 1}</button>`).join("")}<span class="grow"></span><span class="ws-cmp"></span></div>
            <div class="runbox">
              <div><label>Input (tự nhập)</label><textarea class="ws-in" spellcheck="false"></textarea></div>
              <div><label>Output</label><pre class="ws-out"></pre></div>
            </div>
          </div>
          <div data-pane="res" hidden><div class="ws-res empty">Chưa nộp bài. Bấm <b>Nộp bài</b> để chấm trên ${"≥"}70 test.</div></div>
          <div data-pane="his" hidden><div class="ws-his"></div></div>
        </div>`;
      this.$ = (s) => right.querySelector(s);
      const draft = Store.get(opts.draftKey, null);
      const edHost = this.$(".ws-editor");
      edHost.style.height = opts.editorHeight || "56vh";
      this.ed = new window.CBEditor(edHost, {
        value: draft,
        filename: (p.code || p.id) + ".cpp",
        onChange: (v) => {
          clearTimeout(this._sv); this._sv = setTimeout(() => Store.set(opts.draftKey, v), 400);
          clearTimeout(this._an); this._an = setTimeout(() => this.analyze(), 1200);
        },
        onRun: () => this.run(),
        onSubmit: () => this.submit(),
        onSave: () => { Store.set(opts.draftKey, this.ed.value); H.toast("Đã lưu nháp (tự động lưu mỗi khi bạn gõ)"); },
      });
      this.$(".ws-in").value = (opts.samples && opts.samples[0] && opts.samples[0].input) || "";
      this.curSample = opts.samples && opts.samples.length ? 0 : -1;
      this.$(".ws-in").addEventListener("input", () => { this.curSample = -1; this.$(".ws-cmp").innerHTML = ""; });
      right.addEventListener("click", (e) => {
        const t = e.target.closest("[data-tab]");
        if (t) this.tab(t.dataset.tab);
        const s = e.target.closest("[data-sample]");
        if (s && s.tagName === "BUTTON") { this.curSample = +s.dataset.sample; this.$(".ws-in").value = opts.samples[this.curSample].input; this.$(".ws-cmp").innerHTML = ""; }
        if (e.target.closest("[data-run]")) this.run();
        if (e.target.closest("[data-submit]")) this.submit();
        const lo = e.target.closest("[data-load]");
        if (lo) {
          const item = History.all().find((x) => x.ts === +lo.dataset.load);
          if (item && confirm("Nạp lại code của lần nộp này vào editor? (Ctrl+Z để hoàn tác)")) this.ed.setValue(item.code);
        }
      });
      this.renderHistory();
      this.$(".ws-hint").addEventListener("click", (e) => {
        const c = e.target.closest("[data-line]");
        if (c && !e.target.closest("button")) this.ed.gotoLine(+c.dataset.line, +c.dataset.col);
        const cp = e.target.closest("[data-copyfix]");
        if (cp) H.copyText(cp.parentElement.querySelector("pre").textContent);
      });
      setTimeout(() => this.analyze(), 300);
    }
    /** Gọi trợ lý phân tích code (không chạy code) */
    async analyze(judged) {
      const code = this.ed.value;
      try {
        const a = judged || await H.api("/api/analyze", { id: this.o.problem.id, code });
        if (code !== this.ed.value) return;            // code đã đổi trong lúc chờ
        this.renderHints(a);
      } catch (e) { /* server chưa chạy */ }
    }
    renderHints(a) {
      const fs = a.findings || [];
      this.ed.setMarkers(fs.map((f) => ({ line: f.line, from: f.from, to: f.to, sev: f.sev, title: f.title })));
      const nErr = fs.filter((f) => f.sev === "error").length;
      const badge = this.$(".ws-hint-n");
      badge.textContent = fs.length ? String(fs.length) : "";
      badge.className = "badge ws-hint-n " + (nErr ? "bad" : fs.length ? "warn" : "");
      const SEV = { error: ["Lỗi", "bad"], warn: ["Cảnh báo", "warn"], opt: ["Tối ưu", "acc"] };
      let h = `<div class="small muted" style="margin-bottom:6px">Hướng làm nhận diện được: <b>${esc(a.approach ? a.approach.name : "?")}</b> · độ phức tạp ước tính <b>${esc(a.approach ? a.approach.cx : "?")}</b>. Bấm vào thẻ để nhảy tới dòng code.</div>`;
      if (!fs.length) h += `<div class="empty">Không phát hiện lỗi hay gặp nào.${a.optimal_note ? "<br>" + esc(a.optimal_note) : ""}</div>`;
      for (const f of fs) {
        const s = SEV[f.sev] || SEV.warn;
        h += `<div class="hint-card ${f.sev}" data-line="${f.line}" data-col="${f.from}">
          <h4><span class="badge ${s[1]}">${s[0]}</span>Dòng ${f.line}: ${esc(f.title)}</h4>
          <div class="lbl">${f.sev === "opt" ? "Hướng hiện tại & ý tưởng tối ưu" : "Vì sao sai"}</div><p>${esc(f.why)}</p>
          ${f.fix ? `<div class="lbl">${f.sev === "opt" ? "Code gợi ý" : "Sửa thành"} <button class="btn sm ghost" data-copyfix>Sao chép</button></div><pre>${H.highlight(f.fix)}</pre>` : ""}
          ${f.better ? `<div class="lbl">Vì sao cách này tốt hơn</div><p>${esc(f.better)}</p>` : ""}
        </div>`;
      }
      this.$(".ws-hint").innerHTML = h;
    }
    tab(name) {
      this.o.right.querySelectorAll("[data-tab]").forEach((b) => b.classList.toggle("on", b.dataset.tab === name));
      this.o.right.querySelectorAll("[data-pane]").forEach((p) => (p.hidden = p.dataset.pane !== name));
    }
    busy(on, msg) {
      this.$("[data-run]").disabled = on;
      this.$("[data-submit]").disabled = on;
      clearInterval(this._tick);
      const st = this.$(".ws-status");
      if (on) {
        const t0 = Date.now();
        const draw = () => (st.innerHTML = `<span class="spinner"></span> ${msg} ${Math.round((Date.now() - t0) / 1000)}s`);
        draw();
        this._tick = setInterval(draw, 500);
      } else st.innerHTML = msg || "";
    }
    async run() {
      this.tab("run");
      Store.set(this.o.draftKey, this.ed.value);
      this.busy(true, "Đang biên dịch & chạy…");
      const out = this.$(".ws-out");
      try {
        const r = await H.api("/api/run", { code: this.ed.value, input: this.$(".ws-in").value });
        if (r.status === "CE") { out.innerHTML = `<span class="v-CE">Lỗi biên dịch:</span>\n${esc(r.compile_error)}`; this.busy(false, '<span class="v-CE">CE</span>'); return; }
        let txt = esc(r.out);
        if (r.status === "TLE") txt += `\n<span class="v-TLE">[Chạy quá 3 giây — dừng lại. Có thể bị vòng lặp vô hạn hoặc đang chờ nhập thêm dữ liệu]</span>`;
        if (r.status === "RE") txt += `\n<span class="v-RE">[Lỗi khi chạy: ${esc(r.err)}]</span>`;
        out.innerHTML = txt || '<span class="muted">(không in gì)</span>';
        let cmp = "";
        if (this.curSample >= 0 && r.status === "OK") {
          const exp = this.o.samples[this.curSample].output;
          cmp = r.out.split(/\s+/).join(" ").trim() === exp.split(/\s+/).join(" ").trim()
            ? '<span class="badge ok">Khớp đáp án ví dụ ✓</span>' : '<span class="badge bad">Khác đáp án ví dụ ✗</span>';
        }
        this.$(".ws-cmp").innerHTML = cmp;
        this.busy(false, `${r.status === "OK" ? "Chạy xong" : r.status} · ${r.time_ms} ms`);
      } catch (e) {
        out.textContent = "Lỗi: " + e.message;
        this.busy(false, "");
      }
    }
    async submit() {
      if (this.o.canSubmit && !this.o.canSubmit()) return;
      const code = this.ed.value;
      Store.set(this.o.draftKey, code);
      this.tab("res");
      const res = this.$(".ws-res");
      res.className = "ws-res";
      res.innerHTML = '<div class="empty"><span class="spinner"></span> Đang chấm… (lần đầu chấm một bài sẽ mất thêm 10–40 giây để sinh test)</div>';
      this.busy(true, "Đang chấm…");
      try {
        const r = await H.api("/api/judge", { id: this.o.problem.id, code });
        renderResult(res, r, { onUseInput: (inp) => { this.$(".ws-in").value = inp; this.curSample = -1; this.$(".ws-cmp").innerHTML = ""; this.tab("run"); } });
        if (r.analysis) {
          this.renderHints(r.analysis);
          const n = (r.analysis.findings || []).length;
          if (n && r.verdict !== "AC") res.insertAdjacentHTML("afterbegin", `<div class="banner" style="background:var(--accent-soft);color:var(--text);border-color:var(--accent)">Trợ lý tìm thấy <b>${n}</b> điểm cần xem trong code (đã gạch chân trong editor). <button class="btn sm" data-gohint>Xem gợi ý</button></div>`);
          const g = res.querySelector("[data-gohint]");
          if (g) g.onclick = () => this.tab("hint");
        }
        History.add({ pid: this.o.problem.id, title: this.o.problem.title, ts: Date.now(), verdict: r.verdict, score: r.score, max: r.max_score,
          time_ms: r.max_time_ms || 0, code, tag: this.o.historyTag || "", spent: this.o.getSpent ? this.o.getSpent() : 0 });
        if (!this.o.historyTag) Progress.record(this.o.problem.id, r.score, r.max_score);
        this.renderHistory();
        this.busy(false, `<span class="v-${r.verdict}">${r.verdict}</span> · ${r.score}/${r.max_score} điểm`);
        if (r.score === r.max_score) H.toast("Chính xác! 100 điểm");
        this.o.onJudged && this.o.onJudged(r);
      } catch (e) {
        res.innerHTML = `<div class="banner">Không chấm được: ${esc(e.message)}</div>`;
        this.busy(false, "");
      }
    }
    renderHistory() {
      const list = History.forProblem(this.o.problem.id).filter((x) => (x.tag || "") === (this.o.historyTag || ""));
      this.$(".ws-his").innerHTML = list.length ? `<table class="tbl"><tr><th>Lúc</th><th>Kết quả</th><th>Điểm</th><th>Thời gian chạy</th><th></th></tr>${list.slice(0, 30).map((x) =>
        `<tr><td>${H.fmtDate(x.ts)}</td><td class="v-${x.verdict}">${x.verdict}</td><td>${x.score}/${x.max}</td><td>${x.time_ms} ms</td><td><button class="btn sm" data-load="${x.ts}">Nạp code</button></td></tr>`).join("")}</table>`
        : '<div class="empty">Chưa có lần nộp nào.</div>';
    }
  }

  window.WS = { loadProblem, renderStatement, renderResult, problemClock, Workspace };
})();
