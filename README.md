# Docusaurus Blog with Remark42 Comments

A modern blog built with Docusaurus 3.8.1 and integrated with Remark42 comment system for interactive discussions.

## Features

- Built with Docusaurus 3.8.1
- Integrated Remark42 comment system on blog posts
- React 19 support
- Docker-based Remark42 deployment
- Content Security Policy (CSP) configuration for Remark42
- Anonymous commenting enabled
- Automated ngrok configuration for local development

## Prerequisites

- Node.js >= 18.0
- Docker and Docker Compose
- ngrok account (for local development with Remark42)

## Installation

```bash
npm install
```

## Development

### Quick Start (without Remark42)

```bash
npm start
```

Your site will be available at http://localhost:3000

### With Remark42 Comments (Local Development)

1. Start ngrok tunnel:
```bash
ngrok http 8080
```

2. Update configuration with your ngrok URL:
```bash
node update-ngrok.js https://your-ngrok-url.ngrok-free.app
```

3. Start Docusaurus:
```bash
npm start
```

For detailed Remark42 setup instructions, see [README-REMARK42.md](README-REMARK42.md)

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build production bundle
- `npm run serve` - Serve production build locally
- `npm run deploy` - Deploy to hosting
- `npm run clear` - Clear build cache
- `npm run swizzle` - Eject Docusaurus components for customization
- `npm run write-translations` - Generate translation files
- `npm run write-heading-ids` - Add heading IDs to markdown files

## Project Structure

```
my-blog/
├── blog/                    # Blog posts
├── docs/                    # Documentation pages
├── src/
│   ├── components/         # React components (including Remark42)
│   ├── clientModules/      # Client-side modules (CSP config)
│   ├── pages/              # Custom pages
│   └── theme/              # Swizzled theme components
├── static/                 # Static assets
├── docusaurus.config.js    # Docusaurus configuration
├── sidebars.js            # Sidebar configuration
├── docker-compose.yml     # Remark42 Docker setup
├── update-ngrok.js        # Ngrok automation script
└── package.json
```

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
REMARK42_HOST=https://your-ngrok-url.ngrok-free.app
REMARK42_SITE_ID=remark
```

### Docusaurus Config

Main configuration is in `docusaurus.config.js`:
- Site metadata (title, tagline, favicon)
- Deployment settings
- Theme configuration
- Remark42 integration via custom fields

## Remark42 Integration

The project includes:

- `src/components/Remark42.js` - React component for embedding comments
- `src/clientModules/remark42-csp.js` - CSP configuration for Remark42
- `src/theme/BlogPostItem/index.js` - Swizzled component to add comments to blog posts
- `docker-compose.yml` - Remark42 server configuration
- `update-ngrok.js` - Script to automatically update all Remark42 URLs

Comments are automatically added to all blog posts. Anonymous commenting is enabled by default.

## Build

```bash
npm run build
```

The static files will be generated in the `build` directory.

## Deployment

This project can be deployed to various platforms:

- GitHub Pages
- Vercel
- Netlify
- Custom hosting

For production deployment:
1. Update environment variables with production Remark42 URL
2. Build the project
3. Deploy the `build` directory

## Browser Support

### Production
- >0.5%
- not dead
- not op_mini all

### Development
- last 3 Chrome versions
- last 3 Firefox versions
- last 5 Safari versions

## Troubleshooting

### Remark42 comments not loading

1. Check browser console for errors
2. Verify ngrok URL is correct in `.env` and `docker-compose.yml`
3. Clear browser cache (Ctrl+Shift+R)
4. Check Docker logs: `docker logs remark42`

### Build errors

1. Clear Docusaurus cache: `npm run clear`
2. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
3. Check Node version: `node --version` (should be >= 18.0)

## Documentation

- [Docusaurus Documentation](https://docusaurus.io/)
- [Remark42 Documentation](https://remark42.com/)
- [Remark42 Setup Guide](README-REMARK42.md)

## License

This project is private.

## Support

For issues related to:
- Docusaurus: https://github.com/facebook/docusaurus/issues
- Remark42: https://github.com/umputun/remark42/issues
