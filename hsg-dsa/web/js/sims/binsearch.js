/* Mô phỏng chủ đề: Sort & tìm kiếm nhị phân */
(function () {
  "use strict";
  const { parseNums } = window.SimUtil;

  /* ---------------- 1. lower_bound trên dãy đã sắp xếp ---------------- */
  window.SIMS.bsearch = (host) => new window.SimPlayer(host, {
    title: "Mô phỏng: lower_bound — tìm vị trí đầu tiên có a[i] ≥ x",
    inputs: [
      { id: "a", label: "Dãy a (sẽ tự sắp xếp, tối đa 16 số)", value: "2 3 3 5 8 8 8 11 13 17 20" },
      { id: "x", label: "x", value: "8", width: "80px" },
    ],
    presets: [["x không có trong dãy", { x: "9" }], ["x lớn hơn mọi số", { x: "100" }]],
    code: [
      "sort(a.begin(), a.end());",
      "int lo = 0, hi = n;          // tìm trong [lo, hi)",
      "while (lo < hi) {",
      "    int mid = (lo + hi) / 2;",
      "    if (a[mid] >= x) hi = mid;",
      "    else lo = mid + 1;",
      "}",
      "// lo = vị trí đầu tiên có a[lo] >= x",
    ],
    build(v) {
      const a = parseNums(v.a, { max: 16, lo: -999, hi: 999, name: "dãy a" }).sort((p, q) => p - q);
      const x = Number(v.x);
      if (!Number.isInteger(x)) throw new Error("x phải là số nguyên");
      const n = a.length;
      const F = [];
      const view = (lo, hi, mid, extra = {}) => {
        const marks = {};
        a.forEach((_, i) => { marks[i] = i >= lo && i < hi ? "range" : "dim"; });
        if (mid != null) marks[mid] = "cur";
        Object.assign(marks, extra);
        const tags = {};
        if (lo < n) tags[lo] = "lo"; if (hi < n) tags[hi] = (tags[hi] ? tags[hi] + "," : "") + "hi";
        if (mid != null) tags[mid] = (tags[mid] ? tags[mid] + "," : "") + "mid";
        return [{ name: "a", values: a, marks, tags }];
      };
      let lo = 0, hi = n, step = 0;
      F.push({ line: 1, vars: { n, x }, arrays: view(0, n), msg: "Dãy đã được sắp xếp tăng dần — điều kiện bắt buộc của tìm kiếm nhị phân." });
      F.push({ line: 2, vars: { x, lo, hi }, arrays: view(lo, hi), msg: `Vùng tìm kiếm ban đầu [${lo}, ${hi}) — toàn bộ dãy (màu xanh).` });
      while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        step++;
        F.push({ line: 4, vars: { x, lo, hi, mid, "a[mid]": a[mid] }, arrays: view(lo, hi, mid), msg: `Lần ${step}: xét giữa mid = ${mid}, a[mid] = ${a[mid]}.` });
        if (a[mid] >= x) {
          hi = mid;
          F.push({ line: 5, vars: { x, lo, hi, mid }, arrays: view(lo, hi, null, { [mid]: "pur" }), msg: `a[${mid}] = ${a[mid]} ≥ ${x}: đáp án là mid hoặc nằm bên trái → hi = ${mid}. Bỏ đi nửa phải!` });
        } else {
          lo = mid + 1;
          F.push({ line: 6, vars: { x, lo, hi, mid }, arrays: view(lo, hi), msg: `a[${mid}] = ${a[mid]} < ${x}: đáp án nằm bên phải mid → lo = ${mid + 1}. Bỏ đi nửa trái!` });
        }
      }
      const found = lo < n && a[lo] === x;
      F.push({ line: 8, vars: { x, lo, "số lần chia đôi": step }, arrays: view(-1, -1, null, lo < n ? { [lo]: found ? "done" : "bad" } : {}),
        msg: lo === n ? `lo = n = ${n}: mọi số đều < ${x}. Chỉ mất ${step} bước.` :
          `Kết quả lo = ${lo}: có <b>${lo} số nhỏ hơn ${x}</b>. ` + (found ? `a[${lo}] = ${x} → <b>tìm thấy</b> x (lần xuất hiện đầu tiên).` : `a[${lo}] = ${a[lo]} ≠ ${x} → x <b>không có</b> trong dãy.`) + ` Chỉ mất ${step} bước.` });
      return F;
    },
  });

  /* ---------------- 2. Chặt nhị phân theo kết quả: cắt gỗ ---------------- */
  window.SIMS.answer = (host) => new window.SimPlayer(host, {
    title: "Mô phỏng: chặt nhị phân theo kết quả — bài Cắt gỗ",
    inputs: [
      { id: "a", label: "Độ dài các khúc gỗ (tối đa 10)", value: "8 12 5 3" },
      { id: "k", label: "Cần ít nhất k thanh", value: "7", width: "80px" },
    ],
    code: [
      "long long lo = 1, hi = max(a), ans = 0;",
      "while (lo <= hi) {",
      "    long long mid = lo + (hi - lo) / 2;",
      "    // ok(mid): đếm số thanh dài mid",
      "    if (ok(mid)) { ans = mid; lo = mid + 1; }",
      "    else hi = mid - 1;",
      "}",
      "cout << ans;",
    ],
    build(v) {
      const a = parseNums(v.a, { max: 10, lo: 1, hi: 30, name: "độ dài (để dễ nhìn, mỗi khúc ≤ 30)" });
      const k = Number(v.k);
      if (!Number.isInteger(k) || k < 1) throw new Error("k phải là số nguyên dương");
      const mx = Math.max(...a);
      const F = [];
      const Ls = Array.from({ length: mx }, (_, i) => i + 1);
      const tested = {};
      const view = (lo, hi, mid) => {
        const marks = {};
        Ls.forEach((L, i) => { marks[i] = tested[L] === true ? "done" : tested[L] === false ? "bad" : L >= lo && L <= hi ? "range" : "dim"; });
        if (mid) marks[mid - 1] = "cur";
        const tags = {}; if (lo >= 1 && lo <= mx) tags[lo - 1] = "lo"; if (hi >= 1 && hi <= mx) tags[hi - 1] = (tags[hi - 1] ? tags[hi - 1] + "," : "") + "hi";
        return [{ name: "L", values: Ls, marks, tags, base: 1 }, { name: "gỗ", values: a, marks: {} }];
      };
      let lo = 1, hi = mx, ans = 0;
      F.push({ line: 1, vars: { k, lo, hi, ans }, arrays: view(lo, hi), msg: `Đáp án L nằm trong [1, ${mx}]. Ô xanh lá = L đã thử và <b>được</b>, ô đỏ = <b>không được</b>.` });
      while (lo <= hi) {
        const mid = lo + Math.floor((hi - lo) / 2);
        const cnt = a.reduce((s, x) => s + Math.floor(x / mid), 0);
        F.push({ line: 3, vars: { k, lo, hi, mid }, arrays: view(lo, hi, mid), msg: `Đoán L = mid = ${mid}.` });
        const detail = a.map((x) => `⌊${x}/${mid}⌋`).join(" + ") + ` = ${cnt}`;
        if (cnt >= k) {
          tested[mid] = true; ans = mid; lo = mid + 1;
          F.push({ line: 5, vars: { k, mid, "số thanh": cnt, ans, lo, hi }, arrays: view(lo, hi), msg: `${detail} ≥ ${k} → <b>được</b>. Ghi nhận ans = ${mid}, thử L lớn hơn: lo = ${lo}. (Mọi L < ${mid} chắc chắn cũng được — không cần thử.)` });
        } else {
          tested[mid] = false; hi = mid - 1;
          F.push({ line: 6, vars: { k, mid, "số thanh": cnt, ans, lo, hi }, arrays: view(lo, hi), msg: `${detail} < ${k} → <b>không được</b>. L phải nhỏ hơn: hi = ${hi}. (Mọi L > ${mid} cũng không được.)` });
        }
      }
      F.push({ line: 8, vars: { ans }, arrays: view(0, -1), msg: ans ? `Đáp án L = <b>${ans}</b>. Chỉ thử ${Object.keys(tested).length} giá trị thay vì ${mx}.` : "Không cắt đủ k thanh dù L = 1 → in <b>0</b>." });
      return F;
    },
  });
})();
