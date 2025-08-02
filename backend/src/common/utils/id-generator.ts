import { randomBytes } from 'crypto';

/**
 * 生成唯一ID的工具函数
 * 使用时间戳 + 随机字符串确保唯一性
 */
export function generateId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = randomBytes(8).toString('hex');
  return `${timestamp}_${randomPart}`;
}

/**
 * 生成短ID（用于URL等场景）
 */
export function generateShortId(): string {
  return randomBytes(6).toString('base64url');
}

/**
 * 生成UUID v4格式的ID
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * 验证ID格式是否有效
 */
export function isValidId(id: string): boolean {
  if (!id || typeof id !== 'string') {
    return false;
  }
  
  // 检查是否为我们生成的ID格式（时间戳_随机字符串）
  const customIdPattern = /^[a-z0-9]+_[a-f0-9]{16}$/;
  if (customIdPattern.test(id)) {
    return true;
  }
  
  // 检查是否为UUID格式
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidPattern.test(id)) {
    return true;
  }
  
  return false;
}