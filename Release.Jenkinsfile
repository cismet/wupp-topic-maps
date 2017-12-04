pipeline {

    agent any

    options {
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage('checkout') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: "*/${env.BRANCH_NAME}"]],
                        extensions: [[$class: 'CleanCheckout'],
                            [$class: 'LocalBranch', localBranch: "${env.BRANCH_NAME}"]]])
            }
        }
        stage('build') {
            steps {
                sh 'docker build -t cismet/wupp-geoportal3-powerboats:"${env.BRANCH_NAME}" .'
            }

        }

    }


}
