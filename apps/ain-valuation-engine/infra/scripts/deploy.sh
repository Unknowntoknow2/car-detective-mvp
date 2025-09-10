#!/bin/bash
# Usage: ./deploy.sh <env>
# Deploys infrastructure and application for the specified environment (stage|prod)
set -euo pipefail

ENV=${1:-stage}

# 1. Terraform apply (infra)
cd $(dirname $0)/..
terraform init -input=false
terraform workspace select $ENV || terraform workspace new $ENV
terraform plan -out=tfplan -input=false
terraform apply -input=false -auto-approve tfplan

# 2. Build & push Docker images (if needed)
# (Assume ECR login and tagging handled in pipeline)

# 3. Deploy Lambda/API/ECS (assume IaC covers this)

# 4. Database migrations (stage only)
if [ "$ENV" = "stage" ]; then
  cd ../../db/migrations
  supabase db push
fi

# 5. Canary/weighted routing (prod only, via API Gateway config)
if [ "$ENV" = "prod" ]; then
  echo "Triggering canary rollout via API Gateway weighted routes..."
  # Placeholder: implement canary logic via AWS CLI or IaC
fi

echo "Deployment to $ENV complete."
