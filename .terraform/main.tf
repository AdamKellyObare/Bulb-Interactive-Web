terraform {
  cloud {
    organization = "fameve-cloud"

    workspaces {
      name = "mshoppa_landing_angular"
    }
  }
}
# data "terraform_remote_state" "fc" {
#   backend = "remote"
#   config = {
#     organization = "fameve-cloud"
#     workspaces = {
#       name = "fc_preview"
#     }
#     token = var.fc_preview_token
#   }
# }
# data "terraform_remote_state" "mshoppa" {
#   backend = "remote"
#   config = {
#     organization = "fameve-cloud"
#     workspaces = {
#       name = "mshoppa_shared"
#     }
#     token = var.fc_preview_token
#   }
# }
variable "fc_preview_token" {}
variable "api_image" {}
