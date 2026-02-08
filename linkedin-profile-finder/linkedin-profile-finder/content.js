// Content script that runs on LinkedIn job posting pages

console.log('LinkedIn Profile Finder: Content script loaded');

// Extract job details from the page
function extractJobDetails() {
  try {
    let jobTitle = null;
    let companyName = null;

    // Try multiple selectors for job title
    const titleSelectors = [
      'h1.t-24',
      'h1.job-title',
      'h1.jobs-unified-top-card__job-title',
      'h1.jobs-details-top-card__job-title',
      'h2.t-24',
      '.jobs-unified-top-card__job-title',
      '[class*="job-title"]',
      'h1',
      'h2'
    ];

    for (const selector of titleSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim().length > 0) {
        jobTitle = element.textContent.trim();
        console.log('Found job title with selector:', selector, jobTitle);
        break;
      }
    }

    // Try multiple selectors for company name
    const companySelectors = [
      'a.jobs-unified-top-card__company-name',
      'a.job-card-container__company-name',
      '.jobs-unified-top-card__subtitle-primary-grouping a',
      '.jobs-unified-top-card__company-name',
      '[data-anonymize="company-name"]',
      'a[data-tracking-control-name*="company"]',
      '.jobs-details-top-card__company-url',
      'a.app-aware-link[href*="/company/"]',
      '[class*="company-name"]'
    ];

    for (const selector of companySelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim().length > 0) {
        companyName = element.textContent.trim();
        console.log('Found company name with selector:', selector, companyName);
        break;
      }
    }

    // If still not found, try to get company from anywhere on the page
    if (!companyName) {
      const allLinks = document.querySelectorAll('a[href*="/company/"]');
      for (const link of allLinks) {
        const text = link.textContent.trim();
        if (text.length > 0 && text.length < 100 && !text.includes('Show') && !text.includes('Follow')) {
          companyName = text;
          console.log('Found company name from company link:', companyName);
          break;
        }
      }
    }

    console.log('Final extracted job details:', { jobTitle, companyName });
    
    return {
      jobTitle: jobTitle,
      companyName: companyName
    };
  } catch (error) {
    console.error('Error extracting job details:', error);
    return { jobTitle: null, companyName: null };
  }
}

// Send job details to background script
function sendJobDetails() {
  const jobDetails = extractJobDetails();
  
  if (jobDetails.jobTitle && jobDetails.companyName) {
    chrome.runtime.sendMessage({
      type: 'JOB_DETAILS',
      data: jobDetails
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error sending message:', chrome.runtime.lastError);
      } else {
        console.log('Job details sent successfully');
      }
    });
  } else {
    console.log('Could not extract complete job details');
  }
}

// Wait for page to be fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(sendJobDetails, 3000); // Wait 3 seconds for dynamic content
  });
} else {
  setTimeout(sendJobDetails, 3000);
}

// Listen for URL changes (LinkedIn is a SPA)
let lastUrl = location.href;
new MutationObserver(() => {
  const currentUrl = location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    if (currentUrl.includes('/jobs/view/')) {
      setTimeout(sendJobDetails, 3000);
    }
  }
}).observe(document, { subtree: true, childList: true });

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_JOB_DETAILS') {
    const jobDetails = extractJobDetails();
    sendResponse(jobDetails);
  }
  return true;
});
