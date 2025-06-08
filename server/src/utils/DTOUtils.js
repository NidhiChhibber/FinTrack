/**
 * Utility functions for DTO conversion and validation
 */
export class DTOUtils {
  /**
   * Convert snake_case object keys to camelCase
   * @param {Object} obj - Object with snake_case keys
   * @returns {Object} Object with camelCase keys
   */
  static toCamelCase(obj) {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
      return obj;
    }

    const camelCaseObj = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = this._snakeToCamel(key);
      
      if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        camelCaseObj[camelKey] = this.toCamelCase(value);
      } else if (Array.isArray(value)) {
        camelCaseObj[camelKey] = value.map(item => this.toCamelCase(item));
      } else {
        camelCaseObj[camelKey] = value;
      }
    }
    
    return camelCaseObj;
  }

  /**
   * Convert camelCase object keys to snake_case
   * @param {Object} obj - Object with camelCase keys
   * @returns {Object} Object with snake_case keys
   */
  static toSnakeCase(obj) {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
      return obj;
    }

    const snakeCaseObj = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const snakeKey = this._camelToSnake(key);
      
      if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        snakeCaseObj[snakeKey] = this.toSnakeCase(value);
      } else if (Array.isArray(value)) {
        snakeCaseObj[snakeKey] = value.map(item => this.toSnakeCase(item));
      } else {
        snakeCaseObj[snakeKey] = value;
      }
    }
    
    return snakeCaseObj;
  }

  /**
   * Clean undefined values from object
   * @param {Object} obj - Object to clean
   * @returns {Object} Object without undefined values
   */
  static cleanUndefined(obj) {
    if (!obj || typeof obj !== 'object') return obj;

    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = value;
      }
    }
    return cleaned;
  }

  /**
   * Convert snake_case string to camelCase
   * @param {string} str - Snake case string
   * @returns {string} Camel case string
   * @private
   */
  static _snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
  }

  /**
   * Convert camelCase string to snake_case
   * @param {string} str - Camel case string
   * @returns {string} Snake case string
   * @private
   */
  static _camelToSnake(str) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }

  /**
   * Safely pick specific fields from object
   * @param {Object} obj - Source object
   * @param {string[]} fields - Fields to pick
   * @returns {Object} Object with only specified fields
   */
  static pick(obj, fields) {
    if (!obj || typeof obj !== 'object' || !Array.isArray(fields)) {
      return {};
    }

    const picked = {};
    for (const field of fields) {
      if (obj.hasOwnProperty(field)) {
        picked[field] = obj[field];
      }
    }
    return picked;
  }

  /**
   * Safely omit specific fields from object
   * @param {Object} obj - Source object
   * @param {string[]} fields - Fields to omit
   * @returns {Object} Object without specified fields
   */
  static omit(obj, fields) {
    if (!obj || typeof obj !== 'object' || !Array.isArray(fields)) {
      return obj;
    }

    const omitted = { ...obj };
    for (const field of fields) {
      delete omitted[field];
    }
    return omitted;
  }
}