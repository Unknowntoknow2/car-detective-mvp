output "assets_bucket_id" {
  description = "ID of the S3 assets bucket."
  value       = aws_s3_bucket.assets.id
}

output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution."
  value       = aws_cloudfront_distribution.assets.id
}

output "cloudfront_domain_name" {
  description = "Domain name of the CloudFront distribution."
  value       = aws_cloudfront_distribution.assets.domain_name
}
