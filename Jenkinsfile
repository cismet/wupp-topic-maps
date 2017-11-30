pipeline {
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
            def app = docker.build("cismet/wupp-geoportal3-powerboats")

        }

    }


}
