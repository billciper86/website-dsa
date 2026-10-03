# Số học

## 1. Ý nghĩa

Số học là phần **dễ lấy điểm nhất** trong đề tỉnh: bài 1–2 rất hay hỏi về ước, bội, số nguyên tố, chia dư. Bốn công cụ cần thuộc lòng:

- **ƯCLN / BCNN (thuật toán Euclid):** ví dụ chia 12 cái kẹo và 18 cái bánh thành các phần **giống hệt nhau** thì được nhiều nhất bao nhiêu phần? Đáp án là ƯCLN = 6. Hai đèn nhấp nháy theo chu kỳ 12 giây và 18 giây thì cứ sau BCNN = 36 giây chúng lại cùng sáng một lúc.
- **Sàng Eratosthenes:** tìm **mọi** số nguyên tố tới N cùng lúc, nhanh hơn rất nhiều so với kiểm tra từng số.
- **Phép mod:** khi đáp án quá lớn, đề yêu cầu "in ra phần dư khi chia cho 10⁹+7".
- **Lũy thừa nhanh:** tính aᵇ với b tới 10¹⁸ chỉ trong khoảng 60 phép nhân.

## 2. Kiến thức cốt lõi

**Euclid:** gcd(a, b) = gcd(b, a mod b), và gcd(a, 0) = a. Thuật toán chạy O(log min(a, b)).
- BCNN: lcm(a, b) = **a / gcd(a, b) · b**. Chia trước rồi mới nhân để không tràn số.
- C++17 có sẵn `gcd(a, b)` và `lcm(a, b)` trong `<numeric>`, hoặc `__gcd(a, b)` của GCC.

**Sàng Eratosthenes** tới N:
1. Ban đầu coi mọi số từ 2 đến N là nguyên tố.
2. Duyệt i = 2, 3, … với i·i ≤ N. Nếu i còn là nguyên tố thì gạch mọi bội i·i, i·i+i, i·i+2i, …
3. Các số còn lại chính là số nguyên tố.

Độ phức tạp **O(N log log N)**, gần như O(N). Với N = 10⁷ chỉ mất khoảng 0,05 giây.

**Kiểm tra 1 số có nguyên tố không:** thử chia cho d từ 2 đến √n, mất O(√n).

**Tính chất của phép mod** (M = 10⁹ + 7):
- (a + b) mod M = ((a mod M) + (b mod M)) mod M
- (a · b) mod M = ((a mod M) · (b mod M)) mod M. Hai số < M nhân nhau thì < 10¹⁹, vừa đủ cho `long long`.
- (a − b) mod M = ((a − b) mod M **+ M**) mod M, cộng M để kết quả không âm.
- **Phép chia không mod trực tiếp được.** Muốn chia phải dùng nghịch đảo modulo (nâng cao, ít gặp ở mức giải Ba).

**Lũy thừa nhanh:** viết b dưới dạng nhị phân. Ví dụ a¹³ = a⁸ · a⁴ · a¹ vì 13 = 1101₂. Ta lần lượt bình phương a → a² → a⁴ → a⁸, và nhân vào kết quả những lũy thừa ứng với bit 1. Độ phức tạp **O(log b)**.

[[SIM:euclid]]

## 3. Dấu hiệu nhận biết trong đề

**Dấu hiệu CÓ:**
- "Ước chung lớn nhất", "phân số tối giản", "chia thành các phần bằng nhau", "chu kỳ lặp lại", "cùng gặp lại sau bao lâu": dùng gcd / lcm.
- "Số nguyên tố", "đếm số nguyên tố trong đoạn", nhiều truy vấn với giá trị ≤ 10⁷: dùng sàng (thường kết hợp prefix sum).
- "In ra kết quả **modulo 10⁹ + 7**": phải mod sau **mỗi** phép cộng / nhân.
- "aᵇ", "2ⁿ", b tới 10⁹–10¹⁸: dùng lũy thừa nhanh.
- Một số n tới 10¹²: phân tích hoặc đếm ước bằng cách duyệt tới √n (xem chủ đề Độ phức tạp).

