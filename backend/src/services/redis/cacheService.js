const { getRedisClient } = require('../../config/redis');
const logger = require('../../config/logger');

class CacheService {
  constructor() {
    this.defaultTTL = 3600; // 1 hour in seconds
  }

  // Get cached data
  async get(key) {
    try {
      const client = getRedisClient();
      const data = await client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error(`Cache get error: ${error.message}`);
      return null;
    }
  }

  // Set cached data
  async set(key, value, ttl = this.defaultTTL) {
    try {
      const client = getRedisClient();
      await client.setEx(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error(`Cache set error: ${error.message}`);
      return false;
    }
  }

  // Delete cached data
  async del(key) {
    try {
      const client = getRedisClient();
      await client.del(key);
      return true;
    } catch (error) {
      logger.error(`Cache delete error: ${error.message}`);
      return false;
    }
  }

  // Delete multiple keys
  async delMany(keys) {
    try {
      const client = getRedisClient();
      if (keys.length > 0) {
        await client.del(keys);
      }
      return true;
    } catch (error) {
      logger.error(`Cache delete many error: ${error.message}`);
      return false;
    }
  }

  // Delete keys by pattern
  async delPattern(pattern) {
    try {
      const client = getRedisClient();
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(keys);
      }
      return true;
    } catch (error) {
      logger.error(`Cache delete pattern error: ${error.message}`);
      return false;
    }
  }

  // Check if key exists
  async exists(key) {
    try {
      const client = getRedisClient();
      const result = await client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Cache exists error: ${error.message}`);
      return false;
    }
  }

  // Set expiry time
  async expire(key, ttl) {
    try {
      const client = getRedisClient();
      await client.expire(key, ttl);
      return true;
    } catch (error) {
      logger.error(`Cache expire error: ${error.message}`);
      return false;
    }
  }

  // Increment value
  async incr(key) {
    try {
      const client = getRedisClient();
      return await client.incr(key);
    } catch (error) {
      logger.error(`Cache incr error: ${error.message}`);
      return null;
    }
  }

  // Decrement value
  async decr(key) {
    try {
      const client = getRedisClient();
      return await client.decr(key);
    } catch (error) {
      logger.error(`Cache decr error: ${error.message}`);
      return null;
    }
  }

  // Flush all cache
  async flushAll() {
    try {
      const client = getRedisClient();
      await client.flushAll();
      logger.info('All cache flushed');
      return true;
    } catch (error) {
      logger.error(`Cache flush all error: ${error.message}`);
      return false;
    }
  }
}

module.exports = new CacheService();
