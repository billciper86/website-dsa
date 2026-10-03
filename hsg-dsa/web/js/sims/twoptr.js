/* Mô phỏng chủ đề: Two pointers & sliding window */
(function () {
  "use strict";
  const { parseNums } = window.SimUtil;

  window.SIMS.window = (host) => new window.SimPlayer(host, {
    title: "Mô phỏng: cửa sổ trượt — đoạn dài nhất có tổng ≤ S",
    inputs: [
      { id: "a", label: "Dãy số dương (tối đa 16 số)", value: "4 2 1 3 6 1 1 9 2 2" },
      { id: "S", label: "S", value: "10", width: "80px" },
    ],
    code: [
      "int l = 0, best = 0; long long sum = 0;",
      "for (int r = 0; r < n; r++) {",
      "    sum += a[r];              // a[r] vào cửa sổ",
      "    while (sum > S) {",
      "        sum -= a[l]; l++;     // a[l] ra khỏi cửa sổ",
      "    }",
      "    best = max(best, r - l + 1);",
      "}",
    ],
    build(v) {
      const a = parseNums(v.a, { max: 16, lo: 1, hi: 999, name: "dãy (số dương)" });
      const S = Number(v.S);
      if (!Number.isInteger(S) || S < 1) throw new Error("S phải là số nguyên dương");
      const n = a.length;
      const F = [];
      let l = 0, best = 0, sum = 0, bl = -1, br = -1;
      const view = (r, extra = {}) => {
        const marks = {}, tags = {};
        for (let i = 0; i < n; i++) marks[i] = i >= l && i <= r ? "range" : i < l ? "dim" : "";
        Object.assign(marks, extra);
        if (l < n) tags[l] = "l";
        if (r >= 0 && r < n) tags[r] = (tags[r] ? tags[r] + "," : "") + "r";
        const best_ = a.map((_, i) => (i >= bl && i <= br ? "★" : ""));
        return [{ name: "a", values: a, marks, tags }, { name: "tốt nhất", values: best_, marks: Object.fromEntries(best_.map((x, i) => [i, x ? "done" : "dim"])) }];
      };
      F.push({ line: 1, vars: { S, l, sum, best }, arrays: view(-1), msg: "Cửa sổ [l, r] ban đầu rỗng. Mỗi phần tử sẽ vào đúng 1 lần, ra nhiều nhất 1 lần → O(n)." });
      for (let r = 0; r < n; r++) {
        sum += a[r];
        F.push({ line: 3, vars: { S, l, r, sum, best }, arrays: view(r, { [r]: "cur" }), msg: `r = ${r}: a[${r}] = ${a[r]} vào cửa sổ → sum = ${sum}.` + (sum > S ? ` <b>Vượt S = ${S}!</b>` : "") });
        while (sum > S) {
          const out = a[l];
          sum -= out; l++;
          F.push({ line: 5, vars: { S, l, r, sum, best }, arrays: view(r, { [l - 1]: "bad" }), msg: `sum > S nên bỏ a[${l - 1}] = ${out} ra, l tiến lên ${l} → sum = ${sum}.` });
        }
        if (r - l + 1 > best) { best = r - l + 1; bl = l; br = r; }
        F.push({ line: 7, vars: { S, l, r, sum, "độ dài": r - l + 1, best }, arrays: view(r), msg: `Cửa sổ [${l}, ${r}] hợp lệ (sum = ${sum} ≤ ${S}), dài ${Math.max(0, r - l + 1)}. best = ${best}.` });
      }
      F.push({ line: 8, vars: { best }, arrays: view(n - 1), msg: `Kết quả: đoạn dài nhất là <b>${best}</b>` + (best ? ` (vị trí ${bl}..${br}, đánh dấu ★).` : " — mọi phần tử đều lớn hơn S.") + ` Con trỏ l chỉ tiến tổng cộng ${l} bước.` });
      return F;
    },
  });
})();
