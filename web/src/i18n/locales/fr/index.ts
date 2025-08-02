import type { TranslationNamespaces } from '@/i18n/types/i18n.types';

export const fr: TranslationNamespaces = {
     common: {
          // App basics
          appName: 'Mon App React i18n',
          welcome: 'Bienvenue dans Notre App',
          description: 'Une application React moderne avec support d\'internationalisation',

          // UI Elements
          language: 'Langue',
          theme: 'Thème',
          light: 'Clair',
          dark: 'Sombre',
          loading: 'Chargement de l\'application...',
          loadingDots: 'Chargement',

          // Actions
          save: 'Sauvegarder',
          cancel: 'Annuler',
          close: 'Fermer',
          confirm: 'Confirmer',
          delete: 'Supprimer',
          edit: 'Modifier',
          create: 'Créer',
          update: 'Mettre à jour',
          submit: 'Soumettre',
          reset: 'Réinitialiser',
          retry: 'Réessayer',
          refresh: 'Actualiser',

          // Status
          success: 'Succès',
          error: 'Erreur',
          warning: 'Avertissement',
          info: 'Information',

          // Confirmation
          yes: 'Oui',
          no: 'Non',
          ok: 'OK',

          // Greetings and messages
          hello: 'Bonjour',
          goodbye: 'Au revoir',
          thankyou: 'Merci',
          pleaseWait: 'Veuillez patienter...',

          // Interpolated messages
          greeting: 'Bonjour, {{name}} !',
          currentLang: 'Langue actuelle : {{lang}}',
          welcomeUser: 'Bon retour, {{username}} !',
          itemCount: 'Vous avez {{count}} élément',
          itemCount_plural: 'Vous avez {{count}} éléments',

          // Time and dates
          today: 'Aujourd\'hui',
          yesterday: 'Hier',
          tomorrow: 'Demain',
          now: 'Maintenant',

          // Common phrases
          noData: 'Aucune donnée disponible',
          noResults: 'Aucun résultat trouvé',
          searchPlaceholder: 'Rechercher...',
          selectOption: 'Sélectionner une option',
          allOptions: 'Tous',
          none: 'Aucun',
     },

     navigation: {
          // Main navigation
          home: 'Accueil',
          about: 'À propos',
          contact: 'Contact',
          services: 'Services',
          products: 'Produits',

          // User navigation
          profile: 'Profil',
          settings: 'Paramètres',
          dashboard: 'Tableau de bord',
          account: 'Compte',
          preferences: 'Préférences',

          // Auth navigation
          login: 'Se connecter',
          logout: 'Se déconnecter',
          register: 'S\'inscrire',
          signup: 'Créer un compte',
          signin: 'Se connecter',

          // Secondary navigation
          help: 'Aide',
          support: 'Support',
          faq: 'FAQ',
          documentation: 'Documentation',
          api: 'API',

          // Footer navigation
          privacy: 'Politique de confidentialité',
          terms: 'Conditions d\'utilisation',
          cookies: 'Politique des cookies',
          legal: 'Légal',

          // Breadcrumbs
          breadcrumbHome: 'Accueil',
          breadcrumbSeparator: '/',

          // Menu actions
          menu: 'Menu',
          openMenu: 'Ouvrir le menu',
          closeMenu: 'Fermer le menu',
          toggleMenu: 'Basculer le menu',

          // Navigation states
          current: 'Page actuelle',
          active: 'Actif',
          disabled: 'Désactivé',
     },

     pages: {
          // Home page
          homeTitle: 'Bienvenue dans Notre Application',
          homeSubtitle: 'Créez des expériences incroyables avec React et TypeScript',
          homeDescription: 'Une application React moderne et évolutive avec support complet d\'internationalisation, mode sombre et beaux composants UI.',
          homeGetStarted: 'Commencer',
          homeLearnMore: 'En savoir plus',

          // Profile page
          profileTitle: 'Profil utilisateur',
          profileEdit: 'Modifier le profil',
          profileSave: 'Sauvegarder les modifications',
          profilePersonalInfo: 'Informations personnelles',
          profileContactInfo: 'Informations de contact',
          profilePreferences: 'Préférences',
          profileSecurity: 'Paramètres de sécurité',

          // Settings page
          settingsTitle: 'Paramètres',
          settingsGeneral: 'Paramètres généraux',
          settingsAppearance: 'Apparence',
          settingsLanguage: 'Langue et région',
          settingsNotifications: 'Notifications',
          settingsPrivacy: 'Confidentialité',
          settingsAccount: 'Paramètres du compte',
          settingsAdvanced: 'Avancé',

          // Dashboard page
          dashboardTitle: 'Tableau de bord',
          dashboardOverview: 'Aperçu',
          dashboardAnalytics: 'Analyses',
          dashboardReports: 'Rapports',
          dashboardStats: 'Statistiques',

          // About page
          aboutTitle: 'À propos de nous',
          aboutDescription: 'En savoir plus sur notre mission et nos valeurs',
          aboutTeam: 'Notre équipe',
          aboutHistory: 'Notre histoire',
          aboutValues: 'Nos valeurs',

          // Contact page
          contactTitle: 'Nous contacter',
          contactForm: 'Formulaire de contact',
          contactInfo: 'Informations de contact',
          contactSend: 'Envoyer le message',
          contactName: 'Votre nom',
          contactEmail: 'Votre email',
          contactMessage: 'Votre message',
          contactSuccess: 'Message envoyé avec succès !',

          // Feature descriptions
          featureI18n: 'Support complet d\'internationalisation avec TypeScript',
          featureThemes: 'Support des thèmes sombres et clairs',
          featureComponents: 'Composants personnalisés avec shadcn/ui',
          featureResponsive: 'Design entièrement responsive',
          featureAccessible: 'Approche axée sur l\'accessibilité',
          featurePerformant: 'Optimisé pour les performances',
     },

     errors: {
          // Generic errors
          somethingWentWrong: 'Quelque chose s\'est mal passé',
          unexpectedError: 'Une erreur inattendue s\'est produite',
          tryAgainLater: 'Veuillez réessayer plus tard',
          contactSupport: 'Veuillez contacter le support si le problème persiste',

          // Network errors
          networkError: 'Erreur réseau',
          connectionFailed: 'Échec de la connexion',
          timeoutError: 'Délai d\'attente dépassé',
          offline: 'Vous êtes hors ligne',

          // Validation errors
          required: 'Ce champ est requis',
          invalidEmail: 'Veuillez saisir une adresse email valide',
          invalidUrl: 'Veuillez saisir une URL valide',
          tooShort: 'Ce champ est trop court',
          tooLong: 'Ce champ est trop long',
          invalidFormat: 'Format invalide',

          // Auth errors
          loginFailed: 'Échec de la connexion',
          invalidCredentials: 'Nom d\'utilisateur ou mot de passe invalide',
          accountLocked: 'Le compte a été verrouillé',
          sessionExpired: 'Votre session a expiré',
          accessDenied: 'Accès refusé',
          unauthorized: 'Vous n\'êtes pas autorisé à effectuer cette action',

          // Form errors
          formInvalid: 'Veuillez corriger les erreurs ci-dessous',
          saveFailed: 'Échec de la sauvegarde des modifications',
          deleteFailed: 'Échec de la suppression de l\'élément',
          uploadFailed: 'Échec du téléchargement du fichier',

          // Loading errors
          loadingFailed: 'Échec du chargement du contenu',
          dataNotFound: 'Données non trouvées',
          pageNotFound: 'Page non trouvée',
          resourceNotFound: 'Ressource non trouvée',

          // Browser/System errors
          browserNotSupported: 'Votre navigateur n\'est pas pris en charge',
          featureNotSupported: 'Cette fonctionnalité n\'est pas prise en charge par votre navigateur',
          cookiesDisabled: 'Veuillez activer les cookies pour utiliser cette application',
          javascriptDisabled: 'Veuillez activer JavaScript pour utiliser cette application',

          // Language/i18n errors
          translationMissing: 'Traduction manquante',
          languageNotSupported: 'Langue non prise en charge',
          loadingTranslations: 'Chargement des traductions...',
          translationError: 'Erreur lors du chargement des traductions',
     },
};