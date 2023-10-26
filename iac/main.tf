
module "notebooks" {
  source = "./notebooks"
}

resource "kubernetes_deployment" "notebook_fe_deployment" {
  metadata {
    name = "notebook-fe"
  }

  spec {
    selector {
      match_labels = {
        app = "notebook-fe"
      }
    }

    template {
      metadata {
        labels = {
          app = "notebook-fe"
          group = "notebook-instance"
        }
      }

      spec {
        container {
          image = "mfranczel/notebook-fe:latest"
          name  = "notebook-fe"
          image_pull_policy = "Always"
          
          port {
            container_port = 80
          }
        }
      }
    }
  }
}

resource "kubernetes_deployment" "control_plane_fe_deployment" {
  metadata {
    name = "control-plane-fe"
  }

  spec {
    selector {
      match_labels = {
        app = "control-plane-fe"
      }
    }

    template {
      metadata {
        labels = {
          app = "control-plane-fe"
        }
      }

      spec {
        container {
          image = "mfranczel/control-plane-fe:latest"
          name  = "control-plane-fe"
          image_pull_policy = "Always"
          
          port {
            container_port = 80
          }
        }
      }
    }
  }
}

resource "kubernetes_persistent_volume" "terraform_state_pv" {
  metadata {
    name = "terraform-state-pv"
  }
  spec {
    storage_class_name = "standard"
    capacity = {
      storage = "1Gi"
    }
    access_modes = ["ReadWriteOnce"]
    persistent_volume_source {
      host_path {
        path = "/Users/s4q3a/Code/Assignment/infra/iac"
        type = "DirectoryOrCreate"
      }
    }
  }
}

resource "kubernetes_persistent_volume_claim" "terraform_state_pvc" {
  metadata {
    name = "terraform-state-pvc"
  }
  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = "1Gi"
      }
    }
    volume_name = kubernetes_persistent_volume.terraform_state_pv.metadata.0.name
    storage_class_name = "standard"
  }
}

resource "kubernetes_service_account" "internal_kubectl" {
  metadata {
    name = "internal-kubectl"
  }
}

resource "kubernetes_role" "modify_pods_role" {
  metadata {
    name = "modify-pods"
  }

  rule {
    api_groups = ["*"]
    resources  = ["*"]
    verbs      = ["*"]
  }
}

resource "kubernetes_role_binding" "modify_pods_role_binding" {
  metadata {
    name = "modify-pods-to-sa"
  }

  subject {
    kind      = "ServiceAccount"
    name      = kubernetes_service_account.internal_kubectl.metadata[0].name
    namespace = "default" 
  }

  role_ref {
    kind      = "Role"
    name      = kubernetes_role.modify_pods_role.metadata[0].name
    api_group = "rbac.authorization.k8s.io"
  }
}

resource "kubernetes_deployment" "control_plane_be_deployment" {
  metadata {
    name = "control-plane-be"
  }

  spec {
    selector {
      match_labels = {
        app = "control-plane-be"
      }
    }

    template {
      metadata {
        labels = {
          app = "control-plane-be"
        }
      }

      spec {

        volume {
          name = "terraform"
          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim.terraform_state_pvc.metadata.0.name
          }
        }

        service_account_name = kubernetes_service_account.internal_kubectl.metadata[0].name

        container {
          image = "mfranczel/control-plane-be:latest"
          name  = "control-plane-be"
          image_pull_policy = "Always"
          
          port {
            container_port = 3001
          }

          volume_mount {
            name       = "terraform"
            mount_path = "/app/iac"
          }

        }
      }
    }
  }
}

resource "kubernetes_service" "notebook_fe_service" {
  metadata {
    name = "notebook-fe"
    labels = {
      group = "notebook-service"
      app = "notebook-fe"
    }
  }

  spec {
    type = "NodePort"
    selector = {
      app = "notebook-fe"
    }

    port {
      name       = "http"
      protocol   = "TCP"
      port       = 80
      node_port  = 32011
    }
  }
}

resource "kubernetes_service" "control_plane_fe_service" {
  metadata {
    name = "control-plane-fe"
    labels = {
      group = "control-plane-fe-service"
      app = "control-plane-fe"
    }
  }

  spec {
    type = "NodePort"
    selector = {
      app = "control-plane-fe"
    }

    port {
      name       = "http"
      protocol   = "TCP"
      port       = 80
      node_port  = 32010
    }
  }
}

resource "kubernetes_service" "control_plane_be_service" {
  metadata {
    name = "control-plane-be"
  }

  spec {
    selector = {
      app = "control-plane-be"
    }

    port {
      name       = "http"
      port       = 3001
      target_port = 3001
      protocol   = "TCP"
    }
  }
}