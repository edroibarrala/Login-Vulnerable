@echo off
REM Script para ejecutar pruebas con Newman en Windows
REM Uso: run-tests.bat [opción]

setlocal enabledelayedexpansion

set OPTION=%1
if "%OPTION%"=="" set OPTION=normal

echo.
echo 🧪 Iniciando pruebas de API con Newman...
echo.

if "%OPTION%"=="normal" (
    echo 📊 Modo: Pruebas completas con reportes
    echo.
    call npm run test
    echo.
    echo ✅ Pruebas completadas!
    echo 📄 Abre: test-results\newman-report.html
) else if "%OPTION%"=="ci" (
    echo 🚀 Modo: CI/CD ^(fail fast^)
    echo.
    call npm run test:ci
    echo.
    echo ✅ Pipeline completado
) else if "%OPTION%"=="watch" (
    echo 👀 Modo: Watch ^(auto-reload^)
    echo.
    call npm run test:watch
) else (
    echo ❌ Opción no válida: %OPTION%
    echo.
    echo Opciones disponibles:
    echo   run-tests.bat normal - Pruebas completas con reportes ^(default^)
    echo   run-tests.bat ci     - Modo CI/CD ^(detiene en primer error^)
    echo   run-tests.bat watch  - Modo watch ^(auto-reload^)
    exit /b 1
)
