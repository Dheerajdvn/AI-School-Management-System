pipeline {
    agent any

    tools {
        maven 'Maven-3.9'
        nodejs 'NodeJS-20'
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
                    // 1. Deploy Backend to Render
                    try {
                        withCredentials([string(credentialsId: 'RENDER_DEPLOY_HOOK', variable: 'RENDER_HOOK')]) {
                            echo '===> Triggering Render Backend Deployment...'
                            sh 'curl -s -X POST "$RENDER_HOOK"'
                            echo '===> Render deployment triggered successfully!'
                        }
                    } catch (Exception e) {
                        echo 'ℹ️ RENDER_DEPLOY_HOOK not found in Jenkins Credentials. Skipping Render deployment.'
                    }

                    // 2. Deploy Frontend to Vercel
                    try {
                        withCredentials([string(credentialsId: 'VERCEL_TOKEN', variable: 'VERCEL_AUTH_TOKEN')]) {
                            echo '===> Deploying frontend directly to Vercel...'
                            dir('frontend') {
                                sh 'npx --yes vercel --prod --token "$VERCEL_AUTH_TOKEN" --yes'
                            }
                            echo '===> Vercel deployment completed successfully!'
                        }
                    } catch (Exception e) {
                        try {
                            withCredentials([string(credentialsId: 'VERCEL_DEPLOY_HOOK', variable: 'VERCEL_HOOK')]) {
                                echo '===> Triggering Vercel Frontend Deployment via Deploy Hook...'
                                sh 'curl -s -X POST "$VERCEL_HOOK"'
                                echo '===> Vercel deploy hook triggered!'
                            }
                        } catch (Exception e2) {
                            echo 'ℹ️ Neither VERCEL_TOKEN nor VERCEL_DEPLOY_HOOK found in Jenkins. Skipping Vercel deployment.'
                        }
                    }
                }
                echo '===> Production deployment stage completed!'
            }
        }
    }

    post {
        success {
            echo '🎉 Pipeline completed successfully! Backend & Frontend tested, built, and deployed to Production.'
        }
        failure {
            echo '❌ Pipeline failed! Deployment was aborted to protect production.'
        }
    }
}
