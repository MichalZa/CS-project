node {
    docker.image('markadams/chromium-xvfb-js').withRun('-it --entrypoint=/bin/bash') {
      stage('NPM Install') {
          sh 'npm install'
      }

      stage('Test') {
          sh 'npm run test'
      }

      stage('Lint') {
          sh 'npm run lint'
      }
    }
}
