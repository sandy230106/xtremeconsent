# Deployment Guide - Vercel + AWS DynamoDB

This guide outlines how to deploy your dynamic Tattoo Consent Form application using AWS DynamoDB for cloud storage and Vercel for web hosting.

## Prerequisites
- AWS Account (create at https://aws.amazon.com)
- Vercel Account (create at https://vercel.com)
- GitHub Account with your repository pushed

---

## Step 1: Set Up AWS DynamoDB

### Create DynamoDB Tables
You will need to create two tables in the AWS DynamoDB Console (under your preferred region, e.g., `us-east-1`):

1. **`consent_forms` Table**
   - **Table Name:** `consent_forms`
   - **Partition Key:** `id` (Type: **String**)
   - **Sort Key:** None
   - Leave other settings as default (or choose **On-Demand** capacity to stay cost-efficient).

2. **`consent_questions` Table**
   - **Table Name:** `consent_questions`
   - **Partition Key:** `id` (Type: **String**)
   - **Sort Key:** None
   - Leave other settings as default (or choose **On-Demand** capacity).

---

## Step 2: Set Up AWS Credentials & Permissions

To allow Vercel to securely connect to your DynamoDB tables, you need to create an IAM User in AWS with permission to read and write to DynamoDB.

### Create IAM User and Access Keys
1. Go to the **IAM Console** in AWS.
2. Click **Users** > **Create User**.
3. Set the username (e.g., `xtreme-consent-app`) and proceed.
4. Set permissions by attaching policies directly:
   - Search for and select **`AmazonDynamoDBFullAccess`** (or create a custom IAM policy targeting only the `consent_forms` and `consent_questions` tables for stricter security).
5. Complete user creation.
6. Click on the created user name, navigate to the **Security credentials** tab.
7. Click **Create access key** under **Access keys**.
8. Select **Command Line Interface (CLI)** or **Application running outside AWS** and proceed.
9. **Save the Access Key ID and Secret Access Key securely!** (Keep these secret).

---

## Step 3: Local Testing and Environment Setup

### 1. Set up `.env.local`
Create a file named `.env.local` in your root project directory (this is already ignored in `.gitignore`) and fill in your AWS credentials:

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY
DYNAMODB_TABLE_CONSENT_FORMS=consent_forms
DYNAMODB_TABLE_CONSENT_QUESTIONS=consent_questions
```

### 2. Run Locally
```bash
npm install
npm run dev
```
Open http://localhost:3000 to verify the application.

---

## Step 4: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)
1. Go to [Vercel](https://vercel.com).
2. Click **New Project** and import your GitHub repository (`xtremeconsent`).
3. Under **Configure Project**, expand the **Environment Variables** section.
4. Add the following **5 environment variables**:
   - `AWS_REGION` = `us-east-1` (or your chosen AWS region)
   - `AWS_ACCESS_KEY_ID` = `YOUR_AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY` = `YOUR_AWS_SECRET_ACCESS_KEY`
   - `DYNAMODB_TABLE_CONSENT_FORMS` = `consent_forms`
   - `DYNAMODB_TABLE_CONSENT_QUESTIONS` = `consent_questions`
5. Click **Deploy**! Vercel will automatically compile, build, and publish your website.

### Option B: Using Vercel CLI
If you prefer deploying from your terminal:
```bash
npm install -g vercel
vercel
# Link and add the environment variables in your Vercel Dashboard, then redeploy:
vercel --prod
```

---

## Step 5: Verify Operations

1. Fill out a consent form on the live site, draw the signatures, capture a camera photo, and click **Submit**.
2. Log into the **AWS DynamoDB Console**, click on the **`consent_forms`** table, and click **Explore table items**. You will see the complete form JSON, signature strings, and photo saved in the cloud.
3. Access the Admin Panel at `/admin` (e.g., `https://your-site.vercel.app/admin`). You will see all submissions loaded.
4. Open **Questions** tab in the admin dashboard. Add a question, and verify it updates in the DynamoDB `consent_questions` table!
