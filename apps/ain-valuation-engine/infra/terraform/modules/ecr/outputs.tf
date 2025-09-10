output "ecr_repo_arns" {
  description = "ARNs of the created ECR repositories."
  value       = [for repo in aws_ecr_repository.repos : repo.arn]
}

output "ecr_repo_urls" {
  description = "Repository URLs of the created ECR repositories."
  value       = [for repo in aws_ecr_repository.repos : repo.repository_url]
}
