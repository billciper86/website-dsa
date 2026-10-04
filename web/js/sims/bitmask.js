/* Mô phỏng chủ đề: Bitmask - duyệt mọi tập con */
(function () {
  "use strict";
  const { parseNums } = window.SimUtil;

  window.SIMS.subsets = (host) => new window.SimPlayer(host, {
    title: "Mô phỏng: duyệt mọi tập con bằng bitmask — đếm tập con có tổng S",
    inputs: [
      { id: "a", label: "Dãy a (tối đa 5 số)", value: "1 2 3 4" },
      { id: "S", label: "S", value: "5", width: "80px" },
    ],
    code: [
      "for (int mask = 0; mask < (1 << n); mask++) {",
      "    long long s = 0;",
      "    for (int i = 0; i < n; i++)",
      "        if (mask >> i & 1) s += a[i];",
      "    if (s == S) cnt++;",
      "}",
    ],
    build(v) {
      const a = parseNums(v.a, { max: 5, lo: 0, hi: 999, name: "dãy a" });
      const S = Number(v.S);
      if (!Number.isInteger(S)) throw new Error("S phải là số nguyên");
      const n = a.length;
      const F = [];
      let cnt = 0;
      const found = [];
      for (let mask = 0; mask < (1 << n); mask++) {
        const bits = [];
        for (let i = n - 1; i >= 0; i--) bits.push((mask >> i) & 1);
        const chosen = a.map((_, i) => (mask >> i) & 1);
        const s = a.reduce((t, x, i) => t + (chosen[i] ? x : 0), 0);
        const hit = s === S;
        if (hit) { cnt++; found.push(mask); }
        F.push({
          line: hit ? 5 : 4,
          vars: { mask, "nhị phân": mask.toString(2).padStart(n, "0"), s, cnt },
          arrays: [
            { name: "bit", values: bits, marks: Object.fromEntries(bits.map((b, k) => [k, b ? "cur" : "dim"])), tags: Object.fromEntries(bits.map((_, k) => [k, "i=" + (n - 1 - k)])) },
            { name: "a", values: a, marks: Object.fromEntries(chosen.map((c, i) => [i, c ? (hit ? "done" : "range") : "dim"])) },
          ],
          msg: `mask = ${mask} = ${mask.toString(2).padStart(n, "0")}₂ → chọn {${a.filter((_, i) => chosen[i]).join(", ") || "∅"}}, tổng ${s}` + (hit ? ` = S → <b>đếm</b> (cnt = ${cnt}).` : "."),
        });
      }
      F.push({ line: 6, vars: { "số tập con": 1 << n, cnt }, arrays: [{ name: "a", values: a, marks: {} }],
        msg: `Đã duyệt đủ 2^${n} = ${1 << n} tập con. Có <b>${cnt}</b> tập có tổng ${S}` + (found.length ? `: mask ${found.join(", ")}.` : ".") });
      return F;
    },
  });
})();
