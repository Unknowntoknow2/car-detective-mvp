# Secrets Manager Terraform module for AIN Valuation Engine

resource "aws_secretsmanager_secret" "secrets" {
  for_each = toset(var.names)
  name = each.value
  recovery_window_in_days = 0
  rotation_lambda_arn     = var.rotation_lambda_arn
  rotation_rules {
    automatically_after_days = 90
  }
  tags = var.tags
}

resource "aws_secretsmanager_secret_version" "secrets_version" {
  for_each      = aws_secretsmanager_secret.secrets
  secret_id     = each.value.id
  secret_string = var.default_secret_value
  lifecycle {
    ignore_changes = [secret_string]
  }
}
