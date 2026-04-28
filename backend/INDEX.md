# 📑 Índice de Documentación: Postman + Newman

## 🎯 Encuentra lo que necesitas rápidamente

### 🔥 Lo primero que debes leer

**→ [QUICK_START.md](./QUICK_START.md)** (5-10 minutos)
- ⚡ Instalación paso a paso
- 🚀 Ejecutar tests en 3 pasos
- 🐛 Troubleshooting básico

### 📖 Documentación completa

**→ [POSTMAN_TESTING.md](./POSTMAN_TESTING.md)** (30 minutos)
- 📦 Archivos generados
- ✅ Scripts disponibles
- 📊 Estructura de pruebas
- 🔑 Variables de entorno
- 📈 Reportes y resultados
- 🎓 Ejemplos prácticos

---

## 📚 Guías especializadas

### Para aprender a escribir tests avanzados
**→ [ADVANCED_TESTING.md](./ADVANCED_TESTING.md)**

Temas cubiertos:
- ✅ Mejores prácticas
- 🧪 Pre-request scripts
- 📋 Post-response scripts
- 🔗 Flujos encadenados
- 🔍 Tests de errores
- 📈 Tests de performance
- 🧬 Loops y condicionales
- 🛡️ Seguridad en tests

**Cuando usar:**
- Quieres escribir tus propios tests
- Necesitas validaciones personalizadas
- Quieres automatizar flujos complejos

### Para integrar con CI/CD
**→ [CICD_SETUP.md](./CICD_SETUP.md)**

Configuraciones para:
- 🐙 GitHub Actions
- 🦊 GitLab CI
- 🔶 Jenkins
- ☁️ Azure DevOps
- 🔵 CircleCI

**Cuando usar:**
- Quieres que tests corran en cada push
- Necesitas notificaciones de fallos
- Usas un servicio de CI/CD

### Para crear colecciones personalizadas
**→ [CUSTOM_COLLECTIONS.md](./CUSTOM_COLLECTIONS.md)**

Temas cubiertos:
- 📁 Estructura de colecciones
- 🆕 Crear desde cero
- ➕ Agregar requests (GET, POST, PUT, DELETE)
- 🔄 Workflows automáticos
- ⚙️ Variables y environments
- 📋 Ejemplo completo CRUD
- 🧹 Mejores prácticas

**Cuando usar:**
- Quieres agregar tus propios endpoints
- Necesitas crear colecciones nuevas
- Quieres reutilizar requests

---

## 🗂️ Archivos del proyecto

### Archivos de configuración

| Archivo | Propósito |
|---------|-----------|
| `postman-collection.json` | Define todos los requests y tests |
| `postman-environment.json` | Variables (URLs, tokens, credenciales) |
| `newman-config.json` | Configuración de Newman (reportes, timeouts) |
| `package.json` | Scripts npm y dependencias |

### Scripts de ejecución

| Archivo | Uso |
|---------|-----|
| `run-tests.sh` | Ejecutar en macOS / Linux |
| `run-tests.bat` | Ejecutar en Windows |

### Reportes generados

| Archivo | Descripción |
|---------|------------|
| `test-results/newman-report.html` | Reporte visual (abre en navegador) |
| `test-results/newman-report.json` | Datos en formato JSON |

---

## 🎓 Rutas de aprendizaje

### Ruta 1: Principiante (30 minutos)
```
1. Lee: QUICK_START.md
2. Ejecuta: npm install && npm test
3. Abre: test-results/newman-report.html
4. Lee: POSTMAN_TESTING.md (secciones básicas)
```

### Ruta 2: Intermedio (1-2 horas)
```
1. Completa Ruta 1
2. Lee: ADVANCED_TESTING.md
3. Lee: CUSTOM_COLLECTIONS.md
4. Personaliza: postman-collection.json
5. Ejecuta: npm test nuevamente
```

### Ruta 3: Avanzado (2-4 horas)
```
1. Completa Ruta 2
2. Lee: CICD_SETUP.md
3. Elige tu plataforma (GitHub/GitLab/Jenkins)
4. Configura: .github/workflows/api-tests.yml (o similar)
5. Verifica: Que tests ejecuten automáticamente
```

### Ruta 4: Experto (Tiempo variable)
```
1. Completa Ruta 3
2. Integra: Notificaciones (Slack, email)
3. Optimiza: Performance de tests
4. Automatiza: Reportes y análisis
5. Escala: A múltiples proyectos
```

---

## 🔍 Buscar por tema

