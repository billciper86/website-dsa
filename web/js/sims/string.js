/* Mô phỏng chủ đề: Xâu ký tự */
(function () {
  "use strict";

  function readStr(v, max, name) {
    const s = v.trim();
    if (!s || s.length > max || !/^[a-z]+$/.test(s)) throw new Error(`${name}: 1–${max} chữ cái thường a–z`);
    return s;
  }

  /* ---------------- 1. Xâu đối xứng: mở rộng từ tâm ---------------- */
  window.SIMS.palindrome = (host) => new window.SimPlayer(host, {
    title: "Mô phỏng: xâu đối xứng dài nhất — mở rộng từ tâm",
    inputs: [{ id: "s", label: "Xâu s (tối đa 14 chữ)", value: "cabbadx" }],
    presets: [["Đối xứng lẻ", { s: "xabacabay" }], ["Toàn một chữ", { s: "aaaaa" }]],
    code: [
      "for (int c = 0; c < n; c++) {",
      "    best = max(best, expand(c, c));     // tâm lẻ",
      "    best = max(best, expand(c, c + 1)); // tâm chẵn",
      "}",
      "int expand(int l, int r) {",
      "    while (l >= 0 && r < n && s[l] == s[r]) { l--; r++; }",
      "    return r - l - 1;",
      "}",
    ],
    build(v) {
      const s = readStr(v.s, 14, "xâu");
      const n = s.length;
      const chars = s.split("");
      const F = [];
      let best = 1, bl = 0, br = 0;
      const view = (l, r, ok, extra = {}) => {
        const marks = {};
        for (let i = 0; i < n; i++) marks[i] = i >= bl && i <= br ? "done" : "";
        for (let i = l + 1; i < r; i++) marks[i] = "range";
        if (l >= 0 && l < n) marks[l] = ok ? "cur" : "bad";
        if (r >= 0 && r < n) marks[r] = ok ? "cur" : "bad";
        const tags = {};
        if (l >= 0 && l < n) tags[l] = "l";
        if (r >= 0 && r < n) tags[r] = (tags[r] ? tags[r] + "," : "") + "r";
        return [{ name: "s", values: chars, marks: { ...marks, ...extra }, tags }];
      };
      F.push({ line: 1, vars: { n, best }, arrays: view(-1, -1, true), msg: `Có ${2 * n - 1} tâm: ${n} tâm là 1 ký tự và ${n - 1} tâm nằm giữa 2 ký tự.` });
      for (let c = 0; c < n; c++) {
        for (const [L0, R0, kind, line] of [[c, c, "lẻ", 2], [c, c + 1, "chẵn", 3]]) {
          if (R0 >= n) continue;
          let l = L0, r = R0;
          F.push({ line, vars: { c, "loại tâm": kind, l, r, best }, arrays: view(l, r, s[l] === s[r]), msg: `Tâm ${kind} tại ${kind === "lẻ" ? `vị trí ${c}` : `giữa ${c} và ${c + 1}`}.` });
          while (l >= 0 && r < n && s[l] === s[r]) {
            F.push({ line: 6, vars: { c, l, r, "s[l]": s[l], "s[r]": s[r], best }, arrays: view(l, r, true), msg: `s[${l}] = s[${r}] = '${s[l]}' → mở rộng thêm.` });
            l--; r++;
          }
          const len = r - l - 1;
          let msg = l >= 0 && r < n ? `s[${l}] = '${s[l]}' ≠ s[${r}] = '${s[r]}' → dừng.` : "Chạm biên xâu → dừng.";
          if (len > best) { best = len; bl = l + 1; br = r - 1; msg += ` Tìm được đối xứng dài <b>${len}</b>: "${s.slice(bl, br + 1)}" — kỷ lục mới!`; }
          else msg += ` Độ dài ${len}.`;
          F.push({ line: 7, vars: { c, "độ dài": len, best }, arrays: view(l, r, false), msg });
        }
      }
      F.push({ line: 4, vars: { best }, arrays: view(-1, -1, true), msg: `Xâu đối xứng dài nhất: <b>"${s.slice(bl, br + 1)}"</b>, độ dài <b>${best}</b>.` });
      return F;
    },
  });

  /* ---------------- 2. Đếm hoán vị: cửa sổ trượt ---------------- */
  window.SIMS.anagram = (host) => new window.SimPlayer(host, {
    title: "Mô phỏng: đếm hoán vị của p trong s — cửa sổ trượt + mảng đếm",
    inputs: [
      { id: "s", label: "Xâu s (tối đa 16 chữ)", value: "cbabcacab" },
      { id: "p", label: "Xâu p", value: "abc", width: "100px" },
    ],
    code: [
      "for (char c : p) need[c-'a']++;",
      "for (int i = 0; i < m; i++) win[s[i]-'a']++;",
      "int cnt = (win == need);",
      "for (int i = m; i < n; i++) {",
      "    win[s[i]-'a']++; win[s[i-m]-'a']--;",
      "    if (win == need) cnt++;",
      "}",
    ],
    build(v) {
      const s = readStr(v.s, 16, "s"), p = readStr(v.p, 16, "p");
      const n = s.length, m = p.length;
      if (m > n) throw new Error("|p| > |s| → đáp án 0, không có gì để mô phỏng");
      const letters = Array.from(new Set((s + p).split(""))).sort();
      const need = {}, win = {};
      letters.forEach((c) => { need[c] = 0; win[c] = 0; });
      for (const c of p) need[c]++;
      const F = [];
      let cnt = 0;
      const view = (l, ok) => {
        const marks = {};
        for (let i = 0; i < n; i++) marks[i] = i >= l && i < l + m ? (ok ? "done" : "range") : "";
        return [
          { name: "s", values: s.split(""), marks },
          { name: "chữ", values: letters, marks: {} },
          { name: "need", values: letters.map((c) => need[c]), marks: {} },
          { name: "win", values: letters.map((c) => win[c]), marks: Object.fromEntries(letters.map((c, k) => [k, win[c] === need[c] ? "done" : "bad"])) },
        ];
      };
      for (let i = 0; i < m; i++) win[s[i]]++;
      const eq = () => letters.every((c) => win[c] === need[c]);
      let ok = eq(); if (ok) cnt++;
      F.push({ line: 3, vars: { m, cnt }, arrays: view(0, ok), msg: `Cửa sổ đầu "${s.slice(0, m)}": ` + (ok ? "<b>khớp</b> với p." : "chưa khớp (ô đỏ = số lần khác nhau).") });
      for (let i = m; i < n; i++) {
        win[s[i]]++; win[s[i - m]]--;
        ok = eq(); if (ok) cnt++;
        F.push({ line: 6, vars: { i, "vào": s[i], "ra": s[i - m], cnt }, arrays: view(i - m + 1, ok), msg: `Trượt: '${s[i]}' vào, '${s[i - m]}' ra → cửa sổ "${s.slice(i - m + 1, i + 1)}" ` + (ok ? "<b>khớp</b>!" : "chưa khớp.") + " Chỉ cập nhật 2 ô của bảng đếm, không đếm lại từ đầu." });
      }
      F.push({ line: 7, vars: { cnt }, arrays: view(-99, false), msg: `Có <b>${cnt}</b> vị trí là hoán vị của "${p}".` });
      return F;
    },
  });
})();
