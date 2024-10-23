# Contributing to Transcript-Seeker

Hey there! 👋 Welcome to the **Transcript-Seeker** project! We're absolutely thrilled that you're interested in contributing. Whether you're fixing a bug, adding a feature, or sharing an idea, your efforts help make our project better and more useful for everyone. Here are some easy-to-follow guidelines to help you dive in!

## Table of Contents

- [Issues](#issues)
- [Pull Requests](#pull-requests)
- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [Conventional Commits](#conventional-commits)
- [Code Formatting](#code-formatting)

## Issues

Have you found a bug, got a suggestion, or stumbled upon something that doesn't work as expected? No problem! Feel free to [open an issue](https://github.com/Meeting-Baas/transcript-seeker/issues). When submitting an issue, try to include a clear and concise title and as many details as possible. The more info you provide, the faster we can jump in and help!

## Pull Requests

We love pull requests! 🎉 If you'd like to make a contribution, whether it’s a bug fix, a feature, or a small improvement, follow these steps:

1. **Fork the repo** to your GitHub account.
2. **Create a new branch** with a meaningful name:
   - For bug fixes: `fix/issue-123-bug-description`
   - For new features: `feat/awesome-new-feature`
3. Make your changes, and make sure you follow our [Conventional Commits](#conventional-commits) guidelines.
4. **Push your branch** to your forked repository.
5. Open a **pull request** from your branch to the `main` branch of this repo.
6. Before submitting, make sure your code is clean by running:
   ```bash
   pnpm typecheck
   ```
   This will help catch any issues early on. 🚀

## Local Setup

Ready to jump into the code? Awesome! Here’s how to get set up locally:

1. **Fork the repository** to your GitHub account.

2. **Clone the repository** to your machine:

   ```bash
   git clone <your-forked-repo-url>
   cd transcript-seeker
   ```

3. **Create your environment file** by copying `.env.example` to `.env`. This allows you to configure your setup.

   ```bash
   cp .env.example .env
   ```

4. **Install dependencies**:

   ```bash
   pnpm install
   ```

5. **Run database migrations**:

   ```bash
   pnpm db:generate && pnpm db:migrate
   ```

6. **Start the app in development mode**:

   ```bash
   pnpm dev
   ```

   You can now access the services at:

   | Service           | URL              |
   | ----------------- | ---------------- |
   | Proxy Server      | `localhost:3000` |
   | Transcript Seeker | `localhost:5173` |

## Environment Variables

To configure the environment properly, here are some key environment variables used in **Transcript-Seeker**:

### Proxy Configuration

- `HOST`: Set the host address for the proxy server. Default is `0.0.0.0`.
- `PORT`: Define the port where the proxy server will run. Default is `3000`.
- `MEETINGBASS_API_URL`: URL for the MeetingBaas API, e.g., `https://api.meetingbaas.com`.
- `MEETINGBASS_S3_URL`: URL for accessing MeetingBaas S3 resources, e.g., `https://s3.eu-west-3.amazonaws.com/meeting-baas-video`.

### Client Configuration

- `VITE_CLIENT_PORT`: Set the port for the client application. Default is `5173`.
- `VITE_CLIENT_HOST`: Host address for the client. Default is `0.0.0.0`.
- `VITE_PROXY_URL`: URL to the proxy server. This can be used to set up your own proxy, e.g., `https://localhost:3000`.

### Service Worker

- `SW`: Enables the Service Worker (`true` or `false`). Default is `"true"`.
- `SW_DEV`: Makes it easier to manage the Service Worker during development (`true` or `false`). Default is `"true"`.

### Advanced Configuration

- `VITE_S3_PREFIX`: S3 bucket prefix for accessing video files. Default is `https://s3.eu-west-3.amazonaws.com/meeting-baas-video`.

These environment variables allow you to configure the proxy, client, and advanced features to meet your specific requirements. Make sure to adjust them according to your local setup or deployment needs.

## Conventional Commits

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) to keep our commit history clean and organized. It makes it easier for everyone to understand what's been done at a glance. Commit messages should use the following format:

```
<type>(<scope>): <description>
```

For example:

- `feat(homepage): redesign the layout`
- `fix(styles): correct position of server status`

Some common commit types:

- `feat`: A new feature.
- `fix`: A bug fix.
- `docs`: Documentation changes.
- `style`: Code style changes (formatting, missing semicolons, etc.).

## Code Formatting

To keep the codebase consistent and readable, we recommend running a few checks before opening a pull request:

1. **Lint fixes**:
   ```bash
   pnpm lint:fix
   ```

2. **Run type checks** to ensure there are no type issues:
   ```bash
   pnpm typecheck
   ```

Your code should be well-tested, clear, and follow our best practices. Remember, every contribution makes a difference, and we deeply appreciate your help in making **Transcript-Seeker** better! 🎉

Thanks a ton for contributing, and welcome aboard! If you need any help, don’t hesitate to ask. Let’s make something amazing together. 🚀

