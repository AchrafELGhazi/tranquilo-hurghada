export const errors = {
     // Generic errors
     somethingWentWrong: 'Something went wrong',
     unexpectedError: 'An unexpected error occurred',
     tryAgainLater: 'Please try again later',
     contactSupport: 'Please contact support if the problem persists',

     // Network errors
     networkError: 'Network error',
     connectionFailed: 'Connection failed',
     timeoutError: 'Request timed out',
     offline: 'You are offline',

     // Validation errors
     required: 'This field is required',
     invalidEmail: 'Please enter a valid email address',
     invalidUrl: 'Please enter a valid URL',
     tooShort: 'This field is too short',
     tooLong: 'This field is too long',
     invalidFormat: 'Invalid format',

     // Auth errors
     loginFailed: 'Login failed',
     invalidCredentials: 'Invalid username or password',
     accountLocked: 'Account has been locked',
     sessionExpired: 'Your session has expired',
     accessDenied: 'Access denied',
     unauthorized: 'You are not authorized to perform this action',

     // Form errors
     formInvalid: 'Please correct the errors below',
     saveFailed: 'Failed to save changes',
     deleteFailed: 'Failed to delete item',
     uploadFailed: 'File upload failed',

     // Loading errors
     loadingFailed: 'Failed to load content',
     dataNotFound: 'Data not found',
     pageNotFound: 'Page not found',
     resourceNotFound: 'Resource not found',

     // Browser/System errors
     browserNotSupported: 'Your browser is not supported',
     featureNotSupported: 'This feature is not supported in your browser',
     cookiesDisabled: 'Please enable cookies to use this application',
     javascriptDisabled: 'Please enable JavaScript to use this application',

     // Language/i18n errors
     translationMissing: 'Translation missing',
     languageNotSupported: 'Language not supported',
     loadingTranslations: 'Loading translations...',
     translationError: 'Error loading translations',
} as const;