/* Mô phỏng chủ đề: BFS/DFS trên lưới */
(function () {
  "use strict";

  window.SIMS.bfs = (host) => new window.SimPlayer(host, {
    title: "Mô phỏng: BFS / DFS trên lưới — tìm đường từ S tới T",
    inputs: [
      { id: "g", label: "Lưới (. trống, # tường, S, T; tối đa 8×10)", type: "textarea", rows: 5, value: "S...#.\n.##.#.\n...T..\n#.#..#" },
      { id: "mode", label: "Thuật toán", type: "select", value: "bfs", options: [["bfs", "BFS (hàng đợi) — đường ngắn nhất"], ["dfs", "DFS (ngăn xếp) — KHÔNG chắc ngắn nhất"]] },
    ],
    code: [
      "dist[S] = 0; q.push(S);",
      "while (!q.empty()) {",
      "    u = q.front(); q.pop();      // DFS: st.top(); st.pop();",
      "    for (4 ô kề v của u)",
      "        if (v trống && dist[v] == -1) {",
      "            dist[v] = dist[u] + 1;",
      "            q.push(v);",
      "        }",
      "}",
    ],
    build(v) {
      const rows = v.g.trim().split("\n").map((r) => r.trim()).filter(Boolean);
      if (!rows.length || rows.length > 8) throw new Error("cần 1–8 hàng");
      const m = rows[0].length;
      if (m < 1 || m > 10 || rows.some((r) => r.length !== m || /[^.#ST]/.test(r))) throw new Error("mỗi hàng cùng độ dài (≤ 10), chỉ gồm . # S T");
      const flat = rows.join("");
      if ((flat.match(/S/g) || []).length !== 1 || (flat.match(/T/g) || []).length !== 1) throw new Error("cần đúng 1 S và 1 T");
      const n = rows.length;
      const bfs = v.mode === "bfs";
      let sx, sy, tx, ty;
      rows.forEach((r, i) => r.split("").forEach((c, j) => { if (c === "S") { sx = i; sy = j; } if (c === "T") { tx = i; ty = j; } }));
      const dist = rows.map((r) => r.split("").map(() => -1));
      const done = rows.map((r) => r.split("").map(() => false));
      const F = [];
      const cont = [];
      const grids = (cur, nb) => {
        const cells = rows.map((r, i) => r.split("").map((c, j) => (c === "#" ? "■" : dist[i][j] >= 0 ? dist[i][j] : c === "T" ? "T" : "")));
        const marks = {};
        rows.forEach((r, i) => r.split("").forEach((c, j) => {
          if (c === "#") marks[i + "," + j] = "dim";
          else if (done[i][j]) marks[i + "," + j] = "done";
          else if (dist[i][j] >= 0) marks[i + "," + j] = "range";
        }));
        if (cur) marks[cur[0] + "," + cur[1]] = "cur";
        if (nb) marks[nb[0] + "," + nb[1]] = "pur";
        marks[tx + "," + ty] = marks[tx + "," + ty] === "cur" ? "cur" : dist[tx][ty] >= 0 ? "bad" : marks[tx + "," + ty] || "bad";
        return [{ name: "dist (số = khoảng cách, ■ = tường)", cells, marks }];
      };
      const qhtml = () => `<div class="small muted" style="font-family:var(--mono)">${bfs ? "Hàng đợi (lấy ở đầu trái)" : "Ngăn xếp (lấy ở cuối phải)"}: [ ${cont.map((p) => `(${p[0]},${p[1]})`).join(" ")} ]</div>`;
      dist[sx][sy] = 0; cont.push([sx, sy]);
      F.push({ line: 1, vars: { n, m }, grids: grids([sx, sy]), html: qhtml(), msg: `Bắt đầu từ S = (${sx}, ${sy}) với dist = 0.` });
      const dx = [-1, 1, 0, 0], dy = [0, 0, -1, 1];
      let found = false;
      while (cont.length && !found) {
        const [x, y] = bfs ? cont.shift() : cont.pop();
        F.push({ line: 3, vars: { u: `(${x},${y})`, "dist[u]": dist[x][y], "số phần tử chờ": cont.length }, grids: grids([x, y]), html: qhtml(), msg: `Lấy ô (${x}, ${y}) ra, dist = ${dist[x][y]}.` });
        for (let d = 0; d < 4; d++) {
          const nx = x + dx[d], ny = y + dy[d];
          if (nx < 0 || nx >= n || ny < 0 || ny >= m || rows[nx][ny] === "#" || dist[nx][ny] !== -1) continue;
          dist[nx][ny] = dist[x][y] + 1;
          cont.push([nx, ny]);
          F.push({ line: 6, vars: { u: `(${x},${y})`, v: `(${nx},${ny})`, "dist[v]": dist[nx][ny] }, grids: grids([x, y], [nx, ny]), html: qhtml(), msg: `Ô kề (${nx}, ${ny}) chưa thăm → dist = ${dist[nx][ny]}, cho vào ${bfs ? "hàng đợi" : "ngăn xếp"}.` + (nx === tx && ny === ty ? " <b>Đã chạm tới T!</b>" : "") });
          if (nx === tx && ny === ty) found = true;
        }
        done[x][y] = true;
      }
      // khoảng cách đúng để so sánh
      const real = rows.map((r) => r.split("").map(() => -1));
      const qq = [[sx, sy]]; real[sx][sy] = 0;
      while (qq.length) { const [x, y] = qq.shift(); for (let d = 0; d < 4; d++) { const nx = x + dx[d], ny = y + dy[d]; if (nx >= 0 && nx < n && ny >= 0 && ny < m && rows[nx][ny] !== "#" && real[nx][ny] < 0) { real[nx][ny] = real[x][y] + 1; qq.push([nx, ny]); } } }
      const got = dist[tx][ty], best = real[tx][ty];
      let msg;
      if (best < 0) msg = "Không tới được T → đáp án <b>−1</b>.";
      else if (got === best) msg = `${bfs ? "BFS" : "DFS"} cho dist[T] = <b>${got}</b> — đúng là ngắn nhất.` + (bfs ? " Mỗi ô được gán dist đúng 1 lần, theo thứ tự lớp tăng dần." : " (Lần này DFS may mắn đúng — thử lưới khác.)");
      else msg = `DFS cho dist[T] = <b>${got}</b> nhưng đường ngắn nhất thật là <b>${best}</b>. DFS đi sâu theo một hướng nên ô bị gán khoảng cách quá lớn → <b>SAI</b>.`;
      F.push({ line: 9, vars: { "dist[T]": got, "ngắn nhất": best }, grids: grids(null), html: qhtml(), msg });
      return F;
    },
  });
})();
