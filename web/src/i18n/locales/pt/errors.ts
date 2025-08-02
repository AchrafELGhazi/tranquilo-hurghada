export const errors = {
     // Generic errors
     somethingWentWrong: 'حدث خطأ ما',
     unexpectedError: 'حدث خطأ غير متوقع',
     tryAgainLater: 'يرجى المحاولة مرة أخرى لاحقاً',
     contactSupport: 'يرجى الاتصال بالدعم إذا استمرت المشكلة',

     // Network errors
     networkError: 'خطأ في الشبكة',
     connectionFailed: 'فشل الاتصال',
     timeoutError: 'انتهت مهلة الطلب',
     offline: 'أنت غير متصل',

     // Validation errors
     required: 'هذا الحقل مطلوب',
     invalidEmail: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
     invalidUrl: 'يرجى إدخال رابط صحيح',
     tooShort: 'هذا الحقل قصير جداً',
     tooLong: 'هذا الحقل طويل جداً',
     invalidFormat: 'تنسيق غير صحيح',

     // Auth errors
     loginFailed: 'فشل تسجيل الدخول',
     invalidCredentials: 'اسم المستخدم أو كلمة المرور غير صحيحة',
     accountLocked: 'تم قفل الحساب',
     sessionExpired: 'انتهت صلاحية جلستك',
     accessDenied: 'تم رفض الوصول',
     unauthorized: 'غير مخول لك بتنفيذ هذا الإجراء',

     // Form errors
     formInvalid: 'يرجى تصحيح الأخطاء أدناه',
     saveFailed: 'فشل في حفظ التغييرات',
     deleteFailed: 'فشل في حذف العنصر',
     uploadFailed: 'فشل في تحميل الملف',

     // Loading errors
     loadingFailed: 'فشل في تحميل المحتوى',
     dataNotFound: 'البيانات غير موجودة',
     pageNotFound: 'الصفحة غير موجودة',
     resourceNotFound: 'المورد غير موجود',

     // Browser/System errors
     browserNotSupported: 'متصفحك غير مدعوم',
     featureNotSupported: 'هذه الميزة غير مدعومة في متصفحك',
     cookiesDisabled: 'يرجى تفعيل الكوكيز لاستخدام هذا التطبيق',
     javascriptDisabled: 'يرجى تفعيل JavaScript لاستخدام هذا التطبيق',

     // Language/i18n errors
     translationMissing: 'الترجمة مفقودة',
     languageNotSupported: 'اللغة غير مدعومة',
     loadingTranslations: 'جاري تحميل الترجمات...',
     translationError: 'خطأ في تحميل الترجمات',
} as const;