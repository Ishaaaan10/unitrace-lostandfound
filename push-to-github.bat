@echo off
setlocal
set PATH=C:\Users\HP\AppData\Local\Programs\portable-tools\nodejs;C:\Users\HP\AppData\Local\Programs\portable-tools\git\cmd;C:\Users\HP\AppData\Local\Programs\portable-tools\git\mingw64\bin;%PATH%
cd /d "%~dp0"

echo ========================================================
echo   UniTrace - Push to GitHub (Ishaaaan10)
echo ========================================================
echo Target: https://github.com/Ishaaaan10/unitrace-lost-and-found
echo.
echo Option A: If you have a GitHub Personal Access Token (PAT),
echo          paste it below to push instantly without prompts.
echo.
echo Option B: Or simply press ENTER to push using your browser login.
echo ========================================================
echo.
set /p GH_TOKEN="GitHub Token (or press ENTER to skip): "

git remote remove origin 2>nul
git remote add origin https://github.com/Ishaaaan10/unitrace-lost-and-found.git
git branch -M main

echo.
echo Pushing project to GitHub...

if not "%GH_TOKEN%"=="" (
    git push -u https://%GH_TOKEN%@github.com/Ishaaaan10/unitrace-lost-and-found.git main
) else (
    git push -u origin main
)

if %ERRORLEVEL% equ 0 (
    echo.
    echo ========================================================
    echo   SUCCESS! Your project is now LIVE on GitHub!
    echo   URL: https://github.com/Ishaaaan10/unitrace-lost-and-found
    echo ========================================================
    echo.
    echo Next Step: Go to https://vercel.com, click "Add New..." -> "Project",
    echo select "unitrace-lost-and-found", and click Deploy!
    echo.
) else (
    echo.
    echo Push could not complete.
    echo Tip: Generate a token at https://github.com/settings/tokens (classic, tick 'repo')
    echo and re-run this script, pasting that token!
)

pause
