/* Mô phỏng chủ đề: QHĐ kinh điển (cái túi, LIS) */
(function () {
  "use strict";
  const { parseNums } = window.SimUtil;

  /* ---------------- 1. Cái túi 0/1 ---------------- */
  window.SIMS.knapsack = (host) => new window.SimPlayer(host, {
    title: "Mô phỏng: cái túi 0/1 với mảng dp 1 chiều (j giảm dần)",
    inputs: [
      { id: "it", label: "Món đồ (mỗi dòng: khối lượng giá trị, tối đa 5)", type: "textarea", rows: 4, value: "3 30\n4 50\n5 60" },
      { id: "W", label: "W (≤ 12)", value: "8", width: "70px" },
      { id: "dir", label: "Thứ tự duyệt j", type: "select", value: "down", options: [["down", "Giảm dần (ĐÚNG)"], ["up", "Tăng dần (SAI: lấy 1 món nhiều lần)"]] },
    ],
    code: [
      "vector<long long> dp(W + 1, 0);",
      "for (auto [w, v] : items)",
      "    for (int j = W; j >= w; j--)",
      "        dp[j] = max(dp[j], dp[j - w] + v);",
      "// đáp án: dp[W]",
    ],
    build(v) {
      const items = v.it.trim().split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
        const p = l.split(/[\s,]+/).map(Number);
        if (p.length !== 2 || !p.every(Number.isInteger) || p[0] < 1 || p[0] > 12 || p[1] < 0 || p[1] > 999) throw new Error(`"${l}" cần 1 ≤ khối lượng ≤ 12, 0 ≤ giá trị ≤ 999`);
        return p;
      });
      if (!items.length || items.length > 5) throw new Error("cần 1–5 món");
      const W = Number(v.W);
      if (!Number.isInteger(W) || W < 1 || W > 12) throw new Error("1 ≤ W ≤ 12");
      const down = v.dir === "down";
      const dp = Array(W + 1).fill(0);
      const F = [];
      const view = (marks = {}, tags = {}) => [{ name: "dp", values: dp.slice(), marks, tags }];
      F.push({ line: 1, vars: { W }, arrays: view(), msg: "dp[j] = giá trị lớn nhất với tổng khối lượng ≤ j. Ban đầu chưa có món nào: toàn 0." });
      items.forEach(([w, val], k) => {
        F.push({ line: 2, vars: { món: k + 1, w, v: val }, arrays: view(), msg: `Xét món ${k + 1}: nặng ${w}, giá trị ${val}.` });
        const js = [];
        if (down) for (let j = W; j >= w; j--) js.push(j); else for (let j = w; j <= W; j++) js.push(j);
        for (const j of js) {
          const take = dp[j - w] + val;
          const old = dp[j];
          if (take > old) dp[j] = take;
          F.push({ line: 4, vars: { món: k + 1, j, "dp[j] cũ": old, "dp[j-w]+v": take, "dp[j]": dp[j] }, arrays: view({ [j]: take > old ? "done" : "cur", [j - w]: "pur" }, { [j]: "j", [j - w]: "j-w" }),
            msg: `dp[${j}] = max(${old}, dp[${j - w}] + ${val} = ${take}) = <b>${dp[j]}</b>.` + (!down && j - w >= w ? ` <span style="color:var(--bad)">dp[${j - w}] đã được cập nhật bằng món ${k + 1} rồi → món này có thể bị lấy 2 lần!</span>` : "") });
        }
      });
      F.push({ line: 5, vars: { "dp[W]": dp[W] }, arrays: view({ [W]: "done" }), msg: `Đáp án dp[${W}] = <b>${dp[W]}</b>.` + (down ? "" : " (Kết quả này có thể SAI vì món bị lấy lặp — hãy so với chế độ giảm dần.)") });
      return F;
    },
  });

  /* ---------------- 2. LIS O(n^2) ---------------- */
  window.SIMS.lis = (host) => new window.SimPlayer(host, {
    title: "Mô phỏng: dãy con tăng dài nhất — QHĐ O(n²)",
    inputs: [{ id: "a", label: "Dãy a (tối đa 12 số)", value: "5 2 8 6 3 6 9 7" }],
    code: [
      "for (int i = 0; i < n; i++) {",
      "    f[i] = 1;",
      "    for (int j = 0; j < i; j++)",
      "        if (a[j] < a[i]) f[i] = max(f[i], f[j] + 1);",
      "    best = max(best, f[i]);",
      "}",
    ],
    build(v) {
      const a = parseNums(v.a, { max: 12, lo: -999, hi: 999, name: "dãy a" });
      const n = a.length;
      const f = Array(n).fill(null), from = Array(n).fill(-1);
      const F = [];
      let best = 0, bi = 0;
      const view = (ma = {}, mf = {}) => [{ name: "a", values: a, marks: ma }, { name: "f", values: f.slice(), marks: mf }];
      for (let i = 0; i < n; i++) {
        f[i] = 1;
        F.push({ line: 2, vars: { i, "a[i]": a[i], "f[i]": 1 }, arrays: view({ [i]: "cur" }, { [i]: "cur" }), msg: `f[${i}] = 1: chỉ riêng a[${i}] = ${a[i]}.` });
        for (let j = 0; j < i; j++) {
          if (a[j] < a[i]) {
            const cand = f[j] + 1;
            if (cand > f[i]) { f[i] = cand; from[i] = j; }
            F.push({ line: 4, vars: { i, j, "a[j]": a[j], "a[i]": a[i], "f[j]+1": cand, "f[i]": f[i] }, arrays: view({ [i]: "cur", [j]: "done" }, { [i]: "cur", [j]: "pur" }), msg: `a[${j}] = ${a[j]} < ${a[i]}: nối được → thử f[${j}] + 1 = ${cand}. f[${i}] = ${f[i]}.` });
          } else {
            F.push({ line: 4, vars: { i, j, "a[j]": a[j], "a[i]": a[i] }, arrays: view({ [i]: "cur", [j]: "bad" }, { [i]: "cur" }), msg: `a[${j}] = ${a[j]} ≥ ${a[i]}: không nối được (phải tăng ngặt).` });
          }
        }
        if (f[i] > best) { best = f[i]; bi = i; }
        F.push({ line: 5, vars: { i, "f[i]": f[i], best }, arrays: view({ [i]: "cur" }, { [i]: "done" }), msg: `Xong i = ${i}: f[${i}] = ${f[i]}, best = ${best}.` });
      }
      const path = [];
      for (let k = bi; k !== -1; k = from[k]) path.push(k);
      F.push({ line: 6, vars: { best }, arrays: view(Object.fromEntries(a.map((_, k) => [k, path.includes(k) ? "done" : "dim"])), {}),
        msg: `LIS dài <b>${best}</b>: ${path.reverse().map((k) => a[k]).join(", ")} (truy vết ngược qua mảng from[]).` });
      return F;
    },
  });
})();
