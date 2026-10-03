/* ============================================================
   Bộ máy mô phỏng dùng chung.
   Mỗi thuật toán chỉ cần khai báo:
     - code: các dòng code C++ hiển thị bên phải
     - inputs: ô nhập dữ liệu
     - build(values): chạy thuật toán và trả về DANH SÁCH KHUNG HÌNH
       mỗi khung: { line, msg, vars:{...}, arrays:[{name, values, marks:{i:'cur'|'done'|'range'|'bad'|'pur'|'dim'}, tags:{i:'l'}, base}],
                    grids:[{name, cells:[[..]], marks:{"i,j":cls}, base}] }
   Bộ máy lo phần: Bước tiếp / Lùi / Chạy / Đặt lại, thanh tốc độ,
   thanh kéo bước, tô dòng code, hiện biến (biến vừa đổi tô đỏ).
   ============================================================ */
(function () {
  "use strict";
  const { esc, highlight, el } = window.HSG;
  window.SIMS = window.SIMS || {};

  const LEGEND = `<div class="legend">
    <span><i style="background:var(--warn-soft);border-color:var(--warn)"></i>đang xét</span>
    <span><i style="background:var(--accent-soft);border-color:var(--accent)"></i>trong đoạn / đang dùng</span>
    <span><i style="background:var(--ok-soft);border-color:var(--ok)"></i>đã xong</span>
    <span><i style="background:var(--purple-soft);border-color:var(--purple)"></i>giá trị được đọc</span>
    <span><i style="background:var(--bad-soft);border-color:var(--bad)"></i>cần chú ý</span></div>`;

  function renderArray(a) {
    const base = a.base == null ? 0 : a.base;
    let h = `<div class="arr"><div class="arr-name">${esc(a.name)}</div>`;
    a.values.forEach((v, k) => {
      const cls = (a.marks && a.marks[k]) ? "m-" + a.marks[k] : "";
      const tag = (a.tags && a.tags[k]) || "";
      h += `<div class="cell ${cls}"><div class="tag">${esc(tag)}</div><div class="v">${v === null || v === undefined ? "" : esc(v)}</div><div class="i">${k + base}</div></div>`;
    });
    return h + "</div>";
  }
  function renderGrid(g) {
    const base = g.base == null ? 0 : g.base;
    const rows = g.cells.length, cols = g.cells[0].length;
    let h = `<div><div class="small muted" style="font-family:var(--mono)">${esc(g.name)}</div><div class="grid2d" style="grid-template-columns: 26px repeat(${cols}, auto)"><div></div>`;
    for (let j = 0; j < cols; j++) h += `<div class="h">${j + base}</div>`;
    for (let i = 0; i < rows; i++) {
      h += `<div class="h">${i + base}</div>`;
      for (let j = 0; j < cols; j++) {
        const m = g.marks && g.marks[i + "," + j];
        const v = g.cells[i][j];
        h += `<div class="g ${m ? "m-" + m : ""}">${v === null || v === undefined ? "" : esc(v)}</div>`;
      }
    }
    return h + "</div></div>";
  }

  class SimPlayer {
    constructor(host, spec) {
      this.spec = spec;
      this.frames = [];
      this.idx = 0;
      this.timer = null;
      host.classList.add("sim");
      host.innerHTML = `
        <div class="sim-head">${esc(spec.title || "Mô phỏng")}</div>
        <div class="sim-inputs"></div>
        <div class="sim-err"></div>
        <div class="sim-body">
          <div class="sim-view"></div>
          <div class="sim-side"><div class="sim-code"></div><div class="sim-vars"></div></div>
        </div>
        <div class="sim-msg"></div>
        <div class="sim-ctrl">
          <button class="btn sm" data-c="reset" title="Về bước đầu">⏮ Đặt lại</button>
          <button class="btn sm" data-c="prev" title="Phím ←">◀ Lùi</button>
          <button class="btn sm primary" data-c="next" title="Phím →">Bước tiếp ▶</button>
          <button class="btn sm" data-c="play">▶▶ Chạy</button>
          <span class="small muted">Tốc độ</span><input type="range" min="1" max="10" value="5" class="speed">
          <input type="range" class="scrub" min="0" value="0">
          <span class="small muted step"></span>
        </div>`;
      this.host = host;
      this.$ = (s) => host.querySelector(s);
      // ô nhập
      const ins = this.$(".sim-inputs");
      for (const inp of spec.inputs || []) {
        const lab = el("label", {}, esc(inp.label));
        let f;
        if (inp.type === "select") {
          f = el("select", {}, inp.options.map((o) => `<option value="${esc(o[0])}">${esc(o[1])}</option>`).join(""));
          f.value = inp.value;
          f.addEventListener("change", () => this.load());
        } else if (inp.type === "textarea") {
          f = el("textarea", { rows: inp.rows || 3 });
          f.value = inp.value;
        } else {
          f = el("input", { type: "text" });
          f.value = inp.value;
          if (inp.width) f.style.minWidth = inp.width;
        }
        f.dataset.id = inp.id;
        lab.appendChild(f);
        ins.appendChild(lab);
      }
      const run = el("button", { class: "btn primary" }, "Nạp dữ liệu");
      run.onclick = () => this.load();
      ins.appendChild(run);
      if (spec.presets) {
        for (const [name, vals] of spec.presets) {
          const b = el("button", { class: "btn sm" }, esc(name));
          b.onclick = () => { for (const [k, v] of Object.entries(vals)) { const f = ins.querySelector(`[data-id="${k}"]`); if (f) f.value = v; } this.load(); };
          ins.appendChild(b);
        }
      }
      ins.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.tagName === "INPUT") this.load(); });
      // code
      this.$(".sim-code").innerHTML = spec.code.map((l, k) => `<div data-l="${k + 1}"><span class="ln">${k + 1}</span>${highlight(l) || " "}</div>`).join("");
      // điều khiển
      this.$(".sim-ctrl").addEventListener("click", (e) => {
        const b = e.target.closest("[data-c]");
        if (!b) return;
        const c = b.dataset.c;
        if (c === "reset") { this.stop(); this.go(0); }
        if (c === "prev") { this.stop(); this.go(this.idx - 1); }
        if (c === "next") { this.stop(); this.go(this.idx + 1); }
        if (c === "play") this.timer ? this.stop() : this.play();
      });
      this.$(".scrub").addEventListener("input", (e) => { this.stop(); this.go(+e.target.value); });
      this.$(".speed").addEventListener("input", () => { if (this.timer) { this.stop(); this.play(); } });
      host.tabIndex = 0;
      host.addEventListener("keydown", (e) => {
        if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
        if (e.key === "ArrowRight") { e.preventDefault(); this.stop(); this.go(this.idx + 1); }
        if (e.key === "ArrowLeft") { e.preventDefault(); this.stop(); this.go(this.idx - 1); }
        if (e.key === " ") { e.preventDefault(); this.timer ? this.stop() : this.play(); }
      });
      this.load();
    }
    values() {
      const v = {};
      this.host.querySelectorAll("[data-id]").forEach((f) => (v[f.dataset.id] = f.value));
      return v;
    }
    load() {
      this.stop();
      const err = this.$(".sim-err");
      err.textContent = "";
      try {
        this.frames = this.spec.build(this.values());
        if (!this.frames.length) throw new Error("Không có bước nào để mô phỏng.");
      } catch (e) {
        err.textContent = "Dữ liệu chưa hợp lệ: " + e.message;
        return;
      }
      this.$(".scrub").max = this.frames.length - 1;
      this.go(0);
    }
    play() {
      if (this.idx >= this.frames.length - 1) this.go(0);
      const sp = +this.$(".speed").value;
      const delay = Math.round(1600 / sp);
      this.$('[data-c="play"]').textContent = "⏸ Tạm dừng";
      this.timer = setInterval(() => {
        if (this.idx >= this.frames.length - 1) { this.stop(); return; }
        this.go(this.idx + 1);
      }, delay);
    }
    stop() {
      if (this.timer) clearInterval(this.timer);
      this.timer = null;
      const b = this.$('[data-c="play"]');
      if (b) b.textContent = "▶▶ Chạy";
    }
    go(k) {
      if (!this.frames.length) return;
      k = Math.max(0, Math.min(this.frames.length - 1, k));
      this.idx = k;
      const f = this.frames[k];
      const prev = this.frames[k - 1];
      // vùng hình
      let h = "";
      if (this.spec.render) h = this.spec.render(f);
      else {
        for (const a of f.arrays || []) h += renderArray(a);
        for (const g of f.grids || []) h += renderGrid(g);
        if (f.html) h += f.html;
        h += LEGEND;
      }
      this.$(".sim-view").innerHTML = h;
      // dòng code
      this.host.querySelectorAll(".sim-code div").forEach((d) => d.classList.toggle("hl", +d.dataset.l === f.line));
      const hl = this.host.querySelector(".sim-code div.hl");
      if (hl) { const box = this.$(".sim-code"); const t = hl.offsetTop - box.offsetTop; if (t < box.scrollTop || t > box.scrollTop + box.clientHeight - 20) box.scrollTop = t - 40; }
      // biến
      const vars = f.vars || {};
      const pv = (prev && prev.vars) || {};
      this.$(".sim-vars").innerHTML = Object.keys(vars).length
        ? Object.entries(vars).map(([n, v]) => `<span class="${prev && pv[n] !== v ? "changed" : ""}">${esc(n)} = <b>${esc(v)}</b></span>`).join("")
        : '<span class="muted">(không có biến)</span>';
      this.$(".sim-msg").innerHTML = f.msg || "";
      this.$(".scrub").value = k;
      this.$(".step").textContent = `Bước ${k + 1}/${this.frames.length}`;
    }
  }

  /** Tiện ích cho file sims: đọc dãy số từ chuỗi */
  function parseNums(s, { min = 1, max = 20, lo = -1e9, hi = 1e9, name = "dãy" } = {}) {
    const a = s.trim().split(/[\s,;]+/).filter(Boolean).map(Number);
    if (a.some((x) => !Number.isInteger(x))) throw new Error(`${name} chỉ được chứa số nguyên`);
    if (a.length < min || a.length > max) throw new Error(`${name} cần từ ${min} đến ${max} số`);
    if (a.some((x) => x < lo || x > hi)) throw new Error(`mỗi số trong ${name} phải nằm trong [${lo}, ${hi}]`);
    return a;
  }

  window.SimPlayer = SimPlayer;
  window.SimUtil = { parseNums, renderArray, renderGrid };
})();
