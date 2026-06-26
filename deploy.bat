@echo off
echo Fazendo deploy do Bora Beber...
cd /d "%~dp0"
firebase deploy --only hosting
echo.
echo Deploy finalizado! Acesse: https://borabeber.online
pause
