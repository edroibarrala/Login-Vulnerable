# 🎨 Guía de Personalización: Crear tus propias colecciones

Aprende a crear, modificar y mantener colecciones de Postman personalizadas.

## 📁 Estructura de una colección

```json
{
  "info": {
    "_postman_id": "unique-id",
    "name": "Mi API",
    "description": "Descripción opcional",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Carpeta (Grupo de requests)",
      "item": [
        {
          "name": "Mi primer request",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "https://api.ejemplo.com/users",
              "protocol": "https",
              "host": ["api", "ejemplo", "com"],
              "path": ["users"]
            }
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
      ]
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "https://api.ejemplo.com"
    }
  ]
}
```

## 🆕 Crear nueva colección desde cero

### Opción 1: Manualmente en Postman

1. Abre Postman
2. Click en **"New"** → **"Collection"**
3. Dale un nombre
4. Agrega requests
5. Exporta haciendo clic derecho → **"Export"**

### Opción 2: Crear archivo JSON

```json
{
  "info": {
    "_postman_id": "prueba-api-12345",
    "name": "Prueba API",
    "description": "Mi primera colección personalizada",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Users",
      "item": [
        {
          "name": "GET todas los usuarios",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Accept",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/users",
              "host": ["{{base_url}}"],
              "path": ["users"]
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status 200 OK', function() {",
                  "  pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test('Response es array', function() {",
                  "  pm.expect(pm.response.json()).to.be.an('array');",
                  "});"
                ]
              }
            }
          ]
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "https://jsonplaceholder.typicode.com"
    }
  ]
}
```

## ➕ Agregar requests a colección existente

### Agregar carpeta

```json
{
  "name": "Products",
  "item": [
    // Aquí irán los requests
  ]
}
```

### Agregar GET request

```json
{
  "name": "GET Producto por ID",
  "request": {
    "method": "GET",
    "header": [],
    "url": {
      "raw": "{{base_url}}/products/{{product_id}}",
      "host": ["{{base_url}}"],
      "path": ["products", "{{product_id}}"]
    }
  },
  "event": [
    {
      "listen": "test",
      "script": {
        "exec": [
          "pm.test('Retorna producto', function() {",
          "  const response = pm.response.json();",
          "  pm.expect(response).to.have.all.keys('id', 'name', 'price');",
          "});"
        ]
      }
    }
  ]
}
```

### Agregar POST request

```json
{
  "name": "POST Crear Usuario",
  "request": {
    "method": "POST",
    "header": [
      {
        "key": "Content-Type",
        "value": "application/json"
      }
    ],
    "body": {
      "mode": "raw",
      "raw": "{\\n  \\\"username\\\": \\\"nuevo_usuario\\\",\\n  \\\"email\\\": \\\"user@example.com\\\",\\n  \\\"password\\\": \\\"secure_password\\\"\\n}"
    },
    "url": {
      "raw": "{{base_url}}/users",
      "host": ["{{base_url}}"],
      "path": ["users"]
    }
  },
  "event": [
    {
      "listen": "test",
      "script": {
        "exec": [
          "pm.test('Status 201 Created', function() {",
          "  pm.response.to.have.status(201);",
          "});",
          "",
          "pm.test('Guardar ID del usuario', function() {",
          "  const response = pm.response.json();",
          "  pm.environment.set('user_id', response.id);",
          "});"
        ]
      }
    }
  ]
}
```

### Agregar PUT request

```json
{
  "name": "PUT Actualizar Usuario",
  "request": {
    "method": "PUT",
    "header": [
      {
        "key": "Content-Type",
        "value": "application/json"
      },
      {
        "key": "Authorization",
        "value": "Bearer {{auth_token}}"
      }
    ],
    "body": {
      "mode": "raw",
      "raw": "{\\n  \\\"email\\\": \\\"nuevo_email@example.com\\\",\\n  \\\"name\\\": \\\"Nombre Actualizado\\\"\\n}"
    },
    "url": {
      "raw": "{{base_url}}/users/{{user_id}}",
      "host": ["{{base_url}}"],
      "path": ["users", "{{user_id}}"]
    }
  },
  "event": [
    {
      "listen": "test",
      "script": {
        "exec": [
          "pm.test('Actualización exitosa', function() {",
          "  pm.response.to.have.status(200);",
          "});"
        ]
      }
    }
  ]
}
```

### Agregar DELETE request

```json
{
  "name": "DELETE Usuario",
  "request": {
    "method": "DELETE",
    "header": [
      {
        "key": "Authorization",
        "value": "Bearer {{auth_token}}"
      }
    ],
    "url": {
      "raw": "{{base_url}}/users/{{user_id}}",
      "host": ["{{base_url}}"],
      "path": ["users", "{{user_id}}"]
    }
  },
  "event": [
    {
      "listen": "test",
      "script": {
        "exec": [
          "pm.test('Eliminación exitosa', function() {",
          "  pm.response.to.have.status(204);",
          "});"
        ]
      }
    }
  ]
}
```

## 🔄 Flujos entre requests (Workflows)

### Ejemplo: Crear usuario → Obtener usuario → Actualizar → Eliminar

