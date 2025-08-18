terraform {
  required_version = ">= 1.7.0"
  required_providers {
    aws = { source = "hashicorp/aws", version = ">= 5.0" }
  }
}

provider "aws" { region = var.region }

module "vpc" {
  source = "./modules/vpc"
  name   = "ain"
  cidr   = "10.42.0.0/16"
}

module "ecr" {
  source = "./modules/ecr"
  repos  = ["valuation-api", "market-fetcher", "otel-collector"]
}

module "s3_cf" {
  source             = "./modules/s3_cf"
  assets_bucket_name = "ain-assets-${var.env}"
  tags               = var.tags
}

module "secrets" {
  source = "./modules/secrets"
  names  = ["VPIC_API_KEY", "OPENAI_API_KEY", "CARFAX_API_KEY"]
}


# Add additional modules (api, ecs, observability) as needed
# Runbooks: terraform plan in stage first; terraform apply only via CI with manual approval.
