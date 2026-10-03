# Quy hoạch động cơ bản

## 1. Ý nghĩa

**Quy hoạch động (QHĐ)** giải bài toán lớn bằng cách **ghi nhớ đáp án của các bài toán con** để không phải tính lại. Nếu cách trâu thử mọi khả năng mất 2ⁿ, thì QHĐ thường chỉ mất O(n) hoặc O(n²).

**Ví dụ đời thường:** muốn biết có bao nhiêu cách đi từ nhà tới trường trên các con phố hình bàn cờ (chỉ đi sang phải hoặc đi xuống). Không cần liệt kê từng đường đi. Số cách tới một ngã tư bằng **số cách tới ngã tư bên trái + số cách tới ngã tư bên trên**. Ta điền dần các ngã tư từ gần nhà ra xa, mỗi ngã tư chỉ tính một lần.

QHĐ là dạng **chắc chắn có trong đề tỉnh**, và thường chia nhiều subtask: đệ quy trâu → QHĐ O(n²) → QHĐ tối ưu.

## 2. Kiến thức cốt lõi

**4 bước giải một bài QHĐ:**
1. **Trạng thái:** f[i] (hoặc f[i][j]) nghĩa là gì? Hãy viết ra bằng lời, ví dụ "f[i] = tổng lớn nhất của đoạn **kết thúc tại i**".
2. **Công thức truy hồi:** f[i] tính từ những f nhỏ hơn như thế nào? Hãy tự hỏi "bước cuối cùng là gì?".
3. **Cơ sở:** giá trị đầu tiên, ví dụ f[0], f[1], hàng 0 hoặc cột 0.
4. **Đáp án:** f[n]? max của mọi f[i]? Đọc kỹ đề.

**Ba bài mẫu của chủ đề:**

| Bài | Trạng thái | Công thức |
|---|---|---|
| Đoạn con tổng lớn nhất (Kadane) | f[i] = tổng lớn nhất của đoạn kết thúc tại i | f[i] = max(aᵢ, f[i−1] + aᵢ) |
| Đếm đường đi trên lưới | f[i][j] = số đường tới ô (i, j) | f[i][j] = f[i−1][j] + f[i][j−1], ô cấm thì bằng 0 |
| Ếch nhảy | f[i] = sức lực ít nhất để tới hòn i | f[i] = min(f[j] + \|hⱼ − hᵢ\|) với i−K ≤ j < i |

**Hai cách cài đặt:**
- **Vòng lặp từ nhỏ đến lớn (bottom-up):** nhanh, gọn, nên dùng.
- **Đệ quy có nhớ (memoization):** viết hàm đệ quy như code trâu, rồi thêm mảng `memo` để lưu kết quả đã tính. Đây là cách dễ nghĩ ra khi vừa viết xong code trâu.

[[SIM:kadane]]

## 3. Dấu hiệu nhận biết trong đề

**Dấu hiệu CÓ:**
- "**Đếm số cách**…" (kèm "modulo 10⁹+7"), "**lớn nhất / nhỏ nhất** có thể" mà tham lam dễ sai.
- Bài toán chia được theo kiểu "**bước cuối cùng**": ô cuối đến từ đâu, phần tử cuối được chọn hay không.
- Đi trên lưới chỉ sang phải / xuống dưới, nhảy từng bước 1..K, leo cầu thang.
- Code trâu đệ quy **gọi lại cùng một tham số nhiều lần**: thêm `memo` là thành QHĐ.
- n ≤ 10⁵ với O(n·K), hoặc n ≤ 5000 với O(n²).

> [!WARN] **Dấu hiệu KHÔNG phải dạng này:**
> - Robot đi **4 hướng** (lên, xuống, trái, phải) trên lưới: đường đi có thể vòng lại nên QHĐ không có thứ tự tính. Đó là bài **BFS** (Ngày 3).
> - "Chọn nhiều nhất các đoạn không giao nhau" có tiêu chí sort rõ ràng: thường **tham lam** là đủ.
> - Truy vấn tổng đoạn nhiều lần: là **prefix sum**, dù cũng là một dạng "ghi nhớ".

