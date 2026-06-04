pipeline {
    agent {
        label 'built-in'
    }

    environment {
        DOCKER_USER = 'gokumonkey'
        TOKEN = "dckr_pat_vHMjHr6LEPU-5_bZln8EdQf_HzY"
        IMAGE_NAME = 'pc-frontend-service'
    }

    stages {

        stage('Source') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/gokumonkey-36/pc-parts-angular-frontend.git'

                stash name: 'source', includes: '**/*'
            }
        }

        stage('Build image') {
            steps {
                sh '''
                docker build -t ${DOCKER_USER}/${IMAGE_NAME}:7 .
                docker login -u ${DOCKER_USER} -p ${TOKEN}
                docker push ${DOCKER_USER}/${IMAGE_NAME}:7
                '''
            }
        }

        stage('Deploy') {
            agent {
                label 'Server'
            }

            steps {
                unstash 'source'

                sh '''
                kubectl apply -f deployment.yaml
                '''
            }
        }
    }
}
