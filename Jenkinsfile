pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS_ID = 'DOCKERHUB_CREDS'
        DOCKERHUB_USERNAME = 'bouthainabakouch'
        BACKEND_IMAGE_NAME = "${env.DOCKERHUB_USERNAME}/backendapi-prod"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test-Backend') {
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
            post {
                success {
                    slackSend(
                        color: 'good',
                        message: "✅ Tests Backend: Exécutés avec succès",
                        credentialsId: 'SLACK_WEBHOOK_URL'
                    )
                }
                failure {
                    slackSend(
                        color: 'danger',
                        message: "❌ Tests Backend: Échec des tests",
                        credentialsId: 'SLACK_WEBHOOK_URL'
                    )
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
                    withCredentials([usernamePassword(credentialsId: env.DOCKERHUB_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        bat """
                            echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                            docker push ${env.BACKEND_IMAGE_NAME}:latest
                        """
                    }
                }
            }
            post {
                success {
                    slackSend(
                        color: 'good',
                        message: "✅ Docker: Image poussée avec succès sur Docker Hub",
                        credentialsId: 'SLACK_WEBHOOK_URL'
                    )
                }
                failure {
                    slackSend(
                        color: 'danger',
                        message: "❌ Docker: Échec du push de l'image sur Docker Hub",
                        credentialsId: 'SLACK_WEBHOOK_URL'
                    )
                }
            }
        }
    }

    post {
        failure {
            slackSend(
                color: 'danger',
                message: "❌ Pipeline FAILED: ${currentBuild.fullDisplayName}",
                credentialsId: 'SLACK_WEBHOOK_URL'
            )
        }
        success {
            slackSend(
                color: 'good',
                message: "✅ Pipeline SUCCESS: ${currentBuild.fullDisplayName}",
                credentialsId: 'SLACK_WEBHOOK_URL'
            )
        }
    }
}