import type { TranslationNamespaces } from '@/i18n/types/i18n.types';

export const es: TranslationNamespaces = {
     common: {
          // App basics
          appName: 'Mi App React i18n',
          welcome: 'Bienvenido a Nuestra App',
          description: 'Una aplicación React moderna con soporte de internacionalización',

          // UI Elements
          language: 'Idioma',
          theme: 'Tema',
          light: 'Claro',
          dark: 'Oscuro',
          loading: 'Cargando aplicación...',
          loadingDots: 'Cargando',

          // Actions
          save: 'Guardar',
          cancel: 'Cancelar',
          close: 'Cerrar',
          confirm: 'Confirmar',
          delete: 'Eliminar',
          edit: 'Editar',
          create: 'Crear',
          update: 'Actualizar',
          submit: 'Enviar',
          reset: 'Restablecer',
          retry: 'Reintentar',
          refresh: 'Actualizar',

          // Status
          success: 'Éxito',
          error: 'Error',
          warning: 'Advertencia',
          info: 'Información',

          // Confirmation
          yes: 'Sí',
          no: 'No',
          ok: 'OK',

          // Greetings and messages
          hello: 'Hola',
          goodbye: 'Adiós',
          thankyou: 'Gracias',
          pleaseWait: 'Por favor espera...',

          // Interpolated messages
          greeting: '¡Hola, {{name}}!',
          currentLang: 'Idioma actual: {{lang}}',
          welcomeUser: '¡Bienvenido de vuelta, {{username}}!',
          itemCount: 'Tienes {{count}} elemento',
          itemCount_plural: 'Tienes {{count}} elementos',

          // Time and dates
          today: 'Hoy',
          yesterday: 'Ayer',
          tomorrow: 'Mañana',
          now: 'Ahora',

          // Common phrases
          noData: 'No hay datos disponibles',
          noResults: 'No se encontraron resultados',
          searchPlaceholder: 'Buscar...',
          selectOption: 'Selecciona una opción',
          allOptions: 'Todos',
          none: 'Ninguno',
     },

     navigation: {
          // Main navigation
          home: 'Inicio',
          about: 'Acerca de',
          contact: 'Contacto',
          services: 'Servicios',
          products: 'Productos',

          // User navigation
          profile: 'Perfil',
          settings: 'Configuración',
          dashboard: 'Panel',
          account: 'Cuenta',
          preferences: 'Preferencias',

          // Auth navigation
          login: 'Iniciar sesión',
          logout: 'Cerrar sesión',
          register: 'Registrarse',
          signup: 'Crear cuenta',
          signin: 'Iniciar sesión',

          // Secondary navigation
          help: 'Ayuda',
          support: 'Soporte',
          faq: 'Preguntas frecuentes',
          documentation: 'Documentación',
          api: 'API',

          // Footer navigation
          privacy: 'Política de privacidad',
          terms: 'Términos de servicio',
          cookies: 'Política de cookies',
          legal: 'Legal',

          // Breadcrumbs
          breadcrumbHome: 'Inicio',
          breadcrumbSeparator: '/',

          // Menu actions
          menu: 'Menú',
          openMenu: 'Abrir menú',
          closeMenu: 'Cerrar menú',
          toggleMenu: 'Alternar menú',

          // Navigation states
          current: 'Página actual',
          active: 'Activo',
          disabled: 'Deshabilitado',
     },

     pages: {
          // Home page
          homeTitle: 'Bienvenido a Nuestra Aplicación',
          homeSubtitle: 'Construye experiencias increíbles con React y TypeScript',
          homeDescription: 'Una aplicación React moderna y escalable con soporte completo de internacionalización, modo oscuro y hermosos componentes de UI.',
          homeGetStarted: 'Comenzar',
          homeLearnMore: 'Aprender más',

          // Profile page
          profileTitle: 'Perfil de usuario',
          profileEdit: 'Editar perfil',
          profileSave: 'Guardar cambios',
          profilePersonalInfo: 'Información personal',
          profileContactInfo: 'Información de contacto',
          profilePreferences: 'Preferencias',
          profileSecurity: 'Configuración de seguridad',

          // Settings page
          settingsTitle: 'Configuración',
          settingsGeneral: 'Configuración general',
          settingsAppearance: 'Apariencia',
          settingsLanguage: 'Idioma y región',
          settingsNotifications: 'Notificaciones',
          settingsPrivacy: 'Privacidad',
          settingsAccount: 'Configuración de cuenta',
          settingsAdvanced: 'Avanzado',

          // Dashboard page
          dashboardTitle: 'Panel',
          dashboardOverview: 'Resumen',
          dashboardAnalytics: 'Análisis',
          dashboardReports: 'Reportes',
          dashboardStats: 'Estadísticas',

          // About page
          aboutTitle: 'Acerca de nosotros',
          aboutDescription: 'Conoce más sobre nuestra misión y valores',
          aboutTeam: 'Nuestro equipo',
          aboutHistory: 'Nuestra historia',
          aboutValues: 'Nuestros valores',

          // Contact page
          contactTitle: 'Contáctanos',
          contactForm: 'Formulario de contacto',
          contactInfo: 'Información de contacto',
          contactSend: 'Enviar mensaje',
          contactName: 'Tu nombre',
          contactEmail: 'Tu email',
          contactMessage: 'Tu mensaje',
          contactSuccess: '¡Mensaje enviado exitosamente!',

          // Feature descriptions
          featureI18n: 'Soporte completo de internacionalización con TypeScript',
          featureThemes: 'Soporte para temas oscuros y claros',
          featureComponents: 'Componentes personalizados con shadcn/ui',
          featureResponsive: 'Diseño completamente responsivo',
          featureAccessible: 'Enfoque en accesibilidad',
          featurePerformant: 'Optimizado para el rendimiento',
     },

     errors: {
          // Generic errors
          somethingWentWrong: 'Algo salió mal',
          unexpectedError: 'Ocurrió un error inesperado',
          tryAgainLater: 'Por favor intenta de nuevo más tarde',
          contactSupport: 'Por favor contacta al soporte si el problema persiste',

          // Network errors
          networkError: 'Error de red',
          connectionFailed: 'Falló la conexión',
          timeoutError: 'Se agotó el tiempo de espera',
          offline: 'Estás desconectado',

          // Validation errors
          required: 'Este campo es requerido',
          invalidEmail: 'Por favor ingresa un email válido',
          invalidUrl: 'Por favor ingresa una URL válida',
          tooShort: 'Este campo es muy corto',
          tooLong: 'Este campo es muy largo',
          invalidFormat: 'Formato inválido',

          // Auth errors
          loginFailed: 'Falló el inicio de sesión',
          invalidCredentials: 'Usuario o contraseña inválidos',
          accountLocked: 'La cuenta ha sido bloqueada',
          sessionExpired: 'Tu sesión ha expirado',
          accessDenied: 'Acceso denegado',
          unauthorized: 'No estás autorizado para realizar esta acción',

          // Form errors
          formInvalid: 'Por favor corrige los errores a continuación',
          saveFailed: 'Error al guardar los cambios',
          deleteFailed: 'Error al eliminar el elemento',
          uploadFailed: 'Error al subir el archivo',

          // Loading errors
          loadingFailed: 'Error al cargar el contenido',
          dataNotFound: 'Datos no encontrados',
          pageNotFound: 'Página no encontrada',
          resourceNotFound: 'Recurso no encontrado',

          // Browser/System errors
          browserNotSupported: 'Tu navegador no es compatible',
          featureNotSupported: 'Esta característica no es compatible con tu navegador',
          cookiesDisabled: 'Por favor habilita las cookies para usar esta aplicación',
          javascriptDisabled: 'Por favor habilita JavaScript para usar esta aplicación',

          // Language/i18n errors
          translationMissing: 'Traducción faltante',
          languageNotSupported: 'Idioma no compatible',
          loadingTranslations: 'Cargando traducciones...',
          translationError: 'Error al cargar las traducciones',
     },
};