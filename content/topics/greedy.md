# Tham lam

## 1. Ý nghĩa

**Tham lam (greedy)** là chiến lược: ở mỗi bước, chọn phương án **tốt nhất ngay lúc đó** theo một tiêu chí, và không bao giờ quay lại sửa lựa chọn. Nếu chọn đúng tiêu chí thì lời giải rất ngắn và nhanh, thường chỉ là **sort + một vòng for**.

**Ví dụ đời thường:**
- Thối tiền bằng ít tờ nhất: luôn đưa tờ **mệnh giá lớn nhất** còn đưa được (với các mệnh giá tiền Việt Nam, cách này luôn đúng).
- Một phòng họp, muốn xếp nhiều cuộc họp nhất: luôn chọn cuộc **kết thúc sớm nhất**, để chừa nhiều thời gian nhất cho các cuộc sau.
- Xếp hàng ở quầy: người làm **nhanh** đi trước thì tổng thời gian chờ của mọi người là ít nhất.

**Cảnh báo:** tham lam **rất dễ sai**. Một tiêu chí nghe hợp lý vẫn có thể có **phản ví dụ**. Kỹ năng quan trọng nhất của chủ đề này là **tự tìm phản ví dụ** trước khi nộp.

## 2. Kiến thức cốt lõi

**Các bước giải một bài tham lam:**
1. Đoán tiêu chí, ví dụ: sắp theo kết thúc, theo giá trị/khối lượng, theo thời gian tăng dần…
2. **Thử phá** tiêu chí bằng ví dụ nhỏ 3–4 phần tử.
3. Chứng minh ngắn gọn bằng **lập luận đổi chỗ (exchange argument)**: giả sử một lời giải tối ưu khác với lựa chọn tham lam ở bước đầu tiên. Thay lựa chọn đó bằng lựa chọn tham lam mà kết quả không tệ đi, thì cách chọn tham lam cũng tối ưu.
4. Nếu không chắc, hãy **viết thêm lời giải trâu** (thử mọi khả năng với n nhỏ) để đối chiếu.

**Các tiêu chí kinh điển cần thuộc:**

| Bài toán | Tiêu chí đúng | Tiêu chí SAI hay bị dùng |
|---|---|---|
| Chọn nhiều đoạn không giao nhau nhất | kết thúc **sớm nhất** | bắt đầu sớm nhất, đoạn ngắn nhất |
| Tổng thời gian chờ nhỏ nhất | thời gian **tăng dần** | giữ nguyên thứ tự |
| Ghép cặp ≤ C (tối đa 2 người/thuyền) | nặng nhất + nhẹ nhất | ghép hai người cạnh nhau |
| Túi chia được (cắt được món đồ) | giá trị / khối lượng giảm dần | (với túi 0/1 tham lam là SAI, phải dùng QHĐ) |
| Đổi tiền mệnh giá 1, 2, 5, 10… | tờ lớn nhất trước | (sai với mệnh giá lạ như 1, 3, 4) |

[[SIM:meetings]]

## 3. Dấu hiệu nhận biết trong đề

**Dấu hiệu CÓ:**
- "Chọn **nhiều nhất** / **ít nhất**…" và các phần tử có thể **sắp xếp** theo một tiêu chí tự nhiên (thời gian, khối lượng, hạn chót).
- Bài có bản chất "lịch làm việc", "xếp hàng", "phân công", "ghép cặp", "đổi tiền".
- n lớn (10⁵–10⁶) nhưng **không có** cấu trúc mảng 2 chiều: lời giải thường là sort O(n log n) rồi một vòng for.

> [!WARN] **Dấu hiệu KHÔNG phải dạng này:**
> - **Túi 0/1**: mỗi món chỉ lấy hoặc không, khối lượng bị giới hạn. Tham lam theo tỉ lệ giá trị/khối lượng **sai**, phải dùng **QHĐ**.
> - Đổi tiền với **mệnh giá bất kỳ** (ví dụ 1, 3, 4 mà cần đổi 6): tham lam cho 4+1+1 (3 tờ), còn tối ưu là 3+3 (2 tờ). Phải dùng QHĐ.
> - Tìm được phản ví dụ nhỏ cho mọi tiêu chí bạn nghĩ ra: rất có thể là bài QHĐ.

## 4. Độ phức tạp: so sánh với cách trâu

| Bài toán | Cách trâu | Tham lam |
|---|---|---|
| Lịch họp | thử mọi tập con O(2ⁿ·n) | O(n log n) |
| Xếp hàng | thử mọi hoán vị O(n!·n) | O(n log n) |
| Thuyền cứu hộ | thử mọi cách ghép (cấp giai thừa) | O(n log n) |

Cách trâu chỉ chạy được với n ≤ 15–20, nhưng **rất quý**: dùng để lấy subtask 1, và để kiểm tra tiêu chí tham lam.

## 5. Mô phỏng tương tác

Mô phỏng ở mục 2 chạy bài **Lịch họp** với hai tiêu chí khác nhau. Hãy chọn tiêu chí "bắt đầu sớm nhất" với dữ liệu mặc định để thấy nó **sai** ra sao, rồi đổi sang "kết thúc sớm nhất".

## 6. Code C++ mẫu

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Meeting { long long s, e; };

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<Meeting> a(n);
    for (auto &m : a) cin >> m.s >> m.e;

    // Sort theo tiêu chí tùy ý bằng hàm so sánh (lambda): ở đây là kết thúc tăng dần
    sort(a.begin(), a.end(), [](const Meeting &x, const Meeting &y) {
        if (x.e != y.e) return x.e < y.e;     // tiêu chí chính
        return x.s < y.s;                     // tiêu chí phụ khi bằng nhau
    });

    long long lastEnd = LLONG_MIN;
    int cnt = 0;
    for (auto &m : a)
        if (m.s >= lastEnd) {                 // không chồng lên cuộc vừa chọn
            cnt++;
            lastEnd = m.e;
        }
    cout << cnt << '\n';
    return 0;
}
```

## 7. Lỗi hay gặp

- **Chọn sai tiêu chí** mà không thử phản ví dụ. Hãy luôn thử 3–4 ví dụ nhỏ, hoặc đối chiếu với code trâu.
- **Nhầm `>` và `>=`** ở biên: cuộc họp bắt đầu **đúng lúc** cuộc trước kết thúc có được không? Đọc kỹ đề.
- **Hàm so sánh sai** trong `sort`: phải trả về `true` khi x **đứng trước** y, và **không** được trả về `true` khi x == y (viết `<`, không viết `<=`). Viết `<=` có thể làm chương trình bị RE.
- **Tràn số khi cộng dồn**: tổng thời gian chờ có thể tới 10¹⁶.
- **Sort mất thông tin đi kèm**: cần sort cả cặp (giá trị, chỉ số) bằng `pair` hoặc `struct`, không sort riêng từng mảng.

> [!TIP] Nếu đã nghĩ 10 phút mà vẫn chưa chắc tiêu chí: hãy nộp **code trâu** để chắc điểm subtask nhỏ trước, rồi mới thử tham lam.

## 8. Bài tập

[[PROBLEMS]]
