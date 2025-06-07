// src/repositories/BaseRepository.js
import { Op } from 'sequelize';

export class BaseRepository {
  constructor(model) {
    if (!model) {
      throw new Error('Model is required for repository');
    }
    this.model = model;
  }

  /**
   * Find record by primary key
   * @param {number|string} id - Primary key
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} Record or null
   */
  async findById(id, options = {}) {
    if (!id) return null;
    return await this.model.findByPk(id, options);
  }

  /**
   * Find one record matching criteria
   * @param {Object} criteria - Search criteria
   * @returns {Promise<Object|null>} Record or null
   */
  async findOne(criteria = {}) {
    return await this.model.findOne(criteria);
  }

  /**
   * Find all records matching criteria
   * @param {Object} criteria - Search criteria
   * @returns {Promise<Array>} Array of records
   */
  async findAll(criteria = {}) {
    return await this.model.findAll(criteria);
  }

  /**
   * Find and count records with pagination
   * @param {Object} criteria - Search criteria
   * @returns {Promise<Object>} Object with rows and count
   */
  async findAndCountAll(criteria = {}) {
    return await this.model.findAndCountAll(criteria);
  }

  /**
   * Create new record
   * @param {Object} data - Record data
   * @returns {Promise<Object>} Created record
   */
  async create(data) {
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Data is required for creation');
    }
    return await this.model.create(data);
  }

  /**
   * Update record by ID
   * @param {number|string} id - Record ID
   * @param {Object} data - Update data
   * @returns {Promise<Object|null>} Updated record or null
   */
  async update(id, data) {
    if (!id || !data || Object.keys(data).length === 0) {
      return null;
    }

    const [updatedCount] = await this.model.update(data, {
      where: { id }
    });

    if (updatedCount === 0) {
      return null;
    }

    return await this.findById(id);
  }

  /**
   * Delete record by ID
   * @param {number|string} id - Record ID
   * @returns {Promise<boolean>} True if deleted
   */
  async delete(id) {
    if (!id) return false;

    const deletedCount = await this.model.destroy({
      where: { id }
    });

    return deletedCount > 0;
  }

  /**
   * Bulk create records
   * @param {Array} dataArray - Array of record data
   * @param {Object} options - Bulk create options
   * @returns {Promise<Array>} Created records
   */
  async bulkCreate(dataArray, options = {}) {
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      return [];
    }

    return await this.model.bulkCreate(dataArray, {
      ignoreDuplicates: true,
      ...options
    });
  }

  /**
   * Count records matching criteria
   * @param {Object} criteria - Search criteria
   * @returns {Promise<number>} Count of records
   */
  async count(criteria = {}) {
    return await this.model.count(criteria);
  }

  /**
   * Find or create record
   * @param {Object} criteria - Search criteria
   * @param {Object} defaults - Default values for creation
   * @returns {Promise<Array>} [instance, created]
   */
  async findOrCreate(criteria, defaults = {}) {
    return await this.model.findOrCreate({
      where: criteria,
      defaults
    });
  }
}