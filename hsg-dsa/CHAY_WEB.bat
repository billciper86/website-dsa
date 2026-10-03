@echo off
chcp 65001 >nul
title Website on thi HSG Tin hoc
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
    py -3 server.py
    goto :end
)
where python >nul 2>nul
if %errorlevel%==0 (
    python server.py
    goto :end
)
echo Khong tim thay Python. Hay cai Python tu https://www.python.org/downloads/
echo (nho tick o "Add python.exe to PATH" khi cai), roi chay lai file nay.
:end
pause
