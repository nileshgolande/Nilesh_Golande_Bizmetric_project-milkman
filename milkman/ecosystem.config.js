module.exports = {
  apps: [
    {
      name: "milkman-django",
      script: "./venv/bin/gunicorn",
      args: "--bind 127.0.0.1:8000 --workers 3 --timeout 120 --access-logfile - --error-logfile - milkman.wsgi:application",
      cwd: ".",
      interpreter: "none",
    }
  ]
};
