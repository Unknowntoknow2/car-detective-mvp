# ECR Terraform module for AIN Valuation Engine

resource "aws_ecr_repository" "repos" {
  for_each = toset(var.repos)
  name                 = each.value
  image_tag_mutability = "IMMUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
  encryption_configuration {
    encryption_type = "AES256"
  }
  tags = var.tags
}
