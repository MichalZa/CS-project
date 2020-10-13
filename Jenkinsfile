node {
  checkout scm

  docker.image('markadams/chromium-xvfb-js').withRun('-it --entrypoint=/bin/bash') {
      stage('NPM Install') {
          sh 'ls'
      }

      stage('Test') {
          //sh 'npm run test'
      }

      stage('Lint') {
          sh 'npm run lint'
      }
    }
}
