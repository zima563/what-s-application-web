@echo off
echo ===================================================
echo   Connecting to AWS EC2 Server (63.179.147.251)
echo ===================================================

if exist "%USERPROFILE%\Downloads\whatsapp-key.pem" (
    ssh -o StrictHostKeyChecking=no -i "%USERPROFILE%\Downloads\whatsapp-key.pem" ubuntu@63.179.147.251
) else if exist "%USERPROFILE%\Downloads\whatsapp-key" (
    ssh -o StrictHostKeyChecking=no -i "%USERPROFILE%\Downloads\whatsapp-key" ubuntu@63.179.147.251
) else if exist "%USERPROFILE%\Downloads\whatsapp-key.pem.txt" (
    ssh -o StrictHostKeyChecking=no -i "%USERPROFILE%\Downloads\whatsapp-key.pem.txt" ubuntu@63.179.147.251
) else (
    echo [ERROR] Could not find whatsapp-key in your Downloads folder!
    echo Searching for any .pem files in Downloads...
    dir "%USERPROFILE%\Downloads\*.pem" /b
    pause
)
