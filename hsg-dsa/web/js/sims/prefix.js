/* Mô phỏng chủ đề: Prefix sum 1D/2D và mảng hiệu */
(function () {
  "use strict";
  const { parseNums } = window.SimUtil;

  function parseQueries(s, k, name, check) {
    const lines = s.trim().split(/\n|;/).map((x) => x.trim()).filter(Boolean);
    if (lines.length > 8) throw new Error(`tối đa 8 ${name}`);
    return lines.map((ln) => {
      const v = ln.split(/[\s,]+/).map(Number);
      if (v.length !== k || v.some((x) => !Number.isInteger(x))) throw new Error(`mỗi ${name} cần đúng ${k} số nguyên: "${ln}"`);
      check(v, ln);
      return v;
    });
  }

  /* ---------------- 1. Prefix sum 1D + trả lời truy vấn ---------------- */
  window.SIMS.prefix1d = (host) => new window.SimPlayer(host, {
    title: "Mô phỏng: dựng mảng cộng dồn p[] rồi trả lời truy vấn tổng đoạn [l, r]",
    inputs: [
      { id: "a", label: "Dãy a (1..n, tối đa 12 số)", value: "3 -1 4 1 5 9 2 6" },
      { id: "q", label: "Truy vấn l r (mỗi dòng một truy vấn)", type: "textarea", value: "2 5\n1 8\n4 4" },
    ],
    presets: [["Toàn số âm", { a: "-5 -2 -7 -1 -3", q: "1 5\n2 3" }], ["n = 1", { a: "42", q: "1 1" }]],
    code: [
      "p[0] = 0;",
      "for (int i = 1; i <= n; i++)",
      "    p[i] = p[i - 1] + a[i];",
      "// --- trả lời truy vấn ---",
      "cin >> l >> r;",
      "cout << p[r] - p[l - 1];",
    ],
    build(v) {
      const a = parseNums(v.a, { max: 12, lo: -999, hi: 999, name: "dãy a" });
      const n = a.length;
      const qs = parseQueries(v.q, 2, "truy vấn", ([l, r], ln) => { if (!(1 <= l && l <= r && r <= n)) throw new Error(`truy vấn "${ln}" cần 1 ≤ l ≤ r ≤ ${n}`); });
      const A = [null, ...a];
      const p = Array(n + 1).fill(null);
      const F = [];
      const view = (ma = {}, mp = {}, ta = {}, tp = {}) => [
        { name: "a", values: A, marks: { 0: "dim", ...ma }, tags: ta },
        { name: "p", values: p.slice(), marks: mp, tags: tp },
      ];
      p[0] = 0;
      F.push({ line: 1, vars: { n }, arrays: view({}, { 0: "done" }), msg: "p[0] = 0: tổng của <b>0 phần tử đầu</b>. Nhờ ô này mà công thức đúng cả khi l = 1." });
      for (let i = 1; i <= n; i++) {
        F.push({ line: 2, vars: { n, i }, arrays: view({ [i]: "cur" }, Object.fromEntries([...Array(i).keys()].map((k) => [k, "done"]))), msg: `i = ${i}` });
        p[i] = p[i - 1] + A[i];
        const done = Object.fromEntries([...Array(i).keys()].map((k) => [k, "done"]));
        F.push({ line: 3, vars: { n, i, "p[i-1]": p[i - 1], "a[i]": A[i], "p[i]": p[i] }, arrays: view({ [i]: "pur" }, { ...done, [i - 1]: "pur", [i]: "cur" }), msg: `p[${i}] = p[${i - 1}] + a[${i}] = ${p[i - 1]} + ${A[i]} = <b>${p[i]}</b> (tổng ${i} phần tử đầu).` });
      }
      F.push({ line: 4, vars: { n }, arrays: view({}, Object.fromEntries(p.map((_, k) => [k, "done"]))), msg: `Dựng xong p[] trong <b>O(n)</b>. Mỗi truy vấn giờ chỉ là 1 phép trừ — O(1).` });
      for (const [l, r] of qs) {
        const rng = Object.fromEntries([...Array(r - l + 1).keys()].map((k) => [l + k, "range"]));
        F.push({ line: 5, vars: { l, r }, arrays: view(rng, {}, { [l]: "l", [r]: "r" }), msg: `Truy vấn tổng đoạn [${l}, ${r}] (các ô xanh).` });
        const ans = p[r] - p[l - 1];
        F.push({ line: 6, vars: { l, r, "p[r]": p[r], "p[l-1]": p[l - 1], "kết quả": ans }, arrays: view(rng, { [r]: "range", [l - 1]: "bad" }, { [l]: "l", [r]: "r" }, { [r]: "r", [l - 1]: "l-1" }), msg: `p[${r}] − p[${l - 1}] = ${p[r]} − ${p[l - 1]} = <b>${ans}</b>. (p[${r}] là tổng tới ${r}, bỏ đi phần tổng tới ${l - 1}.)` });
      }
      return F;
    },
  });

  /* ---------------- 2. Mảng hiệu: cộng x vào đoạn [l, r] ---------------- */
  window.SIMS.diff = (host) => new window.SimPlayer(host, {
    title: "Mô phỏng: mảng hiệu d[] — cộng x vào cả đoạn [l, r] chỉ bằng 2 phép",
    inputs: [
      { id: "a", label: "Dãy ban đầu a (tối đa 12 số)", value: "0 0 0 0 0 0 0 0" },
      { id: "u", label: "Cập nhật l r x (mỗi dòng một lần)", type: "textarea", value: "2 5 3\n4 8 1\n1 1 10" },
    ],
    code: [
      "// mỗi lần cập nhật: cộng x vào a[l..r]",
      "d[l] += x;",
      "d[r + 1] -= x;      // d có kích thước n + 2",
      "// --- sau mọi cập nhật ---",
      "for (int i = 1; i <= n; i++) {",
      "    add += d[i];    // cộng dồn mảng hiệu",
      "    a[i] += add;",
      "}",
    ],
    build(v) {
      const a0 = parseNums(v.a, { max: 12, lo: -999, hi: 999, name: "dãy a" });
      const n = a0.length;
      const ups = parseQueries(v.u, 3, "cập nhật", ([l, r], ln) => { if (!(1 <= l && l <= r && r <= n)) throw new Error(`"${ln}" cần 1 ≤ l ≤ r ≤ ${n}`); });
      const A = [null, ...a0];
      const d = Array(n + 2).fill(0);
      const F = [];
      const view = (ma = {}, md = {}, ta = {}, td = {}) => [
        { name: "a", values: A.slice(), marks: { 0: "dim", ...ma }, tags: ta },
        { name: "d", values: d.slice(), marks: { 0: "dim", ...md }, tags: td },
      ];
      F.push({ line: 1, vars: { n }, arrays: view(), msg: "Ý tưởng: thay vì cộng x vào từng ô (O(n)), ta chỉ <b>đánh dấu điểm bắt đầu và điểm kết thúc</b> trong d[]." });
      for (const [l, r, x] of ups) {
        const rng = Object.fromEntries([...Array(r - l + 1).keys()].map((k) => [l + k, "range"]));
        d[l] += x;
        F.push({ line: 2, vars: { l, r, x, [`d[${l}]`]: d[l] }, arrays: view(rng, { [l]: "cur" }, { [l]: "l", [r]: "r" }, { [l]: "+x" }), msg: `Cập nhật (${l}, ${r}, ${x}): <b>d[${l}] += ${x}</b> → từ vị trí ${l} trở đi được cộng ${x}.` });
        d[r + 1] -= x;
        F.push({ line: 3, vars: { l, r, x, [`d[${r + 1}]`]: d[r + 1] }, arrays: view(rng, { [l]: "done", [r + 1]: "bad" }, { [l]: "l", [r]: "r" }, { [l]: "+x", [r + 1]: "−x" }), msg: `<b>d[${r + 1}] −= ${x}</b> → từ vị trí ${r + 1} trở đi trừ lại, nên chỉ đoạn [${l}, ${r}] được cộng.` + (r === n ? ` (r = n nên ghi vào d[${n + 1}] — vì vậy d cần kích thước n + 2.)` : "") });
      }
      let add = 0;
      F.push({ line: 4, vars: { add }, arrays: view(), msg: "Mọi cập nhật xong, mỗi lần chỉ mất O(1). Giờ cộng dồn d[] để biết mỗi ô được cộng bao nhiêu." });
      for (let i = 1; i <= n; i++) {
        add += d[i];
        F.push({ line: 6, vars: { i, "d[i]": d[i], add }, arrays: view({ [i]: "cur" }, { [i]: "pur", ...Object.fromEntries([...Array(i - 1).keys()].map((k) => [k + 1, "done"])) }), msg: `add = d[1] + … + d[${i}] = <b>${add}</b>: tổng lượng được cộng vào ô ${i}.` });
        A[i] += add;
        F.push({ line: 7, vars: { i, add, "a[i]": A[i] }, arrays: view({ ...Object.fromEntries([...Array(i).keys()].map((k) => [k + 1, "done"])) }, { [i]: "done" }), msg: `a[${i}] = ${A[i] - add} + ${add} = <b>${A[i]}</b>.` });
      }
      F.push({ line: 8, vars: { n }, arrays: view(Object.fromEntries([...Array(n).keys()].map((k) => [k + 1, "done"]))), msg: `Xong. Tổng độ phức tạp <b>O(n + m)</b> thay vì O(n·m).` });
      return F;
    },
  });

  /* ---------------- 3. Prefix sum 2D ---------------- */
  window.SIMS.prefix2d = (host) => new window.SimPlayer(host, {
    title: "Mô phỏng: prefix sum 2D — dựng S[i][j] và tính tổng hình chữ nhật",
    inputs: [
      { id: "g", label: "Lưới a (mỗi dòng một hàng, tối đa 6×6)", type: "textarea", rows: 4, value: "1 2 3 4\n5 6 7 8\n9 10 11 12" },
      { id: "q", label: "Truy vấn x1 y1 x2 y2", type: "textarea", value: "2 2 3 4" },
    ],
    code: [
      "for (int i = 1; i <= n; i++)",
      "  for (int j = 1; j <= m; j++)",
      "    S[i][j] = a[i][j] + S[i-1][j] + S[i][j-1]",
      "              - S[i-1][j-1];",
      "// --- truy vấn ---",
      "ans = S[x2][y2] - S[x1-1][y2]",
      "    - S[x2][y1-1] + S[x1-1][y1-1];",
    ],
    build(v) {
      const rows = v.g.trim().split("\n").map((r) => parseNums(r, { max: 6, lo: -99, hi: 99, name: "mỗi hàng" }));
      if (rows.length > 6) throw new Error("tối đa 6 hàng");
      const m = rows[0].length;
      if (rows.some((r) => r.length !== m)) throw new Error("các hàng phải có cùng số cột");
      const n = rows.length;
      const qs = parseQueries(v.q, 4, "truy vấn", ([x1, y1, x2, y2], ln) => {
        if (!(1 <= x1 && x1 <= x2 && x2 <= n && 1 <= y1 && y1 <= y2 && y2 <= m)) throw new Error(`"${ln}" cần 1 ≤ x1 ≤ x2 ≤ ${n}, 1 ≤ y1 ≤ y2 ≤ ${m}`);
      });
      const A = [Array(m + 1).fill(null), ...rows.map((r) => [null, ...r])];
      const S = Array.from({ length: n + 1 }, (_, i) => Array.from({ length: m + 1 }, (_, j) => (i === 0 || j === 0 ? 0 : null)));
      const F = [];
      const grids = (ma = {}, ms = {}) => [
        { name: "a", cells: A.map((r) => r.slice()), marks: ma },
        { name: "S", cells: S.map((r) => r.slice()), marks: ms },
      ];
      const html = '<div class="small muted">Hàng 0 và cột 0 của S bằng 0 để công thức không bị tràn chỉ số.</div>';
      F.push({ line: 1, vars: { n, m }, grids: grids(), html, msg: "S[i][j] = tổng mọi ô trong hình chữ nhật từ (1,1) đến (i,j)." });
      for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) {
        S[i][j] = A[i][j] + S[i - 1][j] + S[i][j - 1] - S[i - 1][j - 1];
        const ms = { [`${i - 1},${j}`]: "pur", [`${i},${j - 1}`]: "pur", [`${i - 1},${j - 1}`]: "bad", [`${i},${j}`]: "cur" };
        F.push({ line: 3, vars: { i, j, "a[i][j]": A[i][j], "S[i-1][j]": S[i - 1][j], "S[i][j-1]": S[i][j - 1], "S[i-1][j-1]": S[i - 1][j - 1], "S[i][j]": S[i][j] }, grids: grids({ [`${i},${j}`]: "cur" }, ms), html,
          msg: `S[${i}][${j}] = ${A[i][j]} + ${S[i - 1][j]} + ${S[i][j - 1]} − ${S[i - 1][j - 1]} = <b>${S[i][j]}</b>. Ô đỏ bị cộng 2 lần (trong cả ô trên và ô trái) nên phải trừ đi 1 lần.` });
      }
      for (const [x1, y1, x2, y2] of qs) {
        const ma = {};
        for (let i = x1; i <= x2; i++) for (let j = y1; j <= y2; j++) ma[`${i},${j}`] = "range";
        const ans = S[x2][y2] - S[x1 - 1][y2] - S[x2][y1 - 1] + S[x1 - 1][y1 - 1];
        F.push({ line: 5, vars: { x1, y1, x2, y2 }, grids: grids(ma, {}), html, msg: `Cần tổng hình chữ nhật (${x1},${y1}) – (${x2},${y2}) (các ô xanh).` });
        F.push({ line: 6, vars: { x1, y1, x2, y2, "S[x2][y2]": S[x2][y2], "S[x1-1][y2]": S[x1 - 1][y2], "S[x2][y1-1]": S[x2][y1 - 1], "S[x1-1][y1-1]": S[x1 - 1][y1 - 1], ans },
          grids: grids(ma, { [`${x2},${y2}`]: "done", [`${x1 - 1},${y2}`]: "bad", [`${x2},${y1 - 1}`]: "bad", [`${x1 - 1},${y1 - 1}`]: "pur" }), html,
          msg: `Lấy hình lớn (xanh lá) trừ dải trên và dải trái (đỏ), cộng lại góc bị trừ 2 lần (tím): ${S[x2][y2]} − ${S[x1 - 1][y2]} − ${S[x2][y1 - 1]} + ${S[x1 - 1][y1 - 1]} = <b>${ans}</b>.` });
      }
      return F;
    },
  });
})();
