module.exports = {
  apps: [
    {
      name: "milkman-django",
      script: "gunicorn",
      args: "--bind 0.0.0.0:8000 milkman.wsgi:application",
      cwd: "milkman/milkman",
      interpreter: "python3",
    },
    {
      name: "milkman-express",
      script: "node server.js",
      cwd: "milkman/backend",
    }
  ]
};
