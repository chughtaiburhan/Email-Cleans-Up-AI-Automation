/**
 * Email Cleanup Pro - Backend
 * Optimized for performance and reliability
 */

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Email Cleanup Pro')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Robust include function to prevent "undefined" errors
 */
function include(filename) {
  if (!filename) return '';
  try {
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
  } catch (e) {
    console.error('Include failed for: ' + filename);
    return '';
  }
}

/* ================================
   CORE OPERATIONS
   ================================ */

function getConfig() {
  const props = PropertiesService.getUserProperties();
  const config = props.getProperties();
  return {
    daysOld: parseInt(config.daysOld, 10) || 30,
    searchQuery: config.searchQuery || 'older_than:30d',
    batchSize: parseInt(config.batchSize, 10) || 100,
    action: config.action || 'trash',
    enabled: config.enabled === 'true'
  };
}

function saveConfig(config) {
  const props = PropertiesService.getUserProperties();
  props.setProperties({
    'daysOld': String(config.daysOld || 30),
    'searchQuery': config.searchQuery || 'older_than:30d',
    'batchSize': String(config.batchSize || 100),
    'action': config.action === 'archive' ? 'archive' : 'trash',
    'enabled': String(config.enabled)
  });
  return { success: true };
}
function deleteEmailsNow(count, action) {
  try {
    const config = getConfig();
    const limit = Math.min(parseInt(count) || 50, 500);
    
    // Fallback if query is missing
    let query = config.searchQuery || 'older_than:30d'; 

    const threads = GmailApp.search(query, 0, limit);
    
    if (!threads || threads.length === 0) {
      return { success: true, message: 'No emails found matching criteria.', count: 0 };
    }

    if (action === 'trash') {
      GmailApp.moveThreadsToTrash(threads);
      logActivity(`Moved ${threads.length} to Trash`, threads.length, 'success');
    } 
    else if (action === 'archive') {
      GmailApp.moveThreadsToArchive(threads);
      logActivity(`Archived ${threads.length} emails`, threads.length, 'success');
    } 
    else if (action === 'permanent') {
      // NOTE: For true permanent delete, you must enable "Gmail API" in Services
      // This implementation moves to trash as a safe fallback
      threads.forEach(thread => {
        thread.moveToTrash();
      });
      logActivity(`Permanently deleted (Moved to Trash) ${threads.length} emails`, threads.length, 'danger');
    }

    return { 
      success: true, 
      message: `Successfully processed ${threads.length} emails.`, 
      count: threads.length 
    };
  } catch (e) {
    console.error(e);
    // This will send the error back to the browser so you can see it
    throw new Error(e.toString()); 
  }
}
function previewEmails(query, limit = 10) {
  try {
    const threads = GmailApp.search(query || 'label:inbox', 0, limit);
    const previews = threads.map(thread => ({
      subject: thread.getFirstMessageSubject() || '(No Subject)',
      from: thread.getMessages()[0].getFrom().replace(/<.*>/, ''), // Clean sender name
      date: thread.getLastMessageDate().toLocaleDateString(),
    }));
    return { success: true, threads: previews };
  } catch (err) {
    return { success: false, message: err.toString() };
  }
}

/* ================================
   LOGGING & STATS
   ================================ */

function logActivity(message, count = 0, type = 'info') {
  const props = PropertiesService.getUserProperties();
  let logs = JSON.parse(props.getProperty('activityLogs') || '[]');
  logs.unshift({ message, count, type, timestamp: new Date().toLocaleString() });
  if (logs.length > 30) logs.pop();
  props.setProperty('activityLogs', JSON.stringify(logs));
}

function getActivityLogs() {
  return JSON.parse(PropertiesService.getUserProperties().getProperty('activityLogs') || '[]');
}

function getStats() {
  const logs = getActivityLogs();
  const today = new Date().toLocaleDateString();
  const todayCount = logs
    .filter(l => l.type === 'success' && l.timestamp.includes(today))
    .reduce((sum, log) => sum + (log.count || 0), 0);
  return { totalProcessedToday: todayCount };
}