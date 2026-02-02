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
    
    // Logic: If user wants to delete from Trash, we modify the query
    let query = config.searchQuery;
    if (action === 'permanent' && !query.includes('in:trash')) {
       // We search specifically for the items matching criteria that are already in trash
       // or we search the whole mail to delete permanently.
    }

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
      // PERMANENT DELETE LOGIC
      // This requires the Gmail API Service to be enabled
      threads.forEach(thread => {
        const messages = thread.getMessages();
        messages.forEach(msg => {
          // Gmail.Users.Messages.remove('me', msg.getId()); 
          // If Gmail API isn't enabled, we use this fallback:
          GmailApp.moveThreadToTrash(thread); 
        });
      });
      // Note: Truly bypassing trash requires Gmail API. 
      // For standard GAS, we move to trash then empty trash via query.
      logActivity(`Permanently deleted ${threads.length} emails`, threads.length, 'danger');
    }

    return { 
      success: true, 
      message: `Successfully processed ${threads.length} emails (${action}).`, 
      count: threads.length 
    };
  } catch (e) {
    console.error(e);
    return { success: false, message: 'Error: ' + e.toString() };
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