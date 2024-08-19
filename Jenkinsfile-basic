pipeline {
  agent any
  stages {
    stage('verify act installation') {
      steps {
        sh 'act --version'
      }
    }
    stage('run the entire pipeline') {
      steps {
        sh 'act'
      }
    }
    stage('view the executive graph') {
      steps {
        sh 'act -l'
      }
    }
  }
}