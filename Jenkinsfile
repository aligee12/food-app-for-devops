pipeline {
    agent any

    stages {
        stage('Clone Code') {
            steps {
                git branch: 'main', // <-- Specify the branch here
                    url: 'https://github.com/aligee12/food-app-for-devops.git'
                // Remove credentialsId parameter if you don't want to provide credentials
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