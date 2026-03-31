<template>
  <div class="min-h-screen bg-white font-sans">
    <WebNav />

    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">CVR Blog</h1>
      <p class="text-gray-500 text-center mb-12">Tips, guides, and insights for UK vehicle buyers</p>

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
      <div v-else class="grid md:grid-cols-2 gap-8">
        <NuxtLink 
          v-for="post in posts" 
          :key="post.id" 
          :to="`/web/blog/${post.slug}`"
          class="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div class="aspect-video bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <svg class="w-12 h-12 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <div class="p-6">
            <p class="text-xs text-gray-400 mb-2">{{ formatDate(post.created_at) }}</p>
            <h2 class="text-lg font-semibold text-gray-900 group-hover:text-primary transition line-clamp-2">{{ post.title }}</h2>
            <p class="text-gray-500 text-sm mt-2 line-clamp-3">{{ post.excerpt }}</p>
            <span class="text-primary text-sm font-medium mt-4 inline-flex items-center gap-1">
              Read more
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </NuxtLink>
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
      .select('id, title, slug, excerpt, created_at')
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
