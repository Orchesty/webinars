resource "linode_instance" "orchesty-node" {
  image           = var.linode_image
  region          = var.linode_region
  label           = "Orchesty_example_deployment"
  group           = "Terraform"
  type            = "g6-standard-8"
  #type            = "g6-nanode-1"
  authorized_keys = [var.vm_ssh_key]
  root_pass       = var.vm_root_pass

  provisioner "file" {
    source = "setup_script.sh"
    destination = "/tmp/setup_script.sh"
    connection {
      type = "ssh"
      host = self.ip_address
      user = "root"
      password = var.vm_root_pass
    }
  }

  provisioner "file" {
    source = "configs/.env"
    destination = "/tmp/.env"
    connection {
      type = "ssh"
      host = self.ip_address
      user = "root"
      password = var.vm_root_pass
    }
  }

  provisioner "file" {
    source = "configs/start.sh"
    destination = "/tmp/start.sh"
    connection {
      type = "ssh"
      host = self.ip_address
      user = "root"
      password = var.vm_root_pass
    }
  }

  provisioner "remote-exec" {
    inline = [
      "chmod +x /tmp/setup_script.sh",
      "sudo /tmp/setup_script.sh",
      "sleep 10"
    ]
    connection {
      type = "ssh"
      host = self.ip_address
      user = "root"
      password = var.vm_root_pass
    }
  }
}