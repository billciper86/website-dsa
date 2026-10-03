# Xâu ký tự

## 1. Ý nghĩa

Bài xâu xuất hiện ở **gần như mọi đề tỉnh**, thường là bài 1 hoặc bài 2: chuẩn hóa họ tên, đếm từ, kiểm tra đối xứng, đếm ký tự… Phần lớn **không cần thuật toán khó**. Chỉ cần dùng thành thạo `string` và **mảng đếm tần suất**.

**Ví dụ đời thường:**
- Đếm xem chữ cái nào xuất hiện nhiều nhất trong một bài văn: dùng **mảng đếm 26 ô**.
- "Tôi là Lê Văn Lôi" đọc ngược vẫn vậy nếu bỏ dấu và khoảng trắng: đó là **xâu đối xứng**.
- Hai từ "listen" và "silent" có cùng bộ chữ cái: đó là **hoán vị (anagram)** của nhau. So sánh mảng đếm là biết ngay.

## 2. Kiến thức cốt lõi

**Thao tác `string` cần thuộc:**

| Thao tác | Code | Độ phức tạp |
|---|---|---|
| Đọc 1 từ / cả dòng | `cin >> s;` / `getline(cin, s);` | O(\|s\|) |
| Độ dài, truy cập | `s.size()`, `s[i]` | O(1) |
| Xâu con | `s.substr(vị_trí, độ_dài)` | O(độ dài) |
| Tìm | `s.find(t)` → `string::npos` nếu không có | O(\|s\|·\|t\|) |
| Đảo ngược | `reverse(s.begin(), s.end())` | O(\|s\|) |
| Chữ ↔ số | `c - 'a'`, `c - '0'`, `char('a' + k)` | O(1) |
| Kiểm tra / đổi hoa thường | `isdigit`, `isalpha`, `tolower`, `toupper` | O(1) |

**Mảng đếm tần suất:** `int cnt[26]`, với mỗi ký tự c thì `cnt[c - 'a']++`. Hai xâu là hoán vị của nhau khi và chỉ khi hai mảng đếm bằng nhau.

**Xâu đối xứng — mở rộng từ tâm:** mỗi xâu đối xứng có một **tâm**. Tâm có thể là 1 ký tự (độ dài lẻ) hoặc nằm giữa 2 ký tự (độ dài chẵn). Từ mỗi tâm, loang ra hai bên khi hai ký tự còn bằng nhau. Có 2n − 1 tâm, mỗi tâm loang tối đa n bước, tổng O(n²).

**Cửa sổ trượt trên xâu:** giống two pointers. Khi trượt sang phải, cập nhật mảng đếm: thêm ký tự vào, bỏ ký tự ra.

**Hash xâu (đọc thêm, ít cần cho giải Ba):** biến xâu thành một số để so sánh hai xâu con trong O(1). Hãy học khi đã vững các phần trên.

[[SIM:palindrome]]

## 3. Dấu hiệu nhận biết trong đề

**Dấu hiệu CÓ:**
- "Đếm số lần xuất hiện", "ký tự xuất hiện nhiều nhất", "có phải hoán vị / anagram", "hai xâu có cùng bộ chữ": dùng **mảng đếm**.
- "Đối xứng", "palindrome", "đọc xuôi đọc ngược như nhau": dùng **mở rộng từ tâm** (n ≤ 5000), hoặc so sánh với xâu đảo ngược.
- "Xâu con liên tiếp độ dài k có tính chất…": dùng **cửa sổ trượt + mảng đếm**.
- "Chuẩn hóa", "viết hoa chữ cái đầu", "xóa khoảng trắng thừa": duyệt từng ký tự, cẩn thận với `getline`.

> [!WARN] **Dấu hiệu KHÔNG phải dạng này:**
> - "Xâu con **không liên tiếp** chung dài nhất": là QHĐ **LCS** (chủ đề QHĐ kinh điển).
> - |s| tới 10⁶ và hỏi đối xứng dài nhất: O(n²) không chạy kịp, cần thuật toán Manacher (nâng cao). Hãy làm O(n²) để lấy subtask.
> - So sánh **nhiều cặp xâu con** với nhau rất nhiều lần: cần hash. Với subtask nhỏ thì so sánh trực tiếp.

