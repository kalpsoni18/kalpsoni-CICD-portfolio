# Kalp Soni Portfolio Website

This is a personal portfolio website for Kalp Soni, showcasing expertise as a Cloud & DevOps Engineer. The site is built using pure HTML, CSS, and JavaScript and is designed to be hosted on AWS.

## Project Structure
```
portfolio/
├── index.html        # Main HTML file
├── styles.css        # CSS styles
├── script.js         # JavaScript for interactivity
└── README.md         # This file
```

## Deployment Instructions

### 1. Deploy to AWS S3 (Static Hosting)
1. **Create an S3 Bucket**:
   - Log in to the AWS Management Console.
   - Navigate to S3 and create a bucket (e.g., `kalpsoni-portfolio`).
   - Ensure the bucket name is unique and region-appropriate.

2. **Configure the Bucket for Static Website Hosting**:
   - Go to the bucket's **Properties** tab.
   - Enable **Static website hosting**.
   - Set `index.html` as the index document.
   - Note the bucket's endpoint URL (e.g., `http://kalpsoni-portfolio.s3-website-us-east-1.amazonaws.com`).

3. **Upload Files**:
   - Go to the **Objects** tab.
   - Upload `index.html`, `styles.css`, and `script.js`.
   - Ensure all files are publicly readable (set ACL to `public-read` or use a bucket policy).

4. **Set Bucket Policy**:
   - Go to the **Permissions** tab and add the following bucket policy to allow public read access:
     ```json
     {
         "Version": "2012-10-17",
         "Statement": [
             {
                 "Sid": "PublicReadGetObject",
                 "Effect": "Allow",
                 "Principal": "*",
                 "Action": "s3:GetObject",
                 "Resource": "arn:aws:s3:::kalpsoni-portfolio/*"
             }
         ]
     }
     ```

5. **Test the Site**:
   - Access the site using the S3 website endpoint.

### 2. Deploy to AWS Amplify (Optional)
1. **Connect to a Git Repository**:
   - Push the project files to a GitHub repository.
   - In the AWS Amplify Console, connect your repository.

2. **Configure Build Settings**:
   - Amplify auto-detects static sites. Use the default `amplify.yml`:
     ```yaml
     version: 1
     frontend:
       phases:
         build:
           commands:
             - echo "No build required"
       artifacts:
         baseDirectory: /
         files:
           - '**/*'
       cache:
         paths: []
     ```

3. **Deploy**:
   - Amplify will build and deploy the site. Access the provided URL.

### 3. Deploy to EC2 with Nginx (Optional)
1. **Launch an EC2 Instance**:
   - Use an Amazon Linux 2 AMI.
   - Configure a security group to allow HTTP (port 80) and HTTPS (port 443).

2. **Install Nginx**:
   ```bash
   sudo amazon-linux-extras install nginx1
   sudo systemctl enable nginx
   sudo systemctl start nginx
   ```

3. **Upload Files**:
   - Copy the project files to `/usr/share/nginx/html/` using SCP or SFTP.

4. **Test the Site**:
   - Access the EC2 public IP or DNS.

### 4. Configure Custom Domain and SSL (Optional)
1. **Register a Domain**:
   - Use AWS Route 53 or another registrar.

2. **Set Up CloudFront**:
   - Create a CloudFront distribution.
   - Set the origin to your S3 bucket or EC2 instance.
   - Configure SSL using AWS Certificate Manager (ACM) for free certificates.

3. **Update DNS**:
   - In Route 53, create an A record pointing to the CloudFront distribution.

4. **Enforce HTTPS**:
   - In CloudFront, set the Viewer Protocol Policy to "Redirect HTTP to HTTPS".

## AWS Security Best Practices
1. **S3 Bucket Security**:
   - Enable **Block Public Access** except for the bucket policy allowing `s3:GetObject`.
   - Use AWS IAM roles for access instead of public access when possible.
   - Enable S3 versioning to recover from accidental deletes.

2. **CloudFront Security**:
   - Use AWS WAF to protect against common web exploits.
   - Enable **Geo-restriction** if the site is region-specific.
   - Use signed URLs or cookies for restricted content.

3. **SSL/TLS**:
   - Always use HTTPS with a valid SSL certificate (e.g., via ACM).
   - Configure CloudFront to use TLSv1.2 or higher.

4. **Monitoring and Logging**:
   - Enable CloudFront access logs to monitor traffic.
   - Use AWS CloudTrail to track API calls to S3 and other services.

## Local Development
1. Clone the repository.
2. Open `index.html` in a browser to preview locally.
3. Use a local server (e.g., `python -m http.server`) for better testing.

## Notes
- The contact form logs data to the console. For production, integrate with an AWS Lambda function via API Gateway.
- Ensure icon URLs in `styles.css` are accessible or replace with local assets.
- The site is optimized for Unix-based systems and AWS deployment.