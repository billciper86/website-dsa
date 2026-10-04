/* ============================================================
   CBEditor - trình soạn thảo C++ chạy trong trình duyệt, mô phỏng
   cách dùng của Code::Blocks: tô màu cú pháp cùng bảng màu mặc định,
   số dòng, tô dòng hiện tại, tô cặp ngoặc, tự thụt lề, tự đóng ngoặc,
   và các phím tắt quen thuộc:
     F9            Build & Run (Chạy thử với input tự nhập)
     Ctrl+Enter    Nộp bài để chấm
     Ctrl+S        Lưu nháp
     Ctrl+D        Nhân đôi dòng (giống Code::Blocks)
     Ctrl+/        Bật/tắt chú thích //
     Tab/Shift+Tab Thụt lề / bỏ thụt lề (cả khối dòng đang chọn)
   (Code::Blocks là phần mềm desktop nên không nhúng được vào web;
    editor này là bản viết lại gọn nhẹ, chạy offline, không cần thư viện.)
   ============================================================ */
(function () {
  "use strict";
  const { esc, highlight, el, toast } = window.HSG;

  const TEMPLATE = `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    return 0;
}
`;
  const PAIRS = { "(": ")", "[": "]", "{": "}", '"': '"', "'": "'" };
  const CLOSERS = new Set([")", "]", "}"]);

  class CBEditor {
    /**
     * @param {HTMLElement} host
     * @param {{value?:string, filename?:string, onChange?:Function, onRun?:Function, onSubmit?:Function, onSave?:Function}} opts
     */
    constructor(host, opts = {}) {
      this.opts = opts;
      this.fs = +(window.HSG.Store.get("editorFont", 14));
      host.classList.add("cbe");
      host.innerHTML = `
        <div class="cbe-tb">
          <span class="cbe-tab">${esc(opts.filename || "main.cpp")}</span>
          <button class="btn" data-a="open" title="Mở file .cpp (ví dụ file viết trong Code::Blocks)">Mở file</button>
          <button class="btn" data-a="save" title="Tải code về máy dạng .cpp">Lưu .cpp</button>
          <button class="btn" data-a="tpl" title="Chèn khung code mẫu thi HSG">Khung mẫu</button>
          <button class="btn" data-a="fmt" title="Căn lề lại toàn bộ code">Căn lề</button>
          <span class="grow"></span>
          <button class="btn" data-a="fs-" title="Chữ nhỏ hơn">A−</button>
          <button class="btn" data-a="fs+" title="Chữ to hơn">A+</button>
          <input type="file" accept=".cpp,.cc,.c,.txt,.h" hidden>
        </div>
        <div class="cbe-scroll"><div class="cbe-inner">
          <div class="cbe-gutter"></div>
          <div class="cbe-code">
            <div class="cbe-curline"></div>
            <div class="cbe-dbgline" hidden></div>
            <pre class="cbe-hl"></pre>
            <pre class="cbe-sq" aria-hidden="true"></pre>
            <textarea class="cbe-ta" spellcheck="false" autocomplete="off" autocapitalize="off" wrap="off"></textarea>
          </div>
        </div></div>
        <div class="cbe-status"><span class="pos">Dòng 1, Cột 1</span><span>C++17</span><span>UTF-8</span><span class="grow"></span><span>F9: Chạy thử · Ctrl+Enter: Nộp</span></div>`;
      this.host = host;
      this.ta = host.querySelector(".cbe-ta");
      this.hl = host.querySelector(".cbe-hl");
      this.sq = host.querySelector(".cbe-sq");
      this.dbg = host.querySelector(".cbe-dbgline");
      this.markers = [];
      this.bps = new Set();          // các dòng đặt breakpoint
      this.dbgLine = null;
      this.gutter_click = (e) => {
        const g = e.target.closest("[data-ln]");
        if (!g) return;
        const ln = +g.dataset.ln;
        this.bps.has(ln) ? this.bps.delete(ln) : this.bps.add(ln);
        this.render();
        this.opts.onBreakpoints && this.opts.onBreakpoints(this.bps);
      };
      this.ta.addEventListener("mousemove", (e) => {
        const line = Math.floor((e.offsetY - 8) / this.lh) + 1;
        const ms = this.markers.filter((m) => m.line === line);
        this.ta.title = ms.map((m) => (m.sev === "error" ? "✖ " : m.sev === "opt" ? "⚡ " : "⚠ ") + m.title).join("\n");
      });
      this.gutter = host.querySelector(".cbe-gutter");
      this.cur = host.querySelector(".cbe-curline");
      this.pos = host.querySelector(".pos");
      this.gutter.addEventListener("mousedown", (e) => { e.preventDefault(); this.gutter_click(e); });
      this.gutter.title = "Bấm vào số dòng để đặt / bỏ breakpoint (điểm dừng khi gỡ lỗi)";
      this.file = host.querySelector("input[type=file]");
      this.ta.value = opts.value != null ? opts.value : TEMPLATE;
      this.applyFont();
      this.ta.addEventListener("input", () => {
        if (this.markers.length) { this.markers = []; }    // code đổi -> vị trí cũ không còn đúng
        this.render(); this.opts.onChange && this.opts.onChange(this.value);
      });
      this.ta.addEventListener("keydown", (e) => this.onKey(e));
      ["keyup", "click", "select", "focus"].forEach((ev) => this.ta.addEventListener(ev, () => this.renderCaret()));
      document.addEventListener("selectionchange", () => { if (document.activeElement === this.ta) this.renderCaret(); });
      host.querySelector(".cbe-scroll").addEventListener("mousedown", (e) => {
        if (e.target.classList.contains("cbe-scroll") || e.target.classList.contains("cbe-inner")) { e.preventDefault(); this.ta.focus(); }
      });
      host.querySelector(".cbe-tb").addEventListener("click", (e) => {
        const a = e.target.closest("[data-a]");
        if (a) this.action(a.dataset.a);
      });
      this.file.addEventListener("change", () => {
        const f = this.file.files[0];
        if (!f) return;
        f.text().then((t) => { this.setValue(t.replace(/\r\n/g, "\n")); toast("Đã mở " + f.name); });
        this.file.value = "";
      });
      this.render();
    }

    get value() { return this.ta.value; }
    setValue(v, keepUndo = true) {
      this.ta.focus();
      if (keepUndo) { this.ta.select(); this.insert(v); this.ta.setSelectionRange(0, 0); }
      else this.ta.value = v;
      this.render();
      this.opts.onChange && this.opts.onChange(this.value);
    }
    focus() { this.ta.focus(); }

    applyFont() {
      this.host.style.setProperty("--cbe-fs", this.fs + "px");
      this.host.style.setProperty("--cbe-lh", Math.round(this.fs * 1.45) + "px");
      this.lh = Math.round(this.fs * 1.45);
    }

    action(a) {
      if (a === "open") this.file.click();
      else if (a === "save") {
        const blob = new Blob([this.value], { type: "text/x-c++src" });
        const link = el("a", { href: URL.createObjectURL(blob), download: this.opts.filename || "main.cpp" });
        document.body.appendChild(link); link.click(); link.remove();
      } else if (a === "tpl") {
        if (!this.value.trim() || confirm("Thay toàn bộ code hiện tại bằng khung mẫu? (Ctrl+Z để hoàn tác)")) this.setValue(TEMPLATE);
      } else if (a === "fmt") this.setValue(reindent(this.value));
      else if (a === "fs+" || a === "fs-") {
        this.fs = Math.max(10, Math.min(24, this.fs + (a === "fs+" ? 1 : -1)));
        window.HSG.Store.set("editorFont", this.fs);
        this.applyFont(); this.render();
      }
    }

    // ---------------------------------------------------------- vẽ lại
    render() {
      const v = this.ta.value;
      const lines = v.split("\n").length;
      this.hl.innerHTML = highlight(v, this.braceMarks()) + "\n ";
      const sevOf = {};
      const rank = { error: 3, opt: 2, warn: 1 };
      for (const m of this.markers) if ((rank[m.sev] || 0) > (rank[sevOf[m.line]] || 0)) sevOf[m.line] = m.sev;
      let g = "";
      for (let i = 1; i <= lines; i++) {
        const cls = [sevOf[i] ? "g-" + sevOf[i] : "", this.bps.has(i) ? "bp" : "", this.dbgLine === i ? "g-dbg" : ""].join(" ").trim();
        g += `<span data-ln="${i}" class="${cls}">${i}</span>\n`;
      }
      this.gutter.innerHTML = g;
      this.renderDebugLine();
      this.renderMarkers();
      this.renderCaret(true);
    }
    /** Gạch chân lỗi: markers = [{line, from, to, sev, title}] (line từ 1, cột từ 0) */
    setMarkers(ms) { this.markers = ms || []; this.render(); }
    renderMarkers() {
      if (!this.markers.length) { this.sq.innerHTML = ""; return; }
      const lines = this.ta.value.split("\n");
      const byLine = {};
      for (const m of this.markers) (byLine[m.line] = byLine[m.line] || []).push(m);
      this.sq.innerHTML = lines.map((t, k) => {
        const ms = (byLine[k + 1] || []).slice().sort((a, b) => a.from - b.from);
        if (!ms.length) return esc(t);
        let out = "", pos = 0;
        for (const m of ms) {
          const a = Math.max(pos, Math.min(m.from, t.length)), b = Math.max(a, Math.min(m.to, t.length));
          if (b <= a) continue;
          out += esc(t.slice(pos, a)) + `<span class="sq sq-${m.sev}">${esc(t.slice(a, b))}</span>`;
          pos = b;
        }
        return out + esc(t.slice(pos));
      }).join("\n") + "\n ";
    }
    /** Tô dòng đang chạy khi gỡ lỗi (null = tắt) */
    setDebugLine(line) {
      this.dbgLine = line;
      this.render();
      if (line) {
        const sc = this.host.querySelector(".cbe-scroll");
        const y = 8 + (line - 1) * this.lh;
        if (y < sc.scrollTop + 10 || y > sc.scrollTop + sc.clientHeight - 40) sc.scrollTop = y - sc.clientHeight / 3;
      }
    }
    renderDebugLine() {
      if (!this.dbgLine) { this.dbg.hidden = true; return; }
      this.dbg.hidden = false;
      this.dbg.style.top = 8 + (this.dbgLine - 1) * this.lh + "px";
    }
    gotoLine(line, col = 0) {
      const lines = this.ta.value.split("\n");
      let off = 0;
      for (let i = 0; i < line - 1 && i < lines.length; i++) off += lines[i].length + 1;
      off += Math.min(col, (lines[line - 1] || "").length);
      this.ta.focus();
      this.ta.setSelectionRange(off, off);
      this.renderCaret();
    }
    renderCaret(skipHl) {
      const v = this.ta.value, p = this.ta.selectionStart;
      const before = v.slice(0, p);
      const line = before.split("\n").length;
      const col = p - before.lastIndexOf("\n");
      this.pos.textContent = `Dòng ${line}, Cột ${col}` + (this.ta.selectionEnd > p ? ` (chọn ${this.ta.selectionEnd - p} ký tự)` : "");
      this.cur.style.top = 8 + (line - 1) * this.lh + "px";
      if (!skipHl) {
        const key = p + ":" + v.length;
        if (key !== this._lastKey) { this._lastKey = key; this.hl.innerHTML = highlight(v, this.braceMarks()) + "\n "; }
      }
      this.scrollCaretIntoView(line, col);
    }
    scrollCaretIntoView(line, col) {
      const sc = this.host.querySelector(".cbe-scroll");
      const y = 8 + (line - 1) * this.lh;
      if (y < sc.scrollTop) sc.scrollTop = y - 4;
      else if (y + this.lh > sc.scrollTop + sc.clientHeight) sc.scrollTop = y + this.lh - sc.clientHeight + 8;
      const x = 12 + (col - 1) * this.fs * 0.55 + this.gutter.offsetWidth;
      if (x > sc.scrollLeft + sc.clientWidth - 20) sc.scrollLeft = x - sc.clientWidth + 60;
      else if (x - this.gutter.offsetWidth < sc.scrollLeft + 20) sc.scrollLeft = Math.max(0, x - this.gutter.offsetWidth - 60);
    }
    /** Tìm cặp ngoặc tương ứng với ngoặc ngay trước/sau con trỏ (giống Code::Blocks) */
    braceMarks() {
      const v = this.ta.value, p = this.ta.selectionStart;
      if (this.ta.selectionEnd !== p) return null;
      const open = "([{", close = ")]}";
      let at = -1;
      if (p > 0 && (open + close).includes(v[p - 1])) at = p - 1;
      else if ((open + close).includes(v[p])) at = p;
      if (at < 0) return null;
      // bỏ qua ngoặc nằm trong chuỗi / chú thích
      const toks = window.HSG.tokenize(v).filter((t) => t.t === "op" && (open + close).includes(t.s));
      const idx = toks.findIndex((t) => t.p === at);
      if (idx < 0) return null;
      const c = v[at];
      const isOpen = open.includes(c);
      const want = isOpen ? close[open.indexOf(c)] : open[close.indexOf(c)];
      let depth = 0;
      for (let k = idx; isOpen ? k < toks.length : k >= 0; k += isOpen ? 1 : -1) {
        if (toks[k].s === c) depth++;
        else if (toks[k].s === want) { depth--; if (depth === 0) return new Set([at, toks[k].p]); }
      }
      return new Set([at]);
    }

    // ---------------------------------------------------------- chỉnh sửa (giữ được Ctrl+Z)
    insert(text) {
      this.ta.focus();
      if (!document.execCommand || !document.execCommand("insertText", false, text)) {
        this.ta.setRangeText(text, this.ta.selectionStart, this.ta.selectionEnd, "end");
        this.ta.dispatchEvent(new Event("input"));
      }
    }
    replaceRange(a, b, text, selA, selB) {
      this.ta.setSelectionRange(a, b);
      this.insert(text);
      if (selA != null) this.ta.setSelectionRange(selA, selB == null ? selA : selB);
    }
    lineRange() {
      const v = this.ta.value;
      const s = this.ta.selectionStart, e = this.ta.selectionEnd;
      const a = v.lastIndexOf("\n", s - 1) + 1;
      let endPos = e > s && v[e - 1] === "\n" ? e - 1 : e;
      let b = v.indexOf("\n", endPos);
      if (b < 0) b = v.length;
      return [a, b];
    }

    onKey(e) {
      const ta = this.ta, v = ta.value;
      const s = ta.selectionStart, en = ta.selectionEnd;
      const ctrl = e.ctrlKey || e.metaKey;
      if (e.key === "F9") { e.preventDefault(); this.opts.onRun && this.opts.onRun(); return; }
      if (ctrl && e.key === "Enter") { e.preventDefault(); this.opts.onSubmit && this.opts.onSubmit(); return; }
      if (ctrl && (e.key === "s" || e.key === "S")) { e.preventDefault(); this.opts.onSave ? this.opts.onSave() : toast("Đã lưu nháp"); return; }
      if (ctrl && (e.key === "d" || e.key === "D")) {
        e.preventDefault();
        const [a, b] = this.lineRange();
        const txt = v.slice(a, b);
        this.replaceRange(b, b, "\n" + txt, s + txt.length + 1, en + txt.length + 1);
        return;
      }
      if (ctrl && e.key === "/") {
        e.preventDefault();
        const [a, b] = this.lineRange();
        const lines = v.slice(a, b).split("\n");
        const allCom = lines.every((l) => !l.trim() || /^\s*\/\//.test(l));
        const out = lines.map((l) => {
          if (!l.trim()) return l;
          return allCom ? l.replace(/^(\s*)\/\/ ?/, "$1") : l.replace(/^(\s*)/, "$1// ");
        }).join("\n");
        this.replaceRange(a, b, out, a, a + out.length);
        return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        const multi = v.slice(s, en).includes("\n");
        if (!multi && !e.shiftKey) { this.insert("    "); return; }
        const [a, b] = this.lineRange();
        const lines = v.slice(a, b).split("\n");
        const out = lines.map((l) => (e.shiftKey ? l.replace(/^( {1,4}|\t)/, "") : "    " + l)).join("\n");
        this.replaceRange(a, b, out, a, a + out.length);
        return;
      }
      if (e.key === "Enter" && !ctrl && !e.altKey) {
        e.preventDefault();
        const ls = v.lastIndexOf("\n", s - 1) + 1;
        const indent = v.slice(ls, s).match(/^[ \t]*/)[0];
        const prev = v.slice(ls, s).trimEnd();
        const next = v[en];
        if (prev.endsWith("{") && next === "}") {
          this.insert("\n" + indent + "    " + "\n" + indent);
          const p = s + 1 + indent.length + 4;
          ta.setSelectionRange(p, p);
        } else if (prev.endsWith("{")) this.insert("\n" + indent + "    ");
        else this.insert("\n" + indent);
        return;
      }
      if (e.key === "}" && s === en) {
        const ls = v.lastIndexOf("\n", s - 1) + 1;
        const head = v.slice(ls, s);
        if (/^\s+$/.test(head)) {
          e.preventDefault();
          this.replaceRange(ls, s, head.slice(0, Math.max(0, head.length - 4)) + "}");
          return;
        }
      }
      if (e.key === "Backspace" && s === en && s > 0) {
        const o = v[s - 1], c = v[s];
        if (PAIRS[o] && PAIRS[o] === c) { e.preventDefault(); this.replaceRange(s - 1, s + 1, ""); return; }
        const ls = v.lastIndexOf("\n", s - 1) + 1;
        const head = v.slice(ls, s);
        if (head.length >= 4 && /^ +$/.test(head)) { e.preventDefault(); this.replaceRange(s - (head.length % 4 || 4), s, ""); return; }
      }
      if (CLOSERS.has(e.key) || e.key === '"' || e.key === "'") {
        if (s === en && v[s] === e.key) { e.preventDefault(); ta.setSelectionRange(s + 1, s + 1); this.renderCaret(); return; }
      }
      if (PAIRS[e.key] && !ctrl) {
        const next = v[en] || "";
        const prevCh = v[s - 1] || "";
        const quote = e.key === '"' || e.key === "'";
        if (s !== en) {   // bao quanh đoạn đang chọn
          e.preventDefault();
          const sel = v.slice(s, en);
          this.replaceRange(s, en, e.key + sel + PAIRS[e.key], s + 1, en + 1);
          return;
        }
        if ((/[\s)\]};,]/.test(next) || next === "") && !(quote && /\w/.test(prevCh))) {
          e.preventDefault();
          this.insert(e.key + PAIRS[e.key]);
          ta.setSelectionRange(s + 1, s + 1);
          this.renderCaret();
        }
      }
    }
  }

  /** Căn lề lại toàn bộ code theo số ngoặc { } (4 dấu cách mỗi cấp) */
  function reindent(code) {
    let depth = 0;
    const out = [];
    let inBlock = false;
    for (const raw of code.split("\n")) {
      const line = raw.trim();
      if (!line) { out.push(""); continue; }
      let d = depth;
      if (/^[}\]]/.test(line)) d = Math.max(0, d - 1);
      const isCase = /^(case\b.*|default\s*):/.test(line) && d > 0;
      out.push(line.startsWith("#") ? line : " ".repeat(4 * (isCase ? d - 1 : d) + 0) + line);
      // đếm ngoặc, bỏ qua chuỗi và chú thích
      for (const t of window.HSG.tokenize(line)) {
        if (t.t !== "op") continue;
        if (t.s === "{") depth++;
        else if (t.s === "}") depth = Math.max(0, depth - 1);
      }
    }
    void inBlock;
    return out.join("\n");
  }

  window.CBEditor = CBEditor;
  window.CBEditor.TEMPLATE = TEMPLATE;
})();
