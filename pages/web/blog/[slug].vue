<template>
  <div class="min-h-screen bg-white font-sans">
    <WebNav />

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-32">
      <svg class="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
      </svg>
    </div>

    <!-- Not Found -->
    <div v-else-if="!post" class="max-w-lg mx-auto px-4 py-32 text-center">
      <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Post Not Found</h1>
      <p class="text-gray-500 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
      <NuxtLink to="/web/blog" class="text-primary font-medium hover:underline">← Back to Blog</NuxtLink>
    </div>

    <!-- Blog Post -->
    <article v-else class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <!-- Breadcrumb -->
      <nav class="mb-8">
        <NuxtLink to="/web/blog" class="text-primary hover:underline text-sm">← Back to Blog</NuxtLink>
      </nav>

      <!-- Header -->
      <header class="mb-10">
        <p class="text-sm text-gray-400 mb-3">{{ formatDate(post.created_at) }}</p>
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{{ post.title }}</h1>
        <p class="text-lg text-gray-500">{{ post.excerpt }}</p>
      </header>

      <!-- Featured Image -->
      <div class="aspect-video bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-10 flex items-center justify-center">
        <svg class="w-20 h-20 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      </div>

      <!-- Content -->
      <div class="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-primary">
        <div v-html="post.content"></div>
      </div>

      <!-- Share -->
      <div class="mt-12 pt-8 border-t border-gray-200">
        <p class="text-sm text-gray-500 mb-4">Share this article</p>
        <div class="flex gap-3">
          <a 
            :href="`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`" 
            target="_blank" 
            rel="noopener noreferrer"
            class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a 
            :href="`https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(post.title)}`" 
            target="_blank" 
            rel="noopener noreferrer"
            class="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a 
            :href="`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${encodeURIComponent(post.title)}`" 
            target="_blank" 
            rel="noopener noreferrer"
            class="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </div>
    </article>

    <WebFooter />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const supabase = useSupabaseClient();

const loading = ref(true);
const post = ref<any>(null);

const slug = computed(() => route.params.slug as string);

const shareUrl = computed(() => {
  if (process.client) {
    return window.location.href;
  }
  return `https://checkvehiclerecords.co.uk/web/blog/${slug.value}`;
});

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
      .select('*')
      .eq('slug', slug.value)
      .eq('published', true)
      .single();

    if (!error && data) {
      post.value = data;
    }
  } catch (err) {
    console.error('Failed to load blog post:', err);
  } finally {
    loading.value = false;
  }
});

useHead({
  title: computed(() => post.value ? `${post.value.title} - CVR Blog` : 'Blog Post - CVR'),
  meta: [
    { name: 'description', content: computed(() => post.value?.excerpt || 'Check Vehicle Records UK Blog') }
  ]
});
</script>
