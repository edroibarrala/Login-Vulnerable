# 🎯 Cheat Sheet: Postman + Newman

Referencia rápida de comandos, patrones y configuraciones comunes.

## ⚡ Comandos esenciales

```bash
# Instalar dependencias
npm install

# Ejecutar todas las pruebas
npm test

# Ejecutar modo CI (fail fast)
npm run test:ci

# Ejecutar con config personalizada
npm run test:config

# Ejecutar con auto-reload (watch)
npm run test:watch

# Instalar Newman globalmente
npm install -g newman

# Ejecutar directamente con Newman
newman run postman-collection.json -e postman-environment.json

# Generar solo reporte JSON
newman run postman-collection.json --reporters json --reporter-json-export=report.json

# Ejecutar con variables dinámicas
newman run postman-collection.json --env postman-environment.json --global globals.json
```

## 📝 Tests más usados

### Status Code
```javascript
pm.test('Status 200', function() {
  pm.response.to.have.status(200);
});
```

### Content Type
```javascript
pm.test('Response es JSON', function() {
  pm.response.to.have.header('Content-Type', 'application/json');
});
```

### Propiedad existe
```javascript
pm.test('Token existe', function() {
  const json = pm.response.json();
  pm.expect(json).to.have.property('token');
});
```

### Valor específico
```javascript
pm.test('Mensaje correcto', function() {
  const json = pm.response.json();
  pm.expect(json.message).to.equal('Success');
});
```

### Array no vacío
```javascript
pm.test('Tiene items', function() {
  const json = pm.response.json();
  pm.expect(json.items).to.be.an('array').that.is.not.empty;
});
```

### Tipo de dato
```javascript
pm.test('ID es número', function() {
  const json = pm.response.json();
  pm.expect(json.id).to.be.a('number');
});
```

### Rango de valores
```javascript
pm.test('Score entre 0-100', function() {
  const json = pm.response.json();
  pm.expect(json.score).to.be.within(0, 100);
});
```

### Contiene texto
```javascript
pm.test('Mensaje contiene palabra', function() {
  const json = pm.response.json();
  pm.expect(json.message).to.include('success');
});
```

### Tiempo de respuesta
```javascript
pm.test('Respuesta rápida', function() {
  pm.expect(pm.response.responseTime).to.be.below(500);
});
```

## 🔧 Pre-request scripts

### Generar timestamp
```javascript
pm.environment.set('timestamp', Date.now());
```

### Generar UUID
```javascript
pm.environment.set('request_id', pm.variables.replaceIn('{{$guid}}'));
```

### Generar número aleatorio
```javascript
pm.environment.set('random_id', Math.floor(Math.random() * 1000));
```

### Generar string aleatorio
```javascript
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let result = '';
for(let i = 0; i < 10; i++) {
  result += chars.charAt(Math.floor(Math.random() * chars.length));
}
pm.environment.set('random_string', result);
```

### Obtener variable
```javascript
const token = pm.environment.get('auth_token');
```

### Obtener global
```javascript
const apiKey = pm.globals.get('api_key');
```

### Verificar variable existe
```javascript
if (!pm.environment.get('auth_token')) {
  console.warn('Token no encontrado');
}
```

### Validar antes de enviar
```javascript
const username = pm.environment.get('username');
if (!username) {
  throw new Error('Username no configurado');
}
```

## 📊 Post-response scripts

### Guardar token JWT
```javascript
pm.test('Guardar token', function() {
  const json = pm.response.json();
  pm.environment.set('auth_token', json.token);
});
```

### Extraer valor de respuesta
```javascript
pm.test('Guardar ID', function() {
  const json = pm.response.json();
  pm.environment.set('user_id', json.data.id);
});
```

### Loop sobre array
```javascript
pm.test('Verificar items', function() {
  const json = pm.response.json();
  json.items.forEach(function(item) {
    pm.expect(item).to.have.property('id');
  });
});
```

### Condicional
```javascript
pm.test('Validación condicional', function() {
  const status = pm.response.code;
  
  if (status === 200) {
    pm.expect(pm.response.json()).to.have.property('data');
  } else if (status === 400) {
    pm.expect(pm.response.json()).to.have.property('error');
  }
});
```

### Decodificar JWT
```javascript
pm.test('JWT válido', function() {
  const token = pm.response.json().token;
  const payload = JSON.parse(atob(token.split('.')[1]));
  pm.expect(payload).to.have.property('user_id');
});
```

## 🔐 Autenticación

### Bearer Token
```javascript
// Header
{
  "key": "Authorization",
  "value": "Bearer {{auth_token}}"
}
```

### Basic Auth
```javascript
// Header
{
  "key": "Authorization",
  "value": "Basic " + btoa('username:password')
}
```

### API Key
```javascript
// Header
{
  "key": "X-API-Key",
  "value": "{{api_key}}"
}
```

### OAuth2 (manual)
```javascript
// Pre-request
const token = pm.environment.get('oauth_token');
pm.environment.set('Authorization', 'Bearer ' + token);

// Header
{
  "key": "Authorization",
  "value": "{{Authorization}}"
}
```

## 📋 Body templates

### JSON simple
```json
{
  "username": "test",
  "password": "12345"
}
```

### Con variables
```json
{
  "user_id": "{{user_id}}",
  "created_at": "{{timestamp}}"
}
```

### Form data
```
username: {{username}}
password: {{password}}
```

### XML
```xml
<?xml version="1.0" encoding="UTF-8"?>
<user>
  <name>{{name}}</name>
  <email>{{email}}</email>
</user>
```

### GraphQL
```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
  }
}

{
  "id": "{{user_id}}"
}
```

## 🔗 URLs dinámicas

### Simple
```
{{base_url}}/users
```

