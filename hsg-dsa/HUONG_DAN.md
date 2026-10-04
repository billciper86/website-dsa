# Website ôn thi HSG Tin học 10 — Hướng dẫn cài đặt & sử dụng

**Nội dung:** 12 chủ đề (lộ trình 3 ngày), 40 bài tập (mỗi bài ≥ 70 test tự sinh, có subtask), 1 đề thi thử 180 phút gồm 4 bài, mô phỏng tương tác cho từng chủ đề, editor kiểu Code::Blocks có trợ lý gạch chân lỗi và gợi ý tối ưu, đồng hồ bấm giờ.

## 1. Cần có gì trên máy?

| Phần mềm | Dùng để | Kiểm tra (mở cmd gõ) |
|---|---|---|
| **Python 3.8+** | chạy website và bộ chấm | `python --version` |
| **g++** (MinGW) | biên dịch code C++ của bạn | `g++ --version` |

Không cần cài thêm thư viện nào (không cần `pip install`), không cần mạng Internet.

### Cài Python (nếu chưa có)
1. Vào https://www.python.org/downloads/ → tải bản mới nhất cho Windows.
2. Khi cài, **tick ô "Add python.exe to PATH"** rồi bấm *Install Now*.

### Cài g++ (nếu chưa có)
Chọn **một** trong các cách:
- **Đã cài Code::Blocks bản có MinGW** (file cài tên kiểu `codeblocks-xx.xxmingw-setup.exe`): không cần làm gì thêm, bộ chấm tự tìm g++ trong `C:\Program Files\CodeBlocks\MinGW\bin`.
- **MSYS2** (https://www.msys2.org): cài xong mở "MSYS2 UCRT64" rồi gõ `pacman -S mingw-w64-ucrt-x86_64-gcc`.
- Nếu g++ nằm ở chỗ khác: đặt biến môi trường `GPP` trỏ tới file `g++.exe`.

## 2. Chạy website

1. Giải nén file zip (ví dụ vào `Documents\hsg-dsa`).
2. **Nhấp đúp `CHAY_WEB.bat`**. Một cửa sổ đen hiện ra, cho biết đã tìm thấy g++, và trình duyệt tự mở `http://127.0.0.1:8686/`.
3. **Giữ cửa sổ đen mở** trong lúc học. Muốn tắt thì đóng cửa sổ đó (hoặc nhấn Ctrl+C).

> Đừng mở trực tiếp file `web/index.html` bằng cách nhấp đúp. Nếu mở như vậy thì website không kết nối được bộ chấm.

Góc trên bên phải có chấm **xanh "Bộ chấm sẵn sàng"** là mọi thứ đã hoạt động.

## 3. Cách học mỗi ngày

1. **Trang Lộ trình**: xem khối học tiếp theo, bấm **⏱** để hẹn giờ cho khối đó (hết giờ có chuông báo), tick khi xong.
2. **Trang Chủ đề**: đọc 8 mục theo thứ tự, chạy **mô phỏng** (tự nhập dữ liệu, bấm *Bước tiếp*, phím ← → hoặc Space), rồi bấm *Đánh dấu đã học lý thuyết*.
3. **Trang Bài tập**: làm bài từ dễ đến khó.
   - Viết code ngay trong editor (giống Code::Blocks). **F9** để chạy thử với ví dụ, **Ctrl+Enter** để nộp bài.
   - Hoặc viết trong Code::Blocks thật rồi bấm **Mở file** để nạp file `.cpp` vào.
   - Mỗi bài được chấm trên **≥ 70 test**: AC / WA / TLE / RE / CE cho từng test, điểm theo subtask. Khi sai sẽ hiện **test nhỏ nhất bị sai** (input, đáp án đúng, output của bạn).
   - Lần **đầu tiên** nộp một bài sẽ mất thêm 10–40 giây để sinh test, các lần sau sẽ nhanh.
4. **Đồng hồ** ở góc dưới phải: bấm giờ hoặc hẹn giờ (15'–180'). Đồng hồ vẫn chạy khi chuyển trang.
5. **Thi thử**: đếm ngược, không xem được lời giải, lấy điểm cao nhất mỗi bài. Có thể *tự tạo đề luyện* từ các bài chưa làm.

### Phím tắt trong editor
| Phím | Tác dụng |
|---|---|
| F9 | Biên dịch & chạy thử với input tự nhập (giống Build & Run của Code::Blocks) |
| Ctrl+Enter | Nộp bài để chấm |
| Ctrl+S | Lưu nháp (thực ra mỗi lần gõ đều tự lưu) |
| Ctrl+D | Nhân đôi dòng hiện tại |
| Ctrl+/ | Bật/tắt chú thích `//` |
| Tab / Shift+Tab | Thụt lề / bỏ thụt lề (cả khối dòng đang chọn) |
| Ctrl+Z / Ctrl+Y | Hoàn tác / làm lại |

### Học theo từng bước, trợ lý code và gỡ lỗi
- **Từng bước**: lời giải được chia thành 3–6 bước nhỏ. Mỗi bước có giải thích, *Gợi ý 1* là khung code có chỗ trống `/* ? */` để bạn tự điền, *Gợi ý 2* là code mẫu. Có nút chèn khung vào editor và nút **Kiểm tra bước này** để xem code của bạn đã đủ ý chưa.
- **Gợi ý code**: lỗi hay gặp bị gạch chân ngay khi gõ, kèm lý do sai, cách sửa và gợi ý tối ưu theo hướng làm hiện tại của bạn.
- **Gỡ lỗi**: chạy chính code của bạn từng bước. Dòng đang chạy được tô vàng, bạn xem được biến và mảng (ô vừa đổi tô đỏ) cùng output tới thời điểm đó. Bấm vào số dòng để đặt breakpoint. Phím tắt: `F10` bước tiếp, `Shift+F10` lùi, `F8` chạy tới breakpoint. Mô phỏng được tạo tự động sau mỗi lần **Chạy thử**, và trên **test sai nhỏ nhất** khi nộp bị WA/RE/TLE. Mỗi lần gỡ lỗi ghi lại tối đa 3000 bước đầu, input tối đa 20.000 ký tự.

## 4. Chấm bằng dòng lệnh (không cần mở web)

```
python judge.py --list
python judge.py pf_01 D:\code\tongdoan.cpp
```

## 5. Cấu trúc thư mục

```
hsg-dsa/
├── CHAY_WEB.bat          nhấp đúp để chạy
├── server.py             web + API chấm (chỉ thư viện chuẩn Python, chỉ mở ở 127.0.0.1)
├── judge.py              chấm bằng dòng lệnh
├── judge_core.py         biên dịch g++, sinh test, chạy, so sánh output
├── analyzer.py           trợ lý code: tìm lỗi hay gặp, gợi ý tối ưu
├── debugger.py           gỡ lỗi: chèn ghi vết vào code, chạy và ghi lại từng bước
├── steps.py              hướng dẫn từng bước (đọc mốc [BƯỚC n] trong sol.cpp)
├── HUONG_DAN.md          file này
├── content/
│   ├── roadmap.json      lộ trình 3 ngày theo giờ
│   ├── exams.json        danh sách đề thi thử
│   └── topics/           index.json + bài giảng từng chủ đề (.md)
├── problems/
│   ├── genlib.py         hàm dùng chung cho bộ sinh test
│   └── <mã bài>/
│       ├── problem.json  tên, giới hạn thời gian/bộ nhớ, subtask + điểm
│       ├── statement.md  đề bài
│       ├── sol.cpp       lời giải chuẩn (có chú thích)
│       ├── brute.cpp     lời giải trâu (lấy subtask nhỏ)
│       ├── wrong_*.cpp   các lời giải SAI cố ý — để kiểm chứng test bắt được lỗi
│       ├── gen.py        bộ sinh test (có SEED, gán test vào subtask, kiểm tra giới hạn)
│       └── tests/        (tự sinh khi chấm lần đầu)
├── tools/selfcheck.py    tự kiểm tra toàn bộ bài
└── web/                  giao diện (HTML/CSS/JS, chạy offline, không cần thư viện ngoài)
    ├── index.html  topic.html  problems.html  problem.html  exam.html  history.html
    ├── css/style.css
    └── js/  common.js  editor.js  sim-engine.js  workspace.js  pages/  sims/
```

## 6. Thông tin kỹ thuật

- **Biên dịch:** `g++ -O2 -std=c++17 -static` và tăng stack lên 256 MB, để DFS đệ quy sâu không bị RE oan trên Windows.
- **Thời gian chạy** được đo bằng **thời gian CPU** (giống Codeforces), nên không bị chậm oan khi chấm song song nhiều test. Chương trình chạy quá 2 lần giới hạn sẽ bị dừng hẳn.
- **So sánh output:** bỏ qua khoảng trắng và xuống dòng thừa.
- **Điểm subtask:** chỉ được điểm khi **đúng tất cả** test của subtask đó.
- **Bộ nhớ:** Windows không giới hạn bộ nhớ dễ dàng được, nên bộ chấm **không** báo MLE. Hãy tự kiểm tra: 256 MB ≈ 6·10⁷ số `int`.
- **Test** được sinh với seed cố định nên lần nào cũng giống nhau. Nếu sửa `gen.py` hoặc `sol.cpp` thì test sẽ tự sinh lại.
- Mỗi bài tốn khoảng 1–60 MB cho thư mục `tests/`. Muốn giải phóng ổ đĩa thì cứ xóa các thư mục `problems/*/tests` và `build/`, lần chấm sau sẽ tự sinh lại.
- **Tiến độ và lịch sử nộp** được lưu trong trình duyệt (localStorage). Đổi máy hoặc đổi trình duyệt thì dùng *Lịch sử nộp → Sao lưu / Khôi phục*.

### Tự kiểm tra bộ test
```
python tools/selfcheck.py
```
Lệnh này kiểm tra với **mọi bài**:
- có ≥ 70 test, và mọi test đúng giới hạn đề;
- `sol.cpp` được 100 điểm;
- `brute.cpp` và `wrong_*.cpp` ra **đúng số điểm kỳ vọng**, ví dụ bản dùng `int` phải bị WA ở subtask có số lớn. Điều này chứng minh test biên, test lớn và test "anti" bắt được lỗi.

## 7. Gặp lỗi?

| Hiện tượng | Cách xử lý |
|---|---|
| Banner đỏ "Không kết nối được bộ chấm" | Bạn đang mở file .html trực tiếp. Hãy chạy `CHAY_WEB.bat` |
| Chấm xanh nhưng ghi "Thiếu g++" | Cài g++ (mục 1), rồi tắt và mở lại `CHAY_WEB.bat` |
| Cửa sổ đen báo "Không tìm thấy Python" | Cài Python và nhớ tick *Add to PATH* |
| Cổng 8686 bị chiếm | Server tự thử các cổng 8687, 8688…, xem địa chỉ in trong cửa sổ đen |
| Code chạy đúng trong Code::Blocks nhưng RE ở đây | Thường do mảng lớn khai báo trong `main` hoặc vượt chỉ số. Hãy khai báo mảng toàn cục |
| Antivirus chặn file .exe trong thư mục `build/` | Thêm thư mục `hsg-dsa` vào danh sách ngoại lệ của antivirus |
