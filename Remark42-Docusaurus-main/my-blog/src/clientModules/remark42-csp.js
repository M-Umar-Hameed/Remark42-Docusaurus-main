// Client module to configure CSP for Remark42
export default function configureCspForRemark42() {
  if (typeof window !== 'undefined') {
    // Get Remark42 configuration from meta tags or use defaults
    const getHostFromMeta = () => {
      const meta = document.querySelector('meta[name="remark42-host"]');
      return meta
        ? meta.content
        : window.remark_config?.host || 'https://61faf433f3de.ngrok-free.app';
    };

    const remark42Host = getHostFromMeta();
    const remark42Origin = new URL(remark42Host).origin;
    // Configure CSP to allow Remark42 connections
    const existingMeta = document.querySelector(
      'meta[http-equiv="Content-Security-Policy"]'
    );

    const addToDirective = (content, directive, newSources) => {
      const regex = new RegExp(`${directive}([^;]*);?`, 'i');
      const match = content.match(regex);

      if (match) {
        const existingDirective = match[0];
        const sources = match[1];

        // Check if our sources are already included
        if (newSources.every((source) => sources.includes(source))) {
          return content; // Already configured
        }

        // Add new sources
        const updatedDirective = existingDirective.replace(
          /;?$/,
          ` ${newSources.join(' ')};`
        );
        return content.replace(regex, updatedDirective);
      } else {
        // Add new directive
        return content + ` ${directive} 'self' ${newSources.join(' ')};`;
      }
    };

    if (existingMeta) {
      // Modify existing CSP
      let content = existingMeta.getAttribute('content') || '';

      // Add Remark42 permissions
      content = addToDirective(content, 'frame-src', [remark42Origin]);
      content = addToDirective(content, 'connect-src', [remark42Origin]);
      content = addToDirective(content, 'script-src', [
        remark42Origin,
        "'unsafe-inline'",
        "'unsafe-eval'",
      ]);
      content = addToDirective(content, 'script-src-elem', [
        remark42Origin,
        "'unsafe-inline'",
      ]);
      content = addToDirective(content, 'style-src', [
        remark42Origin,
        "'unsafe-inline'",
      ]);
      content = addToDirective(content, 'img-src', [remark42Origin, 'data:']);
      content = addToDirective(content, 'worker-src', [remark42Origin]);

      existingMeta.setAttribute('content', content.trim());
    } else {
      // Create new CSP meta tag optimized for Remark42
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Security-Policy';
      meta.content =
        [
          "default-src 'self'",
          `frame-src 'self' ${remark42Origin}`,
          `connect-src 'self' ${remark42Origin}`,
          `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${remark42Origin}`,
          `script-src-elem 'self' 'unsafe-inline' ${remark42Origin}`,
          `style-src 'self' 'unsafe-inline' ${remark42Origin}`,
          `img-src 'self' data: ${remark42Origin}`,
          `worker-src ${remark42Origin}`,
          "font-src 'self' data:",
          "object-src 'none'",
          "base-uri 'self'",
        ].join('; ') + ';';

      document.head.appendChild(meta);
    }

    // Enhanced fetch interception for CSP debugging
    const originalFetch = window.fetch;
    window.fetch = function (...args) {
      return originalFetch
        .apply(this, args)
        .then((response) => {
          // Log CSP headers for debugging
          const csp = response.headers.get('content-security-policy');
          if (
            csp &&
            args[0] &&
            args[0].includes &&
            args[0].includes(remark42Origin)
          )
            return response;
        })
        .catch((error) => {
          if (args[0] && args[0].includes && args[0].includes(remark42Origin)) {
          }
          throw error;
        });
    };
  }
}
