variable "env" {
  description = "Environment name (dev, stage, prod)."
  type        = string
}

variable "dashboard_body" {
  description = "JSON body for CloudWatch dashboard."
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources."
  type        = map(string)
  default     = {}
}
