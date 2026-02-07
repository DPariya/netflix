/**
 * Validation utility functions
 */

/**
 * Validate required fields
 * @param {Object} data - Object to validate
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} - { isValid, message }
 */
export const validateRequiredFields = (data, requiredFields) => {
  const missingFields = requiredFields.filter((field) => !data[field]);
  if (missingFields.length > 0) {
    return {
      isValid: false,
      message: `Please provide ${missingFields.join(", ")}`,
    };
  }
  return { isValid: true };
};

/**
 * Validate email format
 * @param {String} email - Email to validate
 * @returns {Object} - { isValid, message }
 */
export const validateEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: "Please provide a valid email address",
    };
  }

  return { isValid: true };
};
/**
 * Validate password strength
 * @param {String} password - Password to validate
 * @param {Number} minLength - Minimum length (default: 6)
 * @returns {Object} - { isValid, message }
 */
export const validatePassword = (password, minLength = 6) => {
  if (!password) {
    return {
      isValid: false,
      message: "Please provide a password",
    };
  }

  if (password.length < minLength) {
    return {
      isValid: false,
      message: `Password must be at least ${minLength} characters long`,
    };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
    return {
      isValid: false,
      message:
        "Password must contain uppercase, lowercase, number, and special character",
    };
  }

  return { isValid: true };
};

/**
 * Validate name
 * @param {String} name - Name to validate
 * @returns {Object} - { isValid, message }
 */
export const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return {
      isValid: false,
      message: "Please provide a name",
    };
  }

  if (name.length > 50) {
    return {
      isValid: false,
      message: "Name cannot be more than 50 characters",
    };
  }

  return { isValid: true };
};

/**
 * Create validation error response
 * @param {String} message - Error message
 * @returns {Object} - Standard error response
 */
export const validationError = (message) => {
  return {
    success: false,
    message,
  };
};

/**
 * Validate registration data
 * @param {Object} data - { name, email, password }
 * @returns {Object} - { isValid, message }
 */
export const validateRegistration = (data) => {
  const { name, email, password } = data;

  // Check required fields
  const requiredCheck = validateRequiredFields(data, [
    "name",
    "email",
    "password",
  ]);
  if (!requiredCheck.isValid) return requiredCheck;

  // Validate name
  const nameCheck = validateName(name);
  if (!nameCheck.isValid) return nameCheck;

  // Validate email
  const emailCheck = validateEmail(email);
  if (!emailCheck.isValid) return emailCheck;

  // Validate password
  const passwordCheck = validatePassword(password);
  if (!passwordCheck.isValid) return passwordCheck;

  return { isValid: true };
};

/**
 * Validate login data
 * @param {Object} data - { email, password }
 * @returns {Object} - { isValid, message }
 */
export const validateLogin = (data) => {
  const { email, password } = data;

  // Check required fields
  const requiredCheck = validateRequiredFields(data, ["email", "password"]);
  if (!requiredCheck.isValid) return requiredCheck;

  // Validate email format
  const emailCheck = validateEmail(email);
  if (!emailCheck.isValid) return emailCheck;

  return { isValid: true };
};

/**
 * Validate password change data
 * @param {Object} data - { currentPassword, newPassword }
 * @returns {Object} - { isValid, message }
 */
export const validatePasswordChange = (data) => {
  const { currentPassword, newPassword } = data;

  // Check required fields
  const requiredCheck = validateRequiredFields(data, [
    "currentPassword",
    "newPassword",
  ]);
  if (!requiredCheck.isValid) return requiredCheck;

  // Validate new password
  const passwordCheck = validatePassword(newPassword);
  if (!passwordCheck.isValid) return passwordCheck;

  // Check if passwords are the same
  if (currentPassword === newPassword) {
    return {
      isValid: false,
      message: "New password must be different from current password",
    };
  }

  return { isValid: true };
};

/**
 * Validate profile update data
 * @param {Object} data - { name?, email?, avatar? }
 * @returns {Object} - { isValid, message }
 */
export const validateProfileUpdate = (data) => {
  const { name, email } = data;

  // At least one field must be provided
  if (!name && !email && !data.avatar) {
    return {
      isValid: false,
      message: "Please provide at least one field to update",
    };
  }

  // Validate name if provided
  if (name) {
    const nameCheck = validateName(name);
    if (!nameCheck.isValid) return nameCheck;
  }

  // Validate email if provided
  if (email) {
    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) return emailCheck;
  }

  return { isValid: true };
};
