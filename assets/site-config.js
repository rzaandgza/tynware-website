window.TYNWARE_CONFIG = {
  brandName: "Tynware",
  siteUrl: "https://tynware.com",
  supportEmail: "support@tynware.com",
  privacyEmail: "support@tynware.com",
  legal: {
    entityName: "",
    registrationNumber: "",
    taxId: "",
    registeredOffice: "",
    country: "Romania",
    effectiveDate: "21 September 2026"
  },
  commerce: {
    merchantOfRecord: "Lemon Squeezy",
    merchantOfRecordUrl: "https://www.lemonsqueezy.com/",
    buyerTermsUrl: "https://www.lemonsqueezy.com/buyer-terms",
    privacyUrl: "https://www.lemonsqueezy.com/privacy"
  },
  products: {
    tinyrental: {
      name: "TinyRental",
      version: "0.11.1",
      category: "Rental management",
      supportSummary: "Installation, trial/licensing, backups, diagnostics and recovery.",
      privacySummary: "Inventory, customers, reservations, returns, issues, reports and related operational records are stored locally on the user's PC. TinyRental does not upload the operational database to Tynware during normal use.",
      termsSummary: "Windows desktop rental-management software. Current lifetime license: up to two active devices. Core operational data is local-first. License activation and periodic validation require internet access.",
      productUrl: "/tinyrental/",
      supportUrl: "/tinyrental/support.html",
      downloadUrl: "",
      checkoutUrl: "",
      platform: "Windows 11 · 64-bit",
      installScope: "Machine-wide installation; Windows administrator approval is required.",
      installPath: "%ProgramFiles%\\Tynware\\TinyRental",
      dataPath: "%LOCALAPPDATA%\\Tynware\\TinyRental",
      logPath: "%LOCALAPPDATA%\\Tynware\\TinyRental\\logs\\tinyrental.log",
      backupLabel: "TinyRental backup package",
      installation: [
        "Download TinyRental only from the official Tynware product page.",
        "For the public release, check the installer\'s Windows digital signature before running it. The publisher should be Tynware.",
        "Open the installer. Windows will request administrator approval because TinyRental installs under Program Files.",
        "Choose whether you want the optional desktop shortcut, then complete installation.",
        "Launch TinyRental from the Start menu or shortcut. The 14-day trial begins on first run."
      ],
      troubleshooting: [
        {
          title: "Windows blocks or warns about the installer",
          text: "Do not bypass warnings for an installer obtained from another source. Download a fresh copy from tynware.com and verify its digital signature. If the official signed installer is still blocked, contact support with the exact Windows message."
        },
        {
          title: "TinyRental does not start",
          text: "Restart Windows once, then try the installed Start-menu shortcut. If it still fails, send support your TinyRental version, Windows version, the exact error message and the diagnostic log path shown below."
        },
        {
          title: "Activation or validation fails",
          text: "Confirm that the PC has internet access and retry from Help → License. Do not delete licensing files and do not email your full license key unless support explicitly asks for a secure diagnostic step."
        },
        {
          title: "Data looks missing after reinstall",
          text: "Uninstalling TinyRental does not remove the local business-data folder. Use Help → Open data folder to confirm the active location. Do not manually replace the live database; use the built-in backup and restore tools."
        },
        {
          title: "A restore or backup fails",
          text: "Keep the original backup file unchanged and try a different writable destination. TinyRental validates backups before replacing live data and creates recovery material around restore operations. If the error repeats, send the exact message to support."
        }
      ],
      diagnostics: [
        "TinyRental version",
        "Windows version",
        "Exact error message",
        "What action you were performing",
        "Diagnostic log file, when available",
        "A screenshot only if it does not expose customer data or a license key"
      ]
    },
    offerdesk: {
      name: "Offer Desk",
      version: "0.9.1",
      category: "Job pricing & quoting",
      supportSummary: "Installation, language setup, PDF troubleshooting, backups and local data.",
      privacySummary: "Customers, quotes, reusable library items, company settings and internal pricing data are stored locally on the user's PC. Offer Desk does not require a Tynware cloud workspace for its core workflow.",
      termsSummary: "Windows desktop job-pricing and quoting software. The commercial product is planned as a one-time license. Release-specific activation details shown on the product page and checkout at purchase form part of the license terms.",
      productUrl: "/offerdesk/",
      supportUrl: "/offerdesk/support.html",
      downloadUrl: "",
      checkoutUrl: "",
      platform: "Windows desktop",
      installScope: "Per-user installation; administrator rights are normally not required.",
      installPath: "%LOCALAPPDATA%\\Programs\\Tynware\\OfferDesk",
      dataPath: "%LOCALAPPDATA%\\Tynware\\OfferDesk",
      logPath: "",
      backupLabel: ".offerdesk-backup",
      installation: [
        "Download Offer Desk only from the official Tynware product page.",
        "For the public release, check the installer\'s Windows digital signature before running it. The publisher should be Tynware.",
        "Open the installer and choose your preferred installer/interface language in the first dialog.",
        "Complete the per-user installation. Offer Desk creates Start-menu and desktop shortcuts.",
        "Launch Offer Desk and review your company profile, currency, tax and document defaults before creating customer quotes."
      ],
      troubleshooting: [
        {
          title: "Offer Desk does not start",
          text: "Restart Windows once and launch the installed shortcut again. If an error is shown, send support the Offer Desk version, Windows version and exact message."
        },
        {
          title: "The interface language is wrong",
          text: "Open Settings and select the required interface language. Quote/PDF language can be chosen independently from the interface language."
        },
        {
          title: "A PDF cannot be created",
          text: "Check that the destination folder is writable and review your company profile and quote data. Try saving to Documents or Desktop to rule out folder-permission issues."
        },
        {
          title: "Backup or restore fails",
          text: "Keep the original .offerdesk-backup file unchanged. Use Offer Desk's built-in backup/restore controls rather than replacing the SQLite database manually. A restore creates a safety backup before replacing live data."
        },
        {
          title: "A legacy Monto data warning appears",
          text: "Pre-release users may have a legacy Monto data folder. If Offer Desk reports that both the legacy and new folders contain data, stop and contact support. Do not merge or delete either folder manually."
        },
        {
          title: "Data remains after uninstall",
          text: "This is intentional. Uninstall removes the application but preserves %LOCALAPPDATA%\\Tynware\\OfferDesk so business data is not silently destroyed."
        }
      ],
      diagnostics: [
        "Offer Desk version",
        "Windows version",
        "Exact error message",
        "What action you were performing",
        "Whether the issue affects one quote/customer or the whole application",
        "A screenshot only if it does not expose customer or commercially sensitive data"
      ]
    }
  }
};
