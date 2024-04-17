@echo off
set "shortcutName=Newtube_Installer"
set "startupFolder=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"

if exist "%startupFolder%\%shortcutName%.lnk" (
    echo Removing shortcut...
    del "%startupFolder%\%shortcutName%.lnk"
    echo Removed.
) else (
    echo Not found "%shortcutName%" in Startup Folder.
)

pause