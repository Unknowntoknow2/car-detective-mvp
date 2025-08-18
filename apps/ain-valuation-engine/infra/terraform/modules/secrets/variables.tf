variable "rotation_lambda_arn" {
  description = "ARN of the Lambda function for secret rotation."
  type        = string
  default     = null
}
variable "names" {
  description = "List of secret names to create."
  type        = list(string)
}

variable "default_secret_value" {
  description = "Default value for secrets (useful for dev)."
  type        = string
  default     = "dev-placeholder"
}

variable "tags" {
  description = "Tags to apply to resources."
  type        = map(string)
  default     = {}
}
