<template>
  <div class="min-h-screen bg-white font-sans">
    <WebNav />

    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-primary/5 via-white to-blue-50 py-16 md:py-24">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">CVR Blog</h1>
        <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">Expert tips, guides, and insights for UK vehicle buyers. Stay informed about vehicle history checks, MOT records, and car buying advice.</p>
        <div class="inline-flex items-center gap-2 text-primary font-medium">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <span>{{ posts.length }} articles and growing</span>
        </div>
      </div>
    </section>

    <!-- Blog Posts -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-16">
        <svg class="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
      </div>

      <!-- Empty State -->
      <div v-else-if="posts.length === 0" class="text-center py-16">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
        <p class="text-gray-500">No blog posts yet. Check back soon!</p>
      </div>

      <!-- Blog Posts Grid -->
      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <NuxtLink
          v-for="post in posts"
          :key="post.id"
          :to="`/web/blog/${post.slug}`"
          class="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div class="aspect-video bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center overflow-hidden relative">
            <div class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <img
              v-if="post.featured_image"
              :src="post.featured_image"
              :alt="post.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <svg v-else class="w-16 h-16 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <div class="absolute top-4 left-4 bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
              Article
            </div>
          </div>
          <div class="p-6">
            <p class="text-xs text-gray-500 mb-3 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ formatDate(post.created_at) }}
            </p>
            <h2 class="text-lg font-bold text-gray-900 group-hover:text-primary transition line-clamp-2 mb-3">{{ post.title }}</h2>
            <p class="text-gray-600 text-sm line-clamp-3">{{ post.excerpt }}</p>
            <div class="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span class="text-primary font-semibold text-sm inline-flex items-center gap-1">
                Read article
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
              <span class="text-xs text-gray-400">5 min read</span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Empty State -->
      <div v-if="posts.length === 0 && !loading" class="text-center py-16">
        <div class="max-w-md mx-auto">
          <svg class="w-20 h-20 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No articles yet</h3>
          <p class="text-gray-500">Check back soon for expert vehicle buying tips and guides.</p>
        </div>
      </div>
    </section>

    <WebFooter />
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();

const loading = ref(true);
const posts = ref<any[]>([]);

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

onMounted(async () => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, featured_image, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      posts.value = data;
    }
  } catch (err) {
    console.error('Failed to load blog posts:', err);
  } finally {
    loading.value = false;
  }
});

useHead({
  title: 'Blog - Check Vehicle Records UK',
  meta: [
    { name: 'description', content: 'Tips, guides, and insights for UK vehicle buyers. Learn about vehicle history checks, MOT records, and more.' }
  ]
});
</script>
