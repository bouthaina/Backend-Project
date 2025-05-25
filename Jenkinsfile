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
                echo 'Push des images vers Docker Hub...'
                withCredentials([usernamePassword(
                    credentialsId: env.DOCKERHUB_CREDENTIALS_ID,
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat 'echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin'
                    bat "docker push ${env.BACKEND_IMAGE_NAME}:latest"
                }

            }
            post {
                always {
                    bat 'docker logout'
                }
                success {
                    script {
                        withCredentials([string(credentialsId: 'SLACK_WEBHOOK_URL', variable: 'SLACK_WEBHOOK')]) {
                            writeFile file: 'slack-docker-success.json', text: """
                            {
                                "text": ":whale: *Image successfully pushed to Docker Hub.*\n<${env.BUILD_URL}|See build>"
                            }
                            """
                            bat "curl -X POST -H \"Content-type: application/json\" --data @slack-docker-success.json %SLACK_WEBHOOK%"
                        }
                    }
                }
                failure {
                    script {
                        withCredentials([string(credentialsId: 'SLACK_WEBHOOK_URL', variable: 'SLACK_WEBHOOK')]) {
                            writeFile file: 'slack-docker-failure.json', text: """
                            {
                                "text": ":x: *Error to push image to Docker Hub !*\n<${env.BUILD_URL}|See build>"
                            }
                            """
                            bat "curl -X POST -H \"Content-type: application/json\" --data @slack-docker-failure.json %SLACK_WEBHOOK%"
                        }
                    }
                }
            }
        }
    }
}