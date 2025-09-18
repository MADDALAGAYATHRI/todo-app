pipeline {
    agent any

    tools {
        jdk "jdk17"
        maven "Maven3"
        dockerTool "docker"
    }

    environment {
        DOCKER_HUB_USER = 'maddalagayathri'
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

        stage('Build Backend with Maven') {
            steps {
                dir('backend') {
                    bat 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                bat "docker build -t %DOCKER_HUB_USER%/%BACKEND_IMAGE%:latest ./backend"
                bat "docker build -t %DOCKER_HUB_USER%/%FRONTEND_IMAGE%:latest ./frontend"
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-username',
                                                 usernameVariable: 'DOCKER_USER',
                                                 passwordVariable: 'DOCKER_PASS')]) {
                    bat "docker login -u %DOCKER_USER% -p %DOCKER_PASS%"
                    bat "docker push %DOCKER_HUB_USER%/%BACKEND_IMAGE%:latest"
                    bat "docker push %DOCKER_HUB_USER%/%FRONTEND_IMAGE%:latest"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                bat 'kubectl apply -f k8s/mongo-deployment.yaml'
                bat 'kubectl apply -f k8s/backend-deployment.yaml'
                bat 'kubectl apply -f k8s/frontend-deployment.yaml'
            }
        }
    }

    post {
        success {
            echo "Deployment completed successfully! 🎉"
        }
        failure {
            echo "Pipeline failed. ❌"
        }
    }
}
