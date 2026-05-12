# 🚀 Kalp Soni - Cloud & DevOps Portfolio

[![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-Deploy%20to%20AWS-blue?logo=github-actions)](https://github.com/kalpsoni/kalpsoni-CICD-portfolio-1/actions)
[![AWS](https://img.shields.io/badge/AWS-Solution%20Architect%20Associate-orange?logo=amazon-aws)](https://aws.amazon.com/certification/certified-solutions-architect-associate/)
[![Security](https://img.shields.io/badge/Security-Hardened-green?logo=shield-check)](https://www.kalpsoni.com)
[![Infrastructure](https://img.shields.io/badge/Infrastructure-As%20Code-blue?logo=terraform)](https://www.terraform.io/)

> **Modern, secure, and performant portfolio website showcasing AWS Solution Architect expertise with comprehensive cloud infrastructure, automated CI/CD deployment, and enterprise-grade monitoring.**

## 🌟 Live Demo

**🌐 Website:** [https://www.kalpsoni.com](https://www.kalpsoni.com)

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub Repo   │───▶│  GitHub Actions │───▶│   AWS S3 Bucket │
│                 │    │   CI/CD Pipeline│    │  (Static Host)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │  AWS CloudFront │◀───│  AWS Lambda API │
                       │  (CDN + HTTPS)  │    │  (Contact Form) │
                       │  + WAF + OAC    │    │  + DynamoDB     │
                       └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │  Custom Domain  │    │  CloudWatch     │
                       │  kalpsoni.com   │    │  + SNS Alerts   │
                       └─────────────────┘    └─────────────────┘
```

## 🛠️ Technology Stack

### Frontend Technologies
- **HTML5** - Semantic markup with accessibility features
- **CSS3** - Modern styling with CSS Grid, Flexbox, and custom properties
- **Vanilla JavaScript** - ES6+ features, modular architecture, performance optimized
- **Font Awesome** - Professional icons and visual elements
- **Google Fonts** - Inter and Fira Code typography

### AWS Cloud Infrastructure (Solution Architect Level)
- **Amazon S3** - Static website hosting with Origin Access Control (OAC)
- **Amazon CloudFront** - Global CDN with HTTPS, WAF integration, and security headers
- **AWS Lambda** - Serverless contact form processing with DynamoDB integration
- **Amazon DynamoDB** - NoSQL database for contact form data storage
- **API Gateway** - RESTful API endpoints with rate limiting and throttling
- **Amazon SNS** - Email notifications for CloudWatch alarms and system events
- **CloudWatch** - Comprehensive monitoring with custom metrics and alarms
- **Route 53** - DNS management and domain routing with health checks
- **AWS Certificate Manager** - Free SSL/TLS certificates with automatic renewal
- **AWS WAF** - Web Application Firewall for DDoS protection and security rules

### DevOps & CI/CD
- **GitHub Actions** - Automated deployment pipeline with YAML configuration
- **Terraform** - Infrastructure as Code for AWS resource management
- **Docker** - Containerization for consistent deployment environments
- **Jenkins** - CI/CD pipelines for application deployment

### Security & Performance
- **Content Security Policy (CSP)** - XSS protection and resource control
- **Bot Protection** - Advanced spam and bot detection with behavioral analysis
- **Rate Limiting** - API request throttling and abuse prevention
- **Input Sanitization** - XSS and injection prevention with validation
- **Mobile Optimization** - Responsive design with touch support
- **Performance Monitoring** - Real-time metrics and error tracking

## 🚀 Key Features

### 🔒 Enterprise Security Features
- **Advanced Bot Protection**: Multi-layered bot detection using mouse movements, keyboard events, touch events, and timing analysis
- **Input Sanitization**: Comprehensive XSS and injection prevention with pattern validation
- **CORS Policy**: Strict cross-origin resource sharing controls
- **Content Security Policy**: Comprehensive CSP headers for XSS protection
- **Honeypot Fields**: Hidden form fields to catch automated submissions
- **Rate Limiting**: API-level request throttling (5 requests per minute)
- **AWS WAF Integration**: Web Application Firewall with custom security rules
- **Origin Access Control (OAC)**: Enhanced S3 bucket security with CloudFront
- **IAM Roles & Policies**: Least privilege access with custom policies

### 📊 AWS Monitoring & Alerting
- **CloudWatch Alarms**:
  - Lambda High Error Rate monitoring (>5 errors in 5 minutes)
  - API Gateway 4XX Error tracking (>20 errors in 5 minutes)
  - Traffic spike detection and alerting
  - Custom metrics for performance monitoring
- **SNS Notifications**: Real-time email alerts for critical system events
- **DynamoDB Integration**: Persistent storage for contact form submissions
- **Performance Dashboards**: Real-time monitoring of system health

### 📱 Mobile Optimization
- **Responsive Design**: Mobile-first approach with breakpoints
- **Touch Support**: Optimized touch events and gestures
- **Viewport Optimization**: Proper mobile viewport configuration
- **Performance**: Optimized for mobile network conditions
- **Accessibility**: WCAG 2.1 AA compliance with ARIA labels

### ⚡ Performance Features
- **CDN Distribution**: Global content delivery via CloudFront
- **Asset Optimization**: Minified CSS/JS with versioning
- **Lazy Loading**: Optimized resource loading
- **Caching Strategy**: Browser and CDN caching optimization
- **Compression**: Gzip compression for faster loading

### 🎨 User Experience
- **Modern Dark Theme**: AWS-inspired color scheme
- **Smooth Animations**: CSS transitions and micro-interactions
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Contact Form**: Interactive form with real-time validation and DynamoDB storage

## 📁 Project Structure

```
kalpsoni-CICD-portfolio-1/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD pipeline
├── infrastructure/
│   ├── terraform/              # Infrastructure as Code
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── cloudformation/         # Alternative IaC templates
├── website/
│   ├── index.html             # Main portfolio page
│   ├── styles.css             # Comprehensive styling
│   ├── script.js              # Interactive JavaScript
│   ├── mobile-test.html       # Mobile connection testing
│   ├── security.json          # Security configuration
│   ├── robots.txt             # SEO optimization
│   ├── favicon.ico            # Site favicon
│   └── README.markdown        # Deployment instructions
└── README.md                  # This comprehensive documentation
```

## 🔧 Deployment Process

### Automated CI/CD Pipeline
1. **Code Push**: Changes pushed to `main` branch
2. **GitHub Actions**: Automated workflow triggers with YAML configuration
3. **Terraform Apply**: Infrastructure updates if needed
4. **S3 Sync**: Files uploaded to AWS S3 bucket with OAC
5. **CloudFront Invalidation**: CDN cache cleared
6. **Live Update**: Changes visible within minutes

### Manual Deployment Options
- **AWS S3 Static Hosting**: Direct bucket deployment
- **AWS Amplify**: Git-based deployment platform
- **EC2 with Nginx**: Traditional server deployment

## 🛡️ Security Implementation

### Frontend Security
```javascript
// Bot Detection System
const botState = {
    startTime: Date.now(),
    formInteractions: 0,
    mouseMovements: 0,
    touchEvents: 0,
    scrollEvents: 0,
    keyboardEvents: 0
};

// Input Sanitization
const sanitizeInput = (input) => {
    return input
        .trim()
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .slice(0, 2000);
};
```

### Backend Security (AWS Lambda + DynamoDB)
- **Rate Limiting**: 5 requests per minute per IP
- **Input Validation**: Comprehensive email and content validation
- **Spam Protection**: Keyword filtering and pattern matching
- **AWS Security**: IAM roles with least privilege access
- **DynamoDB Security**: Encryption at rest and in transit
- **SNS Integration**: Secure notification delivery

## 📊 Performance Metrics

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Page Load Time**: < 2 seconds
- **Mobile Performance**: Optimized for 3G networks
- **CDN Coverage**: Global distribution via CloudFront
- **Uptime**: 99.9%+ availability
- **CloudWatch Metrics**: Real-time performance monitoring

## 🔍 SEO & Analytics

### SEO Features
- **Meta Tags**: Comprehensive Open Graph and Twitter Cards
- **Structured Data**: Schema.org markup for better search visibility
- **Sitemap**: XML sitemap for search engines
- **Robots.txt**: Search engine crawling directives
- **Performance**: Core Web Vitals optimization

### Analytics Integration
- **Performance Monitoring**: Real-time error tracking via CloudWatch
- **User Behavior**: Anonymous interaction analytics
- **Security Logging**: Bot detection and security event logging
- **DynamoDB Analytics**: Contact form submission tracking

## 🌐 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet

## 📱 Mobile Features

- **Responsive Design**: Mobile-first approach
- **Touch Optimization**: Gesture support and touch-friendly UI
- **Performance**: Optimized for mobile networks
- **Accessibility**: Mobile screen reader support
- **Testing**: Dedicated mobile connection testing page

## 🚀 Getting Started

### Prerequisites
- AWS Account with appropriate permissions
- GitHub repository
- Custom domain (optional)
- AWS Solution Architect Associate certification (recommended)

### Quick Start
1. **Clone the repository**:
   ```bash
   git clone https://github.com/kalpsoni/kalpsoni-CICD-portfolio-1.git
   cd kalpsoni-CICD-portfolio-1
   ```

2. **Configure AWS Secrets**:
   - `AWS_S3_BUCKET`: Your S3 bucket name
   - `AWS_ACCESS_KEY_ID`: AWS access key
   - `AWS_SECRET_ACCESS_KEY`: AWS secret key
   - `AWS_REGION`: AWS region
   - `CLOUDFRONT_DISTRIBUTION_ID`: CloudFront distribution ID
   - `DYNAMODB_TABLE_NAME`: DynamoDB table for contact form
   - `SNS_TOPIC_ARN`: SNS topic for notifications

3. **Deploy Infrastructure**:
   ```bash
   cd infrastructure/terraform
   terraform init
   terraform plan
   terraform apply
   ```

4. **Deploy Application**:
   ```bash
   git push origin main
   ```

### Local Development
```bash
# Start local server
python -m http.server 8000

# Open in browser
open http://localhost:8000/website/
```

## 📈 Monitoring & Maintenance

### Automated Monitoring
- **GitHub Actions**: Deployment status and logs
- **AWS CloudWatch**: Performance and error monitoring with custom dashboards
- **SNS Alerts**: Real-time email notifications for critical events
- **DynamoDB Monitoring**: Database performance and capacity tracking
- **Security Logging**: Bot detection and security events

### Maintenance Tasks
- **Security Updates**: Regular dependency updates and security patches
- **Performance Optimization**: Continuous improvement based on CloudWatch metrics
- **Content Updates**: Portfolio content management
- **Backup Strategy**: S3 versioning and cross-region replication
- **Cost Optimization**: Regular review of AWS resource utilization

## 🤝 Contributing

This is a personal portfolio project, but suggestions and feedback are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Website**: [https://www.kalpsoni.com](https://www.kalpsoni.com)
- **LinkedIn**: [linkedin.com/in/kalpsoni](https://linkedin.com/in/kalpsoni)
- **GitHub**: [github.com/kalpsoni](https://github.com/kalpsoni)
- **Email**: kalp.soni@example.com

## 🏆 AWS Certifications & Skills

- **AWS Solutions Architect Associate** - Certified cloud architect
- **Infrastructure as Code** - Terraform and CloudFormation expertise
- **Serverless Architecture** - Lambda, API Gateway, DynamoDB
- **Security Best Practices** - IAM, WAF, OAC, encryption
- **Monitoring & Alerting** - CloudWatch, SNS, custom metrics
- **CI/CD Pipelines** - GitHub Actions, Jenkins, automated deployment

## 🙏 Acknowledgments

- **AWS** for comprehensive cloud infrastructure and services
- **GitHub** for version control and CI/CD
- **Font Awesome** for professional icons
- **Google Fonts** for typography
- **CloudFlare** for CDN services

---

**Built with ❤️ using AWS cloud infrastructure and modern DevOps practices**

*Last updated: June 2025* 
