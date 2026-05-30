# Deployment Guide - GitHub ➔ Vercel ➔ Hostinger Domain Linkage

Follow these step-by-step instructions to deploy your landing page on Vercel and link it to your Hostinger domain.

---

## Step 1: Initialize Git and Push to GitHub

1. Open your Mac **Terminal** application.
2. Navigate to your desktop project directory:
   ```bash
   cd ~/Desktop/gurgaon-luxury-landing
   ```
3. Initialize git and make the first commit:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of GoldenAge Gurgaon luxury landing page"
   ```
4. Create a new repository on [GitHub](https://github.com/):
   - Go to GitHub, log in, and click the **New** repository button.
   - Name it (e.g., `gurgaon-luxury-landing`).
   - Keep it Public or Private (either works). Do **not** initialize it with a README, gitignore, or license.
   - Click **Create repository**.
5. Link your local project to GitHub and push the code:
   - Copy the commands shown under "…or push an existing repository from the command line" on GitHub:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/gurgaon-luxury-landing.git
   git push -u origin main
   ```

---

## Step 2: Deploy on Vercel

1. Go to [Vercel](https://vercel.com/) and log in (sign up using your GitHub account for instant access).
2. Once inside the dashboard, click **Add New...** and select **Project**.
3. Under **Import Git Repository**, you will see your GitHub repos. Find `gurgaon-luxury-landing` and click **Import**.
4. Configure Project settings:
   - **Framework Preset:** Select **Other** (since it's a standard static HTML/CSS/JS page).
   - **Root Directory:** `./`
   - Leave Build and Development Settings as default (no commands are needed).
5. Click **Deploy**.
   - Within 15-20 seconds, your site will be live with a free preview URL (e.g., `gurgaon-luxury-landing.vercel.app`).

---

## Step 3: Link Hostinger Domain to Vercel

1. In your Vercel project dashboard, go to **Settings** ➔ **Domains**.
2. Type in your custom domain (e.g., `yourdomain.com` or `goldenagelandbase.com`) and click **Add**.
3. Vercel will show a popup with **DNS Configuration Records** that you need to add to Hostinger. Typically:
   - **For root domain (`yourdomain.com`):**
     - Type: `A`
     - Name: `@`
     - Value: `76.76.21.21`
   - **For subdomain (`www.yourdomain.com`):**
     - Type: `CNAME`
     - Name: `www`
     - Value: `cname.vercel-dns.com`

4. Go to [Hostinger Control Panel](https://hpanel.hostinger.com/) ➔ **Domains** ➔ Select your domain.
5. In the left menu, click **DNS / Nameservers**.
6. Under **DNS Records**, add the records Vercel provided:
   - **Add A Record:**
     - Type: `A`
     - Name: `@`
     - Points to (IP): `76.76.21.21`
     - TTL: Keep default
   - **Add CNAME Record:**
     - Type: `CNAME`
     - Name: `www`
     - Target: `cname.vercel-dns.com`
     - TTL: Keep default
7. Delete any old existing `A` records with Name `@` that point to other servers (if there are active ones pointing to other hosting providers) to avoid conflicts.
8. Wait a few minutes (DNS propagation can take between 5 minutes to a couple of hours). Once connected, Vercel will automatically generate a free SSL Certificate, and your site will be live on your Hostinger domain!
