// Background service worker

let currentJobDetails = null;
let profileResults = {
  sameRole: [],
  recruiters: []
};

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'JOB_DETAILS') {
    currentJobDetails = request.data;
    console.log('Background: Received job details', currentJobDetails);
    
    // Store in chrome.storage for popup access
    chrome.storage.local.set({ 
      currentJobDetails: currentJobDetails,
      lastUpdated: Date.now()
    });
    
    sendResponse({ success: true });
  }
  return true;
});

// Function to construct LinkedIn search URLs
function constructSearchUrls(companyName, jobTitle) {
  const encodedCompany = encodeURIComponent(companyName);
  const encodedJobTitle = encodeURIComponent(jobTitle);
  
  // Company filter format for LinkedIn: currentCompany=["CompanyName"]
  // URL encoded: currentCompany=%5B%22CompanyName%22%5D
  const companyFilter = `&currentCompany=%5B%22${encodedCompany}%22%5D`;
  
  // Search for people with similar job title AT THE SAME COMPANY
  const sameRoleUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodedJobTitle}${companyFilter}&origin=FACETED_SEARCH`;
  
  // Search for recruiters/HR AT THE SAME COMPANY
  const recruitersUrl = `https://www.linkedin.com/search/results/people/?keywords=recruiter%20OR%20%22talent%20acquisition%22%20OR%20%22human%20resources%22%20OR%20HR${companyFilter}&origin=FACETED_SEARCH`;
  
  return {
    sameRoleUrl,
    recruitersUrl
  };
}

// Listen for requests from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_SEARCH_URLS') {
    if (currentJobDetails && currentJobDetails.companyName && currentJobDetails.jobTitle) {
      const urls = constructSearchUrls(currentJobDetails.companyName, currentJobDetails.jobTitle);
      sendResponse({ 
        success: true, 
        urls: urls,
        jobDetails: currentJobDetails
      });
    } else {
      sendResponse({ 
        success: false, 
        error: 'No job details available' 
      });
    }
  }
  return true;
});
