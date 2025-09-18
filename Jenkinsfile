pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = credentials('dockerhub-username')   // Jenkins credentials ID
        DOCKER_HUB_PASS = credentials('dockerhub-password')   // Jenkins credentials ID
        BACKEND_IMAGE  = "todo-backend"
        FRONTEND_IMAGE = "todo-frontend"
        MONGO_IMAGE    = "mongo:6.0"
        KUBE_NAMESPACE = "default"
    }

    tools {
        jdk "jdk17"   // Name you configured in Jenkins Global Tool Configuration
        maven "Maven3" // Assuming you installed Maven in Jenkins tools
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/MADDALAGAYATHRI/todo-app.git'
            }
        }

        stage('Build Backend with Maven') {
            steps {
                dir('backend') {
                    bat "mvn clean package -DskipTests"
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat "npm install"
                    bat "npm run build"
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    bat "docker build -t %DOCKER_HUB_USER%/${BACKEND_IMAGE}:latest ./backend"
                    bat "docker build -t %DOCKER_HUB_USER%/${FRONTEND_IMAGE}:latest ./frontend"
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    bat "docker login -u %DOCKER_HUB_USER% -p %DOCKER_HUB_PASS%"
                    bat "docker push %DOCKER_HUB_USER%/${BACKEND_IMAGE}:latest"
                    bat "docker push %DOCKER_HUB_USER%/${FRONTEND_IMAGE}:latest"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                bat "kubectl apply -f k8s/"
            }
        }
    }

    post {
        failure {
            echo "Pipeline failed. ❌"
        }
        success {
            echo "Pipeline succeeded. ✅"
        }
    }
}
