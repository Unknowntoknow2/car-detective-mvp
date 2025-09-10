variable "cluster_name" {
  description = "Name of the ECS cluster."
  type        = string
}

variable "task_family" {
  description = "Task family name."
  type        = string
}

variable "cpu" {
  description = "CPU units for the task."
  type        = string
}

variable "memory" {
  description = "Memory for the task."
  type        = string
}

variable "execution_role_arn" {
  description = "IAM role ARN for ECS execution."
  type        = string
}

variable "task_role_arn" {
  description = "IAM role ARN for ECS task."
  type        = string
}

variable "container_definitions" {
  description = "JSON for container definitions."
  type        = string
}

variable "service_name" {
  description = "Name of the ECS service."
  type        = string
}

variable "desired_count" {
  description = "Desired number of tasks."
  type        = number
}

variable "subnets" {
  description = "List of subnet IDs."
  type        = list(string)
}

variable "security_groups" {
  description = "List of security group IDs."
  type        = list(string)
}

variable "tags" {
  description = "Tags to apply to resources."
  type        = map(string)
  default     = {}
}
