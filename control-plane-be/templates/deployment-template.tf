resource "kubernetes_deployment" "notebook_fe_deployment_${INSTANCE_NAME}" {
  metadata {
    name = "notebook-fe-${INSTANCE_NAME}"
  }

  spec {
    selector {
      match_labels = {
        app = "notebook-fe-${INSTANCE_NAME}"
      }
    }

    template {
      metadata {
        labels = {
          app = "notebook-fe-${INSTANCE_NAME}"
          group = "notebook-instance"
        }
      }

      spec {
        container {
          image = "mfranczel/notebook-fe:latest"
          name  = "notebook-fe-${INSTANCE_NAME}"
          image_pull_policy = "Always"
          
          port {
            container_port = 80
          }
        }
      }
    }
  }
}