## 4. Độ phức tạp: so sánh với cách trâu

| Bài | Trâu (đệ quy thử hết) | QHĐ | Bộ nhớ |
|---|---|---|---|
| Kadane | O(n²) (hoặc O(n³)) | O(n) | O(1) |
| Đường đi trên lưới | O(C(n+m, n)), tăng theo hàm mũ | O(n·m) | O(n·m) |
| Ếch nhảy | O(Kⁿ) | O(n·K) | O(n) |

## 5. Mô phỏng tương tác

Mô phỏng ở mục 2 chạy thuật toán Kadane. Mô phỏng dưới đây điền bảng QHĐ đếm đường đi. Bạn có thể tự vẽ lưới bằng `.` và `#`.

[[SIM:gridpaths]]

## 6. Code C++ mẫu

```cpp
#include <bits/stdc++.h>
using namespace std;
const long long MOD = 1000000007;

// --- Cách 1: QHĐ bằng vòng lặp (bottom-up) - Ếch nhảy ---
long long frog_loop(int n, int K, const vector<long long> &h) {   // h đánh số từ 1
    vector<long long> f(n + 1, LLONG_MAX);
    f[1] = 0;                                         // cơ sở
    for (int i = 2; i <= n; i++)                      // tính từ nhỏ tới lớn
        for (int j = max(1, i - K); j < i; j++)       // bước cuối: nhảy từ j tới i
            f[i] = min(f[i], f[j] + llabs(h[j] - h[i]));
    return f[n];                                      // đáp án
}

// --- Cách 2: đệ quy có nhớ (memoization) - cùng bài ---
int N, KK; vector<long long> H, memo;
long long go(int i) {                // sức lực ít nhất để từ hòn i tới hòn N
    if (i == N) return 0;
    if (memo[i] != -1) return memo[i];                // đã tính rồi -> trả về luôn
    long long best = LLONG_MAX;
    for (int j = i + 1; j <= min(N, i + KK); j++)
        best = min(best, llabs(H[i] - H[j]) + go(j));
    return memo[i] = best;                            // nhớ lại trước khi trả về
}

int main() {
    int n = 5, K = 3;
    vector<long long> h = {0, 10, 30, 40, 50, 20};    // h[0] bỏ trống
    cout << frog_loop(n, K, h) << '\n';               // 30
    N = n; KK = K; H = h; memo.assign(n + 1, -1);
    cout << go(1) << '\n';                            // 30
    return 0;
}
```

## 7. Lỗi hay gặp

- **Định nghĩa trạng thái mơ hồ**: hãy viết trạng thái thành câu đầy đủ trước khi code. Ví dụ "kết thúc tại i" khác hẳn "trong i phần tử đầu".
- **Sai cơ sở**: Kadane khởi tạo bằng 0 thì sai khi mọi số âm. Đếm đường đi mà quên kiểm tra ô xuất phát có bị chặn không.
- **Tính sai thứ tự**: f[i] dùng f[j] **chưa được tính**. Với bài lưới, phải duyệt i tăng dần rồi j tăng dần.
- **Quên mod** hoặc **mod một lần ở cuối**: số đường đi trên lưới 1000×1000 có hơn 600 chữ số, tràn từ rất sớm.
- **Mảng 1000×1000 `long long` (8 MB) khai báo trong `main`**: tràn stack. Hãy khai báo toàn cục.
- **Khởi tạo min bằng 0**: f[i] = min(...) phải khởi tạo bằng số rất lớn (`LLONG_MAX` hoặc `1e18`). Cẩn thận: `LLONG_MAX + x` bị tràn số.

> [!TIP] Cách tìm công thức nhanh: viết code trâu đệ quy trước (lấy subtask 1). Nhìn xem hàm đệ quy phụ thuộc vào **tham số nào**, đó chính là trạng thái QHĐ. Thêm mảng nhớ là xong.

## 8. Bài tập

[[PROBLEMS]]
