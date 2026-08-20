pipeline {
    agent any

    triggers {
        githubPush()
    }

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
                anyOf {
                    branch 'main'
                    expression { env.BRANCH_NAME == 'main' }
                    expression { env.GIT_BRANCH == 'main' }
                    expression { env.GIT_BRANCH == 'origin/main' }
                }
            }
            steps {
                echo '===> CI checks passed successfully! Triggering production deployments...'
                script {
                    // 1. Deploy Backend to Render
                    def renderCredentialsBound = false
                    try {
                        withCredentials([string(credentialsId: 'RENDER_DEPLOY_HOOK', variable: 'RENDER_HOOK')]) {
                            renderCredentialsBound = true
                            echo '===> Triggering Render Backend Deployment...'
                            sh 'curl -s -f -X POST "$RENDER_HOOK"'
                            echo '===> Render deployment triggered successfully!'
                        }
                    } catch (Exception e) {
                        if (!renderCredentialsBound) {
                            echo 'ℹ️ RENDER_DEPLOY_HOOK not found in Jenkins Credentials. Skipping Render deployment.'
                        } else {
                            echo "❌ Render deployment command failed: ${e.message}"
                            currentBuild.result = 'FAILURE'
                            error("Render deployment failed: ${e.message}")
                        }
                    }

                    // 2. Deploy Frontend to Vercel
                    def vercelTokenBound = false
                    try {
                        withCredentials([string(credentialsId: 'VERCEL_TOKEN', variable: 'VERCEL_AUTH_TOKEN')]) {
                            vercelTokenBound = true
                            echo '===> Deploying frontend directly to Vercel...'
                            dir('frontend') {
                                sh 'npx --yes vercel --prod --token "$VERCEL_AUTH_TOKEN" --yes'
                            }
                            echo '===> Vercel deployment completed successfully!'
                        }
                    } catch (Exception e) {
                        if (vercelTokenBound) {
                            echo "❌ Vercel token-based deployment failed: ${e.message}"
                            currentBuild.result = 'FAILURE'
                            error("Vercel token deployment failed: ${e.message}")
                        } else {
                            // Fallback to deploy hook
                            def vercelHookBound = false
                            try {
                                withCredentials([string(credentialsId: 'VERCEL_DEPLOY_HOOK', variable: 'VERCEL_HOOK')]) {
                                    vercelHookBound = true
                                    echo '===> Triggering Vercel Frontend Deployment via Deploy Hook...'
                                    sh 'curl -s -f -X POST "$VERCEL_HOOK"'
                                    echo '===> Vercel deploy hook triggered!'
                                }
                            } catch (Exception e2) {
                                if (vercelHookBound) {
                                    echo "❌ Vercel deploy hook command failed: ${e2.message}"
                                    currentBuild.result = 'FAILURE'
                                    error("Vercel deploy hook failed: ${e2.message}")
                                } else {
                                    echo 'ℹ️ Neither VERCEL_TOKEN nor VERCEL_DEPLOY_HOOK found in Jenkins. Skipping Vercel deployment.'
                                }
                            }
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
