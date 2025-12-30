# 📤 GitHub Submission Guide

## Step-by-Step Instructions for Pushing to GitHub

### Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and log in
2. Click the **"+"** button in the top right → **"New repository"**
3. Fill in the details:
   - **Repository name**: `smart-agriculture-system`
   - **Description**: `ML-powered crop yield prediction and health analysis platform`
   - **Visibility**: Choose **Public** (for submission)
   - **DO NOT** initialize with README (we already have one)
4. Click **"Create repository"**

### Step 2: Configure Git (First Time Only)

Open terminal/command prompt and run:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 3: Prepare Your Project

**IMPORTANT**: Before pushing, update these files:

1. **PROJECT_INFO.md** - Fill in:
   - [ ] Team ID
   - [ ] Track Number
   - [ ] Track Name  
   - [ ] Team Member Information (names, emails, GitHub usernames)
   - [ ] GitHub repository URL
   - [ ] Google Drive folder URL

2. **README.md** - Update:
   - [ ] Your GitHub username in clone command
   - [ ] Contact information

3. **Create .env.example files**:

**backend/.env.example**:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=crop_yield_db
```

**frontend/.env.example**:
```env
VITE_API_BASE_URL=http://localhost:5000
```

4. **Remove sensitive data**:
   - [ ] Check that `.env` files are NOT being pushed (they're in .gitignore)
   - [ ] Remove any passwords from code
   - [ ] Remove API keys from code

### Step 4: Initialize and Push to GitHub

Run these commands in your project folder:

```bash
# Navigate to your project
cd C:\Users\rudra_tcdxpko\OneDrive\Desktop\cropyield

# Add all files
git add .

# Commit with a message
git commit -m "Initial commit: Smart Agriculture System"

# Add your GitHub repository as remote
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/smart-agriculture-system.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 5: Verify Upload

1. Go to your GitHub repository URL
2. Check that all files are visible
3. Click on README.md to verify it displays correctly
4. Check PROJECT_INFO.md is present

### Step 6: Upload to Google Drive

1. **Create a folder** on Google Drive named: `Smart-Agriculture-System-[TEAM_ID]`
2. **Upload these files/folders**:
   - [ ] Entire `backend/` folder
   - [ ] Entire `frontend/` folder  
   - [ ] README.md
   - [ ] PROJECT_INFO.md
   - [ ] Any presentation files
   - [ ] Screenshots folder (if you have)

3. **Set sharing permissions**:
   - Right-click folder → Share
   - Change to "Anyone with the link can view"
   - Copy the link

4. **Update PROJECT_INFO.md** with the Google Drive link

### Step 7: Final Checklist

- [ ] GitHub repository is public
- [ ] All code files are pushed
- [ ] README.md is complete
- [ ] PROJECT_INFO.md has all required information filled
- [ ] .env files are NOT in the repository
- [ ] Google Drive folder contains all files
- [ ] Google Drive link is accessible (test in incognito mode)
- [ ] Both links are updated in PROJECT_INFO.md
- [ ] Team member information is complete

### Common Issues & Solutions

**Issue**: `git push` asks for username/password  
**Solution**: Use a Personal Access Token instead of password
- Go to GitHub → Settings → Developer settings → Personal access tokens
- Generate new token with `repo` scope
- Use token as password

**Issue**: Large files won't upload  
**Solution**: 
- ML model files might be too large
- Consider using Git LFS or hosting models separately
- Or add `*.pkl` to .gitignore if model is very large

**Issue**: `node_modules/` is being uploaded  
**Solution**: 
- Make sure `.gitignore` exists in frontend folder
- Run `git rm -r --cached node_modules` if already committed

### Need Help?

- GitHub Guides: https://guides.github.com/
- Git Documentation: https://git-scm.com/doc
- Markdown Guide: https://www.markdownguide.org/

---

**Ready to submit!** 🎉

Once completed, you'll have:
- ✅ GitHub repository with complete code
- ✅ Google Drive backup
- ✅ Proper documentation
- ✅ All submission requirements met
