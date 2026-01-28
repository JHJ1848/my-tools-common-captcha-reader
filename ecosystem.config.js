module.exports = {
  apps: [
    {
      name: 'captcha-reader',
      script: 'src/app.js',
      instances: 1,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      // Auto restart configuration
      autorestart: true,
      // Restart delay
      restart_delay: 4000,
      // Error log
      error_file: './logs/error.log',
      // Output log
      out_file: './logs/out.log',
      // Log date format
      log_date_format: 'YYYY-MM-DD HH:mm:ss'
    }
  ]
};
