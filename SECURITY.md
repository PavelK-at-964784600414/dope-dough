# Security Policy

## Overview

La Petite Sourdough takes security seriously. This document outlines our security practices and how to report vulnerabilities.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Security Features

### 1. HTTP Security Headers

The application implements comprehensive security headers:

- **Strict-Transport-Security (HSTS)**: Enforces HTTPS connections (2 year max-age with preload)
- **X-Frame-Options**: Prevents clickjacking attacks (SAMEORIGIN)
- **X-Content-Type-Options**: Prevents MIME-type sniffing (nosniff)
- **X-XSS-Protection**: Legacy XSS filter for older browsers
- **Content-Security-Policy (CSP)**: Restricts resource loading to trusted sources
- **Referrer-Policy**: Controls referrer information sent with requests
- **Permissions-Policy**: Restricts access to browser features (camera, microphone, geolocation disabled)

### 2. Input Validation & Sanitization

All user inputs are validated and sanitized:

- **String Sanitization**: Removes script tags, event handlers, and dangerous protocols
- **HTML Sanitization**: Allows only safe HTML tags (b, i, u, strong, em, br, p, span)
- **Number Validation**: Ensures numeric inputs are within acceptable ranges
- **localStorage Key Validation**: Only allows specific key patterns (sourdough:*, dope-dough:*)

### 3. localStorage Security

Protected localStorage operations with multiple layers:

- **Key Format Validation**: Only accepts whitelisted key patterns
- **Data Size Limits**: Maximum 5MB total storage, 10KB per string
- **Data Structure Validation**: Validates data structure before parsing
- **Graceful Error Handling**: Falls back to defaults if corrupted data detected
- **Rate Limiting**: Prevents excessive read/write operations

### 4. Rate Limiting

Client-side rate limiting prevents abuse:

- **Notification Sounds**: 5 per minute (prevents spam)
- **localStorage Operations**: 50 per minute (prevents DoS)
- **Automatic Reset**: Rate limits reset after time window expires

### 5. Client-Side Protection

- **React Strict Mode**: Enabled for better error detection
- **No Inline Scripts**: CSP prevents inline script execution
- **Safe JSON Parsing**: try-catch blocks with validation on all JSON operations
- **No eval()**: Application doesn't use eval() or Function() constructor
- **No dangerouslySetInnerHTML**: No direct HTML injection

## Data Storage

### What We Store (Client-Side Only)

The application uses **localStorage only** - no server-side data storage:

1. **Recipe Progress** (`sourdough:timers`)
   - Current step index
   - Completed steps array
   - Timer states (remaining seconds, running status)

2. **Language Preference** (`dope-dough:language`)
   - User's selected language ('en' or 'ru')

3. **Ingredients Checklist** (`sourdough:ingredients-checked`)
   - Checked ingredients for current baking session

### Data Privacy

- ✅ **No Personal Information**: App doesn't collect names, emails, or personal data
- ✅ **No Tracking**: No analytics, cookies, or user tracking
- ✅ **Local Only**: All data stays on your device
- ✅ **No Server Uploads**: Data never leaves your browser
- ✅ **Easy Deletion**: Clear browser data or use "Clear All Data" button

## Third-Party Services

### Calendar Integration

The app integrates with calendar services:

- **Google Calendar**: Uses public URL scheme for event creation
- **Apple Calendar**: Uses data: URL with iCalendar format
- **No Data Sharing**: Calendar events created locally, no data sent to our servers

### Content Delivery

- **Images**: Hosted on same domain (no external CDN)
- **Fonts**: Google Fonts (Fredoka, Inter) - loaded from Google's CDN
- **No Tracking Scripts**: No Google Analytics, Facebook Pixel, or other trackers

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

### How to Report

1. **Email**: Send details to [pavelklug@gmail.com](mailto:pavelklug@gmail.com)
2. **Subject Line**: Use "Security Vulnerability Report: La Petite Sourdough"
3. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: Within 48 hours
- **Investigation**: We'll assess the issue within 7 days
- **Fix Timeline**: Critical issues patched within 7 days, others within 30 days
- **Credit**: With your permission, we'll credit you in the changelog

### Please Do NOT

- ❌ Publicly disclose the vulnerability before we've issued a fix
- ❌ Exploit the vulnerability beyond what's needed to demonstrate it
- ❌ Access or modify other users' data (there isn't any, but still)
- ❌ Perform DoS attacks or spam testing

## Security Best Practices for Users

### Browser Security

- ✅ Keep your browser updated to the latest version
- ✅ Use a modern browser (Chrome, Firefox, Safari, Edge)
- ✅ Enable HTTPS-only mode if available
- ✅ Be cautious of browser extensions that modify page content

### Data Protection

- ✅ Use browser's private/incognito mode if you don't want data saved
- ✅ Clear browser data periodically if using shared devices
- ✅ The app includes a "Clear All Data" button for easy cleanup

### Safe Usage

- ✅ Access the app only through official URL: https://la-petite-sourdough.vercel.app
- ✅ Verify HTTPS lock icon in browser address bar
- ❌ Don't use the app from untrusted sources or mirrors

## Development Security

### For Contributors

If you're contributing to this project:

1. **Never commit secrets**: Use .env files (already in .gitignore)
2. **Validate all inputs**: Use security utilities from `lib/security.ts`
3. **Sanitize output**: Escape user-provided content before rendering
4. **Use TypeScript**: Strong typing catches many security issues
5. **Run `npm audit`**: Check for known vulnerabilities in dependencies
6. **Test security features**: Ensure rate limiting and validation work

### Dependency Management

- Regular updates via `npm update`
- Security audits via `npm audit fix`
- Automated Dependabot alerts on GitHub
- No dependencies with known critical vulnerabilities

## Compliance

### Open Source License

- **License**: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- **Attribution Required**: Credit Pavel Klug as original author
- **Share-Alike**: Derivatives must use same license
- **Commercial Use**: Allowed with proper attribution

### Privacy Regulations

- **GDPR Compliant**: No personal data collected
- **CCPA Compliant**: No data sold or shared
- **No Cookies**: Application doesn't use cookies
- **No Consent Required**: No personal data = no consent needed

## Incident Response

In case of a security incident:

1. **Immediate**: Disable affected features if critical
2. **24 hours**: Deploy emergency patch
3. **48 hours**: Notify users via README and GitHub
4. **7 days**: Publish detailed incident report

## Contact

**Security Contact**: Pavel Klug
- **Email**: [pavelklug@gmail.com](mailto:pavelklug@gmail.com)
- **GitHub**: [@PavelK-at-964784600414](https://github.com/PavelK-at-964784600414)
- **Response Time**: Within 48 hours

---

**Last Updated**: October 30, 2025

**Version**: 1.0.0
