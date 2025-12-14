# Netlify Deployment Guide - Step by Step

## 📋 Prerequisites
- GitHub repository me code push ho chuka hai
- Netlify account (free account kaafi hai)

---

## 🚀 Step-by-Step Deployment Process

### Step 1: Netlify Account Banayein
1. Browser me jayein: https://www.netlify.com
2. "Sign up" par click karein
3. GitHub account se sign up karein (recommended) ya email se

### Step 2: New Site Create Karein
1. Netlify dashboard me jayein
2. "Add new site" button par click karein
3. "Import an existing project" select karein
4. "Deploy with GitHub" par click karein

### Step 3: GitHub Repository Connect Karein
1. GitHub se authorize karein (agar pehle se nahi kiya)
2. Apni repository select karein: `mrdevelopersoft-34/mmo-gamee-backend`
3. "Configure the Netlify app on GitHub" par click karein
4. Repository access allow karein

### Step 4: Build Settings Configure Karein
Netlify automatically detect kar lega, lekin verify karein:

**Build settings:**
- **Base directory:** (khali chhod dein)
- **Build command:** `npm install` (ya khali chhod dein - automatic)
- **Publish directory:** `.` (dot - current directory)

**Advanced settings me:**
- **Functions directory:** `netlify/functions`

### Step 5: Environment Variables Add Karein
1. "Site settings" me jayein
2. "Environment variables" section me jayein
3. "Add variable" par click karein
4. Ye variables add karein:

```
MONGO_URI = your_mongodb_connection_string
JWT_SECRET = your_jwt_secret_key
PORT = (Netlify automatically set karega, isko add karne ki zarurat nahi)
FACEBOOK_APP_ID = (agar use kar rahe hain)
FACEBOOK_APP_SECRET = (agar use kar rahe hain)
FACEBOOK_CALLBACK_URL = https://your-site.netlify.app/api/auth/facebook/callback
```

**Important:** 
- `FACEBOOK_CALLBACK_URL` me apna Netlify site URL use karein
- MongoDB Atlas ka connection string use karein (agar cloud database use kar rahe hain)

### Step 6: Deploy Karein
1. "Deploy site" button par click karein
2. Netlify automatically build aur deploy shuru karega
3. 2-3 minutes wait karein
4. Deployment complete hone ke baad apna site URL milega

### Step 7: Test Karein
1. Apna Netlify site URL open karein (jaise: `https://your-site-name.netlify.app`)
2. Health check: `https://your-site-name.netlify.app/` - ye JSON response dega
3. API test: `https://your-site-name.netlify.app/api/auth/signup`

---

## 🔧 Important Notes

### Database Connection
- MongoDB Atlas use karein (free tier available)
- Connection string me IP whitelist me `0.0.0.0/0` add karein (sab IPs allow karein)
- Ya Netlify ke server IPs whitelist karein

### Facebook OAuth (Agar use kar rahe hain)
1. Facebook Developer Console me jayein
2. App settings me "Valid OAuth Redirect URIs" me add karein:
   ```
   https://your-site-name.netlify.app/api/auth/facebook/callback
   ```

### Function Timeout
- Netlify Functions ka default timeout 10 seconds hai
- Agar database connection slow hai, to Netlify dashboard me timeout increase kar sakte hain
- Pro plan me 26 seconds tak milta hai

---

## 🐛 Troubleshooting

### Error: "Function execution timeout"
- Database connection optimize karein
- MongoDB Atlas me connection pooling enable karein

### Error: "Module not found"
- `package.json` me sab dependencies check karein
- Netlify build logs check karein

### Database Connection Issues
- MongoDB Atlas me IP whitelist check karein
- Connection string verify karein
- Environment variables correctly set hain ya nahi check karein

---

## 📝 Useful Commands

### Local Testing (Netlify Dev)
```bash
npm install -g netlify-cli
netlify dev
```
Ye local me Netlify environment simulate karega.

### Manual Deploy (CLI se)
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

---

## ✅ Deployment Complete!

Agar sab kuch sahi se setup hai, to aapka backend ab Netlify par live hai!

**API Base URL:** `https://your-site-name.netlify.app`

**Endpoints:**
- Health Check: `GET /`
- Sign Up: `POST /api/auth/signup`
- Sign In: `POST /api/auth/signin`
- Profile: `GET /api/profile` (requires auth)
- API Docs: `GET /api-docs`

---

## 🆘 Help

Agar koi issue aaye:
1. Netlify dashboard me "Deploy logs" check karein
2. "Function logs" me errors dekh sakte hain
3. Environment variables verify karein

Good luck! 🚀

