# 🚀 Guía de Inicio Rápido: Postman + Newman

## Paso 1: Preparar el ambiente

### 1.1 Verificar Node.js y npm

```bash
node --version  # Debe ser v14 o superior
npm --version
```

### 1.2 Instalar dependencias

```bash
cd Login-Vulnerable/backend
npm install
```

✅ Esto instala:
- `newman` - CLI para ejecutar colecciones Postman
- `newman-reporter-html` - Generador de reportes HTML
- `nodemon` - Auto-reload para desarrollo

## Paso 2: Ejecutar el servidor backend

En una **terminal nueva**:

```bash
cd Login-Vulnerable/backend
node index.js
```

Deberías ver:
```
Server running on port 3000
```

> **Mantén esta terminal abierta durante las pruebas**

## Paso 3: Ejecutar las pruebas

En una **segunda terminal**:

### Opción A: Con reportes completos (RECOMENDADO)

```bash
npm test
```

**Salida esperada:**
```
newman

Login Vulnerable API

  Public Endpoint
    GET /public
      ✓ Status code es 200
      ✓ Response contiene mensaje
      ✓ Tiempo de respuesta menor a 1000ms

  Authentication
    POST /login - Valid Credentials
      ✓ Status code es 200
      ✓ Response contiene token
      ✓ Guardar token en variable

  ... más resultados ...

┌─────────────────────────────┬──────────┬──────────┐
│                             │ executed │ failed   │
├─────────────────────────────┼──────────┼──────────┤
│ iterations                  │ 1        │ 0        │
├─────────────────────────────┼──────────┼──────────┤
│ requests                    │ 5        │ 0        │
├─────────────────────────────┼──────────┼──────────┤
│ test-scripts                │ 15       │ 0        │
├─────────────────────────────┼──────────┼──────────┤
│ prerequest-scripts          │ 1        │ 0        │
├─────────────────────────────┼──────────┼──────────┤
│ assertions                  │ 15       │ 0        │
├─────────────────────────────┼──────────┼──────────┤
│ failures                    │          │ 0        │
└─────────────────────────────┴──────────┴──────────┘
```

### Opción B: Modo CI/CD (para pipelines)

```bash
npm run test:ci
```

Se detiene en el primer error (ideal para GitHub Actions, GitLab CI, etc.)

## Paso 4: Ver los reportes

Después de ejecutar `npm test`:

### 📊 Reporte HTML

```bash
# Windows
start test-results\newman-report.html

# macOS
open test-results/newman-report.html

# Linux
xdg-open test-results/newman-report.html
```

Verás un reporte interactivo con:
- ✅ Requests exitosos
- ❌ Fallos (si los hay)
- ⏱️ Tiempos de respuesta
- 📊 Estadísticas

### 📄 Reporte JSON

Ver en: `test-results/newman-report.json`

Útil para:
- Procesar datos programáticamente
- Integración con otras herramientas
- Análisis de tendencias

## Paso 5: Uso en Postman Desktop (Opcional)

Si prefieres trabajar en la GUI de Postman:

### 5.1 Instalar Postman

Descarga desde: https://www.postman.com/downloads/

### 5.2 Importar colección

1. Abre Postman
2. Haz clic en **Import**
3. Selecciona `postman-collection.json`
4. Elige **Import**

### 5.3 Importar ambiente

1. Haz clic en el **engranaje ⚙️** (Environment)
2. Click en **Import**
3. Selecciona `postman-environment.json`
4. Elige **Import**

### 5.4 Ejecutar requests manualmente

1. En la esquina superior derecha, selecciona el environment "Login API - Environment"
2. Expande la carpeta "Authentication"
3. Haz clic en "POST /login - Valid Credentials"
4. Presiona **Send**

Deberías ver:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJlZHdhciIsImlhdCI6MTcxNDIxNjM2MCwiZXhwIjoxNzE0MjE5OTYwfQ.abc123..."
}
```

### 5.5 Ejecutar colección completa

1. Haz clic derecho en la carpeta "Login Vulnerable API"
2. Selecciona **Run Collection**
3. Click en **Run Login Vulnerable API**

## Troubleshooting 🔧

### Problema: "ECONNREFUSED"
```
Error: connect ECONNREFUSED 127.0.0.1:3000
```

**Solución:** El servidor no está corriendo
```bash
# Terminal 1
node index.js
```

### Problema: "npm: command not found"
**Solución:** Node.js no está instalado
```bash
# Descarga desde https://nodejs.org/
node --version
```

### Problema: "newman: command not found"
**Solución:** Newman no está instalado
```bash
npm install -g newman
# O usa:
npx newman run postman-collection.json
```

### Problema: "auth_token not found"
**Solución:** El login falló
- Verifica credenciales en `postman-environment.json`
- Asegúrate de ejecutar "Login - Valid Credentials" primero

### Problema: Los tests pasan pero no ves los reportes
**Solución:** Verifica que la carpeta exista
```bash
mkdir -p test-results
npm test
```

## 📚 Próximos pasos

### Agregar más tests

Edita `postman-collection.json` y agrega nuevos requests en la sección `item`.

Ver: [ADVANCED_TESTING.md](./ADVANCED_TESTING.md)

### Integración CI/CD

Ver: [POSTMAN_TESTING.md](./POSTMAN_TESTING.md#-integración-en-cicd)

### Tests personalizados

```javascript
// Agregar en la sección "Tests" de cualquier request

pm.test('Mi primer test', function() {
  pm.response.to.have.status(200);
});
```

## 🎯 Checklist de validación

- [ ] Node.js y npm instalados
- [ ] `npm install` ejecutado
- [ ] Servidor corriendo en puerto 3000
- [ ] `npm test` ejecutado exitosamente
- [ ] Reportes generados en `test-results/`
- [ ] Reporte HTML abre correctamente

## ✅ Si todo funciona correctamente

Deberías ver:
```
✓ 5 requests ejecutados
✓ 15 assertions pasadas
✓ 0 fallos
✓ Tiempo promedio: < 100ms
```

---

**¡Felicitaciones! 🎉 Tu automatización de pruebas está lista!**

Ahora puedes:
- ✅ Ejecutar pruebas localmente
- ✅ Generar reportes automáticos
- ✅ Integrar con CI/CD
- ✅ Mantener calidad del código
