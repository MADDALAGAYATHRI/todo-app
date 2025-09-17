pipeline {
  agent any
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Build') {
      steps { dir('backend'){ sh 'mvn -B -DskipTests package' } }
    }
    stage('Docker Build & Push') {
      steps {
        sh 'docker build -t your-dockerhub-username/todo-backend:latest backend'
        sh 'docker build -t your-dockerhub-username/todo-frontend:latest frontend'
        // Push commands (requires docker login with credentials)
        // sh 'docker push your-dockerhub-username/todo-backend:latest'
        // sh 'docker push your-dockerhub-username/todo-frontend:latest'
      }
    }
    stage('Deploy to K8s') {
      steps {
        // assumes kubectl configured on Jenkins agent
        sh 'kubectl apply -f k8s/'
      }
    }
  }
}
