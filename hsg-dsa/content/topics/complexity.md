# Độ phức tạp & đọc giới hạn n

## 1. Ý nghĩa

**Độ phức tạp** cho biết chương trình phải làm *khoảng bao nhiêu phép tính* khi dữ liệu lớn dần. Nó giúp bạn trả lời câu hỏi quan trọng nhất trước khi viết code: *"Cách này có chạy kịp không?"*

**Ví dụ đời thường:** bạn cần tìm tên mình trong danh sách 1000 học sinh.
- Dò từ đầu đến cuối: tệ nhất phải xem 1000 tên. Đây là **O(n)**.
- Danh sách đã xếp theo ABC: mở giữa, thấy tên mình đứng trước thì lật về nửa đầu, cứ thế chia đôi. Chỉ cần khoảng 10 lần là thấy. Đây là **O(log n)**.
- So từng cặp học sinh để tìm 2 bạn trùng ngày sinh: khoảng 500.000 cặp. Đây là **O(n²)**.

Trong phòng thi, **đọc giới hạn n là bước đầu tiên**. Nó cho biết cần thuật toán nào, và subtask nào có thể lấy điểm bằng cách làm trâu.

## 2. Kiến thức cốt lõi

**Quy tắc vàng:** máy chấm chạy được khoảng **10⁸ phép tính đơn giản mỗi giây** (C++, biên dịch -O2).

Cách ước lượng: đếm số vòng lặp lồng nhau, **bỏ hằng số và bỏ các số hạng nhỏ hơn**.
- `for i` chạy n lần, bên trong làm vài phép: **O(n)**.
- Hai `for` lồng nhau, mỗi vòng chạy n lần: **O(n²)**. Dù vòng trong chạy từ i+1 (n²/2 phép) thì vẫn tính là O(n²).
- Mỗi bước chia đôi bài toán: **O(log n)**, vì log₂(10⁹) ≈ 30 và log₂(10¹⁸) ≈ 60.
- `sort` có độ phức tạp **O(n log n)**.

**Bảng tra giới hạn n → thuật toán cần dùng (thời gian 1 giây):**

| Giới hạn n | Độ phức tạp tối đa | Thường là thuật toán |
|---|---|---|
| n ≤ 10 | O(n!) | thử mọi hoán vị (`next_permutation`) |
| n ≤ 20 | O(2ⁿ) | thử mọi tập con, đệ quy quay lui |
| n ≤ 500 | O(n³) | 3 vòng for, DP 3 chiều |
| n ≤ 5000 | O(n²) | 2 vòng for, DP 2 chiều |
| n ≤ 10⁵ – 10⁶ | O(n log n) hoặc O(n) | sort, nhị phân, prefix sum, two pointers |
| n ≤ 10⁹ – 10¹⁸ | O(√n), O(log n), O(1) | công thức toán, nhị phân, lũy thừa nhanh |

**Kiểu dữ liệu:** `int` chứa được tới khoảng **2,1·10⁹**, còn `long long` chứa được tới khoảng **9,2·10¹⁸**. Khi nhân hoặc cộng nhiều số lớn, hãy dùng `long long`.

**Bộ nhớ:** 256 MB chứa được khoảng 6·10⁷ số `int` hoặc 3·10⁷ số `long long`. Mảng `int a[1000][1000]` chỉ tốn 4 MB.

[[SIM:calc]]

## 3. Dấu hiệu nhận biết trong đề

Đây là kỹ năng dùng cho **mọi** bài. Khi đọc đề, hãy tìm:
- **Dòng giới hạn**, ví dụ "1 ≤ n ≤ 2·10⁵": tra bảng ở mục 2 để biết thuật toán cần đạt độ phức tạp nào.
- **Bảng subtask**, ví dụ "Subtask 1: n ≤ 1000": đây là phần **làm trâu O(n²) lấy được điểm**. Luôn lấy những điểm này trước.
- **Giá trị lớn tới 10⁹, 10¹⁸**: không thể duyệt từng giá trị, cần công thức hoặc nhị phân. Đồng thời phải dùng `long long`.
- **"Có T test" hoặc "q truy vấn"**: độ phức tạp nhân thêm T (hoặc q). 10⁵ truy vấn × O(n) là quá chậm, nên phải tiền xử lý để mỗi truy vấn chạy O(1) hoặc O(log n).