```json
[
  {
    "name": "1. POST Crear usuario",
    "request": {
      "method": "POST",
      "body": {
        "mode": "raw",
        "raw": "{\\n  \\\"username\\\": \\\"test_user\\\"\\n}"
      },
      "url": {
        "raw": "{{base_url}}/users",
        "host": ["{{base_url}}"],
        "path": ["users"]
      }
    },
    "event": [
      {
        "listen": "test",
        "script": {
          "exec": [
            "pm.test('Usuario creado', function() {",
            "  const response = pm.response.json();",
            "  pm.environment.set('user_id', response.id);",
            "});"
          ]
        }
      }
    ]
  },
  {
    "name": "2. GET Obtener usuario",
    "request": {
      "method": "GET",
      "url": {
        "raw": "{{base_url}}/users/{{user_id}}",
        "host": ["{{base_url}}"],
        "path": ["users", "{{user_id}}"]
      }
    },
    "event": [
      {
        "listen": "test",
        "script": {
          "exec": [
            "pm.test('Usuario encontrado', function() {",
            "  pm.response.to.have.status(200);",
            "});"
          ]
        }
      }
    ]
  },
  {
    "name": "3. PUT Actualizar usuario",
    "request": {
      "method": "PUT",
      "body": {
        "mode": "raw",
        "raw": "{\\n  \\\"username\\\": \\\"updated_user\\\"\\n}"
      },
      "url": {
        "raw": "{{base_url}}/users/{{user_id}}",
        "host": ["{{base_url}}"],
        "path": ["users", "{{user_id}}"]
      }
    }
  },
  {
    "name": "4. DELETE Eliminar usuario",
    "request": {
      "method": "DELETE",
      "url": {
        "raw": "{{base_url}}/users/{{user_id}}",
        "host": ["{{base_url}}"],
        "path": ["users", "{{user_id}}"]
      }
    }
  }
]
```

## 📝 Variables y environments

### Crear environment personalizado

```json
{
  "name": "Desarrollo",
  "values": [
    {
      "key": "base_url",
      "value": "http://localhost:3000",
      "enabled": true
    },
    {
      "key": "api_key",
      "value": "dev-key-12345",
      "enabled": true
    },
    {
      "key": "timeout",
      "value": "5000",
      "enabled": true
    }
  ]
}
```

```json
{
  "name": "Producción",
  "values": [
    {
      "key": "base_url",
      "value": "https://api.produccion.com",
      "enabled": true
    },
    {
      "key": "api_key",
      "value": "{{SECRET_PROD_KEY}}",
      "enabled": true
    },
    {
      "key": "timeout",
      "value": "10000",
      "enabled": true
    }
  ]
}
```

## 🎯 Ejemplo completo: REST API CRUD

```json
{
  "info": {
    "name": "Blog API - CRUD Completo",
    "description": "Colección completa de pruebas CRUD",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Blog Posts",
      "item": [
        {
          "name": "CREATE Post",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\\n  \\\"title\\\": \\\"Mi primer post\\\",\\n  \\\"content\\\": \\\"Contenido del post\\\",\\n  \\\"author\\\": \\\"John Doe\\\"\\n}"
            },
            "url": {"raw": "{{base_url}}/posts", "host": ["{{base_url}}"], "path": ["posts"]}
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Post creado', function() {",
                  "  pm.response.to.have.status(201);",
                  "  const response = pm.response.json();",
                  "  pm.environment.set('post_id', response.id);",
                  "});"
                ]
              }
            }
          ]
        },
        {
          "name": "READ Posts",
          "request": {
            "method": "GET",
            "url": {"raw": "{{base_url}}/posts", "host": ["{{base_url}}"], "path": ["posts"]}
          }
        },
        {
          "name": "READ Post por ID",
          "request": {
            "method": "GET",
            "url": {"raw": "{{base_url}}/posts/{{post_id}}", "host": ["{{base_url}}"], "path": ["posts", "{{post_id}}"]}
          }
        },
        {
          "name": "UPDATE Post",
          "request": {
            "method": "PUT",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\\n  \\\"title\\\": \\\"Post actualizado\\\",\\n  \\\"content\\\": \\\"Contenido actualizado\\\"\\n}"
            },
            "url": {"raw": "{{base_url}}/posts/{{post_id}}", "host": ["{{base_url}}"], "path": ["posts", "{{post_id}}"]}
          }
        },
        {
          "name": "DELETE Post",
          "request": {
            "method": "DELETE",
            "url": {"raw": "{{base_url}}/posts/{{post_id}}", "host": ["{{base_url}}"], "path": ["posts", "{{post_id}}"]}
          }
        }
      ]
    }
  ],
  "variable": [
    {"key": "base_url", "value": "https://jsonplaceholder.typicode.com"}
  ]
}
```

## 🧹 Mejores prácticas

✅ **Nombres descriptivos**
```
✓ POST /users - Crear nuevo usuario
✗ POST request
```

✅ **Organiza en carpetas**
```json
{
  "name": "Users",
  "item": [...]
}
{
  "name": "Products",
  "item": [...]
}
```

✅ **Usa variables**
```
✓ {{base_url}}/users
✗ http://localhost:3000/users
```

✅ **Documenta con comentarios**
```javascript
// Pre-request: Validar que tenemos token
// Test: Verificar estructura de respuesta
```

✅ **Tests reutilizables**
```javascript
// ✓ Crear snippets de tests comunes
// ✗ Copiar-pegar el mismo test múltiples veces
```

---

**¡Ahora puedes crear colecciones personalizadas! 🎨**
