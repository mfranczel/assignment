# Use official Node.js image
FROM --platform=linux/x86-64 node:16

# Install Terraform
ENV TERRAFORM_VERSION=1.6.2
RUN apt-get update && \
    apt-get install -y wget unzip && \
    wget https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip && \
    unzip terraform_${TERRAFORM_VERSION}_linux_amd64.zip && \
    mv terraform /usr/bin/ && \
    rm terraform_${TERRAFORM_VERSION}_linux_amd64.zip

# Install kubectl
RUN apt-get update && apt-get install -y apt-transport-https gnupg2 && \
    curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add - && \
    echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | tee -a /etc/apt/sources.list.d/kubernetes.list && \
    apt-get update && \
    apt-get install -y kubectl

# Set working directory in container
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code into the container
COPY . .

# Expose port for the app
EXPOSE 3001

# Command to run the app
CMD [ "node", "server.js" ]