> [!WARN] **Dễ nhầm:** "n ≤ 10⁵" không có nghĩa là O(n²) chạy kịp. 10⁵ × 10⁵ = 10¹⁰ phép, chậm gấp khoảng 100 lần giới hạn. Cũng đừng nhầm giới hạn **giá trị** (aᵢ ≤ 10⁹) với giới hạn **số lượng** (n ≤ 10⁵): giá trị lớn chỉ ảnh hưởng tới kiểu dữ liệu, không ảnh hưởng số vòng lặp, trừ khi bạn duyệt theo giá trị.

## 4. Độ phức tạp: so sánh với cách trâu

Ví dụ bài "đếm ước của n ≤ 10¹²" (bài Đếm ước bên dưới):

| Cách làm | Thời gian | Bộ nhớ | n = 10⁶ | n = 10¹² |
|---|---|---|---|---|
| Trâu: thử mọi d từ 1 đến n | O(n) | O(1) | 10⁶ phép, kịp | 10¹² phép, **TLE** |
| Tốt: thử d tới √n, đếm theo cặp (d, n/d) | O(√n) | O(1) | 10³ phép | 10⁶ phép, kịp |

Ví dụ bài "đếm bội của k trong [a, b]": làm trâu mất O(b − a), còn dùng công thức `b/k − (a−1)/k` chỉ mất **O(1)**.

## 5. Mô phỏng tương tác

Chọn kiểu thuật toán, nhập n, rồi bấm **Bước tiếp** hoặc **Chạy** để xem bộ đếm `dem` tăng ra sao. Thử n = 8 với O(n) và O(n²) để thấy khác biệt. Với O(√n), thử n = 36 để xem trường hợp số chính phương.

[[SIM:loops]]

## 6. Code C++ mẫu

Khung code nên dùng cho **mọi** bài thi:

```cpp
#include <bits/stdc++.h>      // nạp toàn bộ thư viện chuẩn (vector, sort, map...)
using namespace std;

typedef long long ll;         // viết tắt: ll thay cho long long

int main() {
    ios::sync_with_stdio(false); // tăng tốc cin/cout (bắt buộc khi đọc nhiều số)
    cin.tie(nullptr);            // không xả cout trước mỗi lần cin
    // Nếu đề yêu cầu đọc/ghi file (Themis), bỏ // ở 2 dòng dưới và đổi tên file:
    // freopen("BAI.INP", "r", stdin);
    // freopen("BAI.OUT", "w", stdout);

    ll n;
    cin >> n;
    ll cnt = 0;                  // đếm ước: dùng long long cho an toàn
    for (ll d = 1; d * d <= n; d++) {   // d * d <= n thay cho d <= sqrt(n): tránh sai số
        if (n % d == 0) {
            cnt++;                       // ước d
            if (d != n / d) cnt++;       // ước n/d (khác d mới đếm)
        }
    }
    cout << cnt << '\n';         // '\n' nhanh hơn endl
    return 0;
}
```

## 7. Lỗi hay gặp

- **Tràn số `int`:** `int x = 100000 * 100000;` sai vì tích là 10¹⁰ > 2,1·10⁹. Cần viết `1LL * a * b` hoặc khai báo `long long`. Biến đếm số cặp cũng dễ vượt 2·10⁹.
- **Biến vòng lặp là `int` khi so sánh `i * i <= n`** với n ≈ 10¹²: `i * i` bị tràn, vòng lặp chạy sai hoặc không bao giờ dừng.
- **Dùng `sqrt()` của số thực:** `sqrt(n)` với n lớn có thể lệch 1 đơn vị. Nên viết `d * d <= n`.
- **Quên `ios::sync_with_stdio(false)`** khi đọc 10⁵–10⁶ số: chương trình có thể chậm gấp 3–5 lần, gây TLE oan.
- **Dùng `endl`** trong vòng lặp in 10⁵ dòng: mỗi lần `endl` đều xả bộ đệm, rất chậm. Hãy dùng `'\n'`.
- **Quên trường hợp biên:** n = 1, số chính phương (ước √n bị đếm 2 lần), a là bội của k (công thức phải dùng a − 1).

> [!TIP] Trước khi nộp, hãy tự hỏi 3 câu: (1) n lớn nhất thì vòng lặp chạy bao nhiêu lần? (2) Giá trị lớn nhất có vượt 2·10⁹ không? (3) n = 1 thì code có chạy đúng không?

## 8. Bài tập

[[PROBLEMS]]
