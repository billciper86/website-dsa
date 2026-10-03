/* Mô phỏng chủ đề: Quy hoạch động cơ bản */
(function () {
  "use strict";
  const { parseNums } = window.SimUtil;

  /* ---------------- 1. Kadane ---------------- */
  window.SIMS.kadane = (host) => new window.SimPlayer(host, {
    title: "Mô phỏng: Kadane — đoạn con tổng lớn nhất",
    inputs: [{ id: "a", label: "Dãy a (tối đa 14 số)", value: "-2 1 -3 4 -1 2 1 -5 4" }],
    presets: [["Toàn số âm", { a: "-8 -3 -6 -2 -5 -4" }]],
    code: [
      "long long cur = a[0], best = a[0];",
      "for (int i = 1; i < n; i++) {",
      "    cur = max(a[i], cur + a[i]);  // f[i]",
      "    best = max(best, cur);",
      "}",
    ],
    build(v) {
      const a = parseNums(v.a, { max: 14, lo: -999, hi: 999, name: "dãy a" });
      const n = a.length;
      const f = Array(n).fill(null);
      const F = [];
      let cur = a[0], best = a[0], start = 0, bs = 0, be = 0;
      f[0] = cur;
      const view = (i, extra = {}) => {
        const ma = {};
        for (let k = 0; k < n; k++) if (k >= bs && k <= be) ma[k] = "done";
        for (let k = start; k <= i; k++) ma[k] = "range";
        ma[i] = "cur";
        return [{ name: "a", values: a, marks: { ...ma, ...extra } }, { name: "f", values: f.slice(), marks: { [i]: "cur" } }];
      };
      F.push({ line: 1, vars: { i: 0, cur, best }, arrays: view(0), msg: "f[0] = a[0]: đoạn duy nhất kết thúc tại 0 là chính a[0]. Không khởi tạo bằng 0 vì đoạn phải khác rỗng." });
      for (let i = 1; i < n; i++) {
        const ext = cur + a[i];
        if (a[i] > ext) { cur = a[i]; start = i; } else cur = ext;
        f[i] = cur;
        F.push({ line: 3, vars: { i, "a[i]": a[i], "cur+a[i]": ext, cur, best }, arrays: view(i),
          msg: `f[${i}] = max(a[${i}] = ${a[i]}, f[${i - 1}] + a[${i}] = ${ext}) = <b>${cur}</b> → ` + (start === i ? "<b>bắt đầu đoạn mới</b> tại i (đoạn cũ đang âm, kéo tổng xuống)." : `nối dài đoạn [${start}, ${i}].`) });
        if (cur > best) { best = cur; bs = start; be = i; }
        F.push({ line: 4, vars: { i, cur, best }, arrays: view(i), msg: `best = ${best}` + (best === cur ? " (vừa cập nhật)." : ".") });
      }
      F.push({ line: 5, vars: { best }, arrays: [{ name: "a", values: a, marks: Object.fromEntries(a.map((_, k) => [k, k >= bs && k <= be ? "done" : "dim"])) }, { name: "f", values: f, marks: { [be]: "done" } }],
        msg: `Đáp án <b>${best}</b>, đoạn [${bs}, ${be}] (xanh lá). Mỗi phần tử chỉ xét 1 lần → O(n).` });
      return F;
    },
  });

  /* ---------------- 2. Đếm đường đi trên lưới ---------------- */
  window.SIMS.gridpaths = (host) => new window.SimPlayer(host, {
    title: "Mô phỏng: QHĐ đếm đường đi trên lưới (chỉ sang phải / xuống)",
    inputs: [{ id: "g", label: "Lưới (. trống, # cấm; tối đa 6×7)", type: "textarea", rows: 4, value: "....\n.#..\n....\n..#." }],
    code: [
      "for (int i = 1; i <= n; i++)",
      "  for (int j = 1; j <= m; j++) {",
      "    if (g[i][j] == '#') f[i][j] = 0;",
      "    else if (i == 1 && j == 1) f[i][j] = 1;",
      "    else f[i][j] = f[i-1][j] + f[i][j-1];",
      "  }",
      "// đáp án: f[n][m]",
    ],
    build(v) {
      const rows = v.g.trim().split("\n").map((r) => r.trim()).filter(Boolean);
      if (!rows.length || rows.length > 6) throw new Error("cần 1–6 hàng");
      const m = rows[0].length;
      if (m < 1 || m > 7 || rows.some((r) => r.length !== m || /[^.#]/.test(r))) throw new Error("mỗi hàng cùng độ dài (≤ 7), chỉ gồm . và #");
      const n = rows.length;
      const f = rows.map((r) => r.split("").map((c) => (c === "#" ? "#" : null)));
      const F = [];
      const grids = (ms = {}) => [{ name: "f[i][j] (đánh số từ 1)", cells: f.map((r) => r.slice()), marks: { ...Object.fromEntries(rows.flatMap((r, i) => r.split("").map((c, j) => [i + "," + j, c === "#" ? "bad" : ""]).filter((x) => x[1]))), ...ms }, base: 1 }];
      F.push({ line: 1, vars: { n, m }, grids: grids(), msg: "Điền bảng theo thứ tự hàng trên xuống, trái sang phải: khi tính ô (i, j) thì ô trên và ô trái đã có sẵn." });
      for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
        if (rows[i][j] === "#") { f[i][j] = 0; F.push({ line: 3, vars: { i: i + 1, j: j + 1 }, grids: grids({ [i + "," + j]: "bad" }), msg: `Ô (${i + 1}, ${j + 1}) bị cấm → f = 0.` }); continue; }
        if (i === 0 && j === 0) { f[i][j] = 1; F.push({ line: 4, vars: { i: 1, j: 1, f: 1 }, grids: grids({ "0,0": "cur" }), msg: "Ô xuất phát: có đúng 1 cách (đứng yên)." }); continue; }
        const up = i > 0 ? f[i - 1][j] : 0, left = j > 0 ? f[i][j - 1] : 0;
        f[i][j] = up + left;
        const ms = { [i + "," + j]: "cur" };
        if (i > 0) ms[i - 1 + "," + j] = "pur";
        if (j > 0) ms[i + "," + (j - 1)] = "pur";
        F.push({ line: 5, vars: { i: i + 1, j: j + 1, "trên": up, "trái": left, f: f[i][j] }, grids: grids(ms), msg: `f[${i + 1}][${j + 1}] = trên (${up}) + trái (${left}) = <b>${f[i][j]}</b>.` });
      }
      F.push({ line: 7, vars: { "đáp án": f[n - 1][m - 1] }, grids: grids({ [(n - 1) + "," + (m - 1)]: "done" }), msg: `Có <b>${f[n - 1][m - 1]}</b> đường đi. Mỗi ô tính đúng 1 lần → O(n·m), dù số đường đi có thể tăng theo hàm mũ.` });
      return F;
    },
  });
})();
