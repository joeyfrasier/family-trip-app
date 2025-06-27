/**
 * Google Apps Script for updating the Family Trip Google Sheets
 * 
 * Instructions:
 * 1. Go to script.google.com
 * 2. Create a new project
 * 3. Replace Code.gs with this content
 * 4. Deploy as Web App with execute permissions for "Anyone"
 * 5. Copy the Web App URL and add it to Vercel as VITE_GOOGLE_APPS_SCRIPT_URL
 */

const SHEET_ID = '1k8WOI-n5CbjEaS3lgLZ8RIiAcNSHg4HkfJ_VQ9MNQIY';

function doPost(e) {
  try {
    // Parse the incoming request
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'updateSheet') {
      return updateSheetWithChanges(data.changes);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Unknown action'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function updateSheetWithChanges(changes) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let updatedSheets = [];
    
    changes.forEach(change => {
      if (change.action === 'add') {
        const sheet = spreadsheet.getSheetByName(change.sheet);
        if (!sheet) {
          throw new Error(`Sheet '${change.sheet}' not found`);
        }
        
        // Find the next empty row
        const lastRow = sheet.getLastRow();
        const nextRow = lastRow + 1;
        
        // Add the new row
        sheet.getRange(nextRow, 1, 1, change.data.length).setValues([change.data]);
        updatedSheets.push(`${change.sheet} (added row ${nextRow})`);
        
      } else if (change.action === 'update' && change.rowIndex) {
        const sheet = spreadsheet.getSheetByName(change.sheet);
        if (!sheet) {
          throw new Error(`Sheet '${change.sheet}' not found`);
        }
        
        // Update the existing row
        sheet.getRange(change.rowIndex, 1, 1, change.data.length).setValues([change.data]);
        updatedSheets.push(`${change.sheet} (updated row ${change.rowIndex})`);
      }
    });
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: `Successfully updated: ${updatedSheets.join(', ')}`
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error updating sheets:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: `Failed to update sheets: ${error.toString()}`
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function to verify the script works
function testScript() {
  const testChanges = [{
    sheet: 'Destinations',
    action: 'add',
    data: ['test-id', 'Test City', 'Test Country', 'TC', '🏴', '2025-01-01', '2025-01-02'],
    description: 'Test destination'
  }];
  
  const result = updateSheetWithChanges(testChanges);
  console.log('Test result:', result.getContent());
}