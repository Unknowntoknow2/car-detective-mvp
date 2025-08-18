variable "lambda_name" {
  description = "Name of the Lambda function."
  type        = string
}

variable "image_uri" {
  description = "ECR image URI for Lambda."
  type        = string
}

variable "lambda_role_arn" {
  description = "IAM role ARN for Lambda."
  type        = string
}

variable "env_vars" {
  description = "Environment variables for Lambda."
  type        = map(string)
  default     = {}
}

variable "tags" {
  description = "Tags to apply to resources."
  type        = map(string)
  default     = {}
}
