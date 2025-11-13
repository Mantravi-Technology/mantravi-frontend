# Sitemap Update Script

## Overview

The `update-sitemap.js` script automatically generates and updates `sitemap.xml` by fetching all blog posts from the Mantravi API and combining them with static pages.

## Features

✅ **Production Ready**
- Efficient pagination to fetch all blogs
- Error handling with retry logic (3 retries)
- Request timeout protection (30 seconds)
- XML escaping for special characters
- Proper date formatting
- Zero impact on website performance (runs separately)

✅ **Automated Updates**
- Runs automatically before each deployment
- Daily updates via GitHub Actions
- Manual trigger available

✅ **SEO Optimized**
- Includes all static pages with proper priorities
- Dynamically adds all blog posts
- Uses correct lastmod dates from blog posts
- Includes blog post images in sitemap

## Usage

### Manual Update

```bash
npm run update-sitemap
```

### Automatic Updates

1. **Before Deployment**: Runs automatically via `npm run build`
2. **Daily Updates**: GitHub Action runs at 2:00 AM UTC daily
3. **Manual Trigger**: Go to GitHub Actions → "Update Sitemap Daily" → "Run workflow"

## Configuration

Edit `scripts/update-sitemap.js` to modify:

- `API_BASE_URL`: Your API endpoint
- `SITE_URL`: Your website URL
- `PAGE_SIZE`: Number of blogs fetched per request (default: 100)
- `MAX_RETRIES`: Number of retry attempts (default: 3)
- `REQUEST_TIMEOUT`: Request timeout in ms (default: 30000)

## Output

The script generates `sitemap.xml` in the root directory with:

- All static pages (Home, Services, About, Contact, Blog, Work With Us)
- All blog posts from the API
- Proper XML formatting
- SEO-optimized priorities and change frequencies

## Troubleshooting

### Script fails to fetch blogs

1. Check API endpoint is accessible: `https://api.mantravi.com/api/blog/published`
2. Verify API returns JSON in expected format
3. Check network connectivity

### Sitemap not updating

1. Check GitHub Actions logs for errors
2. Verify API is returning blog posts
3. Check file permissions on `sitemap.xml`

### Performance concerns

- Script runs separately, never on page load
- Only runs during build or scheduled updates
- Zero impact on website response time

## Best Practices

1. **Run before deployment**: Ensures sitemap is always up-to-date
2. **Daily updates**: Keeps search engines informed of new content
3. **Monitor logs**: Check GitHub Actions for any issues
4. **Test manually**: Run `npm run update-sitemap` after adding new blogs

## Support

For issues or questions, check:
- GitHub Actions logs
- Script output in terminal
- API endpoint accessibility

