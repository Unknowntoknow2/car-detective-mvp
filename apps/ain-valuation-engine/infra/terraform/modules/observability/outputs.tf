output "otel_log_group_name" {
  description = "Name of the OTel log group."
  value       = aws_cloudwatch_log_group.otel.name
}

output "dashboard_name" {
  description = "Name of the CloudWatch dashboard."
  value       = aws_cloudwatch_dashboard.main.dashboard_name
}
