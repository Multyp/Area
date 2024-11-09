#!/bin/bash

# Function to check if a command exists
command_exists() {
    command -v "$1" &> /dev/null
}

# Function to detect the package manager and assign it to a variable
detect_package_manager() {
    if command_exists dnf; then
        PKG_MANAGER="dnf"
    elif command_exists apt-get; then
        PKG_MANAGER="apt-get"
    elif command_exists yum; then
        PKG_MANAGER="yum"
    elif command_exists zypper; then
        PKG_MANAGER="zypper"
    else
        echo "No supported package manager found. Exiting."
        exit 1
    fi
}

# Function to install Docker based on the detected package manager
install_docker() {
    echo "Checking Docker installation..."
    if command_exists docker; then
        echo "Docker is already installed."
        return
    fi

    echo "Docker is not installed. Installing Docker using $PKG_MANAGER..."

    case "$PKG_MANAGER" in
        dnf)
            sudo dnf remove -y docker docker-client docker-client-latest docker-common \
                docker-latest docker-latest-logrotate docker-logrotate \
                docker-selinux docker-engine-selinux docker-engine

            sudo dnf -y install dnf-plugins-core
            sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
            sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
            ;;

        apt-get)
            sudo apt-get remove -y docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc
            sudo apt-get update
            sudo apt-get install -y ca-certificates curl gnupg
            sudo install -m 0755 -d /etc/apt/keyrings
            curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
            echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
            $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
            sudo apt-get update
            sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
            ;;

        yum)
            sudo yum remove -y docker docker-client docker-client-latest docker-common \
                docker-latest docker-latest-logrotate docker-logrotate docker-engine

            sudo yum install -y yum-utils
            sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
            sudo yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
            ;;

        zypper)
            sudo zypper remove -y docker docker-compose podman-docker containerd runc
            sudo zypper install -y docker docker-compose
            ;;
    esac

    # Start and enable Docker service after installation
    sudo systemctl start docker
    sudo systemctl enable docker
}

# Function to start Docker containers
start_containers() {
    local ENV=$1
    if [ "$ENV" != "local" ] && [ "$ENV" != "prod" ]; then
        echo "Invalid environment specified. Use 'local' or 'prod'."
        exit 1
    fi

    # Check if docker-compose or docker compose is available
    if command_exists "docker-compose"; then
        DOCKER_COMPOSE_CMD="docker-compose"
    else
        DOCKER_COMPOSE_CMD="docker compose"
    fi

    if [ "$ENV" = "local" ]; then
        echo "Starting Docker containers for development environment..."
        $DOCKER_COMPOSE_CMD -f docker-compose.local.yml build
        $DOCKER_COMPOSE_CMD -f docker-compose.local.yml up
    elif [ "$ENV" = "prod" ]; then
        echo "Starting Docker containers for production environment..."
        $DOCKER_COMPOSE_CMD -f docker-compose.prod.yml build
        $DOCKER_COMPOSE_CMD -f docker-compose.prod.yml up
    fi
}

# Function to stop Docker containers and remove volumes
stop_containers() {
    echo "Stopping and removing all Docker containers and volumes..."
    if command_exists "docker-compose"; then
        sudo docker-compose -f docker-compose.local.yml down -v
        sudo docker-compose -f docker-compose.prod.yml down -v
    else
        sudo docker compose -f docker-compose.local.yml down -v
        sudo docker compose -f docker-compose.prod.yml down -v
    fi
}

# Function to remove Docker images
remove_images() {
    echo "Removing all unused Docker images..."
    if command_exists "docker"; then
        sudo docker image prune -a -f
    else
        echo "Docker is not installed. Cannot remove images."
        exit 1
    fi
}

purge_images() {
    echo "Purging all Docker images..."
    if command_exists "docker"; then
        sudo docker rm -f $(sudo docker ps -aq)
        sudo docker volume rm $(sudo docker volume ls -q)
    else
        echo "Docker is not installed. Cannot remove images."
        exit 1
    fi
}

# Display help
show_help() {
    echo "Usage: $0 [-i] [-s ENV] [-d] [-r] [-p] [-h]"
    echo ""
    echo "Options:"
    echo "  -i         Install Docker if not installed"
    echo "  -s ENV     Start Docker containers (use 'local' or 'prod' for ENV)"
    echo "  -d         Stop all Docker containers and remove volumes"
    echo "  -r         Remove unused Docker images"
    echo "  -p         Purge all Docker images"
    echo "  -h         Show this help message"
}

# Detect package manager before doing anything
detect_package_manager

OPTSTRING=":is:drph"
# Parse command-line arguments
while getopts ${OPTSTRING} opt; do
    case "${opt}" in
        i)  install_docker
            ;;
        s)  start_containers $OPTARG
            ;;
        d)  stop_containers
            ;;
        r)  remove_images
            ;;
        p)  purge_images
            ;;
        h)  show_help
            exit 0
            ;;
        *)  show_help
            exit 1
            ;;
    esac
done

# If no arguments were passed, show the help message
if [ $OPTIND -eq 1 ]; then
    show_help
fi
