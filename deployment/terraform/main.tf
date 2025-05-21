provider "aws" {
  region = var.aws_region
}

# S3 bucket for frontend assets
resource "aws_s3_bucket" "frontend" {
  bucket = var.frontend_bucket_name
  tags = {
    Name        = "Cardano Kids Frontend"
    Environment = var.environment
  }
}

resource "aws_s3_bucket_website_configuration" "frontend_website" {
  bucket = aws_s3_bucket.frontend.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_cors_configuration" "frontend_cors" {
  bucket = aws_s3_bucket.frontend.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_ownership_controls" "frontend_ownership" {
  bucket = aws_s3_bucket.frontend.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "frontend_access" {
  bucket = aws_s3_bucket.frontend.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "frontend_acl" {
  depends_on = [
    aws_s3_bucket_ownership_controls.frontend_ownership,
    aws_s3_bucket_public_access_block.frontend_access,
  ]

  bucket = aws_s3_bucket.frontend.id
  acl    = "public-read"
}

# CloudFront distribution for CDN
resource "aws_cloudfront_distribution" "frontend_distribution" {
  origin {
    domain_name = aws_s3_bucket_website_configuration.frontend_website.website_endpoint
    origin_id   = "S3-${aws_s3_bucket.frontend.bucket}"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100"

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.frontend.bucket}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name        = "Cardano Kids CDN"
    Environment = var.environment
  }
}

# Route 53 DNS configuration (if domain is managed by AWS)
resource "aws_route53_zone" "primary" {
  count = var.create_dns_zone ? 1 : 0
  name  = var.domain_name
}

resource "aws_route53_record" "frontend" {
  count   = var.create_dns_zone ? 1 : 0
  zone_id = aws_route53_zone.primary[0].zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.frontend_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.frontend_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

# S3 bucket for content storage (educational materials, videos, etc.)
resource "aws_s3_bucket" "content" {
  bucket = var.content_bucket_name
  tags = {
    Name        = "Cardano Kids Content"
    Environment = var.environment
  }
}

resource "aws_s3_bucket_cors_configuration" "content_cors" {
  bucket = aws_s3_bucket.content.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_ownership_controls" "content_ownership" {
  bucket = aws_s3_bucket.content.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "content_access" {
  bucket = aws_s3_bucket.content.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "content_acl" {
  depends_on = [
    aws_s3_bucket_ownership_controls.content_ownership,
    aws_s3_bucket_public_access_block.content_access,
  ]

  bucket = aws_s3_bucket.content.id
  acl    = "public-read"
}

# CloudFront distribution for content CDN
resource "aws_cloudfront_distribution" "content_distribution" {
  origin {
    domain_name = aws_s3_bucket.content.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.content.bucket}"
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.content.bucket}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name        = "Cardano Kids Content CDN"
    Environment = var.environment
  }
}

# Output the CloudFront distribution URLs
output "frontend_cloudfront_domain" {
  value = aws_cloudfront_distribution.frontend_distribution.domain_name
}

output "content_cloudfront_domain" {
  value = aws_cloudfront_distribution.content_distribution.domain_name
}

output "website_endpoint" {
  value = aws_s3_bucket_website_configuration.frontend_website.website_endpoint
}
