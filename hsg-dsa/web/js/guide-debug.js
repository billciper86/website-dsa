/* ============================================================
   Hai tab thêm vào khu làm bài:
   1. "Từng bước": hướng dẫn code cùng — mỗi bước có giải thích, khung code có chỗ trống,
      code mẫu, nút chèn vào editor và nút kiểm tra code của bạn đã có đủ ý chưa.
   2. "Gỡ lỗi": chạy CHÍNH code của bạn, ghi lại từng bước; bước tới/lùi, breakpoint,
      xem biến / mảng thay đổi, output tới thời điểm đó. Tự tạo sau khi Chạy thử và khi nộp bị sai.
   ============================================================ */
(function () {
  "use strict";
  const H = window.HSG;
  const { esc, Store } = H;

  function stripCode(c) {
    return c.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/.*$/gm, "").replace(/"(?:\\.|[^"\\\n])*"/g, '""');
  }

  // ------------------------------------------------------------------ TỪNG BƯỚC
  function attachGuide(ws) {
    const pid = ws.o.problem.id;
    const pane = ws.$('[data-pane="guide"]');
    const key = "guide." + pid;
    let steps = null, cur = 0;
    const st = () => Store.get(key, { done: [], cur: 0 });

    async function load() {
      if (steps) return;
      pane.innerHTML = '<div class="empty"><span class="spinner"></span></div>';
      try { steps = await H.api("/api/steps/" + pid); } catch (e) { pane.innerHTML = `<div class="banner">${esc(e.message)}</div>`; return; }
      cur = Math.min(st().cur || 0, steps.length - 1);
      render();
    }
    function save(extra) { const s = st(); Object.assign(s, extra); Store.set(key, s); }
    function render() {
      const s = st();
      const step = steps[cur];
      const dots = steps.map((_, k) => `<span data-goto="${k}" class="${k === cur ? "cur" : s.done.includes(k) ? "done" : ""}" title="Bước ${k + 1}"></span>`).join("");
      pane.innerHTML = `
        <div class="small muted" style="margin-bottom:6px">Code cùng từng bước. Tự viết vào editor bên trên, bí thì mở gợi ý theo thứ tự, rồi bấm <b>Kiểm tra bước này</b>.</div>
        <div class="step-dots">${dots}</div>
        <div class="step-card">
          <h4>Bước ${cur + 1}/${steps.length}: ${esc(step.title)} ${s.done.includes(cur) ? '<span class="badge ok">✓ xong</span>' : ""}</h4>
          ${step.explain ? `<p style="margin:4px 0 8px">${esc(step.explain)}</p>` : ""}
          <div class="row">
            <button class="btn sm" data-a="scaf">Gợi ý 1: Khung code</button>
            <button class="btn sm" data-a="code">Gợi ý 2: Code mẫu</button>
            <button class="btn sm" data-a="insert" title="Chèn khung vào vị trí con trỏ trong editor">Chèn khung vào editor</button>
            <button class="btn sm primary" data-a="check">Kiểm tra bước này</button>
          </div>
          <div class="g-scaf" hidden><div class="lbl small muted" style="margin-top:8px">Khung (điền vào chỗ <code>/* ? */</code>):</div><pre>${H.highlight(step.scaffold)}</pre></div>
          <div class="g-code" hidden><div class="lbl small muted" style="margin-top:8px">Code mẫu của bước này:</div><pre>${H.highlight(step.code)}</pre></div>
          <div class="g-check"></div>
          <div class="row" style="margin-top:10px;justify-content:space-between">
            <button class="btn sm" data-a="prev" ${cur === 0 ? "disabled" : ""}>◀ Bước trước</button>
            ${cur === steps.length - 1 ? '<button class="btn sm ok" data-a="finish">Chạy thử với ví dụ ▶</button>' : '<button class="btn sm" data-a="next">Bước tiếp ▶</button>'}
          </div>
        </div>`;
    }
    pane.addEventListener("click", (e) => {
      const g = e.target.closest("[data-goto]");
      if (g) { cur = +g.dataset.goto; save({ cur }); render(); return; }
      const b = e.target.closest("[data-a]");
      if (!b || !steps) return;
      const step = steps[cur];
      const a = b.dataset.a;
      if (a === "scaf") pane.querySelector(".g-scaf").hidden = !pane.querySelector(".g-scaf").hidden;
      if (a === "code") {
        const box = pane.querySelector(".g-code");
        if (box.hidden && !confirm("Bạn đã thử tự viết bước này chưa? Xem code mẫu sớm sẽ học kém hiệu quả hơn.")) return;
        box.hidden = !box.hidden;
      }
      if (a === "insert") {
        const ed = ws.ed;
        const tpl = window.CBEditor.TEMPLATE.trim();
        if (cur === 0 && (!ed.value.trim() || ed.value.trim() === tpl)) ed.setValue(step.scaffold + "\n");
        else { ed.focus(); ed.insert("\n" + step.scaffold + "\n"); }
        H.toast("Đã chèn khung — hãy điền vào các chỗ /* ? */");
      }
      if (a === "check") {
        const code = stripCode(ws.ed.value);
        const res = step.checks.map((c) => ({ ...c, ok: new RegExp(c.re).test(code) }));
        const blanks = (ws.ed.value.match(/\/\* \? \*\//g) || []).length;
        const allOk = res.every((r) => r.ok) && blanks === 0;
        pane.querySelector(".g-check").innerHTML = `<div style="margin-top:8px">` +
          res.map((r) => `<div class="chk ${r.ok ? "ok" : "no"}">${r.ok ? "✓" : "✗"} ${esc(r.label)}</div>`).join("") +
          (blanks ? `<div class="chk no">✗ Còn ${blanks} chỗ /* ? */ chưa điền</div>` : "") +
          (allOk ? `<div class="chk ok"><b>Tốt lắm! Bước này đã đủ ý.</b> Bấm "Bước tiếp" hoặc bấm F9 để chạy thử.</div>`
            : `<div class="small muted">Chưa đủ? Mở Gợi ý 1 để xem khung.</div>`) + `</div>`;
        if (allOk) { const s = st(); if (!s.done.includes(cur)) s.done.push(cur); Store.set(key, s); pane.querySelector(".step-dots").innerHTML = steps.map((_, k) => `<span data-goto="${k}" class="${k === cur ? "cur" : s.done.includes(k) ? "done" : ""}"></span>`).join(""); }
      }
      if (a === "prev") { cur--; save({ cur }); render(); }
      if (a === "next") { cur++; save({ cur }); render(); }
      if (a === "finish") ws.run();
    });
    return { load };
  }

  // ------------------------------------------------------------------ GỠ LỖI
  function attachDebugger(ws) {
    const pane = ws.$('[data-pane="dbg"]');
    pane.innerHTML = `
      <div class="small muted">Chạy <b>code của bạn</b> từng bước: xem dòng đang chạy (tô vàng trong editor), giá trị biến, mảng. Bấm vào <b>số dòng</b> trong editor để đặt breakpoint (chấm đỏ).
        Phím tắt: <kbd>F10</kbd> bước tiếp, <kbd>Shift+F10</kbd> lùi, <kbd>F8</kbd> chạy tới breakpoint.</div>
      <div class="runbox" style="margin-top:8px;grid-template-columns:1fr">
        <div><label>Input dùng để gỡ lỗi (nên nhỏ)</label><textarea class="d-in" spellcheck="false" style="height:70px"></textarea></div>
      </div>
      <div class="row" style="margin-top:6px"><button class="btn primary sm" data-d="start">🐞 Bắt đầu gỡ lỗi</button><span class="small muted d-status"></span></div>
      <div class="d-main" hidden>
        <div class="dbg-bar">
          <button class="btn sm" data-d="first" title="Về đầu">⏮</button>
          <button class="btn sm" data-d="back" title="Shift+F10">◀ Lùi</button>
          <button class="btn sm primary" data-d="step" title="F10">Bước ▶</button>
          <button class="btn sm" data-d="cont" title="F8">⏭ Tới breakpoint</button>
          <button class="btn sm" data-d="play">▶▶ Tự chạy</button>
          <input type="range" class="d-scrub" min="0" value="0">
          <span class="small muted d-step"></span>
        </div>
        <div class="d-line small"></div>
        <div class="dbg-vars d-vars"></div>
        <div class="small muted" style="margin-top:8px">Output tới bước này:</div>
        <pre class="dbg-out d-out"></pre>
      </div>`;
    const $ = (s) => pane.querySelector(s);
    let data = null, idx = 0, timer = null, stale = false, codeAt = "";
    const hits = [];

    async function start(input, opts = {}) {
      const code = ws.ed.value;
      if (input != null) $(".d-in").value = input;
      $(".d-status").innerHTML = '<span class="spinner"></span> Đang biên dịch & ghi lại từng bước…';
      let r;
      try { r = await H.api("/api/debug", { code, input: $(".d-in").value }); }
      catch (e) { $(".d-status").textContent = "Lỗi: " + e.message; return null; }
      if (r.status === "CE") { $(".d-status").innerHTML = '<span class="v-CE">Lỗi biên dịch</span> — sửa lỗi trước khi gỡ lỗi.'; return null; }
      if (r.status === "ERR") { $(".d-status").textContent = r.error; return null; }
      data = r; codeAt = code; stale = false;
      hits.length = 0;
      const cnt = {};
      r.events.forEach((e, k) => { cnt[e.line] = (cnt[e.line] || 0) + 1; hits[k] = cnt[e.line]; });
      const msg = { OK: "Chạy xong", RE: `<span class="v-RE">Lỗi khi chạy (RE)</span>: ${esc(r.error || "")} — bước cuối cùng là chỗ chương trình bị lỗi`, TLE: '<span class="v-TLE">Chạy quá 5 giây</span> — có thể bị lặp vô hạn' }[r.status] || r.status;
      $(".d-status").innerHTML = `${msg} · ghi lại ${r.events.length} bước` + (r.truncated ? ` (chương trình chạy tổng ${r.total ?? "?"} bước, chỉ hiện 3000 bước đầu)` : "");
      $(".d-main").hidden = !r.events.length;
      if (!r.events.length) return r;
      $(".d-scrub").max = r.events.length - 1;
      go(opts.toEnd || r.status === "RE" ? r.events.length - 1 : 0);
      return r;
    }
    function varHTML(v, prev) {
      const changed = !prev || JSON.stringify(prev.v) !== JSON.stringify(v.v);
      if (v.k === "s") return `<div class="dbg-var ${changed && prev ? "changed" : ""}"><span class="nm">${esc(v.n)}</span> = <span class="val">${esc(v.v)}</span></div>`;
      if (v.k === "a") {
        const marks = {};
        v.v.forEach((x, i) => { if (prev && prev.k === "a" && prev.v[i] !== x) marks[i] = "bad"; });
        const more = v.len > v.v.length ? ` <span class="muted">(hiện ${v.v.length}/${v.len} phần tử)</span>` : "";
        return `<div class="dbg-var ${changed && prev ? "changed" : ""}"><span class="nm">${esc(v.n)}</span> <span class="muted">[${v.len}]</span>${more}<div class="arr">${window.SimUtil.renderArray({ name: "", values: v.v, marks })}</div></div>`;
      }
      const marks = {};
      v.v.forEach((row, i) => row.forEach((x, j) => { if (prev && prev.k === "g" && prev.v[i] && prev.v[i][j] !== x) marks[i + "," + j] = "bad"; }));
      const cols = Math.max(1, ...v.v.map((r) => r.length));
      const cells = v.v.map((r) => Array.from({ length: cols }, (_, j) => (r[j] === undefined ? "" : r[j])));
      return `<div class="dbg-var ${changed && prev ? "changed" : ""}"><span class="nm">${esc(v.n)}</span> <span class="muted">[${v.len}][…] (hiện ${v.v.length} hàng đầu)</span><div class="arr">${cells.length ? window.SimUtil.renderGrid({ name: "", cells, marks }) : "(rỗng)"}</div></div>`;
    }
    function go(k) {
      if (!data || !data.events.length) return;
      idx = Math.max(0, Math.min(data.events.length - 1, k));
      const ev = data.events[idx], pv = data.events[idx - 1];
      const pmap = {};
      if (pv) pv.vars.forEach((v) => (pmap[v.n] = v));
      const lineText = (codeAt.split("\n")[ev.line - 1] || "").trim();
      $(".d-line").innerHTML = `Dòng <b>${ev.line}</b> (lần thứ ${hits[idx]}): <code>${esc(lineText)}</code>` + (stale ? ' <span class="badge warn">code đã sửa — bấm Bắt đầu gỡ lỗi để chạy lại</span>' : "");
      $(".d-vars").innerHTML = ev.vars.length ? ev.vars.map((v) => varHTML(v, pv ? pmap[v.n] : null)).join("") : '<span class="muted small">(chưa có biến nào trong phạm vi)</span>';
      $(".d-out").textContent = data.output.slice(0, ev.out) || "(chưa in gì)";
      $(".d-scrub").value = idx;
      $(".d-step").textContent = `Bước ${idx + 1}/${data.events.length}`;
      if (!stale) ws.ed.setDebugLine(ev.line);
    }
    function cont() {
      if (!data) return;
      const bps = ws.ed.bps;
      for (let k = idx + 1; k < data.events.length; k++) if (bps.has(data.events[k].line)) { go(k); return; }
      go(data.events.length - 1);
      H.toast(bps.size ? "Không còn breakpoint nào phía sau — đã tới bước cuối" : "Chưa đặt breakpoint: bấm vào số dòng trong editor");
    }
    function stop() { if (timer) clearInterval(timer); timer = null; const b = $('[data-d="play"]'); if (b) b.textContent = "▶▶ Tự chạy"; }
    pane.addEventListener("click", (e) => {
      const b = e.target.closest("[data-d]");
      if (!b) return;
      const a = b.dataset.d;
      if (a !== "play") stop();
      if (a === "start") start();
      if (a === "first") go(0);
      if (a === "back") go(idx - 1);
      if (a === "step") go(idx + 1);
      if (a === "cont") cont();
      if (a === "play") {
        if (timer) { stop(); return; }
        b.textContent = "⏸ Dừng";
        timer = setInterval(() => { if (!data || idx >= data.events.length - 1) { stop(); return; } go(idx + 1); }, 350);
      }
    });
    $(".d-scrub").addEventListener("input", (e) => { stop(); go(+e.target.value); });
    document.addEventListener("keydown", (e) => {
      if (!data || pane.hidden) return;
      if (e.key === "F10") { e.preventDefault(); stop(); go(idx + (e.shiftKey ? -1 : 1)); }
      if (e.key === "F8") { e.preventDefault(); stop(); cont(); }
    });
    return {
      start,
      setInput(v) { $(".d-in").value = v; },
      codeChanged() { if (data && !stale) { stale = true; ws.ed.setDebugLine(null); go(idx); } },
      clearLine() { ws.ed.setDebugLine(null); },
    };
  }

  /** Gắn 2 tab vào Workspace */
  function attach(ws, opts = {}) {
    const tabs = ws.$(".tabs");
    const card = tabs.parentElement;
    if (!opts.noGuide) {
      tabs.insertAdjacentHTML("afterbegin", '<button data-tab="guide">Từng bước</button>');
      card.insertAdjacentHTML("beforeend", '<div data-pane="guide" hidden></div>');
    }
    tabs.insertAdjacentHTML("beforeend", '<button data-tab="dbg">Gỡ lỗi <span class="badge d-new"></span></button>');
    card.insertAdjacentHTML("beforeend", '<div data-pane="dbg" hidden></div>');
    const guide = opts.noGuide ? null : attachGuide(ws);
    const dbg = attachDebugger(ws);
    tabs.addEventListener("click", (e) => {
      const t = e.target.closest("[data-tab]");
      if (!t) return;
      if (t.dataset.tab === "guide" && guide) guide.load();
      if (t.dataset.tab === "dbg") ws.$(".d-new").textContent = "";
      else dbg.clearLine();
    });
    const badge = () => { const b = ws.$(".d-new"); b.textContent = "mới"; b.className = "badge acc d-new"; };
    return {
      // Sau khi Chạy thử: tự tạo mô phỏng code của bạn với cùng input
      async afterRun(input, r) {
        if (!r || r.status === "CE" || input.length > 5000) return;
        const res = await dbg.start(input);
        if (res && res.events && res.events.length) badge();
      },
      // Sau khi nộp bị sai: tự gỡ lỗi trên test sai nhỏ nhất (nếu đủ nhỏ)
      async afterJudge(r, box) {
        const d = r.detail;
        if (!d || !d.input || d.input.endsWith("(đã cắt bớt)")) return;
        const btn = document.createElement("button");
        btn.className = "btn sm primary";
        btn.textContent = "🐞 Gỡ lỗi code của tôi trên test này";
        btn.onclick = () => { ws.tab("dbg"); dbg.start(d.input); };
        const where = box.querySelector("[data-use-input]");
        if (where) where.parentElement.appendChild(btn);
        if (d.input.length <= 3000) { const res = await dbg.start(d.input); if (res && res.events && res.events.length) badge(); }
      },
      codeChanged: () => dbg.codeChanged(),
    };
  }

  window.GuideDebug = { attach };
})();
