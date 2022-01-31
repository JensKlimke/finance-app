pipeline {
  agent {
    docker {
      image 'node:lts-buster-slim'
      args '-p 3000:3000'
    }
  }
  environment {
    TZ = 'Europe/Berlin'
    CI = 'true'
  }
  stages {
    stage('Test') {
      steps {
        sh 'npm install'
        sh 'npm test'
      }
    }
    stage('Build') {
      steps {
        sh 'chmod -R +x ./jenkins/'
        sh './jenkins/write_env.sh'
        sh 'npm run build'
      }
    }
    stage('Deliver - dev') {
        when {
            branch 'dev'
        }
        steps {
          sh 'tar -czvf build-dev.tar.gz -C build .'
          archiveArtifacts artifacts: 'build-dev.tar.gz', fingerprint: true
          build job: 'deploy-finance-app-dev', parameters: [
            string(name: 'GIT_BRANCH_NAME', value: env.BRANCH_NAME),
            string(name: 'TARGET', value: "dev")
          ]
        }
    }
    stage('Deploy') {
        when {
            branch 'main'
        }
        steps {
          sh 'tar -czvf build-prod.tar.gz -C build .'
          archiveArtifacts artifacts: 'build-prod.tar.gz', fingerprint: true
          build job: 'deploy-finance-app-prod', parameters: [
           string(name: 'GIT_BRANCH_NAME', value: env.BRANCH_NAME),
           string(name: 'TARGET', "prod")
         ]
        }
    }
  }
}
