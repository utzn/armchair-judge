
## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Bringing Up the App

1. **Clone the repository**:
    ```sh
    git clone https://github.com/utzn/armchair-judge.git
    cd armchair-judge
    ```

2. **Start the app using Docker Compose**:
    ```sh
    docker-compose up -d
    ```

   This will build and start the backend and frontend services, as well as a MongoDB instance.

3. **Access the app**:
   Open your browser and go to `http://localhost:5000`.

### Shutting Down the App

1. **Stop the app while keeping data**:
    ```sh
    docker-compose down
    ```

2. **Stop the app and delete all volumes (purge data)**:
    ```sh
    docker-compose down --rmi all --volumes
    ```

## Admin User

The admin user (gamemaster) has the first name `Utz`. Use the default password format `CHANGEME-Utz` to log in as the admin.

## Features

- **Admin**:
    - Set boxers
    - Start match
    - Call next round
    - End fight

- **Users**:
    - Submit scorecards
    - View scoreboard

## License

This project is licensed under the MIT License.