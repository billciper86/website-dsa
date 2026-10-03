/* Mô phỏng chủ đề: Số học */
(function () {
  "use strict";
  const esc = window.HSG.esc;

  /* ---------------- 1. Euclid ---------------- */
  window.SIMS.euclid = (host) => new window.SimPlayer(host, {
    title: "Mô phỏng: thuật toán Euclid tìm ƯCLN",
    inputs: [
      { id: "a", label: "a", value: "252", width: "110px" },
      { id: "b", label: "b", value: "105", width: "110px" },
    ],
    presets: [["Hai số Fibonacci (chạy lâu nhất)", { a: "987", b: "610" }], ["Nguyên tố cùng nhau", { a: "35", b: "64" }]],
    code: [
      "long long gcd(long long a, long long b) {",
      "    while (b != 0) {",
      "        long long r = a % b;",
      "        a = b; b = r;",
      "    }",
      "    return a;",
      "}",
      "// lcm = a / gcd * b",
    ],
    build(v) {
      let a = Number(v.a), b = Number(v.b);
      if (!Number.isInteger(a) || !Number.isInteger(b) || a < 1 || b < 1 || a > 1e15 || b > 1e15) throw new Error("a, b là số nguyên dương ≤ 10^15");
      const A = a, B = b;
      const F = [];
      const hist = [];
      const view = () => [{ name: "a, b", values: hist.length ? hist : [a, b], marks: Object.fromEntries((hist.length ? hist : [a, b]).map((_, i, arr) => [i, i >= arr.length - 2 ? "cur" : "dim"])) }];
      hist.push(a, b);
      F.push({ line: 1, vars: { a, b }, arrays: view(), msg: `Tìm gcd(${a}, ${b}). Ý tưởng: ước chung của a và b cũng là ước chung của b và (a mod b).` });
      let step = 0;
      while (b !== 0) {
        F.push({ line: 2, vars: { a, b }, arrays: view(), msg: `b = ${b} ≠ 0 nên tiếp tục.` });
        const r = a % b;
        step++;
        F.push({ line: 3, vars: { a, b, r }, arrays: view(), msg: `r = ${a} mod ${b} = <b>${r}</b> (vì ${a} = ${b}·${Math.floor(a / b)} + ${r}).` });
        a = b; b = r;
        hist.push(r);
        F.push({ line: 4, vars: { a, b }, arrays: view(), msg: `gcd(${A}, ${B}) = gcd(${a}, ${b}).` });
      }
      const g = a;
      F.push({ line: 6, vars: { gcd: g, "số bước": step, lcm: (A / g) * B }, arrays: [{ name: "dãy", values: hist, marks: { [hist.length - 2]: "done" } }],
        msg: `b = 0 → <b>gcd = ${g}</b>, chỉ sau ${step} bước. BCNN = ${A} / ${g} · ${B} = <b>${(A / g) * B}</b>.` });
      return F;
    },
  });

  /* ---------------- 2. Sàng Eratosthenes ---------------- */
  window.SIMS.sieve = (host) => new window.SimPlayer(host, {
    title: "Mô phỏng: sàng Eratosthenes",
    inputs: [{ id: "n", label: "N (2..100)", value: "50", width: "90px" }],
    code: [
      "comp[0] = comp[1] = true;",
      "for (int i = 2; i * i <= N; i++)",
      "    if (!comp[i])",
      "        for (int j = i * i; j <= N; j += i)",
      "            comp[j] = true;   // gạch bội của i",
      "// số i còn comp[i] = false là số nguyên tố",
    ],
    render(f) {
      const cols = 10;
      let h = `<div class="grid2d" style="grid-template-columns: repeat(${cols}, auto)">`;
      for (let x = 0; x <= f.N; x++) {
        const st = f.state[x];
        const cls = x === f.cur ? "m-cur" : x === f.hit ? "m-bad" : st === "p" ? "m-done" : st === "c" ? "m-dim" : "";
        const style = st === "c" && x !== f.hit ? "text-decoration:line-through;opacity:.45" : "";
        h += `<div class="g ${cls}" style="${style}">${x}</div>`;
      }
      h += `</div><div class="legend"><span><i style="background:var(--warn-soft);border-color:var(--warn)"></i>i đang xét</span><span><i style="background:var(--bad-soft);border-color:var(--bad)"></i>vừa bị gạch</span><span><i style="background:var(--ok-soft);border-color:var(--ok)"></i>số nguyên tố</span><span>gạch ngang = hợp số</span></div>`;
      return h;
    },
    build(v) {
      const N = Number(v.n);
      if (!Number.isInteger(N) || N < 2 || N > 100) throw new Error("N trong khoảng 2..100");
      const state = Array(N + 1).fill("");
      const F = [];
      const snap = (o) => ({ N, state: state.slice(), ...o });
      state[0] = state[1] = "c";
      F.push({ line: 1, vars: { N }, ...snap({}), msg: "0 và 1 không phải số nguyên tố." });
      let ops = 0;
      for (let i = 2; i * i <= N; i++) {
        F.push({ line: 2, vars: { N, i, "i*i": i * i }, ...snap({ cur: i }), msg: `i = ${i}, i·i = ${i * i} ≤ ${N}.` });
        if (state[i] === "c") { F.push({ line: 3, vars: { i }, ...snap({ cur: i }), msg: `${i} đã bị gạch (là hợp số) → bỏ qua, các bội của nó đã bị gạch bởi ước nhỏ hơn.` }); continue; }
        state[i] = "p";
        F.push({ line: 3, vars: { i }, ...snap({ cur: i }), msg: `${i} chưa bị gạch → <b>${i} là số nguyên tố</b>. Gạch các bội bắt đầu từ ${i}·${i} = ${i * i} (bội nhỏ hơn đã bị gạch rồi).` });
        for (let j = i * i; j <= N; j += i) {
          const was = state[j];
          state[j] = "c"; ops++;
          F.push({ line: 5, vars: { i, j, "số lần gạch": ops }, ...snap({ cur: i, hit: j }), msg: `Gạch ${j} = ${i}·${j / i}` + (was === "c" ? " (đã bị gạch trước đó)." : ".") });
        }
      }
      for (let x = 2; x <= N; x++) if (state[x] === "") state[x] = "p";
      const primes = [];
      for (let x = 2; x <= N; x++) if (state[x] === "p") primes.push(x);
      F.push({ line: 6, vars: { N, "số nguyên tố": primes.length, "số lần gạch": ops }, ...snap({}), msg: `Có <b>${primes.length}</b> số nguyên tố ≤ ${N}: ${esc(primes.join(", "))}. Tổng chỉ ${ops} lần gạch.` });
      return F;
    },
  });

  /* ---------------- 3. Lũy thừa nhanh ---------------- */
  window.SIMS.fastpow = (host) => new window.SimPlayer(host, {
    title: "Mô phỏng: lũy thừa nhanh a^b mod M",
    inputs: [
      { id: "a", label: "a", value: "3", width: "80px" },
      { id: "b", label: "b", value: "13", width: "80px" },
      { id: "m", label: "M", value: "1000", width: "100px" },
    ],
    code: [
      "a %= M; long long res = 1;",
      "while (b > 0) {",
      "    if (b & 1) res = res * a % M;  // bit cuối = 1",
      "    a = a * a % M;                 // a^1 -> a^2 -> a^4 ...",
      "    b >>= 1;                       // bỏ bit cuối",
      "}",
      "return res;",
    ],
    build(v) {
      let a = Number(v.a), b = Number(v.b);
      const M = Number(v.m);
      if (![a, b, M].every(Number.isInteger) || a < 0 || b < 0 || M < 2 || a > 1e6 || M > 1e6 || b > 1e9) throw new Error("0 ≤ a ≤ 10^6, 0 ≤ b ≤ 10^9, 2 ≤ M ≤ 10^6");
      const A = a, B = b;
      const bits = B.toString(2).split("").reverse();
      const F = [];
      let k = 0, res = 1, pw = 1;
      a %= M;
      const view = () => [{ name: "bit của b", values: bits.slice().reverse(), marks: Object.fromEntries(bits.map((_, i) => [bits.length - 1 - i, i < k ? "dim" : i === k ? "cur" : ""])) }];
      F.push({ line: 1, vars: { a, b, res }, arrays: view(), msg: `b = ${B} = ${B.toString(2)}₂ (nhị phân). Mỗi bit 1 ứng với một lũy thừa a^(2^k) cần nhân vào.` });
      while (b > 0) {
        if (b & 1) {
          res = (res * a) % M;
          F.push({ line: 3, vars: { "k": k, [`a^${pw}`]: a, res, b }, arrays: view(), msg: `Bit thứ ${k} = 1 → nhân a^${pw} vào kết quả: res = <b>${res}</b>.` });
        } else {
          F.push({ line: 3, vars: { "k": k, [`a^${pw}`]: a, res, b }, arrays: view(), msg: `Bit thứ ${k} = 0 → không nhân.` });
        }
        a = (a * a) % M; pw *= 2;
        F.push({ line: 4, vars: { [`a^${pw}`]: a, res }, arrays: view(), msg: `Bình phương: a^${pw} mod ${M} = ${a}.` });
        b = Math.floor(b / 2); k++;
        F.push({ line: 5, vars: { b, res }, arrays: view(), msg: `b >>= 1 → b = ${b}.` });
      }
      F.push({ line: 7, vars: { kết_quả: res, "số vòng": k }, arrays: view(), msg: `${A}^${B} mod ${M} = <b>${res}</b>, chỉ sau ${k} vòng thay vì ${B} phép nhân.` });
      return F;
    },
  });
})();
