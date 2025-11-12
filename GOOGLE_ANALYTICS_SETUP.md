# Google Analytics Setup Guide

## ✅ Google Analytics has been successfully implemented!

Google Analytics tracking code has been added to all pages of your Mantravi website.

## 📋 Next Steps - How to Get Your Google Analytics ID

### Step 1: Create a Google Analytics Account
1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click "Start measuring" or "Create Account"

### Step 2: Set Up a Property
1. Enter your account name (e.g., "Mantravi")
2. Configure data sharing settings (optional)
3. Click "Next"

### Step 3: Create a Data Stream
1. Choose "Web" as your platform
2. Enter your website URL: `https://mantravi.com` (or your domain)
3. Enter a stream name (e.g., "Mantravi Website")
4. Click "Create stream"

### Step 4: Get Your Measurement ID
1. After creating the stream, you'll see your **Measurement ID**
2. It will look like: `G-XXXXXXXXXX` (starts with "G-" followed by letters and numbers)
3. Copy this ID

### Step 5: Add Your Measurement ID to the Website
1. Open the file: `config/analytics-config.js`
2. Find this line:
   ```javascript
   GA_MEASUREMENT_ID: 'G-XXXXXXXXXX', // TODO: Replace with your actual GA4 Measurement ID
   ```
3. Replace `'G-XXXXXXXXXX'` with your actual Measurement ID
4. Example:
   ```javascript
   GA_MEASUREMENT_ID: 'G-ABC123XYZ',
   ```
5. Save the file

### Step 6: Verify It's Working
1. Visit your website
2. Go to Google Analytics dashboard
3. Click "Realtime" in the left menu
4. You should see your visit appear within a few seconds

## 🔧 Configuration Options

### Enable/Disable Analytics
In `config/analytics-config.js`, you can disable analytics by setting:
```javascript
ENABLED: false
```

This is useful for:
- Development/testing
- Temporarily disabling tracking
- Privacy compliance during setup

### Privacy Settings
The implementation includes privacy-friendly settings:
- **IP Anonymization**: Enabled (IP addresses are anonymized)
- **Google Signals**: Disabled (no cross-device tracking)
- **Ad Personalization**: Disabled (no ad personalization)

## 📊 What Gets Tracked

Google Analytics will automatically track:
- **Page views**: Every page visit
- **User sessions**: How long users stay
- **Traffic sources**: Where visitors come from
- **Device information**: Mobile, desktop, tablet
- **Geographic data**: Country, city (anonymized)
- **User flow**: Which pages users visit

## 🎯 Advanced Tracking (Optional)

You can add custom event tracking for:
- Form submissions (consultation form)
- Button clicks (CTA buttons)
- Downloads
- Video plays
- And more...

Contact your developer if you want to add custom event tracking.

## 📁 Files Modified

The following files have been updated:
- `config/analytics-config.js` - Configuration file (NEW)
- `components/analytics/google-analytics.html` - Analytics component (NEW)
- `components/head/head.html` - Head component (UPDATED)
- `pages/home/index.html` - Homepage (UPDATED)
- `pages/blog/index.html` - Blog page (UPDATED)
- `pages/blog/post.html` - Blog post page (UPDATED)
- `pages/services/index.html` - Services page (UPDATED)
- `pages/about/index.html` - About page (UPDATED)
- `pages/contact/index.html` - Contact page (UPDATED)
- `pages/work-with-us/index.html` - Work with us page (UPDATED)

## ⚠️ Important Notes

1. **Replace the placeholder ID**: The code won't work until you replace `G-XXXXXXXXXX` with your actual Measurement ID
2. **Privacy compliance**: Make sure you have a privacy policy and cookie consent if required by law (GDPR, CCPA, etc.)
3. **Testing**: Test in a private/incognito window to see your own visits
4. **Data delay**: Some reports may take 24-48 hours to show data

## 🆘 Troubleshooting

### Analytics not working?
1. Check that you've replaced `G-XXXXXXXXXX` with your actual ID
2. Clear your browser cache
3. Check browser console for errors (F12)
4. Verify the config file path is correct

### Need help?
- [Google Analytics Help Center](https://support.google.com/analytics)
- [GA4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)

---

**Setup completed on:** $(date)
**Status:** ✅ Ready - Just add your Measurement ID!

