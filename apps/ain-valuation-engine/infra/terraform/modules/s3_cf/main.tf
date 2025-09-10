# S3 + CloudFront Terraform module for AIN Valuation Engine

resource "aws_s3_bucket" "assets" {
  bucket = var.assets_bucket_name
  acl    = "private"
  versioning {
    enabled = true
  }
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
  lifecycle_rule {
    id      = "expire-raw-photos"
    enabled = true
    prefix  = "photos/raw/"
    expiration {
      days = 90
    }
  }
  lifecycle_rule {
    id      = "expire-premium-photos"
    enabled = true
    prefix  = "photos/premium/"
    expiration {
      days = 365
    }
  }
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
  tags = var.tags
}

resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "${var.assets_bucket_name}-oac"
  origin_access_control_origin_type  = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
  description                       = "OAC for S3 bucket ${var.assets_bucket_name}"
}

resource "aws_cloudfront_distribution" "assets" {
  enabled             = true
  default_root_object = "index.html"
  origin {
    domain_name              = aws_s3_bucket.assets.bucket_regional_domain_name
    origin_id                = aws_s3_bucket.assets.id
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = aws_s3_bucket.assets.id
    viewer_protocol_policy = "redirect-to-https"
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }
  price_class = "PriceClass_100"
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  viewer_certificate {
    cloudfront_default_certificate = true
  }
  tags = var.tags
}
