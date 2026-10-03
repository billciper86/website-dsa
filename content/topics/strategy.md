# Chiến thuật lấy điểm subtask

## 1. Ý nghĩa

Mục tiêu **giải Ba** không cần giải trọn bài nào cả. Thứ cần làm là **nhặt đủ điểm** từ các subtask dễ của **cả 4 bài**. Một bạn làm 100 điểm bài 1 rồi bỏ trắng 3 bài còn lại thường **ít điểm hơn** một bạn lấy 100 + 40 + 40 + 30 bằng các cách trâu.

**Ví dụ đời thường:** đi chợ với 180 phút. Mua món dễ tìm trước. Món hiếm thì ghé qua lấy tạm loại thay thế (lời giải trâu). Còn thời gian mới quay lại tìm loại tốt (lời giải tối ưu).

## 2. Kiến thức cốt lõi

**Kế hoạch 180 phút gợi ý:**

| Thời gian | Việc làm |
|---|---|
| 0 – 15' | **Đọc cả 4 đề**, ghi ra giấy giới hạn và subtask từng bài, xếp thứ tự dễ → khó |
| 15 – 60' | Làm **trọn bài dễ nhất**, có kiểm tra kỹ |
| 60 – 120' | Với mỗi bài còn lại: **viết trâu lấy subtask 1–2 trước**, rồi mới nghĩ tối ưu |
| 120 – 165' | Nâng cấp bài có nhiều hy vọng nhất, **đối chiếu với code trâu** |
| 165 – 180' | **Dừng viết code mới.** Kiểm tra tên file, đọc/ghi file, `long long`, xóa dòng in debug |

**Lời giải trâu là "phao cứu sinh":**
- Thử mọi khả năng: vòng for lồng nhau, mọi tập con (`for mask < (1<<n)`), mọi hoán vị (`next_permutation`), đệ quy quay lui.
- Viết nhanh (5–10 phút), **ít sai**, và lấy chắc 20–40% điểm của bài.
- Dùng làm **"đáp án mẫu"** để kiểm tra lời giải tối ưu.

**Đối chiếu tự động (stress test):** viết 3 file `trau.cpp`, `toiuu.cpp`, `sinh.cpp` (sinh test ngẫu nhiên nhỏ), rồi chạy một vòng lặp so sánh output. Khi gặp test khác nhau, bạn có ngay một **test nhỏ** để sửa lỗi.

**Gộp nhiều subtask trong một file:** đọc n trước. Nếu n nhỏ thì gọi hàm trâu, ngược lại gọi hàm tối ưu. Nhờ vậy nếu hàm tối ưu sai thì vẫn giữ được điểm subtask nhỏ.

[[SIM:planner]]

## 3. Dấu hiệu nhận biết trong đề

Đọc **bảng subtask** như đọc gợi ý của người ra đề:
- "n ≤ 10, n ≤ 20": người ra đề muốn bạn **thử hết** (hoán vị / tập con).
- "n ≤ 1000 – 5000": O(n²) được điểm.
- "Mọi aᵢ dương", "k = 1", "lưới không có vật cản": trường hợp **đặc biệt** thường có công thức hoặc tham lam đơn giản. Đây là điểm dễ lấy.
- "aᵢ ≤ 1000" trong khi đề gốc là 10⁹: được **duyệt theo giá trị**, hoặc dùng mảng đếm thay map.
- "Không có giới hạn thêm": subtask cuối, cần lời giải tối ưu. Chỉ làm khi đã lấy hết điểm dễ.

> [!WARN] **Sai lầm chiến thuật hay gặp:**
> - Sa đà 90 phút vào một bài khó, trong khi bài khác có 40 điểm trâu chỉ mất 10 phút.
> - Nộp lời giải "tối ưu" chưa kiểm tra, **mất luôn** điểm subtask mà bản trâu lẽ ra lấy được.
> - Quên `freopen` hoặc sai tên file khi đề yêu cầu đọc/ghi file: **0 điểm cả bài**.

## 4. Độ phức tạp: so sánh với cách trâu

