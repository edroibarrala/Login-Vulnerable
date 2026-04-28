# 🔄 Integración CI/CD con Newman

Guía para integrar automáticamente las pruebas de Postman en pipelines de CI/CD.

## 📋 Opciones disponibles

- [GitHub Actions](#github-actions) ⭐ MÁS POPULAR
- [GitLab CI](#gitlab-ci)
- [Jenkins](#jenkins)
- [Azure DevOps](#azure-devops)
- [CircleCI](#circleci)

---

## GitHub Actions

### Crear archivo de workflow

Crea el archivo: `.github/workflows/api-tests.yml`

```yaml
name: 🧪 API Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    # Ejecutar cada día a las 08:00 UTC
    - cron: '0 8 * * *'

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      # (Opcional) Si tu API depende de una BD
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - name: 📥 Checkout código
        uses: actions/checkout@v3
      
      - name: 📦 Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: 📚 Instalar dependencias backend
        run: |
          cd Login-Vulnerable/backend
          npm install
      
      - name: 🚀 Iniciar servidor
        run: |
          cd Login-Vulnerable/backend
          node index.js &
          echo "Esperando servidor..."
          sleep 5
      
      - name: 🧪 Ejecutar pruebas con Newman
        run: |
          cd Login-Vulnerable/backend
          npm run test:ci
      
      - name: 📊 Subir reportes como artifact
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: Login-Vulnerable/backend/test-results/
          retention-days: 30
      
      - name: 📈 Publicar reporte en PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const data = JSON.parse(fs.readFileSync('Login-Vulnerable/backend/test-results/newman-report.json', 'utf8'));
            
            const stats = data.run.stats;
            const comment = `## 🧪 Resultados de Pruebas\n
- ✅ Requests: ${stats.requests.total}
- ✅ Tests: ${stats.tests.total}
- ❌ Fallos: ${stats.failures ? stats.failures.length : 0}
- ⏱️ Duración: ${Math.round(data.run.timings.completed / 1000)}s

[📊 Ver reporte completo](https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }})`;
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

### Resultado esperado

En cada PR verás:
```
✅ API Tests passed

🧪 Resultados de Pruebas
- ✅ Requests: 5
- ✅ Tests: 15
- ❌ Fallos: 0
- ⏱️ Duración: 2s
```

---

## GitLab CI

Crea el archivo: `.gitlab-ci.yml`

```yaml
stages:
  - test

api_tests:
  stage: test
  image: node:18
  
  services:
    - postgres:14
  
  variables:
    POSTGRES_DB: test_db
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres
  
  script:
    # Instalar dependencias
    - cd Login-Vulnerable/backend
    - npm install
    
    # Iniciar servidor en background
    - node index.js > server.log 2>&1 &
    - sleep 5
    
    # Ejecutar pruebas
    - npm run test:ci
  
  artifacts:
    paths:
      - Login-Vulnerable/backend/test-results/
    reports:
      junit: Login-Vulnerable/backend/test-results/newman-report.json
    expire_in: 30 days
  
  allow_failure: false

# Ejecutar pruebas en horario diario
schedule_tests:
  stage: test
  image: node:18
  script:
    - cd Login-Vulnerable/backend
    - npm install
    - npm run test:ci
  only:
    - schedules
```

---

## Jenkins

### Crear Pipeline

Crea el archivo: `Jenkinsfile`

```groovy
pipeline {
    agent any
    
    environment {
        NODE_ENV = 'test'
        API_URL = 'http://localhost:3000'
    }
    
    stages {
        stage('Setup') {
            steps {
                echo '📦 Instalando dependencias...'
                sh '''
                    cd Login-Vulnerable/backend
                    npm install
                '''
            }
        }
        
        stage('Start Server') {
            steps {
                echo '🚀 Iniciando servidor...'
                sh '''
                    cd Login-Vulnerable/backend
                    timeout 30 bash -c 'node index.js > server.log 2>&1 &'
                    sleep 5
                    curl -f http://localhost:3000 || exit 1
                '''
            }
        }
        
        stage('Test') {
            steps {
                echo '🧪 Ejecutando pruebas...'
                sh '''
                    cd Login-Vulnerable/backend
                    npm run test:ci
                '''
            }
        }
        
        stage('Report') {
            steps {
                echo '📊 Generando reportes...'
                publishHTML([
                    reportDir: 'Login-Vulnerable/backend/test-results',
                    reportFiles: 'newman-report.html',
                    reportName: 'Newman Report'
                ])
                
                junit 'Login-Vulnerable/backend/test-results/newman-report.json'
            }
        }
    }
    
    post {
        always {
            echo '🧹 Limpiando...'
            sh 'pkill -f "node index.js" || true'
            
            archiveArtifacts artifacts: 'Login-Vulnerable/backend/test-results/**', 
                             allowEmptyArchive: true
        }
        
        failure {
            echo '❌ Las pruebas fallaron'
            emailext(
                subject: "API Tests Failed in ${env.JOB_NAME}",
                body: "Build log: ${env.BUILD_URL}",
                to: 'team@example.com'
            )
        }
        
        success {
            echo '✅ Todas las pruebas pasaron'
        }
    }
}
```

---

## Azure DevOps

Crea el archivo: `azure-pipelines.yml`

```yaml
trigger:
  - main
  - develop

pr:
  - main

pool:
  vmImage: 'ubuntu-latest'

variables:
  nodeVersion: '18.x'
  NODE_ENV: 'test'

stages:
  - stage: Test
    displayName: 'Run API Tests'
    jobs:
      - job: APITests
        displayName: 'Newman Tests'
        
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: $(nodeVersion)
            displayName: 'Install Node.js'
          
          - script: |
              cd Login-Vulnerable/backend
              npm install
            displayName: 'Install dependencies'
          
          - script: |
              cd Login-Vulnerable/backend
              node index.js > server.log 2>&1 &
              sleep 5
            displayName: 'Start API server'
          
          - script: |
              cd Login-Vulnerable/backend
              npm run test:ci
            displayName: 'Run tests'
            continueOnError: false
          
          - task: PublishTestResults@2
            condition: always()
            inputs:
              testResultsFormat: 'JUnit'
              testResultsFiles: 'Login-Vulnerable/backend/test-results/newman-report.json'
              searchFolder: '$(System.DefaultWorkingDirectory)'
            displayName: 'Publish test results'
          
          - task: PublishBuildArtifacts@1
            condition: always()
            inputs:
              PathtoPublish: 'Login-Vulnerable/backend/test-results'
              ArtifactName: 'test-results'
              publishLocation: 'Container'
            displayName: 'Publish reports'
```

---

## CircleCI

Crea el archivo: `.circleci/config.yml`

```yaml
version: 2.1

executors:
  node:
    docker:
      - image: cimg/node:18.0
      - image: cimg/postgres:14.0
        environment:
          POSTGRES_DB: test_db
          POSTGRES_PASSWORD: postgres

jobs:
  test:
    executor: node
    
    steps:
      - checkout
      
      - run:
          name: Install dependencies
          command: |
            cd Login-Vulnerable/backend
            npm install
      
      - run:
          name: Wait for PostgreSQL
          command: |
            dockerize -wait tcp://localhost:5432 -timeout 1m
      
      - run:
          name: Start API server
          command: |
            cd Login-Vulnerable/backend
            node index.js
          background: true
      
      - run:
          name: Wait for API server
          command: |
            sleep 5
            curl -f http://localhost:3000 || exit 1
      
      - run:
          name: Run tests
          command: |
            cd Login-Vulnerable/backend
            npm run test:ci
      
      - store_test_results:
          path: Login-Vulnerable/backend/test-results
      
      - store_artifacts:
          path: Login-Vulnerable/backend/test-results
          destination: test-results

workflows:
  version: 2
  
  test-on-push:
    jobs:
      - test:
          filters:
            branches:
              only:
                - main
                - develop
  
  daily-tests:
    triggers:
      - schedule:
          cron: "0 8 * * *"
          filters:
            branches:
              only: main
    jobs:
      - test
```

---

## 🔐 Variables de ambiente sensibles

Para credenciales seguras en CI/CD:

### GitHub Actions

```yaml
steps:
  - name: 🧪 Pruebas con credenciales
    env:
      DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
      API_KEY: ${{ secrets.API_KEY }}
    run: npm run test:ci
```

Ir a: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### GitLab CI

```yaml
api_tests:
  script:
    - echo "Using $DB_PASSWORD"
  variables:
    DB_PASSWORD: $DB_PASSWORD  # Definida en CI/CD Variables
```

Ir a: **Settings** → **CI/CD** → **Variables**

### Jenkins

En la configuración del job:
1. **Build Environment**
2. **Use secret text(s) or files**
3. Agregar secretos

```groovy
withCredentials([
    string(credentialsId: 'db-password', variable: 'DB_PASSWORD'),
    string(credentialsId: 'api-key', variable: 'API_KEY')
]) {
    sh './run-tests.sh'
}
```

---

## 📊 Monitorear fallos

### Notificaciones por correo

```yaml
# GitHub Actions
- name: Notificar en caso de fallos
  if: failure()
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.EMAIL_USER }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: ❌ Fallos en pruebas API
    body: |
      Las pruebas fallaron en ${{ github.ref }}
      
      Mira los detalles aquí:
      ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}
    to: team@example.com
```

### Slack notifications

```yaml
# GitHub Actions
- name: 📢 Notificar a Slack
  if: always()
  uses: slackapi/slack-github-action@v1.24.0
  with:
    payload: |
      {
        "text": "API Tests ${{ job.status }}",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*API Tests*: ${{ job.status }}\n<${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|Ver detalles>"
            }
          }
        ]
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 🎯 Mejores prácticas

1. ✅ Ejecutar tests en cada push
2. ✅ Bloquear merge si tests fallan
3. ✅ Generar reportes automáticos
4. ✅ Guardar reportes como artifacts
5. ✅ Notificar al equipo en fallos
6. ✅ Ejecutar tests periódicamente (programado)
7. ✅ Usar variables seguras para credenciales
8. ✅ Validar performance en cada build

---

**¡Tu CI/CD con Postman está lista! 🚀**