### Autenticación y Tokens
- [POSTMAN_TESTING.md → Variables de entorno](./POSTMAN_TESTING.md#-variables-de-entorno)
- [ADVANCED_TESTING.md → Extraer y guardar datos](./ADVANCED_TESTING.md#-validaciones-de-rendimiento)
- [CUSTOM_COLLECTIONS.md → Flujos entre requests](./CUSTOM_COLLECTIONS.md#-flujos-entre-requests-workflows)

### Validación de respuestas
- [ADVANCED_TESTING.md → Estructura básica](./ADVANCED_TESTING.md#1-estructura-básica-de-un-test)
- [ADVANCED_TESTING.md → Tests avanzados](./ADVANCED_TESTING.md#-validaciones-de-rendimiento)
- [ADVANCED_TESTING.md → Validar errores](./ADVANCED_TESTING.md#-testing-de-errores)

### Rendimiento
- [ADVANCED_TESTING.md → Tests de rendimiento](./ADVANCED_TESTING.md#-validaciones-de-rendimiento)
- [POSTMAN_TESTING.md → Reportes](./POSTMAN_TESTING.md#-reportes)

### Integración continua
- [CICD_SETUP.md → Tu plataforma favorita](./CICD_SETUP.md)
- [QUICK_START.md → Troubleshooting](./QUICK_START.md#troubleshooting-)

### Personalización
- [CUSTOM_COLLECTIONS.md → Todo el documento](./CUSTOM_COLLECTIONS.md)
- [ADVANCED_TESTING.md → Ejemplos prácticos](./ADVANCED_TESTING.md#-ejemplos-prácticos-por-endpoint)

### Debugging
- [QUICK_START.md → Troubleshooting](./QUICK_START.md#troubleshooting-)
- [ADVANCED_TESTING.md → Reportes y logs](./ADVANCED_TESTING.md#-reportes-y-logs)

---

## ❓ Preguntas comunes

### "¿Por dónde empiezo?"
→ **Abre [QUICK_START.md](./QUICK_START.md)**

### "¿Cómo escribo mis propios tests?"
→ **Lee [ADVANCED_TESTING.md](./ADVANCED_TESTING.md)**

### "¿Cómo agrego más endpoints?"
→ **Lee [CUSTOM_COLLECTIONS.md](./CUSTOM_COLLECTIONS.md)**

### "¿Cómo integro con GitHub?"
→ **Lee [CICD_SETUP.md → GitHub Actions](./CICD_SETUP.md#github-actions)**

### "¿Qué significa este error?"
→ **Busca en [QUICK_START.md → Troubleshooting](./QUICK_START.md#troubleshooting-)**

### "¿Cómo uso esto en producción?"
→ **Lee [CUSTOM_COLLECTIONS.md → Mejores prácticas](./CUSTOM_COLLECTIONS.md#-mejores-prácticas)**

---

## 📊 Comandos rápidos

```bash
# Instalar todo
npm install

# Ejecutar pruebas básicas
npm test

# Ejecutar en modo CI/CD
npm run test:ci

# Ver ayuda
npm run
```

---

## 🔗 Enlaces útiles

### Documentación oficial
- [Postman Learning Center](https://learning.postman.com/)
- [Newman CLI Documentation](https://learning.postman.com/docs/running-collections/using-newman-cli/)
- [Postman Test Scripts](https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-scripts/)

### Herramientas
- [Descargar Postman](https://www.postman.com/downloads/)
- [NPM Postman](https://www.npmjs.com/package/newman)
- [Chai Assertions](https://www.chaijs.com/)

### CI/CD Platforms
- [GitHub Actions](https://docs.github.com/en/actions)
- [GitLab CI/CD](https://docs.gitlab.com/ee/ci/)
- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Azure Pipelines](https://learn.microsoft.com/en-us/azure/devops/pipelines/)
- [CircleCI](https://circleci.com/docs/)

---

## ✅ Checklist de validación

Después de leer la documentación:

- [ ] Entiendo qué es Postman
- [ ] Entiendo qué es Newman
- [ ] He ejecutado `npm test` exitosamente
- [ ] He visto los reportes generados
- [ ] Entiendo cómo funcionan los tests
- [ ] Puedo agregar nuevos endpoints
- [ ] Puedo escribir tests personalizados
- [ ] Sé cómo integrar con CI/CD
- [ ] Puedo resolver problemas comunes

---

## 🎯 Mapa visual de contenido

```
📑 ÍNDICE (Este archivo)
│
├── 🚀 RÁPIDO
│   └── QUICK_START.md (comienza aquí)
│
├── 📖 COMPLETO
│   └── POSTMAN_TESTING.md (toda la info)
│
├── 🔬 ESPECIALIZADO
│   ├── ADVANCED_TESTING.md (escribe tests)
│   ├── CUSTOM_COLLECTIONS.md (crea colecciones)
│   └── CICD_SETUP.md (automatiza)
│
└── 📦 ARCHIVOS
    ├── postman-collection.json
    ├── postman-environment.json
    ├── newman-config.json
    ├── package.json
    └── test-results/
```

---

## 🎉 Siguiente paso

**→ [Abre QUICK_START.md](./QUICK_START.md) y comienza en 5 minutos! 🚀**

---

**Última actualización:** Abril 28, 2026  
**Versión:** 1.0  
**Status:** ✅ Completo

*Encuentra lo que necesitas. Aprende a tu ritmo. ¡Automatiza con confianza!* 💪
