@echo off
set "targetFile=Newtube_Installer.bat"
set "shortcutName=Newtube_Installer"
set "startupFolder=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"

:: Check if the shortcut already exists
if exist "%startupFolder%\%shortcutName%.lnk" (
    echo Shortcut already exists in Startup folder. Removing old shortcut...
    del "%startupFolder%\%shortcutName%.lnk"
    echo Old shortcut removed.
)

:: Create VBS script to create the shortcut
echo Set objShell = WScript.CreateObject("WScript.Shell") > CreateShortcut.vbs
echo Set objShortcut = objShell.CreateShortcut("%startupFolder%\%shortcutName%.lnk") >> CreateShortcut.vbs
echo objShortcut.TargetPath = "%~dp0%targetFile%" >> CreateShortcut.vbs
echo objShortcut.WorkingDirectory = "%~dp0" >> CreateShortcut.vbs
echo objShortcut.Save >> CreateShortcut.vbs

:: Run the VBS script to create the shortcut
echo Creating shortcut...
cscript //nologo CreateShortcut.vbs
if errorlevel 1 (
    echo Failed to create shortcut. Please run the script as administrator.
) else (
    echo Shortcut created in Startup folder.
)

:: Clean up by deleting the VBS script
del CreateShortcut.vbs

:: Pause to keep the command prompt open
echo.
echo Press any key to exit...
pause > nul