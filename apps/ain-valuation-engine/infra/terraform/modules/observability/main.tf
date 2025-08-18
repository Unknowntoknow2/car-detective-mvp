# Observability Terraform module for AIN Valuation Engine

resource "aws_cloudwatch_log_group" "otel" {
  name              = "/ain/${var.env}/otel-collector"
  retention_in_days = 30
  tags              = var.tags
}

resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "ain-${var.env}-main"
  dashboard_body = var.dashboard_body
  tags           = var.tags
}
