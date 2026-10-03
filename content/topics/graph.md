# BFS/DFS & loang trên lưới

## 1. Ý nghĩa

**Đồ thị** gồm các **đỉnh** (người, ô, thành phố) và các **cạnh** nối chúng (quen nhau, kề nhau, có đường). **BFS** (tìm kiếm theo chiều rộng) và **DFS** (tìm kiếm theo chiều sâu) là hai cách **đi thăm mọi đỉnh** có thể tới được từ một đỉnh xuất phát.

**Ví dụ đời thường:**
- Đổ một giọt mực lên tờ giấy kẻ ô: mực **loang** dần sang các ô kề. Đếm số "vũng" trên bản đồ chính là bài **đếm thành phần liên thông**.
- Tin đồn lan trong lớp: phút 1 bạn A kể cho các bạn thân, phút 2 những bạn đó kể tiếp… Thời điểm mỗi người nghe tin chính là **khoảng cách BFS**, tức là số bước ít nhất.

Ở mức giải Ba, đồ thị trong đề tỉnh hầu hết là **lưới ô vuông** hoặc **đồ thị cho dưới dạng danh sách cạnh**, chỉ cần BFS/DFS.

## 2. Kiến thức cốt lõi

**BFS dùng hàng đợi `queue`**, thăm theo từng lớp: các đỉnh cách 1 bước, rồi cách 2 bước… Ô được thăm **lần đầu** thì khoảng cách lúc đó **là ngắn nhất** (khi mọi cạnh dài bằng nhau).

```cpp
queue<pair<int,int>> q;
dist[sx][sy] = 0; q.push({sx, sy});
while (!q.empty()) {
    auto [x, y] = q.front(); q.pop();
    for (int d = 0; d < 4; d++) {
        int nx = x + dx[d], ny = y + dy[d];
        if (ra ngoài lưới || là tường || đã thăm) continue;
        dist[nx][ny] = dist[x][y] + 1;     // đánh dấu NGAY khi cho vào hàng đợi
        q.push({nx, ny});
    }
}
```

**DFS dùng đệ quy** (hoặc `stack`): đi sâu hết mức rồi mới quay lui. DFS ngắn gọn, phù hợp để **đếm vùng hoặc đánh dấu**, nhưng **không** cho đường ngắn nhất.

**Lưới:** 4 hướng là `dx = {-1, 1, 0, 0}`, `dy = {0, 0, -1, 1}`. Thêm 4 hướng chéo nếu đề cho phép đi chéo.

**Đồ thị danh sách cạnh:** `vector<vector<int>> adj(n + 1)`. Với **vô hướng** phải thêm cả `adj[a].push_back(b)` và `adj[b].push_back(a)`.

**Thành phần liên thông:** duyệt mọi đỉnh. Gặp đỉnh chưa thăm thì tăng số thành phần lên 1 và BFS/DFS đánh dấu cả thành phần đó (có thể ghi mã `comp[v]`).

**BFS nhiều nguồn:** cho **mọi** điểm xuất phát vào hàng đợi từ đầu với dist = 0. Dùng cho bài "lửa lan từ nhiều nơi", "khoảng cách tới siêu thị gần nhất".

[[SIM:bfs]]

## 3. Dấu hiệu nhận biết trong đề

**Dấu hiệu CÓ:**
- Lưới có ô cấm / ô trống: "đếm số vùng / hồ / đảo", "kích thước vùng lớn nhất", "có đi được từ A tới B không".
- "**Số bước ít nhất**", "thời gian ngắn nhất" khi mỗi bước tốn như nhau: dùng **BFS**.
- "Lan truyền", "lây lan", "cháy rừng", "ngập lụt" từ một hoặc nhiều điểm: dùng **BFS (nhiều nguồn)**.
- n người, m quan hệ "quen nhau / có đường nối", hỏi "có liên lạc được", "bao nhiêu nhóm": đếm **thành phần liên thông**.
- n, m ≤ 10⁵–10⁶ đỉnh/cạnh, hoặc lưới ≤ 1000 × 1000: O(n + m) là vừa đủ.

> [!WARN] **Dấu hiệu KHÔNG phải dạng này:**
> - Các cạnh có **trọng số khác nhau** (đường dài 3 km, 5 km…): BFS cho kết quả sai, cần **Dijkstra** (vượt mức giải Ba, hãy làm subtask nhỏ).
> - Robot chỉ đi **phải / xuống**: không có vòng nên dùng **QHĐ** đơn giản hơn.
> - Có cả **thêm và xóa cạnh** xen kẽ với câu hỏi: cần cấu trúc nâng cao (DSU…). Nếu q nhỏ thì BFS lại mỗi lần.

