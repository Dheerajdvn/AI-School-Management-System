pipeline {
    agent any

    tools {
        maven 'Maven-3.9'
    }

    environment {
        RENDER_HOOK = credentials('RENDER_DEPLOY_HOOK')
        VERCEL_HOOK = credentials('VERCEL_DEPLOY_HOOK')
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
                echo '===> CI checks passed successfully! Triggering production deployments...'
                script {
                    if (env.RENDER_HOOK) {
                        echo '===> Triggering Render Backend Deployment...'
                        sh 'curl -s -X POST "$RENDER_HOOK"'
                    } else {
                        echo '===> RENDER_DEPLOY_HOOK not configured in Jenkins Credentials, skipping Render trigger.'
                    }

                    if (env.VERCEL_HOOK) {
                        echo '===> Triggering Vercel Frontend Deployment...'
                        sh 'curl -s -X POST "$VERCEL_HOOK"'
                    } else {
                        echo '===> VERCEL_DEPLOY_HOOK not configured in Jenkins Credentials, skipping Vercel trigger.'
                    }
                }
                echo '===> Deployment phase completed!'
            }
        }
    }

    post {
        success {
            echo '🎉 Pipeline completed successfully! Application tested and deployed.'
        }
        failure {
            echo '❌ Pipeline failed! Deployment was aborted to protect production.'
        }
    }
}
