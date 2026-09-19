@echo off
REM ============================================================
REM  IA sem Misterio - abre o site NESTE computador (Chrome ou Edge)
REM  Funciona sem internet, exceto o que depende de sites externos
REM  (gerador de imagens e links para Quick Draw!, Bing, FLUX etc.).
REM ============================================================
setlocal
set "RAIZ=%~dp0"
set "ARQ=%RAIZ%index.html"
if not exist "%ARQ%" (
  echo Nao achei o index.html. Extraia o ZIP INTEIRO antes de abrir este arquivo.
  pause
  exit /b 1
)
set "NAV="
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "NAV=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not defined NAV if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set "NAV=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not defined NAV if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" set "NAV=%LocalAppData%\Google\Chrome\Application\chrome.exe"
if not defined NAV if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" set "NAV=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not defined NAV if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" set "NAV=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
if defined NAV (
  start "" "%NAV%" "%ARQ%"
) else (
  start "" "%ARQ%"
)
exit /b 0
