@echo off
SET MONGO_PATH="C:\Users\ummik\Downloads\mongodb-windows-x86_64-4.4.18\mongodb-win32-x86_64-windows-4.4.18\bin\mongod.exe"
SET DB_PATH="K:\bank app\data\db"

echo 🚀 Starting Local MongoDB...
echo DB Path: %DB_PATH%

%MONGO_PATH% --dbpath %DB_PATH%
