/**
 * Email Cleanup Pro - Production Version
 * Professional email automation system
 */

// Configuration stored in Script Properties (secure)
function getConfig() {
  const props = PropertiesService.getUserProperties();
  return {
    daysOld: parseInt(props.getProperty('daysOld')) || 30,
    searchQuery: props.getProperty('searchQuery') || 'older_than:30d',
    batchSize: parseInt(props.getProperty('batchSize')) || 100,
    action: props.getProperty('action') || 'trash', // 'trash' or 'archive'
    enabled: props.getProperty('enabled') === 'true'
  };
}

function saveConfig(config) {
  const props = PropertiesService.getUserProperties();
  props.setProperty('daysOld', config.daysOld.toString());
  props.setProperty('searchQuery', config.searchQuery);
  props.setProperty('batchSize', config.batchSize.toString());
  props.setProperty('action', config.action);
  props.setProperty('enabled', config.enabled.toString());
  return { success: true };
}

/**
 * Main cleanup function - runs automatically
 */
function cleanupEmails() {
  const config = getConfig();
  
  if (!config.enabled) {
    Logger.log('Cleanup is disabled by user');
    return { success: false, message: 'Cleanup is disabled' };
  }
  
  try {
    const threads = GmailApp.search(config.searchQuery, 0, config.batchSize);
    
    if (threads.length === 0) {
      logActivity('No emails found', 0);
      return { success: true, message: 'No emails to process', count: 0 };
    }
    
    // Perform action
    if (config.action === 'trash') {
      GmailApp.moveThreadsToTrash(threads);
    } else {
      GmailApp.archiveThreads(threads);
    }
    
    logActivity(`Processed ${threads.length} threads`, threads.length);
    
    return { 
      success: true, 
      message: `Successfully processed ${threads.length} emails`,
      count: threads.length 
    };
    
  } catch (error) {
    logActivity('Error: ' + error.toString(), 0, 'error');
    return { success: false, message: error.toString() };
  }
}

/**
 * Test function for preview
 */
function previewEmails(query, limit) {
  try {
    limit = limit || 10;
    const threads = GmailApp.search(query, 0, limit);
    
    const previews = threads.map(function(thread) {
      const firstMessage = thread.getMessages()[0];
      return {
        subject: thread.getFirstMessageSubject(),
        from: firstMessage.getFrom(),
        date: firstMessage.getDate().toISOString(),
        labels: thread.getLabels().map(l => l.getName())
      };
    });
    
    return { success: true, threads: previews, total: threads.length };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

/**
 * Activity logging
 */
function logActivity(message, count, type) {
  type = type || 'info';
  const props = PropertiesService.getUserProperties();
  const log = {
    timestamp: new Date().toISOString(),
    message: message,
    count: count,
    type: type
  };
  
  // Store last 100 logs
  let logs = JSON.parse(props.getProperty('activityLogs') || '[]');
  logs.unshift(log);
  logs = logs.slice(0, 100);
  props.setProperty('activityLogs', JSON.stringify(logs));
}

function getActivityLogs() {
  const props = PropertiesService.getUserProperties();
  return JSON.parse(props.getProperty('activityLogs') || '[]');
}

/**
 * Statistics
 */
function getStats() {
  const logs = getActivityLogs();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayLogs = logs.filter(log => new Date(log.timestamp) >= today);
  const weekLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    return logDate >= weekAgo;
  });
  
  return {
    totalProcessedToday: todayLogs.reduce((sum, log) => sum + (log.count || 0), 0),
    totalProcessedWeek: weekLogs.reduce((sum, log) => sum + (log.count || 0), 0),
    totalProcessedAll: logs.reduce((sum, log) => sum + (log.count || 0), 0),
    lastRun: logs.length > 0 ? logs[0].timestamp : null
  };
}

/**
 * Trigger management
 */
function setupTrigger(frequency) {
  // Delete existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'cleanupEmails') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Create new trigger
  if (frequency === 'none') {
    return { success: true, message: 'Automatic cleanup disabled' };
  }
  
  let trigger;
  if (frequency === 'daily') {
    trigger = ScriptApp.newTrigger('cleanupEmails')
      .timeBased()
      .atHour(2)
      .everyDays(1)
      .create();
  } else if (frequency === 'weekly') {
    trigger = ScriptApp.newTrigger('cleanupEmails')
      .timeBased()
      .onWeekDay(ScriptApp.WeekDay.MONDAY)
      .atHour(2)
      .create();
  } else if (frequency === 'hourly') {
    trigger = ScriptApp.newTrigger('cleanupEmails')
      .timeBased()
      .everyHours(1)
      .create();
  }
  
  return { success: true, message: `Trigger set to ${frequency}` };
}

function getCurrentTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  const cleanupTrigger = triggers.find(t => t.getHandlerFunction() === 'cleanupEmails');
  
  if (!cleanupTrigger) {
    return { frequency: 'none' };
  }
  
  // Determine frequency from trigger
  const eventType = cleanupTrigger.getEventType();
  if (eventType === ScriptApp.EventType.CLOCK) {
    // Check trigger details to determine frequency
    return { frequency: 'daily' }; // Simplified
  }
  
  return { frequency: 'unknown' };
}

/**
 * Serve the web app
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Email Cleanup Pro')
    .setFaviconUrl('https://www.gstatic.com/images/branding/product/1x/gmail_48dp.png');
}

/**
 * Manual run function
 */
function runCleanupNow() {
  return cleanupEmails();
}