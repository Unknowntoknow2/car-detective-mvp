output "lambda_function_arn" {
  description = "ARN of the Lambda function."
  value       = aws_lambda_function.api.arn
}

output "api_gateway_id" {
  description = "ID of the API Gateway."
  value       = aws_apigatewayv2_api.http_api.id
}
