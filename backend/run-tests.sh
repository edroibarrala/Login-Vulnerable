#!/bin/bash

# Script para ejecutar pruebas con Newman
# Uso: ./run-tests.sh [opción]
#      ./run-tests.sh normal  - Ejecutar con reportes completos
#      ./run-tests.sh ci      - Modo CI (fail fast)
#      ./run-tests.sh watch   - Modo watch

set -e

echo "🧪 Iniciando pruebas de API con Newman..."
echo ""

OPTION="${1:-normal}"

case $OPTION in
  normal)
    echo "📊 Modo: Pruebas completas con reportes"
    echo ""
    npm run test
    echo ""
    echo "✅ Pruebas completadas!"
    echo "📄 Abre: test-results/newman-report.html"
    ;;
  ci)
    echo "🚀 Modo: CI/CD (fail fast)"
    echo ""
    npm run test:ci
    echo ""
    echo "✅ Pipeline completado"
    ;;
  watch)
    echo "👀 Modo: Watch (auto-reload)"
    echo ""
    npm run test:watch
    ;;
  *)
    echo "❌ Opción no válida: $OPTION"
    echo ""
    echo "Opciones disponibles:"
    echo "  ./run-tests.sh normal - Pruebas completas con reportes (default)"
    echo "  ./run-tests.sh ci     - Modo CI/CD (detiene en primer error)"
    echo "  ./run-tests.sh watch  - Modo watch (auto-reload)"
    exit 1
    ;;
esac
