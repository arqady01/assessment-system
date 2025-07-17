export const SECURITY_CONFIG = {
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key-change-in-production',
    jwtExpiry: '1h',
    refreshTokenExpiry: '7d',
    bcryptRounds: 12,
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000,
    sessionTimeout: 24 * 60 * 60 * 1000,
    csrfSecret: process.env.CSRF_SECRET || 'csrf-secret-key',
    encryptionKey: process.env.ENCRYPTION_KEY || 'encryption-key-32-chars-long-min',
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecialChars: true,
    mfaSecret: process.env.MFA_SECRET || 'mfa-secret-key',
    mfaCodeExpiry: 5 * 60 * 1000,
    backupCodesCount: 10
  },
  
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 100,
    maxLoginAttempts: 5,
    maxMFAAttempts: 3,
    maxPasswordResetAttempts: 3,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    keyGenerator: (req: any) => req.ip,
    onLimitReached: (req: any, res: any) => {
      console.log(`Rate limit exceeded for IP: ${req.ip}`)
    }
  },
  
  encryption: {
    algorithm: 'aes-256-gcm',
    keySize: 32,
    ivSize: 16,
    tagSize: 16,
    iterations: 100000,
    saltSize: 32,
    compressionEnabled: true,
    keyRotationInterval: 30 * 24 * 60 * 60 * 1000
  },
  
  validation: {
    maxInputLength: 10000,
    allowedFileTypes: ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx'],
    maxFileSize: 10 * 1024 * 1024,
    sqlInjectionPatterns: [
      /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/i,
      /((\-\-)|(\#)|(/\*)|(\*/)|(\bor\b)|(\band\b))/i,
      /(\b(script|javascript|vbscript)\b)/i
    ],
    xssPatterns: [
      /<script[^>]*>.*?<\/script>/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe[^>]*>/i
    ],
    commandInjectionPatterns: [
      /(\b(rm|del|format|shutdown|reboot|kill|ps|ls|dir|cat|type)\b)/i,
      /([\|\&\;\`\$\(\)\{\}\[\]])/,
      /(\.\.\/)/,
      /(\/etc\/|\/proc\/|\/sys\/)/
    ],
    pathTraversalPatterns: [
      /(\.\.\/|\.\.\\)/,
      /(^\/|^[a-zA-Z]:\\)/,
      /([\<\>\:\"\|\?\*])/,
      /(\0)/
    ]
  },
  
  headers: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"]
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    referrerPolicy: 'strict-origin-when-cross-origin',
    permissionsPolicy: {
      geolocation: [],
      microphone: [],
      camera: [],
      payment: [],
      usb: [],
      magnetometer: [],
      gyroscope: [],
      accelerometer: []
    }
  },
  
  audit: {
    enabled: true,
    logLevel: 'info',
    logFile: '/var/log/security-audit.log',
    maxLogSize: 100 * 1024 * 1024,
    maxLogFiles: 10,
    sensitiveFields: ['password', 'token', 'secret', 'key'],
    retentionDays: 90,
    realTimeAlerts: true,
    alertThresholds: {
      failedLogins: 10,
      suspiciousActivity: 5,
      dataExfiltration: 1
    }
  },
  
  monitoring: {
    enabled: true,
    metricsInterval: 60000,
    healthCheckInterval: 30000,
    performanceThresholds: {
      responseTime: 1000,
      memoryUsage: 80,
      cpuUsage: 80,
      diskUsage: 90
    },
    alerting: {
      email: process.env.ALERT_EMAIL,
      webhook: process.env.ALERT_WEBHOOK,
      slack: process.env.SLACK_WEBHOOK
    }
  },
  
  backup: {
    enabled: true,
    interval: 24 * 60 * 60 * 1000,
    retention: 30,
    encryption: true,
    compression: true,
    destinations: [
      {
        type: 's3',
        bucket: process.env.BACKUP_S3_BUCKET,
        region: process.env.BACKUP_S3_REGION
      },
      {
        type: 'local',
        path: '/var/backups/security'
      }
    ]
  },
  
  compliance: {
    gdpr: {
      enabled: true,
      dataRetentionDays: 365,
      anonymizationEnabled: true,
      consentRequired: true
    },
    hipaa: {
      enabled: false,
      encryptionRequired: true,
      auditTrailRequired: true,
      accessControlRequired: true
    },
    pci: {
      enabled: false,
      tokenizationRequired: true,
      networkSegmentation: true,
      regularTesting: true
    }
  },
  
  development: {
    debugMode: process.env.NODE_ENV === 'development',
    testMode: process.env.NODE_ENV === 'test',
    mockExternalServices: process.env.NODE_ENV !== 'production',
    verboseLogging: process.env.NODE_ENV === 'development',
    disableRateLimit: process.env.NODE_ENV === 'test',
    allowInsecureConnections: process.env.NODE_ENV === 'development'
  },
  
  external: {
    cppExecutable: process.env.CPP_SECURITY_EXECUTABLE || './security_validator',
    maxCppProcesses: 5,
    cppTimeout: 5000,
    trustedProxies: (process.env.TRUSTED_PROXIES || '').split(',').filter(Boolean),
    geoLocationService: process.env.GEO_SERVICE_URL || 'http://ip-api.com/json/',
    threatIntelligence: {
      enabled: true,
      apiKey: process.env.THREAT_INTEL_API_KEY,
      updateInterval: 60 * 60 * 1000
    }
  },
  
  database: {
    encryption: {
      enabled: true,
      algorithm: 'aes-256-gcm',
      keyRotation: true,
      keyRotationInterval: 30 * 24 * 60 * 60 * 1000
    },
    backup: {
      enabled: true,
      interval: 6 * 60 * 60 * 1000,
      retention: 7,
      encryption: true
    },
    monitoring: {
      slowQueryThreshold: 1000,
      connectionPoolMonitoring: true,
      deadlockDetection: true
    }
  },
  
  network: {
    ssl: {
      enabled: true,
      minVersion: 'TLSv1.2',
      ciphers: [
        'ECDHE-RSA-AES128-GCM-SHA256',
        'ECDHE-RSA-AES256-GCM-SHA384',
        'ECDHE-RSA-AES128-SHA256',
        'ECDHE-RSA-AES256-SHA384'
      ],
      dhParam: 2048
    },
    firewall: {
      enabled: true,
      allowedPorts: [80, 443, 22],
      blockedCountries: [],
      rateLimitByIP: true,
      ddosProtection: true
    },
    proxy: {
      enabled: false,
      trustProxy: false,
      maxProxyHops: 1
    }
  }
}

export type SecurityConfigType = typeof SECURITY_CONFIG

export function validateSecurityConfig(): boolean {
  const required = [
    'JWT_SECRET',
    'CSRF_SECRET',
    'ENCRYPTION_KEY'
  ]
  
  for (const key of required) {
    if (!process.env[key]) {
      console.error(`Missing required environment variable: ${key}`)
      return false
    }
  }
  
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.error('JWT_SECRET must be at least 32 characters long')
    return false
  }
  
  if (process.env.ENCRYPTION_KEY && process.env.ENCRYPTION_KEY.length < 32) {
    console.error('ENCRYPTION_KEY must be at least 32 characters long')
    return false
  }
  
  return true
}

export function getSecurityConfig(): SecurityConfigType {
  if (!validateSecurityConfig() && process.env.NODE_ENV === 'production') {
    throw new Error('Invalid security configuration')
  }
  
  return SECURITY_CONFIG
}
