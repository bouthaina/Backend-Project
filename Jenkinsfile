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

        stage('Check Test Results') {
            steps {
                script {
                    try {
                        def report = readJSON file: 'test-report/test-report.json'
                        if (report.success == false || report.numFailedTests > 0) {
                            error("Tests failed.")
                        }

                        archiveArtifacts artifacts: 'test-report/test-report.json', fingerprint: true
                        slackSend color: 'good', message: "✅ Résultats des Tests : Succès ! Tous les tests sont passés."
                    } catch (Exception e) {
                        slackSend color: 'danger', message: "❌ Résultats des Tests : Échec des tests."
                        throw e
                    }
                }
            }



        }
    }

}






