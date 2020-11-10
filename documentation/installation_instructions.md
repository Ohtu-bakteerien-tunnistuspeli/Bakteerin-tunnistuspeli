# Installation instructions for development and production


## Development & local use


In order to run this project locally, you need to have `git` and `node` installed. This project was made using node version 14 so we don't recommend using anything older than that. After cloning the project's GitHub repository, you need to navigate into the backend directory and create a file called *.env* with the following content:

```
PORT=3001
SECRET=<your secret string here>
IMAGEURL=<relative path to a folder you want the app to save images to>
```

The environment variable:
- PORT is used to determine the localhost port where the application's backend will start running on. 
- SECRET is a string that is used to encrypt the JSON web tokens which are required for user authentication.
- IMAGEURL is a relative path to a directory where to application will save uploaded images to. E.g. using "images" as the IMAGEURL will create a folder named images within the application's backend folder and all subsequent images will be saved there.

After creating the appropriate .env file, you need to install the project's dependencies using npm. This is done by first navigating into the application's frontend directory and using the command:

```npm install```

after which you need to navigate back to the backend directory and use the same command:

```npm install```

In order to use the application locally you should have two terminal windows open, one of which will be running the frontend while the other has the backend running in the background. In the terminal where you want to start the backend, navigate to the backend folder and use the command:

```npm run dev```

and the backend will start on localhost port 3001. In the other terminal navigate to the the frontend folder and use the command:

```npm start```

to start the frontend on the default localhost port 3000. The application should automatically open up *http://localhost:3000* with the default browser and the application should now be ready for development use. To stop the front and backend processes in their respective terminals, use `Ctrl + C`.

While in development mode, the application uses an in-memory MongoDB server as the database and thus all changes made to the database are lost when the backend restarts.


### Available npm scripts:


#### Frontend:


| Command | Description |
| ----------- | ----------- |
| `npm start` | Starts frontend on port 3000 |
| `npm run lint` | Checks the frontend for lint errors |
| `npm run cypress:open` | Runs cypress tests in a window. Requires backend to be running. |
| `npm run test:e2e` | Runs cypress tests in terminal. Requires backend to be running. |


#### Backend:


| Command | Description |
| ----------- | ----------- |
| `npm start` | Starts backend in production mode on port 3001. Requires a frontend build and MongoDB. |
| `npm run dev` | Starts backend in development mode (with nodemon) on port 3001 |
| `npm test` | Runs backend unit/integration tests in terminal |
| `npm run test-githubactions` | ? |
| `npm run build:ui` | Builds the frontend and moves it to a build folder within the backend folder. |
| `npm run lint` | Checks the backend for lint errors |
| `npm run start:test` | Starts backend in test mode on port 3001 |
| `npm run start:testServer` | ? |


## Deployment & production

There are of course various ways to deploy the application to production. Here are a few examples with general instructions. The baseline for these instructions is that there is a server of some sort where you also have permission to install the required software.

### Using docker

1. Build the app image (preferably) locally from a Dockerfile. The project's repository already has a Dockerfile which can be used to build the image by using the command:

    ```docker build -t <username/repositoryname> .```

    where username and repository name refer to your Docker Hub username and the repository name for the image. You can now push the image to Docker Hub with:

    ```docker push <username/repositoryname>```

2. Install `docker` and `docker-compose` on the server
3. Create a directory for the application configurations
4. Inside the directory, create a *docker-compose.yml* file with e.g. the following structure:

```
services:
  app:
    image: <username/repositoryname>
    restart: unless-stopped
    volumes:
      - <relative_path_to_your_image_folder_on_the_server>:/app/backend/images
    depends_on:
      - mongo
    ports:
      - 3001:3001
    environment:
      - PORT=3001
      - SECRET=<secret_string>
      - IMAGEURL=images
      - MONGODB_URI=mongodb://mongo:27017/<database_name>
      - VIRTUAL_HOST=app
    container_name: app
   
  mongo:
    image: mongo:4.4.1
    restart: unless-stopped
    volumes:
      - <relative_path_to_your_database_folder_on_the_server>:/data/db
    ports:
      - 27017:27017
    container_name: bacteria_db

  web:
    image: nginx
    restart: unless-stopped
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - <other_stuff_you_might_need_for_nginx_configurations>
    depends_on:
      - app
    ports:
      - 80:80
      - 443:443
    container_name: web

```

5. You also need to create a *nginx.conf* file where you can add the necessary directives etc. We won't be going into detail on how to configure nginx. In the virtual hosts config, you should add a server block that looks something along the lines of:
    ```
    server {
            listen 443 ssl;
		    listen [::]:443 ssl;

            server_name <your_domain_name_here>;

            location / {
	            proxy_pass http://app:3001/;
	            proxy_http_version 1.1;
	            proxy_set_header Upgrade $http_upgrade;
	            proxy_set_header Connection 'upgrade';
	            proxy_set_header Host $host;
	            proxy_cache_bypass $http_upgrade;
            }
    }
    ```

    Note that using the SSL port 443 requires SSL certificates to be configured correctly. Using the regular HTTP port 80 works too.

6. While still inside the same directory, use the command:

    ```docker-compose up -d```

    to start the necessary containers in the background.

7. Automatic deployment pipelines can be set up using github actions and by configuring `watchtower` on the server. Github actions can e.g. build and push the application to Docker Hub each time the master branch is updated. Watctower then periodically checks whether there are newer versions of the images available and pulls them from Docker Hub while restarting any affected containers.

### Without docker

1. Without using docker, you need to install `git`, `node`, `mongodb`, `nginx` and some sort of process manager like the npm package `pm2` globally on the server.
2. Configure nginx by e.g. editing the *nginx.conf* file in /etc/nginx/. Add something like this to the virtual hosts config block:
    ```
    server {
            listen 80;
		    listen [::]:80;

            server_name <your_domain_name_here>;

            location / {
	            proxy_pass http://localhost:3001/;
	            proxy_http_version 1.1;
	            proxy_set_header Upgrade $http_upgrade;
	            proxy_set_header Connection 'upgrade';
	            proxy_set_header Host $host;
	            proxy_cache_bypass $http_upgrade;
            }
    }
    ```
    The SSL port 443 can be used once again, but it requires extra configurations.
3. Pull the project's repository from github to the server.
4. Inside the repository, move to the frontend and backend directories and install their respective dependencies using `npm ci`.
5. Inside the backend directory, create a .env file with the following contents:

    ```
    PORT=3001
    SECRET=<your secret string here>
    IMAGEURL=<relative path to a folder you want the app to save images to>
    MONGODB_URI=mongodb://mongo:27017/<database_name>
    ```

    These environment variables are similar to the ones in the development instructions, but in production mode, a MongoDB URI is required.

6. Inside the backend directory, run the command:

    ```npm run build:ui```
    which creates a minified version of the frontend in the backend's build directory.

7. While still inside the backend directory, create a file called *app.json* with the following contents:
    ```
    {
      "name": "<process_name>",
      "script": "node index.js",
      "env": {
        "NODE_ENV": "production"
       }
    }
    ```

8. Start the application process in the background using the pm2 command:

    ```pm2 start <process_name>```

9. For automatic deployment, you can set up a webhook, that executes some sort of deployment script on the server when it receives a request.