pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'maddalagayathri'   // Your DockerHub username
        BACKEND_IMAGE  = 'todo-backend'
        FRONTEND_IMAGE = 'todo-frontend'
        MONGO_IMAGE    = 'mongo:6.0'
        KUBE_NAMESPACE = 'default'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/MADDALAGAYATHRI/todo-app.git'
            }
        }

        stage('Check Java & Maven') {
            steps {
                bat 'java -version'
                bat 'mvn -v'
            }
        }

        stage('Build Backend with Maven') {
            steps {
                dir('backend') {
                    bat 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    // Build backend image
                    bat "docker build -t %DOCKER_HUB_USER%/%BACKEND_IMAGE%:latest ./backend"
                    
                    // Build frontend image
                    bat "docker build -t %DOCKER_HUB_USER%/%FRONTEND_IMAGE%:latest ./frontend"
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', usernameVariable: 'DOCKER_HUB_USER', passwordVariable: 'DOCKER_HUB_PASSWORD')]) {
                        bat "docker login -u %DOCKER_HUB_USER% -p %DOCKER_HUB_PASSWORD%"
                        bat "docker push %DOCKER_HUB_USER%/%BACKEND_IMAGE%:latest"
                        bat "docker push %DOCKER_HUB_USER%/%FRONTEND_IMAGE%:latest"
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Apply Kubernetes manifests
                    bat "kubectl apply -f k8s/mongo-deployment.yaml"
                    bat "kubectl apply -f k8s/backend-deployment.yaml"
                    bat "kubectl apply -f k8s/frontend-deployment.yaml"
                }
            }
        }
    }

    post {
        success {
            echo "Deployment completed successfully! 🎉"
        }
        failure {
            echo "Pipeline failed. Check logs. ❌"
        }
    }
}
