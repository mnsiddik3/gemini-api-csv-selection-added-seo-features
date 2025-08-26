// Utility functions for handling images safely

/**
 * Creates a safe object URL for an image file with automatic cleanup
 */
export const createImageUrl = (file: File): string => {
  try {
    return URL.createObjectURL(file);
  } catch (error) {
    console.error('Failed to create object URL:', error);
    return '';
  }
};

/**
 * Safely revokes an object URL
 */
export const revokeImageUrl = (url: string): void => {
  try {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.warn('Failed to revoke object URL:', error);
  }
};

/**
 * Validates image file type and size
 */
export const validateImage = (file: File, maxSizeInMB: number = 60): boolean => {
  if (!file.type.startsWith('image/')) {
    return false;
  }
  
  if (file.size > maxSizeInMB * 1024 * 1024) {
    return false;
  }
  
  return true;
};

/**
 * Formats file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Gets image file extension
 */
export const getImageExtension = (file: File): string => {
  return file.type.split('/')[1]?.toUpperCase() || 'Unknown';
};