/* Mô phỏng chủ đề: Tham lam — Lịch họp */
(function () {
  "use strict";
  const esc = window.HSG.esc;

  window.SIMS.meetings = (host) => new window.SimPlayer(host, {
    title: "Mô phỏng: chọn cuộc họp — so sánh tiêu chí tham lam đúng và sai",
    inputs: [
      { id: "m", label: "Cuộc họp (mỗi dòng: bắt đầu kết thúc, tối đa 10)", type: "textarea", rows: 5, value: "0 10\n1 3\n3 5\n5 7\n7 9\n2 4" },
      { id: "c", label: "Tiêu chí sắp xếp", type: "select", value: "end", options: [["end", "Kết thúc sớm nhất (ĐÚNG)"], ["start", "Bắt đầu sớm nhất (SAI)"], ["len", "Ngắn nhất (SAI)"]] },
    ],
    code: [
      "sort(a.begin(), a.end(), tiêu_chí);",
      "long long lastEnd = -INF; int cnt = 0;",
      "for (auto &m : a)",
      "    if (m.s >= lastEnd) {     // không chồng lên",
      "        cnt++; lastEnd = m.e; // chọn",
      "    }",
    ],
    render(f) {
      const T = f.T, W = 520, unit = W / Math.max(1, T);
      let h = `<div style="position:relative;width:${W + 60}px;font-family:var(--mono);font-size:12px">`;
      f.order.forEach((m, k) => {
        const st = f.state[k];
        const bg = st === "pick" ? "var(--ok-soft)" : st === "skip" ? "var(--bad-soft)" : k === f.cur ? "var(--warn-soft)" : "var(--surface-2)";
        const bd = st === "pick" ? "var(--ok)" : st === "skip" ? "var(--bad)" : k === f.cur ? "var(--warn)" : "var(--border)";
        h += `<div style="height:26px;position:relative;margin:3px 0"><span style="position:absolute;left:0;top:4px;color:var(--text-2)">#${k + 1}</span>
          <div style="position:absolute;left:${34 + m[0] * unit}px;width:${Math.max(6, (m[1] - m[0]) * unit)}px;height:22px;background:${bg};border:1.5px solid ${bd};border-radius:5px;text-align:center;line-height:20px;white-space:nowrap;overflow:hidden">${m[0]}–${m[1]}</div></div>`;
      });
      if (f.lastEnd !== null) h += `<div style="position:absolute;top:0;bottom:0;left:${34 + f.lastEnd * unit}px;border-left:2px dashed var(--accent)" title="lastEnd"></div>`;
      h += `</div><div class="legend"><span><i style="background:var(--ok-soft);border-color:var(--ok)"></i>được chọn</span><span><i style="background:var(--bad-soft);border-color:var(--bad)"></i>bỏ qua (chồng lên)</span><span><i style="background:var(--warn-soft);border-color:var(--warn)"></i>đang xét</span><span>vạch xanh = lastEnd</span></div>`;
      return h;
    },
    build(v) {
      const ms = v.m.trim().split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
        const p = l.split(/[\s,]+/).map(Number);
        if (p.length !== 2 || !p.every(Number.isInteger) || p[0] < 0 || p[0] >= p[1] || p[1] > 100) throw new Error(`"${l}" cần 0 ≤ bắt đầu < kết thúc ≤ 100`);
        return p;
      });
      if (!ms.length || ms.length > 10) throw new Error("cần 1 đến 10 cuộc họp");
      const cmp = { end: (a, b) => a[1] - b[1] || a[0] - b[0], start: (a, b) => a[0] - b[0] || a[1] - b[1], len: (a, b) => (a[1] - a[0]) - (b[1] - b[0]) || a[1] - b[1] }[v.c];
      const order = ms.slice().sort(cmp);
      const T = Math.max(...ms.map((m) => m[1]));
      const state = order.map(() => "");
      const F = [];
      let lastEnd = null, cnt = 0;
      const snap = (o) => ({ T, order, state: state.slice(), lastEnd, ...o });
      const name = { end: "thời điểm kết thúc", start: "thời điểm bắt đầu", len: "độ dài" }[v.c];
      F.push({ line: 1, vars: { n: ms.length }, ...snap({}), msg: `Đã sắp xếp theo <b>${name}</b> tăng dần.` });
      F.push({ line: 2, vars: { cnt }, ...snap({}), msg: "Chưa chọn cuộc nào." });
      order.forEach((m, k) => {
        F.push({ line: 3, vars: { cnt, lastEnd: lastEnd === null ? "-∞" : lastEnd, "s": m[0], "e": m[1] }, ...snap({ cur: k }), msg: `Xét cuộc họp [${m[0]}, ${m[1]}].` });
        if (lastEnd === null || m[0] >= lastEnd) {
          state[k] = "pick"; cnt++; lastEnd = m[1];
          F.push({ line: 5, vars: { cnt, lastEnd }, ...snap({ cur: k }), msg: `Bắt đầu ${m[0]} ≥ lastEnd → <b>chọn</b>. lastEnd = ${m[1]}.` });
        } else {
          state[k] = "skip";
          F.push({ line: 4, vars: { cnt, lastEnd }, ...snap({ cur: k }), msg: `Bắt đầu ${m[0]} < lastEnd = ${lastEnd} → chồng lên, <b>bỏ qua</b>.` });
        }
      });
      // đáp án đúng để so sánh
      const opt = (() => { const o = ms.slice().sort((a, b) => a[1] - b[1]); let le = -1, c = 0; for (const m of o) if (m[0] >= le) { c++; le = m[1]; } return c; })();
      F.push({ line: 6, vars: { cnt, "tối ưu": opt }, ...snap({}), msg: cnt === opt ? `Chọn được <b>${cnt}</b> cuộc họp — đúng bằng tối ưu.` : `Chỉ chọn được <b>${cnt}</b> cuộc, trong khi tối ưu là <b>${opt}</b>. Tiêu chí "${esc(name)}" <b>SAI</b> — đây chính là phản ví dụ!` });
      return F;
    },
  });
})();
