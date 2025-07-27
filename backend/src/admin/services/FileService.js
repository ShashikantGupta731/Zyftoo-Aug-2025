/**
 * File Service
 * 
 * Service for handling file operations, uploads, and static file generation
 */

const fs = require('fs').promises;
const path = require('path');
const { ApiError } = require('../utils');

class FileService {
  /**
   * Write data to a file
   */
  static async writeFile(filePath, data, options = {}) {
    try {
      // Ensure directory exists
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });

      // Write file
      await fs.writeFile(filePath, data, { encoding: 'utf8', ...options });
      
      console.log(`✅ File written successfully: ${filePath}`);
      return true;
    } catch (error) {
      console.error(`❌ Error writing file ${filePath}:`, error);
      throw new ApiError(500, `Failed to write file: ${error.message}`);
    }
  }

  /**
   * Read data from a file
   */
  static async readFile(filePath, options = {}) {
    try {
      const data = await fs.readFile(filePath, { encoding: 'utf8', ...options });
      return data;
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new ApiError(404, `File not found: ${filePath}`);
      }
      throw new ApiError(500, `Failed to read file: ${error.message}`);
    }
  }

  /**
   * Check if file exists
   */
  static async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Delete a file
   */
  static async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
      console.log(`🗑️ File deleted: ${filePath}`);
      return true;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return true; // File already doesn't exist
      }
      throw new ApiError(500, `Failed to delete file: ${error.message}`);
    }
  }

  /**
   * Generate static data file for frontend
   */
  static async generateStaticDataFile(data, outputPath, options = {}) {
    const {
      varName = 'data',
      includeMetadata = true,
      prettify = true
    } = options;

    let content = '';

    if (includeMetadata) {
      content += `// Auto-generated file - DO NOT EDIT MANUALLY\n`;
      content += `// Generated at: ${new Date().toISOString()}\n`;
      content += `// Source: Admin Configuration\n\n`;
    }

    const jsonData = prettify ? JSON.stringify(data, null, 2) : JSON.stringify(data);
    content += `export const ${varName} = ${jsonData};\n\n`;
    content += `export default ${varName};\n`;

    await this.writeFile(outputPath, content);
    return content;
  }

  /**
   * Generate backup of existing file
   */
  static async createBackup(filePath) {
    const exists = await this.fileExists(filePath);
    if (!exists) return null;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${filePath}.backup.${timestamp}`;
    
    try {
      const content = await this.readFile(filePath);
      await this.writeFile(backupPath, content);
      console.log(`📋 Backup created: ${backupPath}`);
      return backupPath;
    } catch (error) {
      console.error(`❌ Failed to create backup:`, error);
      return null;
    }
  }

  /**
   * Clean old backup files
   */
  static async cleanOldBackups(directory, pattern, maxAge = 7 * 24 * 60 * 60 * 1000) {
    try {
      const files = await fs.readdir(directory);
      const backupFiles = files.filter(file => file.includes(pattern) && file.includes('.backup.'));
      
      const now = Date.now();
      let cleanedCount = 0;

      for (const file of backupFiles) {
        const filePath = path.join(directory, file);
        const stats = await fs.stat(filePath);
        
        if (now - stats.mtime.getTime() > maxAge) {
          await this.deleteFile(filePath);
          cleanedCount++;
        }
      }

      if (cleanedCount > 0) {
        console.log(`🧹 Cleaned ${cleanedCount} old backup files`);
      }

      return cleanedCount;
    } catch (error) {
      console.error(`❌ Error cleaning backups:`, error);
      return 0;
    }
  }
}

module.exports = FileService;
