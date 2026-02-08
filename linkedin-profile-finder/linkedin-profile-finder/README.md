# LinkedIn Profile Finder - Chrome Extension

A Chrome extension that helps you find LinkedIn profiles of people working in similar roles and recruiters/HR professionals at a company when viewing LinkedIn job postings.

## Features

- 🎯 **Automatic Job Detection**: Detects when you're viewing a LinkedIn job posting
- 👥 **Same Role Profiles**: Generates search links to find people in similar roles at the company
- 🤝 **Recruiter Finder**: Generates search links to find recruiters and HR professionals at the company
- 🔗 **Direct LinkedIn Search**: Opens LinkedIn search with pre-filled queries for easy profile discovery
- 🚀 **Simple & Clean UI**: Easy-to-use popup interface

## Installation

### Step 1: Download the Extension

1. Download or clone this repository to your local machine
2. Extract the files if downloaded as ZIP

### Step 2: Install in Chrome

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **"Load unpacked"**
5. Select the `linkedin-profile-finder` folder
6. The extension icon should appear in your Chrome toolbar

## How to Use

### Step 1: Navigate to a LinkedIn Job Posting

1. Go to [LinkedIn](https://www.linkedin.com)
2. Search for jobs or navigate to any job posting
3. Open a specific job posting (URL should contain `/jobs/view/`)

### Step 2: Open the Extension

1. Click on the **LinkedIn Profile Finder** extension icon in your Chrome toolbar
2. The extension will automatically detect the job title and company name

### Step 3: Find Profiles

1. Click the **"Find Profiles"** button
2. Two LinkedIn search links will appear:
   - **Same Role Profiles**: Search for people with similar job titles at the company
   - **Recruiters & HR**: Search for recruiters and HR professionals at the company

3. Click on either link to open a LinkedIn search in a new tab
4. Browse through the search results to find relevant profiles
5. Click on individual profiles to view their LinkedIn pages

## How It Works

1. **Content Script**: Automatically extracts job title and company name from LinkedIn job posting pages
2. **Search Generation**: Constructs optimized LinkedIn search URLs based on the job details
3. **Profile Discovery**: Opens LinkedIn searches that you can browse to find relevant profiles

## Important Notes

### Privacy & LinkedIn Terms

- This extension **does not scrape** LinkedIn profiles automatically
- It generates search URLs that open in LinkedIn's own search interface
- You manually browse and view profiles through LinkedIn's official interface
- Respects LinkedIn's terms of service and privacy policies

### Limitations

- Requires you to be logged into LinkedIn
- Search results depend on your LinkedIn network and connection level
- LinkedIn may limit search results based on your account type (Free vs Premium)
- Extension only works on LinkedIn job posting pages

## File Structure

```
linkedin-profile-finder/
├── manifest.json          # Extension configuration
├── content.js            # Extracts job details from LinkedIn pages
├── background.js         # Background service worker
├── popup.html           # Extension popup interface
├── popup.css            # Popup styling
├── popup.js             # Popup functionality
├── icons/               # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md            # This file
```

## Troubleshooting

### Extension doesn't detect job details

- Make sure you're on a job posting page (URL contains `/jobs/view/`)
- Refresh the page and try again
- LinkedIn's page structure may have changed; the extension might need updating

### Search links don't work

- Make sure you're logged into LinkedIn
- Click the links to open searches in new tabs
- LinkedIn may require you to complete a CAPTCHA if you search too frequently

### Extension icon doesn't appear

- Check that the extension is enabled in `chrome://extensions/`
- Try reloading the extension
- Restart Chrome if needed

## Technical Details

- **Manifest Version**: 3
- **Permissions**: 
  - `activeTab`: Access current tab
  - `scripting`: Inject content scripts
  - `storage`: Store job details
  - `host_permissions`: Access LinkedIn.com

## Privacy

This extension:
- Only runs on LinkedIn.com
- Does not collect or transmit any personal data
- Does not store any profile information
- Only stores current job title and company name locally in your browser
- Does not make external API calls

## Updates & Maintenance

LinkedIn frequently updates their website structure. If the extension stops working:

1. Check for updates to this extension
2. Report issues with specific job posting URLs
3. The selectors in `content.js` may need to be updated

## License

This project is provided as-is for educational and personal use.

## Disclaimer

This extension is not affiliated with, endorsed by, or sponsored by LinkedIn Corporation. LinkedIn is a trademark of LinkedIn Corporation. Use this extension responsibly and in accordance with LinkedIn's Terms of Service.

---

**Version**: 1.0.0  
**Last Updated**: February 2026
