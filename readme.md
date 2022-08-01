# Welcome to the Anythink Market repo

To start the app use Docker. It will start both frontend and backend, including all the relevant dependencies, and the db.

Please find more info about each part in the relevant Readme file ([frontend](frontend/readme.md) and [backend](backend/README.md)).

## Development

When implementing a new feature or fixing a bug, please create a new pull request against `main` from a feature/bug branch and add `@vanessa-cooper` as reviewer.

## First setup

**[TODO 05/01/2018 @vanessa-cooper]:** _It's been a while since anyone ran a fresh copy of this repo. I think it's worth documenting the steps needed to install and run the repo on a new machine?_

**[Step 1]:** First of all we need Docker. It's going to make it easier for us to run things locally. To install Docker follow this [documentation](https://docs.docker.com/get-docker/). You can verify docker is ready by running the following commands:

```console
1) docker -v 
2) docker-compose -v
```

**[Step 2]:** Now run **docker-compose up** in the terminal from the root directory of the project. It can load frontend and backend server, also your backend connect to local database.
