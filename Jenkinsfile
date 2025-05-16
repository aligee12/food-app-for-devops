pipeline {
    agent any

    stages {
        stage('Clone Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/aligee12/food-app-for-devops.git'
                
            }
        }

        stage('Build Containers') {
            steps {
                script {
                    sh 'docker-compose -p foodapp-ci -f docker-compose.yml up -d --build'
                }
            }
        }
    }
}