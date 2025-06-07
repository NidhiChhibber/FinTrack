export class DateUtils {
  /**
   * Get current month date range
   * @returns {Object} Start and end dates for current month
   */
  static getCurrentMonthRange() {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  }

  /**
   * Get date range for specified number of days from today
   * @param {number} days - Number of days back from today
   * @returns {Object} Start and end dates
   */
  static getDateRange(days) {
    if (typeof days !== 'number' || days < 0) {
      throw new Error('Days must be a positive number');
    }
    
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  }

  /**
   * Validate date range
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {boolean} True if valid range
   */
  static isValidDateRange(startDate, endDate) {
    if (!startDate || !endDate) return false;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;
    
    return start <= end;
  }

  /**
   * Format date for database storage
   * @param {Date|string} date - Date to format
   * @returns {string} Formatted date (YYYY-MM-DD)
   */
  static formatDateForDB(date) {
    if (!date) return null;
    
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return null;
    
    return dateObj.toISOString().split('T')[0];
  }

  /**
   * Get month name from date
   * @param {Date|string} date - Date
   * @returns {string} Month name
   */
  static getMonthName(date) {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return '';
    
    return dateObj.toLocaleDateString('en-US', { month: 'long' });
  }

  /**
   * Get relative time description
   * @param {Date|string} date - Date to compare
   * @returns {string} Relative time description
   */
  static getRelativeTime(date) {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return 'Invalid date';
    
    const now = new Date();
    const diffMs = now - dateObj;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays <= 365) return `${Math.floor(diffDays / 30)} months ago`;
    
    return `${Math.floor(diffDays / 365)} years ago`;
  }

  /**
   * Parse date string safely
   * @param {string} dateString - Date string to parse
   * @returns {Date|null} Parsed date or null if invalid
   */
  static parseDate(dateString) {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  }
}