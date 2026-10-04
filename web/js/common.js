/* ============================================================
   Dùng chung cho mọi trang: giao diện sáng/tối, thanh điều hướng,
   lưu trữ localStorage, gọi API, tô màu C++, markdown, đồng hồ.
   ============================================================ */
(function () {
  "use strict";

  // ---------------------------------------------------------------- lưu trữ
  const Store = {
    get(key, def) {
      try {
        const v = localStorage.getItem("hsg." + key);
        return v === null ? def : JSON.parse(v);
      } catch (e) { return def; }
    },
    set(key, val) {
      try { localStorage.setItem("hsg." + key, JSON.stringify(val)); } catch (e) { /* bộ nhớ đầy / bị chặn */ }
    },
    del(key) { try { localStorage.removeItem("hsg." + key); } catch (e) {} },
  };

  const Progress = {
    all() { return Store.get("progress", { read: {}, best: {}, blocks: {} }); },
    save(p) { Store.set("progress", p); },
    markRead(topic, on = true) { const p = this.all(); if (on) p.read[topic] = Date.now(); else delete p.read[topic]; this.save(p); },
    isRead(topic) { return !!this.all().read[topic]; },
    best(pid) { return this.all().best[pid]; },
    record(pid, score, max) {
      const p = this.all();
      const old = p.best[pid];
      if (!old || score > old.score) p.best[pid] = { score, max };
      this.save(p);
    },
    toggleBlock(id, on) { const p = this.all(); p.blocks = p.blocks || {}; if (on) p.blocks[id] = 1; else delete p.blocks[id]; this.save(p); },
    blockDone(id) { return !!(this.all().blocks || {})[id]; },
    /** % hoàn thành 1 chủ đề = (đã học lý thuyết ? 1 : 0) + tổng (điểm/điểm tối đa) các bài, chia cho (1 + số bài) */
    topicPercent(topic) {
      const p = this.all();
      let got = p.read[topic.id] ? 1 : 0;
      for (const pid of topic.problems || []) {
        const b = p.best[pid];
        if (b) got += b.score / (b.max || 100);
      }
      return Math.round(100 * got / (1 + (topic.problems || []).length));
    },
  };

  const History = {
    all() { return Store.get("history", []); },
    add(item) {
      const h = this.all();
      h.unshift(item);
      Store.set("history", h.slice(0, 300));
    },
    forProblem(pid) { return this.all().filter((x) => x.pid === pid); },
  };

  // ---------------------------------------------------------------- API
  async function api(path, body) {
    const opt = body === undefined ? {} : {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    };
    const r = await fetch(path, opt);
    const data = await r.json().catch(() => ({ error: "Phản hồi không hợp lệ" }));
    if (data.error === "Không có API này") throw new Error("Server đang chạy là bản cũ. Hãy đóng cửa sổ đen cũ rồi chạy lại CHAY_WEB.bat.");
    if (!r.ok || data.error) throw new Error(data.error || ("HTTP " + r.status));
    return data;
  }
  async function getJSON(url) {
    const r = await fetch(url, { cache: "no-cache" });
    if (!r.ok) throw new Error("Không tải được " + url);
    return r.json();
  }
  async function getText(url) {
    const r = await fetch(url, { cache: "no-cache" });
    if (!r.ok) throw new Error("Không tải được " + url);
    return r.text();
  }

  // ---------------------------------------------------------------- tiện ích
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  function el(tag, attrs = {}, html = "") {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") e.className = v; else if (k.startsWith("on")) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v);
    }
    if (html) e.innerHTML = html;
    return e;
  }
  function qs(name) { return new URLSearchParams(location.search).get(name); }
  function fmtTime(ms, withHours = true) {
    ms = Math.max(0, Math.round(ms / 1000));
    const h = Math.floor(ms / 3600), m = Math.floor((ms % 3600) / 60), s = ms % 60;
    const p = (x) => String(x).padStart(2, "0");
    return withHours || h ? `${p(h)}:${p(m)}:${p(s)}` : `${p(m)}:${p(s)}`;
  }
  function fmtDate(ts) {
    const d = new Date(ts);
    const p = (x) => String(x).padStart(2, "0");
    return `${p(d.getHours())}:${p(d.getMinutes())} ${p(d.getDate())}/${p(d.getMonth() + 1)}`;
  }
  let toastTimer;
  function toast(msg) {
    let t = $(".toast");
    if (!t) { t = el("div", { class: "toast" }); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }
  function copyText(s) {
    if (navigator.clipboard) navigator.clipboard.writeText(s).then(() => toast("Đã sao chép"));
    else { const ta = el("textarea"); ta.value = s; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); toast("Đã sao chép"); }
  }
  const VERDICT_VI = { AC: "Đúng (AC)", WA: "Sai kết quả (WA)", TLE: "Quá thời gian (TLE)", RE: "Lỗi khi chạy (RE)", CE: "Lỗi biên dịch (CE)" };

  // ---------------------------------------------------------------- tô màu C++
  const KW = new Set("if else for while do switch case default break continue return goto using namespace struct class public private protected template typename const constexpr static inline new delete sizeof true false nullptr this operator auto typedef enum friend virtual try catch throw".split(" "));
  const TYPES = new Set("int long short char bool void float double unsigned signed size_t string vector map set pair queue stack deque priority_queue unordered_map unordered_set multiset array bitset tuple ll pii pll ull std cin cout cerr endl int64_t uint64_t".split(" "));
  /** Trả về danh sách token {t: loại, s: chuỗi, p: vị trí} */
  function tokenize(src) {
    const out = [];
    let i = 0;
    const n = src.length;
    let lineStart = true;
    while (i < n) {
      const c = src[i];
      const st = i;
      if (c === "\n") { out.push({ t: "", s: c, p: st }); i++; lineStart = true; continue; }
      if (c === " " || c === "\t" || c === "\r") { while (i < n && (src[i] === " " || src[i] === "\t" || src[i] === "\r")) i++; out.push({ t: "", s: src.slice(st, i), p: st }); continue; }
      if (c === "/" && src[i + 1] === "/") { while (i < n && src[i] !== "\n") i++; out.push({ t: "com", s: src.slice(st, i), p: st }); continue; }
      if (c === "/" && src[i + 1] === "*") { const e = src.indexOf("*/", i + 2); i = e < 0 ? n : e + 2; out.push({ t: "com", s: src.slice(st, i), p: st }); lineStart = false; continue; }
      if (c === "#" && lineStart) {
        while (i < n && src[i] !== "\n" && !(src[i] === "/" && (src[i + 1] === "/" || src[i + 1] === "*"))) i++;
        out.push({ t: "pre", s: src.slice(st, i), p: st }); lineStart = false; continue;
      }
      lineStart = false;
      if (c === '"' || c === "'") {
        i++;
        while (i < n && src[i] !== c && src[i] !== "\n") { if (src[i] === "\\") i++; i++; }
        i = Math.min(n, i + 1);
        out.push({ t: c === '"' ? "str" : "chr", s: src.slice(st, i), p: st }); continue;
      }
      if (/[0-9]/.test(c) || (c === "." && /[0-9]/.test(src[i + 1] || ""))) {
        while (i < n && /[0-9a-zA-Z_.']/.test(src[i])) { if ((src[i] === "e" || src[i] === "E") && (src[i + 1] === "-" || src[i + 1] === "+")) i++; i++; }
        out.push({ t: "num", s: src.slice(st, i), p: st }); continue;
      }
      if (/[A-Za-z_]/.test(c)) {
        while (i < n && /[A-Za-z0-9_]/.test(src[i])) i++;
        const w = src.slice(st, i);
        out.push({ t: KW.has(w) ? "kw" : TYPES.has(w) ? "type" : "", s: w, p: st }); continue;
      }
      i++;
      out.push({ t: "op", s: c, p: st });
    }
    return out;
  }
  /** Tô màu thành HTML. marks: Set các vị trí cần tô nổi (cặp ngoặc). */
  function highlight(src, marks) {
    let html = "";
    for (const tk of tokenize(src)) {
      const s = esc(tk.s);
      if (marks && tk.t === "op" && marks.has(tk.p)) html += `<span class="tk-op tk-br">${s}</span>`;
      else html += tk.t ? `<span class="tk-${tk.t}">${s}</span>` : s;
    }
    return html;
  }

  // ---------------------------------------------------------------- markdown
  function inline(s) {
    // thay `code` bằng ký hiệu tạm để không xử lý bên trong, định dạng xong mới trả lại
    const codes = [];
    let x = s.replace(/`([^`]+)`/g, (m, c) => { codes.push("<code>" + esc(c) + "</code>"); return "\u0000" + (codes.length - 1) + "\u0000"; });
    x = esc(x);
    x = x.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
    x = x.replace(/(^|[^*])\*([^*\s][^*]*?)\*/g, "$1<i>$2</i>");
    x = x.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, u) => `<a href="${u}">${t}</a>`);
    return x.replace(/\u0000(\d+)\u0000/g, (m, k) => codes[+k]);
  }
  function slug(s) {
    return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }
  /** Markdown đơn giản -> HTML. Hỗ trợ: tiêu đề, đoạn, danh sách, bảng, trích dẫn (> [!TIP] / [!WARN] / [!NOTE]),
   *  khối code (```cpp / ```input / ```output), [[SLOT:tên]] để chèn mô phỏng. */
  function md(src) {
    const lines = src.replace(/\r/g, "").split("\n");
    let html = "";
    let i = 0;
    let codeId = 0;
    let pendingSample = null;
    const flushSample = () => {
      if (pendingSample) { html += `<div class="sample">${pendingSample}</div>`; pendingSample = null; }
    };
    while (i < lines.length) {
      const L = lines[i];
      const fence = L.match(/^```(\w*)\s*$/);
      if (fence) {
        const lang = fence[1];
        const buf = [];
        i++;
        while (i < lines.length && !/^```\s*$/.test(lines[i])) buf.push(lines[i++]);
        i++;
        const code = buf.join("\n");
        const id = "cb" + (++codeId);
        if (lang === "input" || lang === "output") {
          const box = `<div class="codebox" data-sample="${lang}"><div class="codebox-h"><span>${lang === "input" ? "Input" : "Output"}</span><button class="btn sm ghost" data-copy="${id}">Sao chép</button></div><pre id="${id}">${esc(code)}</pre></div>`;
          if (lang === "input") { flushSample(); pendingSample = box; } else { pendingSample = (pendingSample || "") + box; flushSample(); }
          continue;
        }
        flushSample();
        const body = lang === "cpp" || lang === "c++" ? highlight(code) : esc(code);
        html += `<div class="codebox"><div class="codebox-h"><span>${lang === "cpp" ? "C++" : esc(lang || "")}</span><button class="btn sm ghost" data-copy="${id}">Sao chép</button></div><pre id="${id}">${body}</pre></div>`;
        continue;
      }
      flushSample();
      if (/^\s*$/.test(L)) { i++; continue; }
      let m;
      if ((m = L.match(/^\[\[(\w+)(?::([\w-]+))?\]\]\s*$/))) {
        html += `<div data-slot="${m[1]}" data-arg="${m[2] || ""}"></div>`; i++; continue;
      }
      if ((m = L.match(/^(#{1,3})\s+(.*)$/))) {
        const lv = m[1].length;
        html += `<h${lv} id="${slug(m[2])}">${inline(m[2])}</h${lv}>`; i++; continue;
      }
      if (/^---+\s*$/.test(L)) { html += "<hr>"; i++; continue; }
      if (L.startsWith(">")) {
        const buf = [];
        while (i < lines.length && lines[i].startsWith(">")) buf.push(lines[i++].replace(/^>\s?/, ""));
        let cls = "";
        const t = buf[0].match(/^\[!(TIP|WARN|NOTE)\]\s*/);
        if (t) { cls = t[1].toLowerCase(); buf[0] = buf[0].slice(t[0].length); }
        html += `<blockquote class="${cls}">${md(buf.join("\n"))}</blockquote>`;
        continue;
      }
      if (L.startsWith("|")) {
        const rows = [];
        while (i < lines.length && lines[i].startsWith("|")) rows.push(lines[i++]);
        const cells = (r) => r.replace(/^\||\|\s*$/g, "").split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, "|"));
        let t = "<table><thead><tr>" + cells(rows[0]).map((c) => `<th>${inline(c)}</th>`).join("") + "</tr></thead><tbody>";
        for (const r of rows.slice(2)) t += "<tr>" + cells(r).map((c) => `<td>${inline(c)}</td>`).join("") + "</tr>";
        html += t + "</tbody></table>";
        continue;
      }
      if (/^\s*([-*]|\d+\.)\s+/.test(L)) {
        const ordered = /^\s*\d+\./.test(L);
        const items = [];
        while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) {
          let item = lines[i++].replace(/^\s*([-*]|\d+\.)\s+/, "");
          while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*([-*]|\d+\.)\s+/.test(lines[i])) item += " " + lines[i++].trim();
          items.push(`<li>${inline(item)}</li>`);
        }
        html += ordered ? `<ol>${items.join("")}</ol>` : `<ul>${items.join("")}</ul>`;
        continue;
      }
      const buf = [];
      while (i < lines.length && lines[i].trim() && !/^(#{1,3}\s|```|>|\||\s*([-*]|\d+\.)\s|\[\[)/.test(lines[i])) buf.push(lines[i++]);
      if (!buf.length) { buf.push(lines[i++]); }
      html += `<p>${inline(buf.join(" "))}</p>`;
    }
    flushSample();
    return html;
  }
  /** Gắn nút "Sao chép" cho các khối code trong root */
  function wireCopy(root) {
    root.addEventListener("click", (e) => {
      const b = e.target.closest("[data-copy]");
      if (b) copyText(document.getElementById(b.dataset.copy).textContent);
    });
  }

  // ---------------------------------------------------------------- giao diện sáng/tối
  function applyTheme() {
    const t = Store.get("theme", null);
    if (t) document.documentElement.setAttribute("data-theme", t);
    else document.documentElement.removeAttribute("data-theme");
  }
  function toggleTheme() {
    const cur = document.documentElement.getAttribute("data-theme") ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    Store.set("theme", cur === "dark" ? "light" : "dark");
    applyTheme();
  }
  applyTheme();

  // ---------------------------------------------------------------- thanh điều hướng
  function header(active) {
    const links = [
      ["index.html", "Lộ trình", "home"],
      ["topic.html?id=complexity", "Chủ đề", "topic"],
      ["problems.html", "Bài tập", "problems"],
      ["exam.html", "Thi thử 180'", "exam"],
      ["history.html", "Lịch sử nộp", "history"],
    ];
    const bar = el("header", { class: "topbar" });
    bar.innerHTML = `<div class="topbar-in">
      <a class="brand" href="index.html"><span class="brand-mark">{}</span>HSG Tin 10</a>
      <nav class="nav">${links.map(([h, t, k]) => `<a href="${h}" class="${k === active ? "active" : ""}">${t}</a>`).join("")}</nav>
      <span class="server-dot" id="server-dot">đang kết nối…</span>
      <button class="btn sm" id="theme-btn" title="Đổi giao diện sáng/tối">◐ Sáng/Tối</button>
    </div>`;
    document.body.prepend(bar);
    $("#theme-btn").onclick = toggleTheme;
    checkServer();
  }
  let serverInfo = null;
  async function checkServer() {
    const dot = $("#server-dot");
    try {
      serverInfo = await api("/api/status");
      if ((serverInfo.version || 0) < 4) {
        const main = $("main") || document.body;
        main.prepend(el("div", { class: "banner" }, "Đang chạy <b>server bản cũ</b> nên một số chức năng mới (gỡ lỗi, gợi ý code, từng bước) sẽ báo lỗi. Hãy <b>đóng cửa sổ đen cũ</b> (hoặc nhấn Ctrl+C trong đó), rồi nhấp đúp <b>CHAY_WEB.bat</b> lại và tải lại trang."));
      }
      if (dot) {
        dot.className = "server-dot " + (serverInfo.gpp ? "on" : "off");
        dot.textContent = serverInfo.gpp ? "Bộ chấm sẵn sàng" : "Thiếu g++";
        dot.title = serverInfo.gpp || "Không tìm thấy g++ - xem HUONG_DAN.md";
      }
    } catch (e) {
      if (dot) { dot.className = "server-dot off"; dot.textContent = "Chưa chạy server"; }
      const main = $("main") || document.body;
      const b = el("div", { class: "banner" }, "Không kết nối được bộ chấm. Hãy mở website bằng cách <b>nhấp đúp file CHAY_WEB.bat</b> (đừng mở trực tiếp file .html), rồi tải lại trang này.");
      main.prepend(b);
    }
    return serverInfo;
  }

  // ---------------------------------------------------------------- đồng hồ (bấm giờ + hẹn giờ)
  const Timer = {
    st() {
      return Store.get("timer", { mode: "stopwatch", running: false, start: 0, acc: 0, dur: 25 * 60000, label: "", alarmed: false });
    },
    save(s) { Store.set("timer", s); },
    elapsed(s) { return s.acc + (s.running ? Date.now() - s.start : 0); },
    display(s) {
      const e = this.elapsed(s);
      return s.mode === "stopwatch" ? e : Math.max(0, s.dur - e);
    },
    start() { const s = this.st(); if (!s.running) { s.running = true; s.start = Date.now(); s.alarmed = false; this.save(s); } },
    pause() { const s = this.st(); if (s.running) { s.acc += Date.now() - s.start; s.running = false; this.save(s); } },
    reset() { const s = this.st(); s.running = false; s.acc = 0; s.alarmed = false; this.save(s); },
    countdown(minutes, label) {
      this.save({ mode: "countdown", running: true, start: Date.now(), acc: 0, dur: minutes * 60000, label: label || "", alarmed: false });
    },
    setMode(mode) { const s = this.st(); s.mode = mode; s.running = false; s.acc = 0; s.alarmed = false; this.save(s); },
  };
  function beep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [0, 0.35, 0.7].forEach((t) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.frequency.value = 880; o.connect(g); g.connect(ctx.destination);
        g.gain.setValueAtTime(0.25, ctx.currentTime + t); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.3);
        o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + 0.3);
      });
    } catch (e) {}
  }
  function timerWidget() {
    const fab = el("button", { class: "timer-fab", title: "Đồng hồ học tập" });
    const panel = el("div", { class: "timer-panel" });
    panel.innerHTML = `
      <div class="tabs" style="margin-bottom:6px"><button data-m="stopwatch">Bấm giờ</button><button data-m="countdown">Hẹn giờ</button></div>
      <div class="label" id="tm-label"></div>
      <div class="big" id="tm-big">00:00:00</div>
      <div class="row" style="justify-content:center">
        <button class="btn primary" id="tm-go">Bắt đầu</button>
        <button class="btn" id="tm-reset">Đặt lại</button>
      </div>
      <div id="tm-cd">
        <div class="presets">${[15, 25, 45, 60, 90, 120, 180].map((m) => `<button class="btn sm" data-min="${m}">${m}'</button>`).join("")}</div>
        <div class="row"><input type="number" id="tm-min" min="1" max="600" value="30" style="width:80px"> <span class="small muted">phút</span>
          <button class="btn sm" id="tm-set">Đặt</button></div>
      </div>
      <p class="small muted" style="margin:10px 0 0">Đồng hồ vẫn chạy khi bạn chuyển trang. Hết giờ sẽ có chuông báo.</p>`;
    document.body.append(fab, panel);
    fab.onclick = () => panel.classList.toggle("open");
    $$("[data-m]", panel).forEach((b) => (b.onclick = () => { Timer.setMode(b.dataset.m); render(); }));
    $("#tm-go", panel).onclick = () => { const s = Timer.st(); s.running ? Timer.pause() : Timer.start(); render(); };
    $("#tm-reset", panel).onclick = () => { Timer.reset(); render(); };
    $$("[data-min]", panel).forEach((b) => (b.onclick = () => { Timer.countdown(+b.dataset.min, ""); render(); }));
    $("#tm-set", panel).onclick = () => { const v = +$("#tm-min", panel).value; if (v > 0) { Timer.countdown(v, ""); render(); } };
    function render() {
      const s = Timer.st();
      const ms = Timer.display(s);
      const done = s.mode === "countdown" && s.running && ms <= 0;
      if (done && !s.alarmed) {
        s.alarmed = true; s.running = false; s.acc = s.dur; Timer.save(s);
        beep(); toast("Hết giờ" + (s.label ? ": " + s.label : "") + "!");
        fab.classList.add("alarm");
        setTimeout(() => fab.classList.remove("alarm"), 15000);
      }
      fab.innerHTML = `<span>⏱</span><span>${fmtTime(ms)}</span>`;
      fab.classList.toggle("running", s.running);
      $("#tm-big", panel).textContent = fmtTime(ms);
      $("#tm-label", panel).textContent = s.label || (s.mode === "stopwatch" ? "Bấm giờ" : "Hẹn giờ " + Math.round(s.dur / 60000) + " phút");
      $("#tm-go", panel).textContent = s.running ? "Tạm dừng" : "Bắt đầu";
      $$("[data-m]", panel).forEach((b) => b.classList.toggle("on", b.dataset.m === s.mode));
      $("#tm-cd", panel).style.display = s.mode === "countdown" ? "" : "none";
    }
    render();
    setInterval(render, 500);
    window.addEventListener("storage", render);
    return { render };
  }

  // ---------------------------------------------------------------- khởi tạo trang
  function initPage(active, opts = {}) {
    header(active);
    if (opts.timer !== false) window.HSG.timerUI = timerWidget();
  }

  window.HSG = {
    Store, Progress, History, Timer, api, getJSON, getText, esc, $, $$, el, qs, fmtTime, fmtDate, toast, copyText,
    tokenize, highlight, md, wireCopy, initPage, checkServer, VERDICT_VI, beep,
    get serverInfo() { return serverInfo; },
  };
})();