> [!WARN] **Dấu hiệu KHÔNG phải dạng này:**
> - Giá trị tới 10¹² mà cần **nhiều** số nguyên tố: không sàng tới 10¹² được (hết bộ nhớ). Hãy duyệt tới √n hoặc sàng tới 10⁶.
> - "Modulo" nhưng cần **chia**: cần nghịch đảo modulo (a^(M−2)), không chia thẳng được.
> - Chỉ kiểm tra **một** số nhỏ có nguyên tố không: không cần sàng, duyệt √n là đủ.

## 4. Độ phức tạp: so sánh với cách trâu

| Bài toán | Cách trâu | Cách tốt |
|---|---|---|
| gcd(a, b) | thử mọi d: O(min(a,b)) | Euclid O(log) |
| Đếm nguyên tố ≤ N | kiểm tra từng số: O(N√N) | sàng O(N log log N) |
| q truy vấn đếm nguyên tố trong [l, r] | O(q·N√N) | sàng + prefix: O(N + q) |
| aᵇ mod M | nhân b lần: O(b) | lũy thừa nhanh O(log b) |

Bộ nhớ của sàng: N byte (`bool`), cộng 4N byte nếu có thêm mảng đếm `int`. Với N = 10⁷ tổng khoảng 50 MB.

## 5. Mô phỏng tương tác

Mô phỏng **sàng Eratosthenes**: nhìn các bội bị gạch dần (màu đỏ), số nguyên tố còn lại tô xanh.

[[SIM:sieve]]

Mô phỏng **lũy thừa nhanh**: theo dõi các bit của b.

[[SIM:fastpow]]

## 6. Code C++ mẫu

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll MOD = 1000000007;

ll gcd_(ll a, ll b) { return b == 0 ? a : gcd_(b, a % b); }   // Euclid đệ quy
ll lcm_(ll a, ll b) { return a / gcd_(a, b) * b; }            // chia trước, nhân sau

ll power(ll a, ll b) {               // a^b mod MOD
    a %= MOD;                        // đưa a về < MOD trước
    ll res = 1;
    while (b > 0) {
        if (b & 1) res = res * a % MOD;
        a = a * a % MOD;
        b >>= 1;
    }
    return res;
}

const int N = 1000000;
bool composite[N + 1];               // toàn cục: tự bằng false

void sieve() {
    composite[0] = composite[1] = true;            // 0, 1 không nguyên tố
    for (ll i = 2; i * i <= N; i++)
        if (!composite[i])
            for (ll j = i * i; j <= N; j += i) composite[j] = true;
}

bool isPrime(ll n) {                 // kiểm tra 1 số tới 1e12: O(sqrt n)
    if (n < 2) return false;
    for (ll d = 2; d * d <= n; d++) if (n % d == 0) return false;
    return true;
}

int main() {
    sieve();
    cout << gcd_(12, 18) << ' ' << lcm_(12, 18) << '\n';     // 6 36
    cout << power(2, 10) << '\n';                            // 1024
    cout << (composite[97] ? "khong" : "co") << '\n';        // co
    ll a = 5, b = 7;
    cout << ((a - b) % MOD + MOD) % MOD << '\n';             // phép trừ trong mod: không ra số âm
    return 0;
}
```

## 7. Lỗi hay gặp

- **Coi 1 là số nguyên tố**: nhớ đánh dấu `composite[0] = composite[1] = true`.
- **Tính BCNN bằng a·b/gcd**: tích a·b tràn số. Hãy viết `a / gcd * b`.
- **Lũy thừa quên `a %= MOD`** khi a lớn: a·a tràn ngay ở bước đầu.
- **Quên mod sau mỗi phép tính**, chỉ mod ở cuối: kết quả trung gian tràn từ lâu rồi.
- **Mod số âm**: trong C++, (−7) % 3 = −1 chứ không phải 2. Hãy viết `((x % M) + M) % M`.
- **Vòng sàng `i * i` với i kiểu `int`** khi N lớn: dùng `long long` hoặc điều kiện `i <= N / i`.
- **Mảng sàng 10⁷ khai báo trong `main`**: tràn stack. Hãy khai báo **toàn cục**.
- **0⁰**: lũy thừa nhanh viết đúng sẽ trả về 1. Hãy xem đề quy ước thế nào.

> [!TIP] Học thuộc 3 số: 10⁹ + 7 là số nguyên tố; số nguyên tố lớn nhất < 10⁶ là 999983; có 78498 số nguyên tố ≤ 10⁶. Dùng để tự kiểm tra code sàng.

## 8. Bài tập

[[PROBLEMS]]
