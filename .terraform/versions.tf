terraform {
  required_providers {
    datadog = {
      source = "DataDog/datadog"
    }
    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.29"
    }


    random = {
      source  = "hashicorp/random"
      version = ">= 3.3.2"
    }

    local = {
      source  = "hashicorp/local"
      version = ">= 2.2.3"
    }

  }
}
