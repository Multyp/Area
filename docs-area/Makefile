WEBSITE_NAME := area-docs
IMAGE_NAME   := area-docs-image
DOCKER       := sudo docker
DOCKERFILE   := dockerfile

build_img:
	-$(DOCKER) build -f $(DOCKERFILE) -t $(IMAGE_NAME) .

delete_img:
	-$(DOCKER) rmi $(IMAGE_NAME)

start_serv:
	-$(DOCKER) run -d -p 8084:8084 --name $(WEBSITE_NAME) -m 256m $(IMAGE_NAME)

stop_serv:
	-$(DOCKER) stop $(WEBSITE_NAME)

remove_serv:
	-$(DOCKER) rm $(WEBSITE_NAME)

update_website: stop_serv remove_serv delete_img build_img start_serv

# Usage:
# - make build_img: Build the Docker image.
# - make delete_img: Delete the Docker image.
# - make start_serv: Start the Docker container.
# - make stop_serv: Stop the Docker container.
# - make remove_serv: Remove the Docker container.
# - make update_website: Update the website by stopping the server, removing the container and image, rebuilding the image, and starting the server again.

.PHONY: build_img delete_img start_serv stop_serv remove_serv update_website
