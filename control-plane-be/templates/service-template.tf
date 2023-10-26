resource "kubernetes_service" "notebook_fe_service_${INSTANCE_NAME}" {
  metadata {
    name = "notebook-fe-${INSTANCE_NAME}"
    labels = {
      group = "notebook-service"
      app = "notebook-fe-${INSTANCE_NAME}"
    }
  }

  spec {
    type = "NodePort"
    selector = {
      app = "notebook-fe-${INSTANCE_NAME}"
    }

    port {
      name      = "http"
      protocol  = "TCP"
      port      = 80
      node_port = ${NODE_PORT}
    }
  }
}