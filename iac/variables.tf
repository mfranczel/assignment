variable "running_in_k8s" {
  description = "Flag to determine if Terraform is being run inside a Kubernetes pod"
  type        = bool
  default     = false
}