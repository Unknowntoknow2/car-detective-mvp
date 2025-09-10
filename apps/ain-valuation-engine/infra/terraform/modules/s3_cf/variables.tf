variable "assets_bucket_name" {
  description = "Name of the S3 bucket for assets."
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources."
  type        = map(string)
  default     = {}
}