## 4. Độ phức tạp: so sánh với cách trâu

| Bài | Trâu | Tốt |
|---|---|---|
| Ký tự phổ biến nhất | đếm lại cho từng vị trí: O(n²) | mảng đếm O(n) |
| Đối xứng dài nhất | thử mọi xâu con: O(n³) | mở rộng từ tâm O(n²) |
| Đếm hoán vị của p trong s | sort từng cửa sổ: O(n·m log m) | cửa sổ trượt O(26·n) |

Bộ nhớ: mảng đếm chỉ 26 số, không đáng kể.

## 5. Mô phỏng tương tác

Mô phỏng ở mục 2 chạy thuật toán mở rộng từ tâm. Hãy nhập một xâu có đối xứng **độ dài chẵn** (như `cabbad`) để thấy vì sao phải xét cả tâm nằm giữa hai ký tự. Mô phỏng dưới đây chạy cửa sổ trượt cho bài đếm hoán vị.

[[SIM:anagram]]

## 6. Code C++ mẫu

```cpp
#include <bits/stdc++.h>
using namespace std;

bool laDoiXung(const string &s) {            // kiểm tra cả xâu: so 2 đầu tiến dần vào giữa
    for (int i = 0, j = (int)s.size() - 1; i < j; i++, j--)
        if (s[i] != s[j]) return false;
    return true;
}

bool laHoanVi(const string &a, const string &b) {
    if (a.size() != b.size()) return false;
    int cnt[26] = {0};
    for (char c : a) cnt[c - 'a']++;
    for (char c : b) cnt[c - 'a']--;          // đếm lên rồi đếm xuống: cuối cùng phải toàn 0
    for (int k = 0; k < 26; k++) if (cnt[k] != 0) return false;
    return true;
}

int main() {
    string line;
    getline(cin, line);                      // đọc cả dòng có dấu cách
    // Chuẩn hóa: bỏ khoảng trắng, chuyển về chữ thường
    string t;
    for (char c : line)
        if (isalpha((unsigned char)c)) t += tolower(c);
    cout << (laDoiXung(t) ? "YES" : "NO") << '\n';
    cout << (laHoanVi("listen", "silent") ? "YES" : "NO") << '\n';

    // Tách từ trong một dòng bằng stringstream
    stringstream ss(line);
    string word; int soTu = 0;
    while (ss >> word) soTu++;
    cout << soTu << '\n';
    return 0;
}
```

## 7. Lỗi hay gặp

- **Trộn `cin >> n` với `getline`**: sau `cin >> n` còn dư ký tự xuống dòng, nên `getline` đọc được xâu rỗng. Hãy gọi `cin.ignore()` trước, hoặc đọc bằng `getline` cả hai.
- **Quên đối xứng độ dài chẵn** khi mở rộng từ tâm.
- **Cộng xâu trong vòng lặp bằng `s = s + c`**: mỗi lần tạo xâu mới, tổng O(n²). Hãy dùng `s += c` hoặc `push_back`.
- **`s.size() - 1` khi s rỗng**: `size()` là số không dấu, nên kết quả là một số khổng lồ thay vì −1. Hãy ép kiểu `(int)s.size() - 1`.
- **Chọn sai khi hòa**: đề yêu cầu ký tự nhỏ nhất thì dùng `>` chứ không dùng `>=`.
- **Bỏ sót cửa sổ đầu hoặc cửa sổ cuối** khi trượt. Hãy thử với |p| = |s| (chỉ có đúng 1 cửa sổ).
- **Xâu có chữ hoa hoặc chữ số** mà dùng `c - 'a'`: chỉ số âm hoặc vượt 25, gây RE. Đọc kỹ đề xem có những ký tự nào.

> [!TIP] Với `isalpha`, `tolower`… hãy ép kiểu `(unsigned char)c` để an toàn với ký tự tiếng Việt có dấu (mã > 127).

## 8. Bài tập

[[PROBLEMS]]
