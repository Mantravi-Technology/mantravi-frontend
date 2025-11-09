# Starting the Development Server

## Quick Start

1. **Stop any running servers** (VS Code Live Server, etc.)

2. **Start the Node.js server:**
   ```bash
   npm start
   ```
   Or:
   ```bash
   node server.js
   ```

3. **Open your browser:**
   - Homepage: http://127.0.0.1:5503/
   - Services: http://127.0.0.1:5503/services
   - About: http://127.0.0.1:5503/about
   - Contact: http://127.0.0.1:5503/contact
   - Blog: http://127.0.0.1:5503/blog
   - Work With Us: http://127.0.0.1:5503/work-with-us

## Important Notes

- **DO NOT use VS Code Live Server** - it doesn't support clean URLs
- **Use the Node.js server** (`npm start`) for development
- The server runs on **port 5503** by default
- All clean URLs will work correctly with this server

## Troubleshooting

If you see "Cannot GET /services" or similar errors:
1. Make sure you stopped Live Server
2. Make sure the Node.js server is running (`npm start`)
3. Check the terminal for any error messages
4. Try accessing http://127.0.0.1:5503/ first

