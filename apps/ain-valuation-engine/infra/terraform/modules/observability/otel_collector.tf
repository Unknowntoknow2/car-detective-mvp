# OTel Collector ECS Task (stub)
resource "aws_ecs_task_definition" "otel_collector" {
  family                   = "otel-collector"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = var.execution_role_arn
  task_role_arn            = var.task_role_arn
  container_definitions    = var.otel_collector_container_definitions
  tags                     = var.tags
}

resource "aws_ecs_service" "otel_collector" {
  name            = "otel-collector"
  cluster         = var.cluster_id
  task_definition = aws_ecs_task_definition.otel_collector.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  network_configuration {
    subnets          = var.subnets
    assign_public_ip = true
    security_groups  = var.security_groups
  }
  tags = var.tags
}
