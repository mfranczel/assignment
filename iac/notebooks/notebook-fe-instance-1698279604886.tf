resource "kubernetes_deployment" "notebook_fe_deployment_instance-1698279604886" {
  metadata {
    name = "notebook-fe-instance-1698279604886"
  }

  spec {
    selector {
      match_labels = {
        app = "notebook-fe-instance-1698279604886"
      }
    }

    template {
      metadata {
        labels = {
          app = "notebook-fe-instance-1698279604886"
          group = "notebook-instance"
        }
      }

      spec {
        container {
          image = "mfranczel/notebook-fe:latest"
          name  = "notebook-fe-instance-1698279604886"
          image_pull_policy = "Always"
          
          port {
            container_port = 80
          }
        }
      }
    }
  }
}
resource "kubernetes_service" "notebook_fe_service_instance-1698279604886" {
  metadata {
    name = "notebook-fe-instance-1698279604886"
    labels = {
      group = "notebook-service"
      app = "notebook-fe-instance-1698279604886"
    }
  }

  spec {
    type = "NodePort"
    selector = {
      app = "notebook-fe-instance-1698279604886"
    }

    port {
      name      = "http"
      protocol  = "TCP"
      port      = 80
      node_port = 32041
    }
  }
}