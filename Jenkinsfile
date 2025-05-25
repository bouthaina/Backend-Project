pipeline {

    agent any

    environment {
        DOCKERHUB_CREDENTIALS_ID = 'DOCKERHUB_CREDS'
        DOCKERHUB_USERNAME = 'bouthainabakouch'
        BACKEND_IMAGE_NAME = "${env.DOCKERHUB_USERNAME}/backendapi-prod"
        SLACK_WEBHOOK_URL = credentials('SLACK_WEBHOOK_URL')

    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test-Bakend') {
            steps {
                script {
                    bat 'npm install'
                    bat """
                        if exist test-report rmdir /s /q test-report
                        mkdir test-report
                        npm run test -- --json --outputFile=test-report\\test-report.json
                        """
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                bat "docker build -t ${env.BACKEND_IMAGE_NAME}:latest ."
            }
        }
        
        stage('Push Docker Image') {
            steps {
                script {
                    try {
                        withCredentials([usernamePassword(credentialsId: env.DOCKERHUB_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                            bat """
                                echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                                docker push ${env.BACKEND_IMAGE_NAME}:latest
                            """
                        }
                        slackSend color: 'good', message: "✅ Docker : Image successfully pushed to Docker Hub."
                    } catch (Exception e) {
                        slackSend color: 'danger', message: "❌ Docker : Error to push image to Docker Hub "
                        throw e
                    }
                }
            }
        }

}


        
}

        