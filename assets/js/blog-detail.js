// blog-detail.js
document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('blog-detail');
  const headerTitle = document.getElementById('blog-detail-title');
  const metaBar = document.getElementById('blog-detail-meta');
  const api = new ApiService();

  function formatDate(dateStr) {
    try { return new Date(dateStr).toLocaleDateString(); } catch { return ''; }
  }

  function initReadingProgress() {
    // Create reading progress bar if it doesn't exist
    let progressBar = document.querySelector('.reading-progress');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.className = 'reading-progress';
      document.body.appendChild(progressBar);
    }

    // Calculate and update reading progress
    function updateProgress() {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      progressBar.style.width = Math.min(scrollPercent, 100) + '%';
    }

    // Update on scroll (throttled)
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Initial update
    updateProgress();
  }

  function updateSEOMetadata(post) {
    const baseUrl = window.location.origin;
    const currentUrl = window.location.href;
    const canonicalUrl = post.canonicalUrl || currentUrl;
    const metaTitle = post.metaTitle || post.title || 'Blog Post - Mantravi';
    const metaDescription = post.metaDescription || post.summary || '';
    const imageUrl = post.mainImagePath ? 
      (post.mainImagePath.startsWith('http') ? post.mainImagePath : `${baseUrl}${post.mainImagePath}`) : 
      `${baseUrl}/assets/icons/ui/mantravi.png`;

    // Update document title
    document.title = metaTitle;

    // Update or create meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', metaDescription);

    // Update or create canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // Open Graph tags for social sharing (Facebook, LinkedIn, etc.)
    const ogTags = {
      'og:title': metaTitle,
      'og:description': metaDescription,
      'og:type': 'article',
      'og:url': canonicalUrl,
      'og:image': imageUrl,
      'og:site_name': 'Mantravi',
      'article:published_time': post.publishedAt || '',
      'article:author': post.author || '',
      'article:tag': (post.tags || []).join(', ')
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      if (!content) return;
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    // Twitter Card tags
    const twitterTags = {
      'twitter:card': 'summary_large_image',
      'twitter:title': metaTitle,
      'twitter:description': metaDescription,
      'twitter:image': imageUrl,
      'twitter:site': '@mantravi' // Update with your Twitter handle
    };

    Object.entries(twitterTags).forEach(([name, content]) => {
      if (!content) return;
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    // Structured Data (JSON-LD) for rich snippets
    let structuredData = document.getElementById('blog-structured-data');
    if (structuredData) {
      structuredData.remove();
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: metaDescription,
      image: {
        '@type': 'ImageObject',
        url: imageUrl,
        width: 1200,
        height: 630
      },
      datePublished: post.publishedAt,
      dateModified: post.publishedAt,
      author: {
        '@type': 'Person',
        name: post.author || 'Mantravi Team',
        url: `${baseUrl}/pages/about/index.html`
      },
      publisher: {
        '@type': 'Organization',
        name: 'Mantravi',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/assets/icons/ui/mantravilogo.png`,
          width: 512,
          height: 512
        },
        url: baseUrl
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl
      },
      articleSection: post.tags?.[0] || 'Technology',
      keywords: post.tags?.join(', ') || 'technology, AI, digital transformation',
      wordCount: (post.content || '').split(/\s+/).length,
      inLanguage: 'en-US',
      isAccessibleForFree: true
    };
    
    if (post.readingTimeMinutes) {
      schema.timeRequired = `PT${post.readingTimeMinutes}M`;
    }

    if (post.tags && post.tags.length) {
      schema.keywords = post.tags.join(', ');
    }

    structuredData = document.createElement('script');
    structuredData.id = 'blog-structured-data';
    structuredData.type = 'application/ld+json';
    structuredData.textContent = JSON.stringify(schema);
    document.head.appendChild(structuredData);
  }

  try {
    // Get blog ID or slug from URL params - prioritize URL params over sessionStorage
    const urlParams = new URLSearchParams(window.location.search);
    const blogSlug = urlParams.get('slug');
    const blogIdFromUrl = urlParams.get('id');
    
    // Only use sessionStorage if NO URL params exist (fallback for direct navigation)
    const blogId = blogIdFromUrl || (!blogSlug ? sessionStorage.getItem('selectedBlogId') : null);
    
    // Clear sessionStorage if we have URL params (to prevent stale data)
    if (blogSlug || blogIdFromUrl) {
      try {
        sessionStorage.removeItem('selectedBlogId');
      } catch {}
    }
    
    if (!blogId && !blogSlug) {
      container.innerHTML = '<p class="text-gray-300">Post not found. Go back to the <a href="/pages/blog/index.html" class="text-[#4EE4FF] underline">blog</a>.</p>';
      return;
    }

    // Fetch full blog details from API
    container.innerHTML = '<div class="text-gray-300">Loading post...</div>';
    let post;
    
    // Use slug endpoint if available, otherwise use ID
    if (blogSlug) {
      // Fetch by slug (preferred)
      post = await api.getBlogBySlug(blogSlug);
    } else if (blogId) {
      // Fetch by ID
      post = await api.getBlogById(blogId);
    } else {
      container.innerHTML = '<p class="text-red-400">No blog identifier found.</p>';
      return;
    }
    
    if (!post || !post.id) {
      container.innerHTML = '<p class="text-red-400">Post not found.</p>';
      return;
    }

    // Update URL to use slug for SEO and sharing (if we fetched by ID)
    // If already using slug, keep it clean
    if (post.slug && !blogSlug) {
      const newUrl = `/pages/blog/post.html?slug=${encodeURIComponent(post.slug)}`;
      window.history.replaceState({}, '', newUrl);
    } else if (post.slug && blogSlug) {
      // Clean URL - remove ID if we have slug
      const cleanUrl = `/pages/blog/post.html?slug=${encodeURIComponent(post.slug)}`;
      window.history.replaceState({}, '', cleanUrl);
    }

    // Apply SEO metadata from API response
    updateSEOMetadata(post);

    headerTitle.textContent = post.title || 'Blog';
    
    // Enhanced meta bar with better formatting
    const authorName = post.author || 'Mantravi Team';
    const publishDate = formatDate(post.publishedAt);
    const readingTime = post.readingTimeMinutes || Math.ceil((post.content || '').split(/\s+/).length / 200);
    
    metaBar.innerHTML = `
      <div class="flex flex-wrap items-center gap-3 text-left">
        <span class="font-medium text-gray-300">${authorName}</span>
        <span class="text-gray-600">·</span>
        <time datetime="${post.publishedAt}" class="text-gray-400">${publishDate}</time>
        <span class="text-gray-600">·</span>
        <span class="text-gray-400 flex items-center gap-1.5">
          <i data-lucide="clock" class="w-4 h-4"></i>
          <span>${readingTime} min read</span>
        </span>
      </div>
    `;
    
    // Show author bio section
    const authorBio = document.getElementById('author-bio');
    const authorInitial = document.getElementById('author-initial');
    const authorNameEl = document.getElementById('author-name');
    if (authorBio && authorInitial && authorNameEl) {
      authorInitial.textContent = authorName.charAt(0).toUpperCase();
      authorNameEl.textContent = authorName;
      authorBio.classList.remove('hidden');
    }
    
    // Reinitialize Lucide icons for meta bar
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Add summary display section (before content)
    const summaryContainer = document.getElementById('blog-summary');
    if (summaryContainer && post.summary) {
      summaryContainer.innerHTML = `
        <p class="text-gray-300 text-lg sm:text-xl leading-relaxed font-semibold mb-6">${post.summary}</p>
      `;
      summaryContainer.classList.remove('hidden');
    }

    // Render blog content - check if content is HTML or plain text
    const content = post.content || '';
    const isHTML = content.trim().startsWith('<') && content.includes('</');
    
    // Create wrapper that allows HTML content to render properly
    container.innerHTML = '';
    
    // If content is HTML with embedded styles (complete article), render it directly
    if (isHTML) {
      // Show main image if available (even if HTML content has its own image)
      if (post.mainImagePath) {
        // Handle both relative and absolute URLs
        const imageUrl = post.mainImagePath.startsWith('http') 
          ? post.mainImagePath 
          : (post.mainImagePath.startsWith('/') 
            ? post.mainImagePath 
            : `/${post.mainImagePath}`);
        
        // Create hero image container BEFORE the HTML content wrapper
        const heroImage = document.createElement('figure');
        heroImage.id = 'blog-hero-image';
        heroImage.style.cssText = 'width: 100%; margin: 2rem 0 3rem 0; display: block !important; position: relative; overflow: visible !important; visibility: visible !important; opacity: 1 !important;';
        heroImage.innerHTML = `
          <div class="w-full rounded-2xl bg-[#4EE4FF]/10 shadow-xl p-2" style="overflow: visible !important; position: relative; width: 100%;">
            <img src="${imageUrl}" alt="${post.title || 'Blog image'}" 
                 id="main-blog-image"
                 style="display: block !important; width: 100% !important; height: auto !important; max-width: 100% !important; object-fit: contain !important; object-position: center !important; margin: 0 auto; position: relative !important; visibility: visible !important; opacity: 1 !important; max-height: 600px; z-index: 1;"
                 loading="eager"
                 decoding="async"
                 onload="console.log('Image loaded:', this.src); this.style.display='block'; this.style.visibility='visible'; this.style.opacity='1'; this.classList.add('loaded');"
                 onerror="console.error('Failed to load image:', '${imageUrl}'); this.src='/assets/icons/ui/mantravi.png'; this.onerror=null; this.style.display='block'; this.style.visibility='visible'; this.style.opacity='1';" />
          </div>
        `;
        // Insert hero image FIRST, before any other content
        container.appendChild(heroImage);
        
        // Double-check image visibility after render
        setTimeout(() => {
          const img = document.getElementById('main-blog-image');
          const figure = document.getElementById('blog-hero-image');
          if (img) {
            img.style.display = 'block';
            img.style.visibility = 'visible';
            img.style.opacity = '1';
            img.style.position = 'relative';
            img.style.zIndex = '1';
            console.log('Hero image forced visible:', img.src);
          }
          if (figure) {
            figure.style.display = 'block';
            figure.style.visibility = 'visible';
            figure.style.opacity = '1';
          }
        }, 50);
      }
      
      // Create a container for the HTML content
      const contentWrapper = document.createElement('div');
      contentWrapper.className = 'blog-content-wrapper';
      contentWrapper.setAttribute('contenteditable', 'false');
      contentWrapper.setAttribute('spellcheck', 'false');
      // Render the cleaned HTML content - it includes its own styles and structure
      contentWrapper.innerHTML = content;
      container.appendChild(contentWrapper);
      
      // Prevent any editing attempts - make absolutely read-only
      const preventEditing = (e) => {
        if (e.target.closest('.blog-content-wrapper')) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      };
      
      // Prevent context menu (right-click) editing
      contentWrapper.addEventListener('contextmenu', preventEditing);
      // Prevent keyboard shortcuts for editing
      contentWrapper.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) preventEditing(e);
        if (e.key === 'a' && e.ctrlKey || e.key === 'A' && e.ctrlKey) {
          // Allow select all
          return true;
        }
        if (e.target.isContentEditable || e.target.closest('[contenteditable="true"]')) {
          preventEditing(e);
        }
      });
      // Prevent drag-and-drop editing
      contentWrapper.addEventListener('drop', preventEditing);
      contentWrapper.addEventListener('dragover', preventEditing);
      
      // Force read-only on all child elements
      const allContentElements = contentWrapper.querySelectorAll('*');
      allContentElements.forEach(el => {
        el.setAttribute('contenteditable', 'false');
        el.style.userSelect = 'text';
        el.style.webkitUserModify = 'read-only';
      });
      
      // Initialize reading progress tracker
      initReadingProgress();
      
      // Optimize images with lazy loading
      setTimeout(() => {
        const images = contentWrapper.querySelectorAll('img:not([loading])');
        images.forEach((img, index) => {
          if (index > 0) {
            img.setAttribute('loading', 'lazy');
            img.setAttribute('decoding', 'async');
            img.addEventListener('load', () => img.classList.add('loaded'));
          }
        });
        
        // Fix any positioning issues that cause content to render as overlays
        const allElements = contentWrapper.querySelectorAll('*');
        allElements.forEach(el => {
          const styles = el.getAttribute('style') || '';
          
          // Fix problematic absolute/fixed positioning that creates unwanted overlays
          // But preserve intentional positioning (like navigation, modals, etc.)
          if (styles.includes('position: absolute') || styles.includes('position: fixed')) {
            const rect = el.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(el);
            // Only fix if it's creating an overlay issue (small, white background, top position)
            if (rect.height > 0 && rect.height < 150 && rect.top < 300 && 
                computedStyle.backgroundColor.includes('255') && 
                parseFloat(computedStyle.opacity || '1') > 0.8) {
              // This might be causing overlay - check if it's content that should be inline
              const isContent = el.tagName === 'P' || el.tagName === 'SPAN' || 
                               el.tagName === 'DIV' && el.textContent.trim().length > 10;
              if (isContent && !styles.includes('navigation') && !styles.includes('modal')) {
                // Convert to relative positioning to render inline
                el.style.position = 'relative';
                el.style.top = 'auto';
                el.style.left = 'auto';
                el.style.zIndex = 'auto';
              }
            }
          }
        });
      }, 100);
    } else {
      // Fallback for plain text/markdown content
      container.innerHTML = `
        <div class="rounded-xl overflow-hidden bg-[#4EE4FF]/10 mb-8">
          <img src="${post.mainImagePath || '/assets/icons/ui/mantravi.png'}" alt="${post.title}" class="w-full h-80 object-cover" />
        </div>
        <div class="prose prose-invert max-w-none">
          <p class="text-gray-200 text-[18px] leading-8 font-semibold">${(post.summary || '')}</p>
          <div class="mt-6 text-gray-100 text-[17px] leading-8 whitespace-pre-line">${content}</div>
        </div>
      `;
      
      // Add tags for plain text content
      if ((post.tags || []).length > 0) {
        const tagsDiv = document.createElement('div');
        tagsDiv.className = 'mt-8';
        tagsDiv.innerHTML = (post.tags || []).map(t => 
          `<span class="inline-block px-3 py-1 mr-2 mb-2 bg-white/10 border border-white/10 rounded-full text-xs">#${t}</span>`
        ).join('');
        container.appendChild(tagsDiv);
      }
    }
    
    // Add related posts section (always show, regardless of content type)
    const relatedSection = document.createElement('section');
    relatedSection.id = 'related';
    relatedSection.className = 'mt-12';
    relatedSection.innerHTML = `
      <h3 class="text-xl font-semibold mb-4">Related Articles</h3>
      <div id="related-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-6"></div>
    `;
    container.appendChild(relatedSection);

    setupShare(post);
    await loadRelated(post);
    
    // Initialize Lucide icons for new elements (back button, lock icon, etc.)
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  } catch (e) {
    console.error('Failed to load blog post:', e);
    container.innerHTML = '<p class="text-red-400">Failed to load post. Please try again.</p>';
  }

  function setupShare(post) {
    // Use canonical URL for sharing (from API) or fallback to current URL
    const url = post.canonicalUrl || window.location.href;
    const title = post.metaTitle || post.title || 'Blog';
    const text = post.metaDescription || post.summary || '';

    const map = {
      'share-twitter': `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      'share-linkedin': `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      'share-facebook': `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };
    Object.entries(map).forEach(([id, href]) => {
      const el = document.getElementById(id);
      if (el) {
        el.href = href;
        el.target = '_blank';
        el.rel = 'noopener';
        // Some browsers/extensions may block default anchor navigation in SPA contexts;
        // ensure opening in a new tab explicitly.
        el.addEventListener('click', (e) => {
          // If modifier keys are used, let browser handle (new tab/window)
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
          e.preventDefault();
          try { window.open(href, '_blank', 'noopener'); } catch { window.location.href = href; }
        });
      }
    });

    const nativeBtn = document.getElementById('share-native');
    if (nativeBtn) {
      nativeBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        if (navigator.share) {
          try { await navigator.share({ title, text, url }); } catch {}
        } else {
          try { await navigator.clipboard.writeText(url); } catch {}
        }
      });
    }
  }

  async function loadRelated(post) {
    const relatedGrid = document.getElementById('related-grid');
    if (!relatedGrid) return;
    relatedGrid.innerHTML = '<div class="text-gray-400">Loading related…</div>';

    try {
      // Get related blogs using slug
      const res = await api.getRelatedBlogs(post.slug || '');
      const items = (res && Array.isArray(res.data)) ? res.data : (Array.isArray(res) ? res : []);
      if (!items.length) {
        relatedGrid.innerHTML = '<div class="text-gray-400">No related articles found.</div>';
        return;
      }
      relatedGrid.innerHTML = items
        .filter(x => String(x.id) !== String(post.id))
        .slice(0, 5)
        .map(x => {
          // Handle image URL (relative or absolute)
          const imageUrl = x.mainImagePath 
            ? (x.mainImagePath.startsWith('http') 
              ? x.mainImagePath 
              : (x.mainImagePath.startsWith('/') 
                ? x.mainImagePath 
                : `/${x.mainImagePath}`))
            : '/assets/icons/ui/mantravi.png';
          
          return `
          <a class="related-article-card block bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-[#4EE4FF]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#4EE4FF]/10 group" href="/pages/blog/post.html${x.slug ? `?slug=${encodeURIComponent(x.slug)}` : `?id=${encodeURIComponent(x.id)}`}" data-related-slug="${x.slug || ''}" data-related-id="${x.id}">
            <div class="h-44 rounded-t-xl overflow-hidden bg-gradient-to-br from-[#4EE4FF]/20 to-[#4EE4FF]/5 flex items-center justify-center relative">
              <img src="${imageUrl}" 
                   alt="${x.title || 'Related article'}" 
                   class="related-article-image object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                   loading="lazy"
                   onerror="this.onerror=null; this.src='/assets/icons/ui/mantravi.png'; this.classList.add('opacity-50');"/>
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
            <div class="p-5">
              <h4 class="font-semibold text-white mb-2 text-base leading-snug group-hover:text-[#4EE4FF] transition-colors">${x.title || 'Untitled'}</h4>
              <p class="related-card-summary text-sm sm:text-base text-gray-300 line-clamp-2 leading-relaxed font-normal">${x.summary || 'No summary available.'}</p>
            </div>
          </a>
        `;
        }).join('');

      // Attach click handlers to related article cards
      // Wait for DOM to update, then attach handlers
      setTimeout(() => {
        const relatedCards = document.querySelectorAll('.related-article-card[data-related-id]');
        
        if (relatedCards.length === 0) {
          console.warn('No related article cards found');
          return;
        }
        
        console.log(`Attached click handlers to ${relatedCards.length} related cards`);
        
        relatedCards.forEach(card => {
          // Ensure pointer cursor
          card.style.cursor = 'pointer';
          
          // Use direct click handler
          card.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const slug = this.getAttribute('data-related-slug') || '';
            const id = this.getAttribute('data-related-id') || '';
            const href = this.getAttribute('href') || '';
            
            console.log('Card clicked - Slug:', slug, 'ID:', id, 'Href:', href);
            
            // Build target URL - prefer slug, then ID, then href
            let targetUrl = href; // Default to href
            
            if (slug && slug.trim() !== '') {
              // Prefer slug - no need for sessionStorage
              targetUrl = `/pages/blog/post.html?slug=${encodeURIComponent(slug.trim())}`;
              // Clear old sessionStorage when using slug
              try {
                sessionStorage.removeItem('selectedBlogId');
              } catch {}
            } else if (id && id.trim() !== '') {
              // Use ID - only save to sessionStorage as backup
              targetUrl = `/pages/blog/post.html?id=${encodeURIComponent(id.trim())}`;
              // Don't save to sessionStorage here - let URL params handle it
              // Only use sessionStorage as absolute last resort
            }
            
            console.log('Navigating to:', targetUrl);
            
            // Force navigation
            if (targetUrl && targetUrl !== '#') {
              window.location.href = targetUrl;
            } else {
              console.error('Invalid target URL');
            }
          }, true); // Use capture phase to catch early
        });
      }, 150);
    } catch (err) {
      relatedGrid.innerHTML = '<div class="text-red-400">Failed to load related.</div>';
    }
  }
});