| Kiểu trâu | Độ phức tạp | Chạy được tới |
|---|---|---|
| Hai vòng for | O(n²) | n ≈ 10⁴ |
| Ba vòng for | O(n³) | n ≈ 500 |
| Mọi tập con | O(2ⁿ·n) | n ≈ 20 |
| Mọi hoán vị | O(n!·n) | n ≈ 9–10 |
| Đệ quy quay lui có cắt nhánh | tùy bài | n ≈ 15–30 |

## 5. Mô phỏng tương tác

Mô phỏng ở mục 2 là một **công cụ lập kế hoạch**. Bạn nhập điểm và thời gian ước lượng của từng subtask, công cụ sẽ xếp lịch theo "điểm / phút" (một bài tham lam!). Hãy dùng nó khi tập đề thi thử.

## 6. Code C++ mẫu

**Khung bài thi có cả trâu lẫn tối ưu:**

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int n;
vector<ll> a;

ll trau() {                                     // chắc chắn đúng, chậm: O(n^2)
    ll best = LLONG_MIN;
    for (int l = 0; l < n; l++) {
        ll s = 0;
        for (int r = l; r < n; r++) { s += a[r]; best = max(best, s); }
    }
    return best;
}

ll toiuu() {                                    // nhanh: O(n)
    ll cur = a[0], best = a[0];
    for (int i = 1; i < n; i++) { cur = max(a[i], cur + a[i]); best = max(best, cur); }
    return best;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // freopen("BAI.INP", "r", stdin);   // bật nếu đề yêu cầu đọc/ghi file
    // freopen("BAI.OUT", "w", stdout);
    cin >> n;
    a.resize(n);
    for (auto &x : a) cin >> x;
    if (n <= 3000) cout << trau() << '\n';      // subtask nhỏ: dùng bản chắc chắn đúng
    else cout << toiuu() << '\n';
    return 0;
}
```

**Đối chiếu tự động (`doichieu.bat` trên Windows):**

```cpp
// sinh.cpp - sinh 1 test ngẫu nhiên nhỏ, seed lấy từ tham số dòng lệnh
#include <bits/stdc++.h>
using namespace std;
int main(int argc, char *argv[]) {
    mt19937 rng(atoi(argv[1]));                          // seed khác nhau mỗi lần
    int n = rng() % 8 + 1;
    cout << n << '\n';
    for (int i = 0; i < n; i++) cout << (int)(rng() % 21) - 10 << ' ';
    cout << '\n';
}
```

```bat
@echo off
for /l %%i in (1,1,1000) do (
    sinh.exe %%i > test.inp
    trau.exe < test.inp > trau.out
    toiuu.exe < test.inp > toiuu.out
    fc /w trau.out toiuu.out > nul || (echo Sai o test %%i & type test.inp & exit /b)
)
echo Khop ca 1000 test!
```

## 7. Lỗi hay gặp

- **Để dòng in debug** (`cout << "check"`) trong bài nộp: WA toàn bộ.
- **Sai tên file / thiếu `freopen`** theo yêu cầu đề, hoặc để `freopen` khi đề đọc từ bàn phím.
- **Quên `return 0`**, hoặc `main` trả về khác 0: một số máy chấm báo RE.
- **Kiểu `int`** cho tổng hoặc tích: kiểm tra lại mọi biến cộng dồn trước khi nộp.
- **Không thử test biên**: n = 1, mọi số bằng nhau, mọi số âm, giá trị lớn nhất.
- **Hết giờ khi đang sửa dở**: luôn giữ một bản **chạy được** đã lưu. Chỉ thay bằng bản mới khi bản mới đã chạy đúng các ví dụ.

> [!TIP] Trước khi nộp, đọc lại **ví dụ** và tự chạy. Code không qua ví dụ thì hầu như chắc chắn được 0 điểm.

## 8. Bài tập

Ba bài dưới đây có **nhiều subtask**. Hãy luyện đúng quy trình: nộp bản trâu, xem điểm, rồi mới nâng cấp.

[[PROBLEMS]]
