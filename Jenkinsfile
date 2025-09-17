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

        stage('Build Backend with Maven') {
            steps {
                dir('backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    // Set Minikube Docker environment
                    sh 'eval $(minikube -p minikube docker-env)'

                    // Build backend image
                    sh "docker build -t ${DOCKER_HUB_USER}/${BACKEND_IMAGE}:latest ./backend"
                    
                    // Build frontend image
                    sh "docker build -t ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:latest ./frontend"
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    sh "docker login -u ${DOCKER_HUB_USER} -p ${DOCKER_HUB_PASSWORD}"
                    sh "docker push ${DOCKER_HUB_USER}/${BACKEND_IMAGE}:latest"
                    sh "docker push ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:latest"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Apply Kubernetes manifests
                    sh 'kubectl apply -f k8s/mongo-deployment.yaml'
                    sh 'kubectl apply -f k8s/backend-deployment.yaml'
                    sh 'kubectl apply -f k8s/frontend-deployment.yaml'
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
