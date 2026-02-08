// Popup script

document.addEventListener('DOMContentLoaded', function() {
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');
  const errorMessage = document.getElementById('error-message');
  const jobInfo = document.getElementById('job-info');
  const jobTitle = document.getElementById('job-title');
  const companyName = document.getElementById('company-name');
  const instructions = document.getElementById('instructions');
  const results = document.getElementById('results');
  const searchBtn = document.getElementById('search-btn');
  const profilesContainer = document.getElementById('profiles-container');
  const sameRoleLink = document.getElementById('same-role-link');
  const recruitersLink = document.getElementById('recruiters-link');

  let currentJobDetails = null;

  // Check if we're on a LinkedIn job page
  function checkCurrentPage() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const currentTab = tabs[0];
      
      if (!currentTab.url.includes('linkedin.com/jobs/view/')) {
        showInstructions();
        return;
      }

      // Get job details from storage
      chrome.storage.local.get(['currentJobDetails', 'lastUpdated'], function(data) {
        if (data.currentJobDetails && data.currentJobDetails.jobTitle && data.currentJobDetails.companyName) {
          currentJobDetails = data.currentJobDetails;
          displayJobInfo();
        } else {
          // Try to get details from content script
          chrome.tabs.sendMessage(currentTab.id, { type: 'GET_JOB_DETAILS' }, function(response) {
            if (chrome.runtime.lastError) {
              showError('Unable to extract job details. Please refresh the page.');
              return;
            }
            
            if (response && response.jobTitle && response.companyName) {
              currentJobDetails = response;
              chrome.storage.local.set({ currentJobDetails: currentJobDetails });
              displayJobInfo();
            } else {
              showError('Could not find job details on this page. Make sure you\'re viewing a job posting.');
            }
          });
        }
      });
    });
  }

  function showInstructions() {
    loading.classList.add('hidden');
    error.classList.add('hidden');
    jobInfo.classList.add('hidden');
    results.classList.add('hidden');
    instructions.classList.remove('hidden');
  }

  function showError(message) {
    loading.classList.add('hidden');
    instructions.classList.add('hidden');
    jobInfo.classList.add('hidden');
    results.classList.add('hidden');
    errorMessage.textContent = message;
    error.classList.remove('hidden');
  }

  function displayJobInfo() {
    loading.classList.add('hidden');
    error.classList.add('hidden');
    instructions.classList.add('hidden');
    
    jobTitle.textContent = currentJobDetails.jobTitle;
    companyName.textContent = currentJobDetails.companyName;
    
    jobInfo.classList.remove('hidden');
    results.classList.remove('hidden');
  }

  function constructSearchUrls() {
    const companyName = currentJobDetails.companyName;
    const jobTitle = currentJobDetails.jobTitle;
    
    // LinkedIn requires searching BY COMPANY PAGE first, then filtering by role
    // The most reliable approach is to use the company page URL pattern
    
    // Method 1: Direct company search with role keyword
    // This opens the company's people page filtered by the role
    const companySlug = companyName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    
    // Search URL that focuses on COMPANY FIRST, then role
    const sameRoleUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(companyName + ' ' + jobTitle)}&origin=FACETED_SEARCH`;
    
    // For recruiters at the SAME company
    const recruitersUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(companyName + ' recruiter OR talent acquisition OR human resources')}&origin=FACETED_SEARCH`;
    
    return {
      sameRoleUrl,
      recruitersUrl
    };
  }

  function displaySearchLinks() {
    const urls = constructSearchUrls();
    
    // Set the company name in the instructions
    document.getElementById('company-filter-name').textContent = currentJobDetails.companyName;
    
    // Create clickable links
    sameRoleLink.innerHTML = `<a href="${urls.sameRoleUrl}" target="_blank" class="profile-link">Search: ${currentJobDetails.jobTitle}</a>`;
    
    recruitersLink.innerHTML = `<a href="${urls.recruitersUrl}" target="_blank" class="profile-link">Search: Recruiters & HR</a>`;
    
    profilesContainer.classList.remove('hidden');
  }

  // Event listeners
  searchBtn.addEventListener('click', function() {
    if (currentJobDetails) {
      displaySearchLinks();
      searchBtn.textContent = 'Refresh Search Links';
    }
  });

  // Initialize
  loading.classList.remove('hidden');
  checkCurrentPage();
});