### Con parámetro
```
{{base_url}}/users/{{user_id}}
```

### Con query string
```
{{base_url}}/users?page=1&limit=10
```

### Query string dinámico
```
{{base_url}}/search?q={{search_term}}&sort={{sort_by}}
```

## 🔍 Debugging

### Imprimir en consola
```javascript
console.log('Variable:', pm.environment.get('auth_token'));
```

### Imprimir objeto completo
```javascript
console.log(pm.response.json());
```

### Ver headers
```javascript
console.log('Headers:', pm.response.headers.toObject());
```

### Ver tiempos
```javascript
console.log('Response time:', pm.response.responseTime, 'ms');
```

### Agrupar logs
```javascript
console.group('🔍 Debug Info');
console.log('Status:', pm.response.code);
console.log('Time:', pm.response.responseTime);
console.groupEnd();
```

## 📊 Validaciones complejas

### Validar estructura completa
```javascript
pm.test('Estructura correcta', function() {
  const json = pm.response.json();
  pm.expect(json).to.have.all.keys('id', 'name', 'email', 'created_at');
});
```

### Validar uno de varios valores
```javascript
pm.test('Status esperado', function() {
  pm.expect([200, 201]).to.include(pm.response.code);
});
```

### Expresión regular
```javascript
pm.test('Email válido', function() {
  const json = pm.response.json();
  pm.expect(json.email).to.match(/^.+@.+\..+$/);
});
```

### Longitud de string
```javascript
pm.test('Password fuerte', function() {
  const json = pm.response.json();
  pm.expect(json.password).to.have.length.above(8);
});
```

### Fecha válida
```javascript
pm.test('Fecha válida', function() {
  const json = pm.response.json();
  pm.expect(new Date(json.created_at)).to.be.instanceof(Date);
});
```

## 🎯 Patrones comunes

### Flujo: Login → Usar token
```javascript
// Request 1: POST Login
// En Tests:
pm.environment.set('auth_token', pm.response.json().token);

// Request 2: GET Dashboard
// En Header:
{
  "key": "Authorization",
  "value": "Bearer {{auth_token}}"
}
```

### Flujo: Crear → Obtener → Actualizar
```javascript
// Request 1: POST /items
// En Tests:
pm.environment.set('item_id', pm.response.json().id);

// Request 2: GET /items/{{item_id}}

// Request 3: PUT /items/{{item_id}}
```

### Validar múltiples usuarios
```javascript
pm.test('Todos los usuarios válidos', function() {
  const json = pm.response.json();
  json.users.forEach(function(user) {
    pm.expect(user).to.have.all.keys('id', 'name', 'email');
    pm.expect(user.id).to.be.a('number');
  });
});
```

## ⚙️ Variables de Postman disponibles

```javascript
$guid              // UUID único
$timestamp         // Timestamp actual
$randomInt         // Número aleatorio
$randomFirstName   // Nombre aleatorio
$randomLastName    // Apellido aleatorio
$randomEmail       // Email aleatorio
$randomColor       // Color aleatorio
$randomCurrencyCode // Código de moneda
$randomCountry     // País aleatorio
$randomPhone       // Teléfono aleatorio
```

Uso:
```javascript
pm.environment.set('random_email', pm.variables.replaceIn('{{$randomEmail}}'));
```

## 🚀 Newman flags útiles

```bash
# Número de iteraciones
newman run collection.json --iteration-count 5

# Mostrar solo fallos
newman run collection.json --suppress-request-body

# Timeout en ms
newman run collection.json --timeout-request 5000

# Verbosidad
newman run collection.json -v

# Especificar reporters
newman run collection.json --reporters cli,html,json

# Exportar JSON
newman run collection.json --reporter-json-export=results.json

# Exportar HTML
newman run collection.json --reporter-html-export=results.html

# Detener en error
newman run collection.json --bail

# Seed aleatorio
newman run collection.json --seed 12345
```

## 📦 package.json scripts template

```json
"scripts": {
  "test": "newman run postman-collection.json -e postman-environment.json --reporters cli,json,html",
  "test:ci": "newman run postman-collection.json -e postman-environment.json --bail",
  "test:watch": "nodemon --exec npm run test",
  "test:verbose": "newman run postman-collection.json -e postman-environment.json -v",
  "test:multiple": "newman run postman-collection.json -e postman-environment.json --iteration-count 3",
  "test:local": "newman run postman-collection.json --env postman-environment.json",
  "test:prod": "newman run postman-collection.json --env postman-environment.prod.json",
  "report": "open test-results/newman-report.html"
}
```

## 🔄 Variables comunes por layer

### Globales (todas las colecciones)
```javascript
pm.globals.set('api_key', 'global-key');
const key = pm.globals.get('api_key');
```

### Environment (proyecto)
```javascript
pm.environment.set('base_url', 'http://localhost:3000');
const url = pm.environment.get('base_url');
```

### Colección (colección actual)
```javascript
pm.collectionVariables.set('collection_var', 'value');
```

### Local (request actual)
```javascript
let local_var = 'solo en este request';
```

## 🎓 Patrón recomendado

```javascript
// 1. Pre-request: Preparar datos
pm.environment.set('request_id', pm.variables.replaceIn('{{$guid}}'));

// 2. Request: Usar variables
// URL: {{base_url}}/users
// Body: { "id": "{{request_id}}" }

// 3. Tests: Validar respuesta
pm.test('Status 200', function() {
  pm.response.to.have.status(200);
});

pm.test('Guardar para próximo request', function() {
  pm.environment.set('user_id', pm.response.json().id);
});
```

---

**🎯 Guarda este cheat sheet para referencia rápida!**

Para ejemplos más complejos, ver: [ADVANCED_TESTING.md](./ADVANCED_TESTING.md)
