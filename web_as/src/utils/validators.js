export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateForm = (formData, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const value = formData[field];
    const rule = rules[field];

    if (rule.required && (!value || value.trim() === '')) {
      errors[field] = `${field} is required`;
      return;
    }

    if (rule.type === 'email' && value && !validateEmail(value)) {
      errors[field] = 'Invalid email format';
      return;
    }

    if (rule.type === 'phone' && value && !validatePhone(value)) {
      errors[field] = 'Invalid phone number';
      return;
    }

    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `Minimum ${rule.minLength} characters required`;
      return;
    }

    if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] = `Maximum ${rule.maxLength} characters allowed`;
      return;
    }
  });

  return errors;
};
