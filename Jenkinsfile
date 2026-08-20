pipeline {
    agent any

    tools {
        maven 'Maven-3.9'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Parallel Build & Test') {
            parallel {
                stage('Backend CI (Spring Boot)') {
                    steps {
                        dir('backend') {
                            echo '===> Compiling, testing, and packaging Spring Boot Backend...'
                            sh 'mvn clean package'
                        }
                    }
                }

                stage('Frontend CI (React / Vite)') {
                    steps {
                        dir('frontend') {
                            echo '===> Installing dependencies and building React frontend...'
                            sh 'npm ci'
                            sh 'npm run build'
                        }
                    }
                }
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                echo '===> CI checks passed successfully! Checking for deployment hooks...'
                script {
                    // Trigger Render deploy hook if credential exists
                    try {
                        withCredentials([string(credentialsId: 'RENDER_DEPLOY_HOOK', variable: 'RENDER_HOOK')]) {
                            echo '===> Triggering Render Backend Deployment...'
                            sh 'curl -s -X POST "$RENDER_HOOK"'
                        }
                    } catch (Exception e) {
                        echo 'ℹ️ RENDER_DEPLOY_HOOK not configured in Jenkins Credentials. Skipping Render deployment.'
                    }

                    // Trigger Vercel deploy hook if credential exists
                    try {
                        withCredentials([string(credentialsId: 'VERCEL_DEPLOY_HOOK', variable: 'VERCEL_HOOK')]) {
                            echo '===> Triggering Vercel Frontend Deployment...'
                            sh 'curl -s -X POST "$VERCEL_HOOK"'
                        }
                    } catch (Exception e) {
                        echo 'ℹ️ VERCEL_DEPLOY_HOOK not configured in Jenkins Credentials. Skipping Vercel deployment.'
                    }
                }
                echo '===> Deployment stage completed!'
            }
        }
    }

    post {
        success {
            echo '🎉 Pipeline completed successfully! Application tested and ready.'
        }
        failure {
            echo '❌ Pipeline failed! Deployment was aborted.'
        }
    }
}
