pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Install') {
            steps {
                dir('backend') {
                    bat 'npm install'
                }
            }
        }

        stage('Frontend Install') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'

                    withSonarQubeEnv('SonarQube') {
                        withEnv([
                    "JAVA_HOME=C:\\Program Files\\Java\\jdk-26.0.1",
                    "PATH+JAVA=C:\\Program Files\\Java\\jdk-26.0.1\\bin"
                ])

                        
                        bat "${scannerHome}\\bin\\sonar-scanner.bat"
                    }
                }
            }
        }
    }
}
