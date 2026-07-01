# App Store Compliance URLs

This document lists all the delete account and privacy policy URLs for each app as submitted to Google Play Store and Apple App Store. **Do not delete or move these files.**

## URL Structure

All app legal pages are accessible at: `https://doxaandco.co/{app-name}/{page}`

### Delete Account Pages

Users can request account deletion at these URLs:

| App | Delete URL | File Location |
|-----|-----------|----------------|
| Beacon of New Beginnings | `https://doxaandco.co/delete/beacon` | `/public/beacon/account/delete.html` |
| Phoenix International School | `https://doxaandco.co/delete/phoenix` | `/public/phoenix/account/delete.html` |
| Faith Klinik | `https://doxaandco.co/delete/faithklinik` | `/public/faithklinik/account/delete.html` |
| HomeLinkGH | `https://doxaandco.co/delete/homelinkgh` | `/public/homelinkgh/account/delete.html` |
| VaultLink | `https://doxaandco.co/delete/vaultlink` | `/public/vaultlink/privacy/delete-data.html` |
| Ministry Hub | `https://doxaandco.co/delete/ministryhub` | `/public/ministryhub/privacy/delete-data.html` |
| Native Nest | `https://doxaandco.co/delete/nativenest` | `/public/nativenest/privacy/delete-data.html` |

### Privacy Policy Pages

Privacy policies are available at these URLs:

| App | Privacy URL | File Location |
|-----|-----------|----------------|
| Beacon of New Beginnings | `https://doxaandco.co/privacy/beacon` | `/public/beacon/privacy-policy.html` |
| Phoenix International School | `https://doxaandco.co/privacy/phoenix` | `/public/phoenix/privacy-policy.html` |
| Faith Klinik | `https://doxaandco.co/privacy/faithklinik` | `/public/faithklinik/privacy-policy.html` |
| HomeLinkGH | `https://doxaandco.co/privacy/homelinkgh` | `/public/homelinkgh/privacy-policy.html` |
| VaultLink | `https://doxaandco.co/privacy/vaultlink` | `/public/vaultlink/privacy-policy.html` |
| Ministry Hub | `https://doxaandco.co/privacy/ministryhub` | `/public/ministryhub/privacy-policy.html` |
| Native Nest | `https://doxaandco.co/privacy/nativenest` | `/public/nativenest/privacy-policy.html` |

## Direct File Access

All files are also accessible via direct path:
- `https://doxaandco.co/{app-name}/account/delete.html`
- `https://doxaandco.co/{app-name}/privacy-policy.html`
- `https://doxaandco.co/{app-name}/privacy/delete-data.html`

## Router Configuration

The website uses two routing mechanisms:

### 1. Dynamic Routes (React Router)
- `/delete/:appName` → redirects to `/{appName}/account/delete.html`
- `/privacy/:appName` → redirects to `/{appName}/privacy-policy.html`

Configured in: `src/router/router.tsx`

### 2. Static File Serving (Netlify)
- Netlify routing rules in `netlify.toml` serve static files from `/public/{app-name}/*`
- These rules must come BEFORE the SPA catch-all rule

Configured in: `netlify.toml`

## App Store Submissions

The following URLs have been submitted to app stores:

### Google Play Store
- **Beacon**: `https://doxaandco.co/delete/beacon` (Deadline: July 14, 2026)
- **Phoenix**: `https://doxaandco.co/delete/phoenix` (Deadline: July 15, 2026)

### Important Notes

1. **Do not rename or move** the app folders in `/public/{app-name}/`
2. **Do not delete** any files in these directories
3. If updating legal pages, keep the same filename (delete.html, privacy-policy.html)
4. Test URLs before submitting to app stores
5. Keep this document updated when adding new apps

## Testing

Before submitting to app stores, verify all URLs are accessible:

```bash
curl -I https://doxaandco.co/delete/beacon
curl -I https://doxaandco.co/delete/phoenix
curl -I https://doxaandco.co/privacy/homelinkgh
# ... etc for all apps
```

All should return HTTP 200 (not 404).

## Troubleshooting

If URLs return 404:
1. Check that the file exists in `/public/{app-name}/`
2. Verify netlify.toml has routing rules for all app folders
3. Ensure build includes the public folder files
4. Check that the React router has the `/delete/:appName` route
