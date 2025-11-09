// blog.js
document.addEventListener("DOMContentLoaded", async () => {
  // Wait a bit for component-loader to finish
  await new Promise(resolve => setTimeout(resolve, 100));
  
  try {
    // Check if ApiService is available
    if (typeof ApiService === 'undefined') {
      console.error('ApiService is not defined! Make sure api-service.js is loaded before blog.js');
      return;
    }
    
  const api = new ApiService();

  const featuredContainer = document.getElementById("featured-blogs");
    const featuredSection = document.getElementById("featured-section");
    const categorySectionsContainer = document.getElementById("category-sections");
  const paginationContainer = document.getElementById("pagination");

    if (!featuredContainer) {
      console.error('Featured container not found!');
    }
    if (!categorySectionsContainer) {
      console.error('Category sections container not found!');
    }

  let currentPage = 0;
  let totalPages = 0;
    const pageLimit = 12; // Increased for better category display
    let currentCategory = 'all';
    let isLoading = false;
    let isInitialized = false; // Prevent duplicate initialization

    function renderSkeletons(container, count = 6) {
      const skeletonCard = `
        <div class="blog-card-premium animate-pulse">
          <div class="blog-card-image-premium bg-gray-700/50"></div>
          <div class="blog-card-content space-y-4">
            <div class="h-6 bg-gray-700/50 rounded w-3/4"></div>
            <div class="h-4 bg-gray-700/50 rounded w-full"></div>
            <div class="h-4 bg-gray-700/50 rounded w-2/3"></div>
            <div class="h-4 bg-gray-700/50 rounded w-1/2 mt-4"></div>
          </div>
        </div>`;
      if (container) {
        container.innerHTML = new Array(count).fill(skeletonCard).join("");
      }
    }

    function formatDate(dateStr) {
      try { return new Date(dateStr).toLocaleDateString(); } catch { return ""; }
    }

    // Load featured blogs (all featured, no category filter) - Top 3
    async function loadFeaturedBlogs() {
      try {
        // Fetch more blogs to ensure we get at least 3 featured
        const response = await api.getPublishedBlogs(0, 20, null, 'publishedAt');
        
        if (!response) {
          return [];
        }
        
        const blogs = response?.data || [];
        
        // Filter featured and get top 3
        const featuredBlogs = blogs.filter(b => b.isFeatured === true).slice(0, 3);
        
        return featuredBlogs;
      } catch (error) {
        console.error('Error loading featured blogs:', error);
        return [];
      }
    }

    // Load blogs for a specific category
    async function loadCategoryBlogs(category, page = 0) {
      try {
        const response = await api.getPublishedBlogs(page, pageLimit, category, 'publishedAt');
        
        if (!response) {
          return { blogs: [], totalPages: 0, currentPage: 0 };
        }
        
        const blogs = response?.data || [];
        const totalPages = response?.totalPages || 0;
        const currentPage = response?.currentPage ?? response?.pageNumber ?? page;
        
        return {
          blogs: blogs,
          totalPages: totalPages,
          currentPage: currentPage
        };
      } catch (error) {
        console.error(`Error loading ${category} blogs:`, error);
        return { blogs: [], totalPages: 0, currentPage: 0 };
      }
    }

    // Helper: Render a single blog card
    function renderBlogCard(blog) {
      return `
        <article class="blog-card-premium cursor-pointer">
          <div class="blog-card-image-premium">
            <img src="${blog.mainImagePath || '/assets/icons/ui/mantravi.png'}" 
                 alt="${blog.title}" 
                 class="w-full h-full object-cover"/>
            <div class="blog-card-overlay"></div>
          </div>
          <div class="blog-card-content">
            <h3 class="blog-card-title">${blog.title}</h3>
            <p class="blog-card-excerpt">${blog.summary || ''}</p>
            <div class="blog-card-footer">
              <div class="flex items-center gap-2">
                <i data-lucide="user" class="w-3.5 h-3.5"></i>
                <span>${blog.author || 'Unknown'}</span>
              </div>
              <div class="flex items-center gap-2">
                <i data-lucide="calendar" class="w-3.5 h-3.5"></i>
                <span>${formatDate(blog.publishedAt)}</span>
              </div>
            </div>
            <a href="/blog/post" 
               data-read-more-id="${blog.id}" 
               class="blog-card-link">
              <span>Read More</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </a>
          </div>
        </article>
      `;
    }

    // Setup category tab filtering with API-based loading
    function setupCategoryTabs() {
      const tabs = document.querySelectorAll('.category-tab');
      
      if (tabs.length === 0) {
        return;
      }
      
      // Function to update active tab
      function updateActiveTab(category) {
        tabs.forEach(t => t.classList.remove('active'));
        const activeTab = Array.from(tabs).find(t => t.getAttribute('data-category') === category);
        if (activeTab) {
          activeTab.classList.add('active');
        }
      }
      
      // Handle tab clicks - Load from API
      tabs.forEach(tab => {
        // Remove any existing listeners by cloning the node
        const newTab = tab.cloneNode(true);
        tab.parentNode.replaceChild(newTab, tab);
        
        newTab.addEventListener('click', async (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          const category = newTab.getAttribute('data-category');
          if (!category) {
            console.error('Tab has no data-category attribute');
            return;
          }
          
          currentCategory = category;
          
          // Update active state
          updateActiveTab(category);
          
          // Show loading state
          if (categorySectionsContainer) {
            renderSkeletons(categorySectionsContainer, 6);
          }
          
          // Load blogs for selected category
          try {
            await loadBlogs(category, 0);
          } catch (error) {
            console.error('Error loading category:', error);
          }
          
          // Update URL hash
          if (category === 'all') {
            window.history.pushState(null, '', window.location.pathname);
          } else {
            window.history.pushState(null, '', `#category-${category.replace(/\s+/g, '-')}`);
          }
          
          // Smooth scroll to sticky category bar
          setTimeout(() => {
            const stickyBar = document.querySelector('.sticky-category-bar');
            if (stickyBar) {
              stickyBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 200);
        });
      });
      
      // Handle hash-based navigation
      function handleHashNavigation() {
        // Don't handle hash navigation during initial load
        if (!isInitialized) {
          return;
        }
        
        const hash = window.location.hash;
        if (hash && hash.startsWith('#category-')) {
          const categoryFromHash = hash.replace('#category-', '').replace(/-/g, ' ');
          // Decode URL-encoded category names
          const decodedCategory = decodeURIComponent(categoryFromHash);
          
          const categoryMap = {
            'AI': 'AI',
            'ai': 'AI',
            'Dev': 'Dev',
            'dev': 'Dev',
            'Digital Marketing': 'Digital Marketing',
            'Digital%20Marketing': 'Digital Marketing',
            'digital marketing': 'Digital Marketing',
            'Case Study': 'Case Study',
            'Case%20Study': 'Case Study',
            'case study': 'Case Study',
            'Tutorials': 'Case Study',
            'tutorials': 'Case Study'
          };
          
          const matchedCategory = categoryMap[decodedCategory] || categoryMap[categoryFromHash] || decodedCategory;
          if (matchedCategory && ['AI', 'Dev', 'Digital Marketing', 'Case Study', 'all'].includes(matchedCategory)) {
            updateActiveTab(matchedCategory);
            currentCategory = matchedCategory;
            loadBlogs(matchedCategory, 0);
            
            setTimeout(() => {
              const stickyBar = document.querySelector('.sticky-category-bar');
              if (stickyBar) {
                stickyBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 300);
          }
        }
      }
      
      // Listen for hash changes (initial hash is handled by init() function)
      // Only add listener after initialization to prevent duplicate calls
      setTimeout(() => {
        window.addEventListener('hashchange', handleHashNavigation);
      }, 1000);
    }

    // Render pagination
    function renderPagination() {
      if (!paginationContainer || totalPages <= 1) {
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
      }
      
      const pages = Array.from({ length: totalPages }).map((_, i) => `
        <button data-page="${i}" class="pagination-btn-premium ${i === currentPage ? 'active' : ''}">${i + 1}</button>
      `).join('');
      
      paginationContainer.innerHTML = `
        <div class="pagination-premium">
          ${pages}
        </div>
      `;
      
      // Attach pagination handlers
      paginationContainer.querySelectorAll('[data-page]').forEach(btn => {
        btn.addEventListener('click', async () => {
          const page = parseInt(btn.getAttribute('data-page'));
          await loadBlogs(currentCategory, page);
          // Scroll to sticky category bar
          setTimeout(() => {
            const stickyBar = document.querySelector('.sticky-category-bar');
            if (stickyBar) {
              stickyBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        });
      });
    }

    function attachReadMoreHandlers(posts) {
      document.querySelectorAll('[data-read-more-id]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const id = btn.getAttribute('data-read-more-id');
          if (id) {
            try {
              // Store ID temporarily - detail page will fetch post and update URL with slug
              sessionStorage.setItem('selectedBlogId', id);
            } catch {}
            // Navigate with ID - detail page will fetch and add slug to URL
            window.location.href = `/blog/post?id=${encodeURIComponent(id)}`;
          }
        });
      });
    }

    // Load all blogs (unified view with pagination)
    async function loadAllBlogs(page = 0) {
      if (!categorySectionsContainer) return;
      
      renderSkeletons(categorySectionsContainer, pageLimit);
      
      try {
        const result = await loadCategoryBlogs(null, page); // null = all blogs
        const blogs = result.blogs.filter(blog => !blog.isFeatured); // Exclude featured
        
        currentPage = result.currentPage;
        totalPages = result.totalPages;
        
        if (blogs.length > 0) {
          categorySectionsContainer.innerHTML = `
            <div class="all-blogs-grid-container">
              <div class="flex items-center gap-3 mb-8">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4EE4FF]/20 to-[#4EE4FF]/10 border border-[#4EE4FF]/30 flex items-center justify-center">
                  <i data-lucide="grid" class="w-5 h-5 text-[#4EE4FF]"></i>
                  </div>
                <div>
                  <h2 class="text-3xl lg:text-4xl font-bold text-white">All Articles</h2>
                  <p class="text-gray-400 text-sm mt-1">Browse all our latest insights and stories</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                ${blogs.map(blog => renderBlogCard(blog)).join('')}
              </div>
            </div>
          `;
        } else {
          categorySectionsContainer.innerHTML = `
            <div class="category-empty">
              <p>No articles available at the moment.</p>
            </div>
          `;
        }
        
        // Render pagination
        renderPagination();
        
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
        
        attachReadMoreHandlers(blogs);
      } catch (error) {
        console.error('Error loading all blogs:', error);
        categorySectionsContainer.innerHTML = `
          <div class="category-empty">
            <p class="text-red-400 mb-4">Error loading blogs: ${error.message}</p>
            <button onclick="location.reload()" class="px-4 py-2 bg-[#4EE4FF] text-[#050a30] rounded-lg font-semibold">
              Retry
            </button>
          </div>
        `;
      }
    }

    // Main load function - loads all blogs or specific category
    async function loadBlogs(category = 'all', page = 0) {
      if (isLoading) {
        return;
      }
      isLoading = true;

      try {
        // Load featured blogs (ALWAYS show, regardless of category)
        const featuredBlogs = await loadFeaturedBlogs();
        renderFeaturedBlogs(featuredBlogs);

        if (category === 'all') {
          // Load all blogs in unified grid with pagination
          await loadAllBlogs(page);
      } else {
          // Load specific category
          await loadSingleCategory(category, page);
        }
      } catch (error) {
        console.error('Error loading blogs:', error);
        if (categorySectionsContainer) {
          categorySectionsContainer.innerHTML = `
            <div class="category-empty">
              <p class="text-red-400 mb-4">Error loading blog content: ${error.message}</p>
              <button onclick="location.reload()" class="px-4 py-2 bg-[#4EE4FF] text-[#050a30] rounded-lg font-semibold">
                Retry
              </button>
            </div>
          `;
        }
      } finally {
        isLoading = false;
      }
    }


    // Load single category view
    async function loadSingleCategory(category, page = 0) {
      if (!categorySectionsContainer) return;
      
      renderSkeletons(categorySectionsContainer, 6);
      
      const result = await loadCategoryBlogs(category, page);
      const blogs = result.blogs.filter(blog => !blog.isFeatured);
      
      currentPage = result.currentPage;
      totalPages = result.totalPages;
      
      const categoryConfig = {
        'AI': { icon: 'brain', title: 'AI & Machine Learning', subtitle: 'Exploring the future of artificial intelligence' },
        'Dev': { icon: 'code', title: 'Development', subtitle: 'Web development, programming, and tech insights' },
        'Digital Marketing': { icon: 'trending-up', title: 'Digital Marketing', subtitle: 'Growth strategies and marketing excellence' },
        'Case Study': { icon: 'file-text', title: 'Case Study', subtitle: 'Real-world projects and success stories' }
      };
      
      const config = categoryConfig[category];
      const categoryHtml = `
        <div class="category-section fade-in-section" data-category="${category}" id="category-${category.replace(/\s+/g, '-')}">
          <div class="category-header">
            <div class="category-icon-wrapper">
              <i data-lucide="${config.icon}" class="w-7 h-7"></i>
            </div>
            <div>
              <h2 class="category-title">${config.title}</h2>
              <p class="category-subtitle">${config.subtitle}</p>
            </div>
          </div>
          <div class="category-grid">
            ${blogs.length > 0 ? blogs.map(blog => renderBlogCard(blog)).join('') : '<div class="category-empty">No articles in this category yet.</div>'}
          </div>
        </div>
      `;
      
      categorySectionsContainer.innerHTML = categoryHtml;
      
      // Render pagination
      renderPagination();
      
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
      
      attachReadMoreHandlers(blogs);
    }

    // Render featured blogs with auto-updating styles based on count
    function renderFeaturedBlogs(featuredBlogs) {
      if (!featuredContainer) {
        return;
      }
      
      // Hide entire section if no featured articles
      if (featuredBlogs.length === 0) {
        if (featuredSection) {
          featuredSection.style.display = 'none';
          featuredSection.style.visibility = 'hidden';
          featuredSection.style.height = '0';
          featuredSection.style.padding = '0';
          featuredSection.style.margin = '0';
          featuredSection.style.overflow = 'hidden';
        }
        featuredContainer.innerHTML = '';
        return;
      }
      
      // Show section if we have featured articles
      if (featuredSection) {
        featuredSection.style.display = '';
        featuredSection.style.visibility = '';
        featuredSection.style.height = '';
        featuredSection.style.padding = '';
        featuredSection.style.margin = '';
        featuredSection.style.overflow = '';
      }
      
      // Conditional layout: Full-width hero for 1, grid for 2-3
      if (featuredBlogs.length === 1) {
        const featuredBlog = featuredBlogs[0];
        featuredContainer.innerHTML = `
          <article class="blog-hero-featured">
            <img src="${featuredBlog.mainImagePath || '/assets/icons/ui/mantravi.png'}" 
                 alt="${featuredBlog.title}"/>
            <div class="blog-hero-content">
              <div class="featured-badge-premium">
                <i data-lucide="star" class="w-4 h-4"></i>
                <span>Featured Article</span>
              </div>
              <h2 class="blog-hero-title">${featuredBlog.title}</h2>
              <p class="blog-hero-summary">${featuredBlog.summary || ''}</p>
              <div class="blog-hero-meta">
                <div class="flex items-center gap-2">
                  <i data-lucide="user" class="w-4 h-4"></i>
                  <span>${featuredBlog.author || 'Mantravi Team'}</span>
                </div>
                <span>•</span>
                <div class="flex items-center gap-2">
                  <i data-lucide="calendar" class="w-4 h-4"></i>
                  <span>${formatDate(featuredBlog.publishedAt)}</span>
                  </div>
                <span>•</span>
                <div class="flex items-center gap-2">
                  <i data-lucide="clock" class="w-4 h-4"></i>
                  <span>${featuredBlog.readingTimeMinutes || Math.ceil((featuredBlog.summary || '').split(/\s+/).length / 200)} min read</span>
                </div>
              </div>
              <a href="/blog/post" 
                 data-read-more-id="${featuredBlog.id}" 
                 class="blog-hero-cta">
                <span>Read Article</span>
                <i data-lucide="arrow-right" class="w-5 h-5"></i>
              </a>
            </div>
          </article>`;
      } else {
        // Grid layout for 2-3 featured articles - Distinct Premium Style
        featuredContainer.innerHTML = `
          <h2 class="section-title-premium">Featured Articles</h2>
          <div class="grid grid-cols-1 ${featuredBlogs.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'} gap-10 lg:gap-12">
            ${featuredBlogs.map(featuredBlog => `
              <article class="featured-card-premium cursor-pointer">
                <div class="featured-card-image">
                  <img src="${featuredBlog.mainImagePath || '/assets/icons/ui/mantravi.png'}" 
                       alt="${featuredBlog.title}" 
                       class="w-full h-full object-cover"/>
                  <div class="featured-card-gradient-overlay"></div>
                  <div class="featured-card-badge-container">
                    <div class="featured-badge-premium">
                      <i data-lucide="star" class="w-4 h-4"></i>
                      <span>Featured</span>
                    </div>
                  </div>
                </div>
                <div class="featured-card-content-wrapper">
                  <h3 class="featured-card-title">${featuredBlog.title}</h3>
                  <p class="featured-card-excerpt">${featuredBlog.summary || ''}</p>
                  <div class="featured-card-footer">
                    <div class="flex items-center gap-2">
                      <i data-lucide="user" class="w-4 h-4 text-[#4EE4FF]"></i>
                      <span class="font-semibold">${featuredBlog.author || 'Unknown'}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <i data-lucide="calendar" class="w-4 h-4 text-[#4EE4FF]"></i>
                      <span>${formatDate(featuredBlog.publishedAt)}</span>
                    </div>
                  </div>
                  <a href="/blog/post" 
                     data-read-more-id="${featuredBlog.id}" 
                     class="featured-card-link">
                    <span>Read Article</span>
                    <i data-lucide="arrow-right" class="w-5 h-5"></i>
                  </a>
                </div>
              </article>
            `).join('')}
          </div>`;
      }

      if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // Initialize page
    async function init() {
      try {
        // Ensure containers exist
        if (!featuredContainer) {
          console.error('Featured container not found!');
          return;
        }
        if (!categorySectionsContainer) {
          console.error('Category sections container not found!');
          return;
        }
        
        // Show loading state immediately
        if (categorySectionsContainer) {
          renderSkeletons(categorySectionsContainer, 6);
        }
        
        // Setup category tabs first (needed for updateActiveTab function)
        setupCategoryTabs();
        
        // Check for hash-based category on load
        const hash = window.location.hash;
        if (hash && hash.startsWith('#category-')) {
          const categoryFromHash = hash.replace('#category-', '').replace(/-/g, ' ');
          const decodedCategory = decodeURIComponent(categoryFromHash);
          const categoryMap = {
            'AI': 'AI',
            'ai': 'AI',
            'Dev': 'Dev',
            'dev': 'Dev',
            'Digital Marketing': 'Digital Marketing',
            'Digital%20Marketing': 'Digital Marketing',
            'digital marketing': 'Digital Marketing',
            'Case Study': 'Case Study',
            'Case%20Study': 'Case Study',
            'case study': 'Case Study',
            'Tutorials': 'Case Study',
            'tutorials': 'Case Study'
          };
          const matchedCategory = categoryMap[decodedCategory] || categoryMap[categoryFromHash] || decodedCategory;
          if (matchedCategory && ['AI', 'Dev', 'Digital Marketing', 'Case Study', 'all'].includes(matchedCategory)) {
            currentCategory = matchedCategory;
            // Update active tab
            const tabs = document.querySelectorAll('.category-tab');
            tabs.forEach(t => t.classList.remove('active'));
            const activeTab = Array.from(tabs).find(t => t.getAttribute('data-category') === matchedCategory);
            if (activeTab) {
              activeTab.classList.add('active');
            }
          }
        }
        
        // Load initial blogs (this will load featured blogs)
        await loadBlogs(currentCategory, 0);
        
        // Mark as initialized to prevent duplicate hash navigation handling
        isInitialized = true;
      } catch (error) {
        console.error('Error initializing blog page:', error);
        console.error('Error stack:', error.stack);
        if (categorySectionsContainer) {
          categorySectionsContainer.innerHTML = `
            <div class="category-empty">
              <p class="text-red-400 mb-4">Error loading blog content: ${error.message}</p>
              <button onclick="location.reload()" class="px-4 py-2 bg-[#4EE4FF] text-[#050a30] rounded-lg font-semibold">
                Retry
              </button>
            </div>
          `;
        }
      }
    }

    // Initialize on page load
    init();
  
  } catch (error) {
    console.error('Fatal error in blog.js initialization:', error);
    const categorySectionsContainer = document.getElementById("category-sections");
    if (categorySectionsContainer) {
      categorySectionsContainer.innerHTML = `
        <div class="category-empty">
          <p class="text-red-400 mb-4">Fatal error: ${error.message}</p>
          <p class="text-gray-400 text-sm mb-4">Please check the browser console for details.</p>
          <button onclick="location.reload()" class="px-4 py-2 bg-[#4EE4FF] text-[#050a30] rounded-lg font-semibold">
            Reload Page
          </button>
        </div>
      `;
    }
  }
});
