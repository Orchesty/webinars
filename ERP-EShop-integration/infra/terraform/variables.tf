variable "linode_api_key" {
  description = "API Key to Linode"
  type        = string
  sensitive   = true
}

variable "vm_root_pass" {
  description = "Password for root user of current VM"
  type        = string
  sensitive   = true
}

variable "vm_ssh_key" {
  description = "Public SSH Key for root user of current VM"
  type = string
  sensitive = true
}

variable "linode_image" {
  description = "Image of current VM (eg. linode/ubuntu22.04)"
  type        = string
  default     = "linode/ubuntu22.04"
}

variable "linode_region" {
  description = "Region of current VM (eg. eu-central)"
  type        = string
  default     = "eu-central"
}