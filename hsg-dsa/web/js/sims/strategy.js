/* Mô phỏng chủ đề: Chiến thuật — xếp lịch làm subtask theo điểm/phút */
(function () {
  "use strict";
  const esc = window.HSG.esc;

  window.SIMS.planner = (host) => new window.SimPlayer(host, {
    title: "Công cụ lập kế hoạch 180 phút: làm subtask nào trước?",
    inputs: [
      { id: "st", label: "Mỗi dòng: tên điểm phút (ví dụ: A1 40 10)", type: "textarea", rows: 7,
        value: "A1 50 15\nA2 50 30\nB1 30 10\nB2 70 70\nC1 40 15\nC2 60 60\nD1 20 10\nD2 80 90" },
      { id: "T", label: "Thời gian (phút)", value: "165", width: "90px" },
    ],
    code: [
      "sort(subtask theo điểm/phút giảm dần);",
      "int conLai = T, tong = 0;",
      "for (auto s : subtask)",
      "    if (s.phut <= conLai) {",
      "        conLai -= s.phut; tong += s.diem;",
      "    }",
    ],
    render(f) {
      const W = 520;
      let h = `<div style="font-family:var(--mono);font-size:12px">`;
      f.list.forEach((s, k) => {
        const st = f.state[k];
        const bg = st === "pick" ? "var(--ok-soft)" : st === "skip" ? "var(--bad-soft)" : k === f.cur ? "var(--warn-soft)" : "var(--surface-2)";
        h += `<div style="display:flex;align-items:center;gap:8px;margin:3px 0"><span style="width:34px">${esc(s.name)}</span>
          <div style="width:${Math.max(30, (s.min / f.T) * W)}px;background:${bg};border:1px solid var(--border);border-radius:5px;padding:2px 6px">${s.pts}đ / ${s.min}'</div>
          <span class="muted">${(s.pts / s.min).toFixed(2)} đ/phút</span></div>`;
      });
      const used = f.T - f.left;
      h += `</div><div style="margin-top:10px"><div class="small muted">Đã dùng ${used}/${f.T} phút — tổng ${f.total} điểm</div>
        <div class="progress ok" style="width:${W}px;max-width:100%"><span style="width:${(100 * used) / f.T}%"></span></div></div>`;
      return h;
    },
    build(v) {
      const list = v.st.trim().split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
        const p = l.split(/\s+/);
        const pts = Number(p[1]), min = Number(p[2]);
        if (p.length !== 3 || !(pts > 0) || !(min > 0)) throw new Error(`"${l}" cần dạng: tên điểm phút`);
        return { name: p[0], pts, min };
      });
      if (!list.length || list.length > 16) throw new Error("cần 1–16 subtask");
      const T = Number(v.T);
      if (!(T > 0)) throw new Error("thời gian phải > 0");
      // subtask sau của cùng một bài (A2) chỉ làm được khi đã có subtask trước (A1)? -> ở đây coi độc lập cho đơn giản
      list.sort((a, b) => b.pts / b.min - a.pts / a.min);
      const state = list.map(() => "");
      const F = [];
      let left = T, total = 0;
      const snap = (o) => ({ list, state: state.slice(), T, left, total, ...o });
      F.push({ line: 1, vars: { T }, ...snap({}), msg: "Sắp xếp theo <b>điểm/phút</b> giảm dần: việc nào \"lời\" nhất làm trước." });
      list.forEach((s, k) => {
        if (s.min <= left) {
          left -= s.min; total += s.pts; state[k] = "pick";
          F.push({ line: 5, vars: { subtask: s.name, "còn lại": left, "tổng điểm": total }, ...snap({ cur: k }), msg: `Làm <b>${esc(s.name)}</b> (${s.pts}đ trong ${s.min}'). Còn ${left} phút.` });
        } else {
          state[k] = "skip";
          F.push({ line: 4, vars: { subtask: s.name, "còn lại": left, "tổng điểm": total }, ...snap({ cur: k }), msg: `Bỏ qua ${esc(s.name)}: cần ${s.min}' nhưng chỉ còn ${left}'.` });
        }
      });
      F.push({ line: 6, vars: { "tổng điểm": total, "còn lại": left }, ...snap({}), msg: `Kế hoạch đạt khoảng <b>${total}</b> điểm. Lưu ý: đây chỉ là gợi ý tham lam; thời gian ước lượng càng sát thực tế thì kế hoạch càng tốt. Hãy luôn để dư 15 phút cuối để kiểm tra.` });
      return F;
    },
  });
})();
