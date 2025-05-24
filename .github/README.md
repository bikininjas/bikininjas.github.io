# GitHub Workflows

This repository contains automated workflows for building, testing, and deploying the Astro blog.

## Workflows

### 1. Deploy to GitHub Pages (`deploy-blog.yml`)

**Triggers:**
- Push to `master` or `main` branches
- Manual trigger via workflow dispatch

**Process:**
1. Sets up Bun environment
2. Caches dependencies for faster builds
3. Installs dependencies using `bun install --frozen-lockfile`
4. Runs TypeScript type checking
5. Builds the Astro site
6. Uploads build artifacts to GitHub Pages
7. Deploys to GitHub Pages

**Requirements:**
- GitHub Pages must be enabled in repository settings
- Source should be set to "GitHub Actions"

### 2. Continuous Integration (`ci.yml`)

**Triggers:**
- Pull requests to `master` or `main` branches
- Push to `master` or `main` branches

**Process:**
1. Sets up Bun environment
2. Caches dependencies
3. Installs dependencies
4. Runs TypeScript type checking
5. Runs Prettier format checking
6. Builds the site
7. Verifies build artifacts exist

### 3. Auto-merge Dependabot PRs (`auto-merge-dependabot.yml`)

**Triggers:**
- Pull requests from Dependabot

**Process:**
1. **Test Job:**
   - Runs full CI pipeline (type check, build test)
   - Must pass before auto-merge proceeds

2. **Auto-merge Job:**
   - Only runs for patch and minor version updates
   - Automatically approves and merges PR if tests pass
   - Uses squash merge for clean history

## Dependabot Configuration

The repository includes automated dependency updates via Dependabot:

- **NPM Dependencies:** Weekly updates on Mondays
- **GitHub Actions:** Weekly updates on Mondays
- **Grouping:** Related packages are grouped together
- **Auto-merge:** Patch and minor updates are auto-merged after testing

## Package Scripts

The following scripts are available in `yukina-blog/package.json`:

```bash
bun run dev        # Start development server
bun run build      # Build for production
bun run preview    # Preview production build
bun run check      # Run TypeScript type checking
bun run format     # Format code with Prettier
bun run format:check # Check code formatting
```

## Development Workflow

1. **Local Development:**
   ```bash
   cd yukina-blog
   bun install
   bun run dev
   ```

2. **Before Committing:**
   ```bash
   bun run check      # Verify types
   bun run format     # Format code
   bun run build      # Test build
   ```

3. **Pull Request Process:**
   - CI workflow runs automatically
   - Type checking, formatting, and build verification
   - Manual review required for approval
   - Auto-merge available for Dependabot PRs

## Troubleshooting

### Build Failures

1. **Type Errors:**
   ```bash
   cd yukina-blog && bun run check
   ```

2. **Format Issues:**
   ```bash
   cd yukina-blog && bun run format
   ```

3. **Dependency Issues:**
   ```bash
   cd yukina-blog && rm -rf node_modules && bun install
   ```

### Deployment Issues

1. **GitHub Pages Not Working:**
   - Check repository settings > Pages
   - Ensure source is set to "GitHub Actions"
   - Verify workflow permissions in repository settings

2. **Build Artifacts Missing:**
   - Check if `dist` directory is created during build
   - Verify Astro configuration is correct

## Security

- Workflows use minimal required permissions
- Dependabot PRs are tested before auto-merge
- Only patch and minor updates are auto-merged
- Major version updates require manual review

## Monitoring

Monitor workflow status in the "Actions" tab of the GitHub repository:
- Green checkmarks indicate successful builds
- Red X marks indicate failures that need attention
- Yellow dots indicate workflows in progress
