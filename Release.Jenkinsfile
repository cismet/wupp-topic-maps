pipeline {

    agent any
    environment {
        BRANCH = "${env.BRANCH_NAME}"
	VERSION= "???"
    }
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
		script {
			String version=BRANCH
			version.replaceFirst(/^release\//,"")
			VERSION=version
		}
		sh "echo ${env.BRANCH_NAME}"
		sh "echo ${VERSION}"
		echo version
                //sh "docker build -t cismet/wupp-geoportal3-powerboats:test-manually-0.0.2 ."
            }

        }

    }


}
