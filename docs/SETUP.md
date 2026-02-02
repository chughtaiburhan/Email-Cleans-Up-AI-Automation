# 📖 Detailed Setup Guide

## Step-by-Step Installation

### 1. Create Google Apps Script Project

1. Open [script.google.com](https://script.google.com)
2. Sign in with your Google account
3. Click **"+ New project"**
4. Name it "Email Cleanup Pro"

### 2. Add the Backend Code

1. You'll see a file called `Code.gs`
2. Delete the default content
3. Copy the entire contents of `Code.gs` from this repository
4. Paste into the editor
5. Press Ctrl+S (Cmd+S on Mac) to save

### 3. Add the Frontend Interface

1. Click the **+** button next to "Files"
2. Select **"HTML"**
3. Name it exactly: `Index` (capital I)
4. Delete any default content
5. Copy the entire contents of `Index.html` from this repository
6. Paste into the editor
7. Press Ctrl+S to save

### 4. Deploy as Web App

1. Click **"Deploy"** button (top right)
2. Select **"New deployment"**
3. Click the gear icon ⚙️
4. Select **"Web app"**
5. Configure:
   - **Description**: "Email Cleanup Pro v1.0"
   - **Execute as**: Me (your email)
   - **Who has access**: 
     - "Only myself" (for personal use)
     - "Anyone" (if sharing with others)
6. Click **"Deploy"**

### 5. Grant Permissions

1. Click **"Authorize access"**
2. Select your Google account
3. You'll see a warning "Google hasn't verified this app"
   - This is normal for personal scripts
4. Click **"Advanced"**
5. Click **"Go to Email Cleanup Pro (unsafe)"**
6. Review permissions:
   - Read, compose, send, and permanently delete email
7. Click **"Allow"**

### 6. Access Your Web App

1. Copy the deployment URL (looks like: `https://script.google.com/macros/s/xxxxx/exec`)
2. Paste in a new browser tab
3. You should see the Email Cleanup Pro interface!

### 7. Initial Configuration

1. **Test First**: Use the default settings (30 days)
2. Click **"Preview Emails"** to see what would be deleted
3. Review the list carefully
4. If satisfied, click **"Run Cleanup Now"**
5. Check your Gmail Trash to verify

### 8. Set Up Automation (Optional)

1. In the web app, go to **Settings**
2. Choose **Automatic Schedule**: Daily or Weekly
3. Toggle **Enable Automatic Cleanup** to ON
4. Click **"Save Settings"**

The script will now run automatically!

## Troubleshooting

### Error: "No HTML file named Index was found"

**Solution**: Make sure the HTML file is named exactly `Index` (capital I, no extension)

### Error: "Exception: No item with the given ID could be found"

**Solution**: Re-authorize the script:
1. Go to [myaccount.google.com/permissions](https://myaccount.google.com/permissions)
2. Remove "Email Cleanup Pro"
3. Re-deploy and re-authorize

### Trigger Not Running

**Solution**: 
1. Open Apps Script editor
2. Click the clock icon (Triggers) on left
3. Verify your trigger is listed
4. Check execution logs for errors

### Settings Not Saving

**Solution**: Check browser console for errors (F12)

## Advanced Configuration

### Custom Search Queries
```javascript
// Delete promotional emails older than 30 days
category:promotions older_than:30d

// Delete unread emails older than 90 days
is:unread older_than:90d

// Delete emails from specific sender
from:newsletter@example.com older_than:30d

// Multiple conditions
(category:promotions OR category:social) older_than:30d

// Exclude important emails
-is:starred -is:important older_than:30d
```

### Performance Optimization

For large inboxes (1000+ emails to clean):

1. Increase `BATCH_SIZE` in Code.gs to 500
2. Use the `aggressiveCleanup()` function
3. Run multiple times if needed

## Security Best Practices

1. ✅ Use "Only myself" access for personal use
2. ✅ Review preview before running cleanup
3. ✅ Start with longer time periods (60-90 days)
4. ✅ Test on a secondary Gmail account first
5. ✅ Keep backup of important emails

## Getting Help

- 📖 Check the [README](../README.md)
- 🐛 [Open an issue](https://github.com/yourusername/email-cleanup-automation/issues)
- 💬 [Start a discussion](https://github.com/yourusername/email-cleanup-automation/discussions)