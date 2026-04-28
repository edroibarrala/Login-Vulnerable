# 📚 Guía Avanzada: Scripts de Testing en Postman

## 🎯 Mejores prácticas para escribir tests

### 1. Estructura básica de un test

```javascript
// ✅ BUENO
pm.test('Descripción clara y específica', function () {
  const response = pm.response.json();
  pm.expect(response).to.have.property('token');
});

// ❌ MALO
pm.test('test', function () {
  pm.expect(pm.response.statusCode).to.equal(200);
});
```

### 2. Tests en Pre-request scripts

Ejecutan **ANTES** de enviar el request:

```javascript
// Generar timestamp dinámico
pm.environment.set('timestamp', Date.now());

// Generar UUID
pm.environment.set('request_id', pm.variables.replaceIn('{{$guid}}'));

// Validar variables existe antes de usarlas
const token = pm.environment.get('auth_token');
if (!token) {
  console.warn('⚠️ Token no encontrado en variables de entorno');
}

// Preparar payload dinámico
const payload = {
  username: pm.environment.get('valid_username'),
  password: pm.environment.get('valid_password'),
  timestamp: pm.environment.get('timestamp')
};
```

### 3. Tests en Post-response scripts

Ejecutan **DESPUÉS** de recibir la respuesta:

```javascript
// Validar status code
pm.test('Status es 200 OK', function () {
  pm.response.to.have.status(200);
});

// Validar headers
pm.test('Content-Type es JSON', function () {
  pm.response.to.have.header('Content-Type', 'application/json');
});

// Validar estructura de respuesta
pm.test('Response tiene estructura correcta', function () {
  const json = pm.response.json();
  pm.expect(json).to.have.all.keys('token', 'expires_in');
});

// Validar tipos de datos
pm.test('Token es string no vacío', function () {
  const json = pm.response.json();
  pm.expect(json.token).to.be.a('string').and.to.have.length.above(0);
});

// Extraer y guardar datos para requests posteriores
pm.test('Guardar token en variables', function () {
  const json = pm.response.json();
  pm.environment.set('auth_token', json.token);
  pm.environment.set('user_id', json.user_id);
});

// Validar tiempo de respuesta
pm.test('Respuesta rápida (< 500ms)', function () {
  pm.expect(pm.response.responseTime).to.be.below(500);
});
```

## 📋 Ejemplos prácticos por endpoint

### Login - Request pre-request

```javascript
// Preparar datos de login
const credentials = {
  username: 'edwar',
  password: 'password'
};

pm.environment.set('login_username', credentials.username);
pm.environment.set('login_timestamp', Date.now());

// Registrar en consola para debugging
console.log('🔐 Intentando login con:', credentials.username);
```

### Login - Response tests

```javascript
pm.test('Status 200 para login exitoso', function () {
  pm.response.to.have.status(200);
});

pm.test('Respuesta contiene JWT token', function () {
  const responseJson = pm.response.json();
  
  pm.expect(responseJson).to.have.property('token');
  pm.expect(responseJson.token).to.be.a('string');
  
  // JWT tiene 3 partes separadas por puntos
  const tokenParts = responseJson.token.split('.');
  pm.expect(tokenParts).to.have.lengthOf(3);
});

pm.test('Guardar token para próximos requests', function () {
  const responseJson = pm.response.json();
  pm.environment.set('auth_token', responseJson.token);
});

pm.test('Token es válido por al menos 1 hora', function () {
  const responseJson = pm.response.json();
  
  // Decodificar JWT (sin verificar firma)
  const payload = JSON.parse(
    atob(responseJson.token.split('.')[1])
  );
  
  const expiresAt = payload.exp * 1000; // Convertir a millisegundos
  const now = Date.now();
  const timeRemaining = expiresAt - now;
  
  pm.expect(timeRemaining).to.be.above(3600000); // 1 hora en ms
});
```

### Dashboard - Pre-request

```javascript
// Verificar que tenemos token antes de hacer request
pm.sendRequest({
  url: 'http://localhost:3000/dashboard',
  method: 'GET',
  header: {
    'Authorization': 'Bearer ' + pm.environment.get('auth_token')
  }
}, function(err, response) {
  if (err) {
    console.log('❌ Error en dashboard:', err);
  } else {
    console.log('✅ Dashboard accessible');
  }
});
```

### Dashboard - Response tests

```javascript
pm.test('Status 200 con token válido', function () {
  pm.response.to.have.status(200);
});

pm.test('Dashboard retorna datos del usuario', function () {
  const responseJson = pm.response.json();
  
  pm.expect(responseJson).to.include.all.keys('message', 'users');
  pm.expect(responseJson.message).to.include('Welcome');
});

pm.test('Datos del usuario contienen propiedades requeridas', function () {
  const responseJson = pm.response.json();
  const user = responseJson.users;
  
  pm.expect(user).to.have.property('id');
  pm.expect(user).to.have.property('username');
  pm.expect(user.id).to.be.a('number');
  pm.expect(user.username).to.be.a('string');
});

pm.test('El usuario coincide con el del token', function () {
  const responseJson = pm.response.json();
  const tokenUsername = pm.environment.get('login_username');
  
  pm.expect(responseJson.users.username).to.equal(tokenUsername);
});
```