## 4. Độ phức tạp: so sánh với cách trâu

| Bài | Trâu | BFS/DFS |
|---|---|---|
| Đếm vùng | lặp "lan nhãn" tới khi ổn định: O((n·m)²) | O(n·m) |
| Đường ngắn nhất trên lưới | thử mọi đường (hàm mũ) / lặp cập nhật | O(n·m) |
| q câu hỏi liên thông | BFS mỗi câu: O(q·(n+m)) | BFS 1 lần + so mã: O(n + m + q) |

Bộ nhớ: mảng `dist`/`vis` cỡ n·m, cộng hàng đợi tối đa n·m phần tử. Với lưới 1000×1000 khoảng 4–8 MB.

## 5. Mô phỏng tương tác

Mô phỏng ở mục 2 chạy BFS trên lưới. Bạn có thể tự vẽ mê cung bằng `.`, `#`, `S`, `T`, rồi xem hàng đợi và các "lớp" khoảng cách lan ra. Chọn chế độ "DFS" để thấy vì sao DFS không cho đường ngắn nhất.

## 6. Code C++ mẫu

```cpp
#include <bits/stdc++.h>
using namespace std;

int n, m;
vector<string> g;
bool vis[1005][1005];                          // toàn cục
int dx[4] = {-1, 1, 0, 0}, dy[4] = {0, 0, -1, 1};

// DFS đệ quy: đánh dấu cả vùng chứa (x, y), trả về kích thước vùng
int dfs(int x, int y) {
    vis[x][y] = true;
    int sz = 1;
    for (int d = 0; d < 4; d++) {
        int nx = x + dx[d], ny = y + dy[d];
        if (nx >= 0 && nx < n && ny >= 0 && ny < m && g[nx][ny] == '.' && !vis[nx][ny])
            sz += dfs(nx, ny);
    }
    return sz;
}

int main() {
    cin >> n >> m;
    g.resize(n);
    for (auto &s : g) cin >> s;
    int soVung = 0, lonNhat = 0;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            if (g[i][j] == '.' && !vis[i][j]) {
                soVung++;
                lonNhat = max(lonNhat, dfs(i, j));
            }
    cout << soVung << ' ' << lonNhat << '\n';

    // Đồ thị cho bằng danh sách cạnh (vô hướng)
    int V, E;
    cin >> V >> E;
    vector<vector<int>> adj(V + 1);
    for (int i = 0; i < E; i++) {
        int a, b; cin >> a >> b;
        adj[a].push_back(b); adj[b].push_back(a);   // 2 chiều!
    }
    vector<int> d(V + 1, -1);                        // BFS từ đỉnh 1
    queue<int> q; q.push(1); d[1] = 0;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : adj[u]) if (d[v] == -1) { d[v] = d[u] + 1; q.push(v); }
    }
    for (int v = 1; v <= V; v++) cout << d[v] << ' ';
    return 0;
}
```

## 7. Lỗi hay gặp

- **Đánh dấu đã thăm khi lấy ra khỏi hàng đợi** thay vì khi cho vào: một ô bị cho vào nhiều lần, hàng đợi phình to, dẫn tới TLE hoặc hết bộ nhớ.
- **Quên kiểm tra biên** `nx < 0 || nx >= n`: truy cập ngoài mảng gây RE.
- **Đồ thị vô hướng chỉ thêm 1 chiều** cạnh.
- **Dùng DFS để tìm đường ngắn nhất**: sai.
- **DFS đệ quy quá sâu** (lưới 1000×1000 hình rắn sâu tới 10⁶): có thể tràn stack trên máy chấm có stack nhỏ. **BFS an toàn hơn** với lưới lớn.
- **Mảng `vis`/`dist` lớn khai báo trong `main`**: tràn stack. Hãy khai báo toàn cục.
- **Quên reset `vis`** khi BFS nhiều lần (nhiều test hoặc nhiều câu hỏi).
- **Nhầm hàng/cột** khi đọc lưới: `g[i][j]` là hàng i, cột j. Ký tự đầu của mỗi dòng là cột 0.

> [!TIP] Khi đề cho đi 8 hướng (kể cả chéo), chỉ cần đổi mảng dx, dy thành 8 phần tử. Mọi thứ khác giữ nguyên.

## 8. Bài tập

[[PROBLEMS]]
