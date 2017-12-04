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
		bash 'echo ${env.BRANCH_NAME}'
                bash 'docker build -t cismet/wupp-geoportal3-powerboats:test-manually-0.0.2 .'
            }

        }

    }


}
