# Lambda + API Gateway Terraform module for AIN Valuation Engine

resource "aws_lambda_function" "api" {
  function_name = var.lambda_name
  image_uri     = var.image_uri
  package_type  = "Image"
  role          = var.lambda_role_arn
  timeout       = 30
  memory_size   = 1024
  environment {
    variables = var.env_vars
  }
  tags = var.tags
}

resource "aws_apigatewayv2_api" "http_api" {
  name          = "${var.lambda_name}-http-api"
  protocol_type = "HTTP"
  target        = aws_lambda_function.api.arn
  tags          = var.tags
}
