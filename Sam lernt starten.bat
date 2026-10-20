@echo off
rem Startet "Sam lernt" ueber einen kleinen Server nur auf diesem Computer,
rem damit Videos, Mikrofon und Offline-Modus wie auf der Webseite funktionieren.
cd /d "%~dp0"
where python >nul 2>&1
if errorlevel 1 (
  start "" "%~dp0index.html"
  exit /b
)
start "Sam lernt - Server (zum Beenden schliessen)" /min python -m http.server 8765 --bind 127.0.0.1
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:8765/index.html"
