terraform {
  required_providers {
    kubernetes = {
      source = "hashicorp/kubernetes"
      version = "2.17.0"
    }
  }
}

provider "kubernetes" {
  config_path    = var.running_in_k8s ? null : "~/.kube/config"
  config_context = var.running_in_k8s ? null : "minikube"
  host                   = var.running_in_k8s ? "https://kubernetes.default.svc.cluster.local" : null
  token                  = var.running_in_k8s ? file("/var/run/secrets/kubernetes.io/serviceaccount/token") : null
  cluster_ca_certificate = var.running_in_k8s ? file("/var/run/secrets/kubernetes.io/serviceaccount/ca.crt") : null
}