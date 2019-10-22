[![Build Status](https://travis-ci.org/MichalZa/CS-project.svg?branch=master)](https://travis-ci.org/MichalZa/CS-project)

# Setup

Steps to run this project:

1. docker-compose up -d

after docker initialization, the app should be accessible through 0.0.0.0:3000

To test propery endpoint by postman, remember to inject valid token into auth header

** For security reasons, all registered users by default have role "ROLE_USER". If you want to become a super-user you have to change the role manually in the database to "ROLE_OWNER".
