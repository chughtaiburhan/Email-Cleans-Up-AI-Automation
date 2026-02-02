# 📧 Email Cleanup Pro

Automatically clean and organize your Gmail inbox using Google Apps Script.

![Email Cleanup Pro](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

Copy The Email AI Automation URL: https://script.google.com/macros/s/AKfycbyXMxbTS27KlD8EcLa_PfMX8i_wjVd300RcEzlVh-sfLx4zZoX6_j5TCslfpRc_x7hZ/exec
## 🌟 Features

- ✨ Automatic email cleanup based on age
- 🎯 Advanced Gmail search queries
- 📊 Real-time statistics dashboard
- 🔄 Scheduled automation (daily/weekly)
- 👀 Preview emails before deletion
- 📱 Fully responsive design
- 🎨 Clean Shadcn UI-inspired interface

## 📖 Usage

### Basic Configuration

1. **Set Email Age**: Choose how old emails should be before deletion (default: 30 days)
2. **Choose Action**: Move to trash or archive
3. **Enable Automation**: Set daily or weekly schedule
4. **Save Settings**: Click "Save Settings"

### Advanced Search Queries
```
older_than:30d                          # Delete emails older than 30 days
category:promotions older_than:30d      # Delete promotional emails
from:newsletter@example.com             # From specific sender
larger:5M older_than:60d                # Large emails over 5MB
-is:starred older_than:30d              # Exclude starred emails
```

### Preview Before Cleanup

Always click "Preview Emails" before running cleanup to see what will be deleted!

## 🎯 Use Cases

- 📬 Remove old newsletter subscriptions
- 🛍️ Clean up promotional emails
- 📢 Delete social media notifications
- 💾 Archive large old attachments
- 🧹 General inbox maintenance

## 🛡️ Security & Privacy

- ✅ Runs entirely in YOUR Google account
- ✅ No data sent to external servers
- ✅ Open source - inspect the code
- ✅ You control all permissions
- ✅ Can revoke access anytime

## 📊 Screenshots

![Dashboard](docs/screenshots/dashboard.png)
![Settings](docs/screenshots/settings.png)
![Preview](docs/screenshots/preview.png)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This software permanently deletes emails. Always:
- Test with non-critical emails first
- Use the preview feature before cleanup
- Verify your search queries
- Keep backups of important emails

**The creators are not responsible for accidental data loss.**

## 💡 Support

- 📫 Open an issue for bug reports
- 💬 Start a discussion for feature requests
- ⭐ Star this repo if you find it helpful!

## 🗺️ Roadmap

- [ ] Multi-account support
- [ ] Email export before deletion
- [ ] Custom label management
- [ ] Undo functionality
- [ ] Email templates
- [ ] API integration

## 👨‍💻 Author

**Your Name**
- GitHub: [Muhammad Burhan Chughtai](https://github.com/chughtaiburhan)

## 🙏 Acknowledgments

- Inspired by Shadcn UI design system
- Built with Google Apps Script
- Icons from Emoji

---

Made with  for a cleaner inbox
```

#### **.gitignore**
```
# Google Apps Script
*.json
appsscript.json

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Dependencies
node_modules/

# Environment
.env
.env.local

# Build
dist/
build/

# User data
user-data/