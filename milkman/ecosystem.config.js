module.exports = {
  apps: [
    {
      name: "milkman-django",
      script: "venv/bin/gunicorn",
      args: "--bind 127.0.0.1:8000 milkman.wsgi:application",
      cwd: ".",
    },
    {
      name: "milkman-express",
      script: "node server.js",
      cwd: "../backend",
    },
    {
      name: "milkman-react",
      script: "npm",
      args: "run dev -- --host",
      cwd: "../frontend",
    }
  ]
};
