# 🧪 Automatización de Pruebas con Postman + Newman

Guía completa para automatizar pruebas de la API de autenticación JWT usando Postman y Newman.

## 📦 Archivos generados

| Archivo | Descripción |
|---------|-------------|
| `postman-collection.json` | Colección de Postman con todos los endpoints |
| `postman-environment.json` | Variables de entorno (URLs, credenciales) |
| `newman-config.json` | Configuración de Newman |
| `test-results/` | Carpeta para reportes (JSON, HTML) |

## 🚀 Instalación

### 1. Instalar Newman y dependencias

```bash
npm install
```

O si lo prefieres instalar solo Newman globalmente:

```bash
npm install -g newman
```

## ✅ Scripts disponibles

### Ejecutar todas las pruebas con reportes

```bash
npm test
```

Este comando ejecuta:
- Pruebas en CLI (salida en terminal)
- Reporte JSON → `test-results/newman-report.json`
- Reporte HTML → `test-results/newman-report.html`

### Ejecutar con configuración personalizada

```bash
npm run test:config
```

### Modo desarrollo (con auto-reload)

```bash
npm run test:watch
```

*Requiere cambios en archivos para re-ejecutar*

### Modo CI/CD (Continuous Integration)

```bash
npm run test:ci
```

Detiene en el primer error encontrado (ideal para pipelines)

## 🧬 Estructura de pruebas

### 1️⃣ **Public Endpoint**
- ✅ GET `/public` - Endpoint sin autenticación

### 2️⃣ **Authentication**
- ✅ POST `/login` - Login con credenciales válidas
- ✅ POST `/login` - Login con credenciales inválidas

### 3️⃣ **Protected Endpoints**
- ✅ GET `/dashboard` - Con token válido
- ✅ GET `/dashboard` - Sin token

## 🔑 Variables de entorno

En `postman-environment.json`:

```json
{
  "base_url": "http://localhost:3000",
  "auth_token": "", // Se rellena automáticamente después del login
  "valid_username": "edwar",
  "valid_password": "password"
}
```

## 📊 Reportes

Después de ejecutar `npm test`, encontrarás:

```
test-results/
├── newman-report.json    # Datos crudos para procesamiento
└── newman-report.html    # Reporte visual interactivo
```

## 🔄 Flujo de ejecución automático

```
1. GET /public
   ↓
2. POST /login (credenciales válidas)
   ├─→ Extrae token JWT
   └─→ Guarda en auth_token
   ↓
3. POST /login (credenciales inválidas)
   ↓
4. GET /dashboard (con token)
   ↓
5. GET /dashboard (sin token)
```

## 🎯 Validaciones que se ejecutan

Cada request verifica:

✅ **Status Code** - Respuesta esperada (200, 401, etc.)
✅ **Response Body** - Estructura y contenido esperado
✅ **Tiempo de respuesta** - Performance < 1000ms
✅ **Token JWT** - Extraído y guardado correctamente
✅ **Mensajes de error** - Validación de errores esperados

## 🖥️ Uso en Postman Desktop

Para usar la colección en Postman:

1. Abre Postman
2. `File` → `Import` → Selecciona `postman-collection.json`
3. `Import` → Selecciona `postman-environment.json`
4. Selecciona el environment en la esquina superior derecha
5. Ejecuta las requests manualmente o con el **Collection Runner**

## 🔌 Integración en CI/CD

### GitHub Actions

```yaml
name: API Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run test:ci
      - uses: actions/upload-artifact@v2
        if: always()
        with:
          name: test-results
          path: test-results/
```

### GitLab CI

```yaml
test:
  image: node:18
  script:
    - npm install
    - npm run test:ci
  artifacts:
    paths:
      - test-results/
```

## 🛠️ Personalización

### Agregar nuevo endpoint a la colección

1. Abre `postman-collection.json`
2. Agrega un nuevo objeto en `item`:

```json
{
  "name": "Mi Nuevo Endpoint",
  "request": {
    "method": "GET",
    "url": "{{base_url}}/nuevo-endpoint"
  },
  "event": [
    {
      "listen": "test",
      "script": {
        "exec": [
          "pm.test('Status 200', function() {",
          "  pm.response.to.have.status(200);",
          "});"
        ]
      }
    }
  ]
}
```

### Usar credenciales diferentes

Modifica `postman-environment.json`:

```json
{
  "key": "valid_username",
  "value": "otro_usuario"
}
```

## 🐛 Troubleshooting

### Error: "Connection refused"
```bash
# Asegúrate que el servidor está corriendo:
node index.js
```

### Error: "newman: command not found"
```bash
# Instala globalmente:
npm install -g newman
```

### El token no se guarda
Verifica que el login sea exitoso (status 200) antes de ejecutar dashboard.

## 📚 Documentación útil

- [Postman Learning Center](https://learning.postman.com/)
- [Newman Documentation](https://learning.postman.com/docs/running-collections/using-newman-cli/)
- [Postman Test Scripts](https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-scripts/)

## 🎓 Ejemplo: Crear tus propias pruebas

```javascript
// En la sección "Tests" de cualquier request

// Verificar status
pm.test('Debe retornar 200', function() {
  pm.response.to.have.status(200);
});

// Verificar estructura
pm.test('Response tiene propiedades', function() {
  const json = pm.response.json();
  pm.expect(json).to.have.property('token');
});

// Guardar valor para otro request
pm.test('Guardar token', function() {
  const json = pm.response.json();
  pm.environment.set('auth_token', json.token);
});

// Validar tipo de dato
pm.test('Token es string', function() {
  const json = pm.response.json();
  pm.expect(json.token).to.be.a('string');
});
```

---

**Autor:** Automated Testing Setup  
**Fecha:** Abril 2026  
**Status:** ✅ Listo para usar
