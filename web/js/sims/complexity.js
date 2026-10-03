/* Mô phỏng chủ đề: Độ phức tạp & đọc giới hạn n */
(function () {
  "use strict";
  const { esc, el } = window.HSG;

  const ALGOS = {
    on: {
      code: [
        "long long dem = 0;",
        "for (int i = 1; i <= n; i++) {",
        "    dem++;            // 1 phép toán",
        "}",
        "// Kết thúc: dem = n  ->  O(n)",
      ],
      build(n) {
        if (n < 1 || n > 30) throw new Error("với O(n) hãy chọn 1 ≤ n ≤ 30");
        const F = [];
        const cells = Array.from({ length: n }, (_, k) => k + 1);
        const arr = (i, done) => ({ name: "i", values: cells, base: 1, marks: Object.fromEntries(cells.map((_, k) => [k, k + 1 < i || done ? "done" : k + 1 === i ? "cur" : ""])) });
        let dem = 0;
        F.push({ line: 1, vars: { n, dem }, arrays: [arr(0)], msg: "Khởi tạo bộ đếm phép toán <b>dem = 0</b>." });
        for (let i = 1; i <= n; i++) {
          F.push({ line: 2, vars: { n, i, dem }, arrays: [arr(i)], msg: `Vòng lặp: i = ${i}.` });
          dem++;
          F.push({ line: 3, vars: { n, i, dem }, arrays: [arr(i)], msg: `Làm 1 phép toán → dem = ${dem}.` });
        }
        F.push({ line: 5, vars: { n, dem }, arrays: [arr(n + 1, true)], msg: `Xong: <b>dem = ${dem} = n</b>. Số phép tăng <b>tuyến tính</b> theo n: n gấp đôi thì thời gian gấp đôi.` });
        return F;
      },
    },
    on2: {
      code: [
        "long long dem = 0;",
        "for (int i = 1; i <= n; i++)",
        "    for (int j = i + 1; j <= n; j++)",
        "        dem++;        // xét cặp (i, j)",
        "// dem = n(n-1)/2  ->  O(n^2)",
      ],
      build(n) {
        if (n < 2 || n > 10) throw new Error("với O(n²) hãy chọn 2 ≤ n ≤ 10");
        const F = [];
        const cells = Array.from({ length: n }, (_, k) => k + 1);
        const arr = (i, j) => ({ name: "", values: cells, base: 1, marks: Object.fromEntries(cells.map((_, k) => [k, k + 1 === i ? "cur" : k + 1 === j ? "pur" : ""])), tags: { [i - 1]: "i", [j - 1]: "j" } });
        let dem = 0;
        F.push({ line: 1, vars: { n, dem }, arrays: [arr(0, 0)], msg: "Đếm số cặp (i, j) với i < j — kiểu duyệt <b>trâu</b> hay gặp nhất." });
        for (let i = 1; i <= n; i++) {
          F.push({ line: 2, vars: { n, i, dem }, arrays: [arr(i, 0)], msg: `Cố định i = ${i}, vòng trong chạy j từ ${i + 1} đến ${n} (${n - i} lần).` });
          for (let j = i + 1; j <= n; j++) {
            dem++;
            F.push({ line: 4, vars: { n, i, j, dem }, arrays: [arr(i, j)], msg: `Xét cặp (${i}, ${j}) → dem = ${dem}.` });
          }
        }
        F.push({ line: 5, vars: { n, dem }, arrays: [arr(0, 0)], msg: `Xong: dem = ${dem} = n(n−1)/2. Với n = 10⁵ thì dem ≈ <b>5·10⁹ → quá chậm</b> (TLE). Đây là lý do cần thuật toán tốt hơn.` });
        return F;
      },
    },
    logn: {
      code: [
        "int dem = 0;",
        "while (n > 1) {",
        "    n = n / 2;      // mỗi bước bỏ đi một nửa",
        "    dem++;",
        "}",
        "// dem ≈ log2(n)  ->  O(log n)",
      ],
      build(n) {
        if (n < 1 || n > 1e18) throw new Error("hãy chọn 1 ≤ n ≤ 10^18");
        const F = [];
        const hist = [n];
        let dem = 0;
        const arr = (cur) => ({ name: "n", values: hist.slice(), marks: { [hist.length - 1]: cur ? "cur" : "done" } });
        F.push({ line: 1, vars: { n, dem }, arrays: [arr(true)], msg: "Mỗi bước chia đôi n. Bao nhiêu bước thì n về 1?" });
        while (n > 1) {
          F.push({ line: 2, vars: { n, dem }, arrays: [arr(true)], msg: `n = ${n} > 1 nên tiếp tục.` });
          n = Math.floor(n / 2);
          hist.push(n);
          F.push({ line: 3, vars: { n, dem }, arrays: [arr(true)], msg: `Chia đôi: n = ${n}.` });
          dem++;
          F.push({ line: 4, vars: { n, dem }, arrays: [arr(true)], msg: `dem = ${dem}.` });
        }
        F.push({ line: 6, vars: { n, dem }, arrays: [arr(false)], msg: `Chỉ cần <b>${dem} bước</b>. Với n = 10¹⁸ cũng chỉ ~60 bước — đây là sức mạnh của <b>tìm kiếm nhị phân</b> và <b>lũy thừa nhanh</b>.` });
        return F;
      },
    },
    sqrtn: {
      code: [
        "int dem = 0;",
        "for (long long d = 1; d * d <= n; d++) {",
        "    dem++;",
        "    if (n % d == 0)",
        "        cout << d << ' ' << n / d;  // cặp ước",
        "}",
        "// dem ≈ sqrt(n)  ->  O(sqrt n)",
      ],
      build(n) {
        if (n < 1 || n > 2500) throw new Error("với O(√n) hãy chọn 1 ≤ n ≤ 2500");
        const F = [];
        const ds = [];
        const found = [];
        let dem = 0;
        const view = (cur) => [
          { name: "d", values: ds.slice(), base: 1, marks: Object.fromEntries(ds.map((d, k) => [k, d === cur ? "cur" : n % d === 0 ? "done" : "dim"])) },
          { name: "ước", values: found.slice().sort((a, b) => a - b), marks: {} },
        ];
        F.push({ line: 1, vars: { n, dem }, arrays: view(0), msg: `Tìm ước của ${n}: ước đi theo cặp (d, n/d), một trong hai luôn ≤ √n ≈ ${Math.sqrt(n).toFixed(1)}.` });
        for (let d = 1; d * d <= n; d++) {
          ds.push(d);
          dem++;
          F.push({ line: 2, vars: { n, d, "d*d": d * d, dem }, arrays: view(d), msg: `d = ${d}, d·d = ${d * d} ≤ ${n}.` });
          if (n % d === 0) {
            found.push(d);
            if (d !== n / d) found.push(n / d);
            F.push({ line: 5, vars: { n, d, "n/d": n / d, dem }, arrays: view(d), msg: `${n} chia hết cho ${d} → được cặp ước <b>(${d}, ${n / d})</b>` + (d === n / d ? " — hai số bằng nhau nên chỉ đếm <b>1 lần</b>!" : ".") });
          } else {
            F.push({ line: 4, vars: { n, d, dem }, arrays: view(d), msg: `${n} không chia hết cho ${d}.` });
          }
        }
        F.push({ line: 7, vars: { n, dem, "số ước": found.length }, arrays: view(0), msg: `Chỉ duyệt <b>${dem}</b> giá trị thay vì ${n}. Với n = 10¹² chỉ cần 10⁶ bước.` });
        return F;
      },
    },
  };

  window.SIMS.loops = (host) => {
    let algo = "on";
    const spec = {
      title: "Mô phỏng: đếm số phép toán của từng kiểu vòng lặp",
      inputs: [
        { id: "algo", label: "Kiểu thuật toán", type: "select", value: "on", options: [["on", "O(n) — 1 vòng for"], ["on2", "O(n²) — 2 vòng lồng nhau"], ["logn", "O(log n) — chia đôi"], ["sqrtn", "O(√n) — duyệt tới căn"]] },
        { id: "n", label: "n", value: "8", width: "90px" },
      ],
      get code() { return ALGOS[algo].code; },
      build(v) {
        const n = Number(v.n);
        if (!Number.isFinite(n) || !Number.isInteger(n)) throw new Error("n phải là số nguyên");
        return ALGOS[v.algo].build(n);
      },
    };
    let player = null;
    const make = () => {
      host.innerHTML = "";
      host.className = "";
      player = new window.SimPlayer(host, spec);
      const sel = host.querySelector('[data-id="algo"]');
      sel.value = algo;
      sel.addEventListener("change", () => {
        const keepN = host.querySelector('[data-id="n"]').value;
        algo = sel.value;
        spec.inputs[0].value = algo;
        spec.inputs[1].value = { on: "8", on2: "5", logn: "1000", sqrtn: "36" }[algo] || keepN;
        make();
      });
    };
    make();
  };

  /* Bảng tính: với n cho trước, mỗi độ phức tạp tốn bao nhiêu phép? */
  window.SIMS.calc = (host) => {
    host.className = "sim";
    host.innerHTML = `<div class="sim-head">Máy tính nhanh: với n này, thuật toán nào chạy kịp 1 giây?</div>
      <div class="sim-inputs"><label>n<input type="text" value="100000" class="cn" style="min-width:140px"></label>
        ${[20, 5000, 100000, 1000000, 1e9, 1e18].map((x) => `<button class="btn sm" data-n="${x}">${x >= 1e9 ? "10^" + Math.round(Math.log10(x)) : x.toLocaleString("vi-VN")}</button>`).join("")}</div>
      <div class="sim-view"></div>`;
    const inp = host.querySelector(".cn");
    const view = host.querySelector(".sim-view");
    const rows = [
      ["O(1)", "công thức", () => 1],
      ["O(log n)", "nhị phân, lũy thừa nhanh", (n) => Math.log2(Math.max(n, 2))],
      ["O(√n)", "duyệt ước, kiểm tra nguyên tố", (n) => Math.sqrt(n)],
      ["O(n)", "1 vòng for, prefix sum, two pointers", (n) => n],
      ["O(n log n)", "sort, nhị phân trong vòng for", (n) => n * Math.log2(Math.max(n, 2))],
      ["O(n²)", "2 vòng lồng nhau, DP 2 chiều", (n) => n * n],
      ["O(n³)", "3 vòng lồng nhau", (n) => n ** 3],
      ["O(2ⁿ)", "duyệt mọi tập con", (n) => 2 ** n],
      ["O(n!)", "duyệt mọi hoán vị", (n) => { let r = 1; for (let i = 2; i <= n && r < 1e300; i++) r *= i; return r; }],
    ];
    const fmt = (x) => {
      if (!isFinite(x) || x > 1e300) return "vô cùng lớn";
      if (x < 1e6) return Math.round(x).toLocaleString("vi-VN");
      const e = Math.floor(Math.log10(x));
      return (x / 10 ** e).toFixed(1) + "·10^" + e;
    };
    function draw() {
      const n = Number(inp.value.replace(/[.\s]/g, ""));
      if (!(n >= 1)) { view.innerHTML = '<p class="muted">Nhập n ≥ 1</p>'; return; }
      let h = `<table class="tbl"><tr><th>Độ phức tạp</th><th>Thường gặp ở</th><th>Số phép ≈</th><th>Với giới hạn 1 giây</th></tr>`;
      for (const [name, where, f] of rows) {
        const ops = f(n);
        const v = ops <= 1e8 ? '<span class="badge ok">Chạy kịp</span>' : ops <= 5e8 ? '<span class="badge warn">Sát nút, phải tối ưu</span>' : '<span class="badge bad">Quá chậm (TLE)</span>';
        h += `<tr><td><b>${name}</b></td><td class="muted">${where}</td><td style="font-family:var(--mono)">${fmt(ops)}</td><td>${v}</td></tr>`;
      }
      view.innerHTML = h + `</table><p class="small muted">Quy tắc nhớ: máy chấm làm được khoảng <b>10⁸ phép tính đơn giản mỗi giây</b> (C++ có -O2).</p>`;
    }
    inp.addEventListener("input", draw);
    host.querySelectorAll("[data-n]").forEach((b) => (b.onclick = () => { inp.value = b.dataset.n === "1e+18" ? "1000000000000000000" : String(Number(b.dataset.n)); draw(); }));
    draw();
  };
})();
