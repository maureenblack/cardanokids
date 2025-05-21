variable "aws_region" {
  description = "AWS region for resources"
  default     = "us-east-1"
}

variable "frontend_bucket_name" {
  description = "Name of the S3 bucket for frontend assets"
  default     = "cardano-kids-frontend"
}

variable "content_bucket_name" {
  description = "Name of the S3 bucket for educational content"
  default     = "cardano-kids-content"
}

variable "environment" {
  description = "Deployment environment"
  default     = "production"
  validation {
    condition     = contains(["development", "staging", "production"], var.environment)
    error_message = "Environment must be one of: development, staging, production."
  }
}

variable "domain_name" {
  description = "Domain name for the Cardano Kids platform"
  default     = "cardanokids.example.com"
}

variable "create_dns_zone" {
  description = "Whether to create a Route 53 DNS zone"
  default     = false
  type        = bool
}
