# ECS Fargate Cluster/Service Terraform module for AIN Valuation Engine

resource "aws_ecs_cluster" "main" {
  name = var.cluster_name
  tags = var.tags
}

resource "aws_ecs_task_definition" "scraper" {
  family                   = var.task_family
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.cpu
  memory                   = var.memory
  execution_role_arn       = var.execution_role_arn
  task_role_arn            = var.task_role_arn
  container_definitions    = var.container_definitions
  tags                     = var.tags
}

resource "aws_ecs_service" "scraper" {
  name            = var.service_name
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.scraper.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"
  network_configuration {
    subnets          = var.subnets
    assign_public_ip = true
    security_groups  = var.security_groups
  }
  tags = var.tags
}