## 🔍 Testing de errores

### Validar respuestas de error

```javascript
// Test para 401 Unauthorized
pm.test('Sin token retorna 401', function () {
  pm.response.to.have.status(401);
});

pm.test('Error message es claro', function () {
  const responseJson = pm.response.json();
  
  pm.expect(responseJson).to.have.property('message');
  pm.expect(responseJson.message).to.be.a('string').and.not.be.empty;
  pm.expect(responseJson.message.toLowerCase()).to.include('unauthorized');
});

pm.test('No incluir información sensible en errores', function () {
  const responseJson = pm.response.json();
  const errorMessage = JSON.stringify(responseJson).toLowerCase();
  
  pm.expect(errorMessage).not.to.include('password');
  pm.expect(errorMessage).not.to.include('secret');
});
```

## 🔗 Flujos encadenados (Workflows)

### Flujo: Login → Dashboard

```javascript
// En el test del login exitoso:
pm.test('Workflow: Extrae token para dashboard', function () {
  const responseJson = pm.response.json();
  const token = responseJson.token;
  
  // Guardar el token
  pm.environment.set('auth_token', token);
  
  // Postman ejecutará automáticamente el siguiente request
  // porque usa {{auth_token}} en el header Authorization
  pm.expect(token).to.exist;
});
```

## 📊 Validaciones de rendimiento

```javascript
pm.test('Tiempo de respuesta bajo', function () {
  pm.expect(pm.response.responseTime).to.be.below(200);
});

pm.test('API responde en menos de 1 segundo', function () {
  pm.expect(pm.response.responseTime).to.be.below(1000);
});

pm.test('No hay slow logs', function () {
  if (pm.response.responseTime > 500) {
    console.warn('⚠️ Respuesta lenta:', pm.response.responseTime + 'ms');
  }
  pm.expect(pm.response.responseTime).to.be.below(500);
});
```

## 🛡️ Seguridad en tests

```javascript
// NO guardar contraseñas en variables globales
// ✅ BIEN: Usar solo para un request
pm.environment.set('temp_password', 'password123');
// Luego: pm.environment.unset('temp_password');

// ❌ MAL: No dejar contraseñas en logs
console.log('Password:', password); // ¡PELIGRO!

// ✅ BIEN: Validar que no hay datos sensibles en respuesta
pm.test('Respuesta no contiene contraseñas', function () {
  const response = pm.response.text().toLowerCase();
  pm.expect(response).not.to.include('password');
});

// ✅ BIEN: Usar variables de entorno para credenciales
const username = pm.environment.get('valid_username');
const password = pm.environment.get('valid_password');
```

## 🧬 Condicionales en tests

```javascript
// Ejecutar test solo si una variable existe
if (pm.environment.get('auth_token')) {
  pm.test('Token está disponible', function () {
    pm.expect(pm.environment.get('auth_token')).to.exist;
  });
}

// Validar basado en status
pm.test('Validaciones condicionales', function () {
  const statusCode = pm.response.code;
  
  if (statusCode === 200) {
    pm.expect(pm.response.json()).to.have.property('data');
  } else if (statusCode === 401) {
    pm.expect(pm.response.json()).to.have.property('message');
  }
});
```

## 🎪 Loops en tests

```javascript
// Probar múltiples usuarios
const users = [
  { username: 'edwar', password: 'password' },
  { username: 'lara', password: '123456' }
];

users.forEach(function(user) {
  pm.test('Login exitoso para ' + user.username, function () {
    // Hacer request dinámico
    pm.sendRequest({
      url: 'http://localhost:3000/login',
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      body: { mode: 'raw', raw: JSON.stringify(user) }
    }, function (err, response) {
      pm.expect(response.code).to.equal(200);
    });
  });
});

// Validar array de items
pm.test('Array tiene elementos válidos', function () {
  const items = pm.response.json().items;
  
  items.forEach(function(item) {
    pm.expect(item).to.have.property('id');
    pm.expect(item.id).to.be.a('number').and.above(0);
  });
});
```

## 📈 Reportes y logs

```javascript
// Agregar información a los logs
console.log('📝 Request enviado a:', pm.request.url);
console.log('⏱️ Respuesta en:', pm.response.responseTime + 'ms');

// Información de debugging
pm.test('Debug info', function () {
  console.group('🔍 Información de Debug');
  console.log('URL:', pm.request.url);
  console.log('Método:', pm.request.method);
  console.log('Status:', pm.response.code);
  console.log('Headers:', pm.response.headers.toObject());
  console.groupEnd();
});
```

---

**Referencia oficial:** [Postman Sandbox API](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-api-reference/)
