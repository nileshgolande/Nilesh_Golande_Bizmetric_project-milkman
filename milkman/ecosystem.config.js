// module.exports = {
//   apps: [
//     {
//       name: "milkman-django",
//       script: "./venv/bin/gunicorn",
//       args: "--bind 127.0.0.1:8000 milkman.wsgi:application",
//       cwd: "milkman",
//       interpreter: "none",
//     }
//   ]
// };
module.exports = {
  apps: [
    {
      name: "milkman-django",
      script: "/home/azureuser/milkman/milkman/venv/bin/gunicorn",
      args: "milkman.wsgi:application --bind 127.0.0.1:8000 --workers 3 --timeout 120",
      cwd: "/home/azureuser/milkman/milkman",
      interpreter: "none",
      env: {
        DJANGO_SETTINGS_MODULE: "milkman.settings",
        PYTHONPATH: "/home/azureuser/milkman/milkman",
      },
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      error_file: "/home/azureuser/.pm2/logs/milkman-django-error.log",
      out_file:   "/home/azureuser/.pm2/logs/milkman-django-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    }
  ]
};
