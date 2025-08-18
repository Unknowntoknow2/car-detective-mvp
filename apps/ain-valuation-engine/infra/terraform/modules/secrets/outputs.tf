output "secret_arns" {
  description = "ARNs of the created secrets."
  value       = [for s in aws_secretsmanager_secret.secrets : s.arn]
}
