<template>
  <nav class="bg-white border-b border-gray-100 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <NuxtLink to="/landing">
            <img src="/main_A-Logo1-Rev4-Final 2.svg" alt="Check Vehicle Records" class="h-14" />
          </NuxtLink>
        </div>
        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center space-x-8">
          <NuxtLink to="/landing" class="text-sm font-medium text-gray-700 hover:text-primary transition">Home</NuxtLink>
          <NuxtLink to="/pricing" class="text-sm font-medium text-gray-700 hover:text-primary transition">Pricing</NuxtLink>
          <NuxtLink to="/sample-report" class="text-sm font-medium text-gray-700 hover:text-primary transition">Sample Report</NuxtLink>
          <NuxtLink to="/download-app" class="text-sm font-medium text-gray-700 hover:text-primary transition">Download App</NuxtLink>
          <!-- User icon + dropdown -->
          <div class="relative" ref="userMenuRef">
            <button @click="userMenuOpen = !userMenuOpen" class="flex items-center space-x-1 text-gray-600 hover:text-primary transition">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
              </svg>
              <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': userMenuOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <div v-if="userMenuOpen" class="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
              <!-- Logged-in menu -->
              <template v-if="user">
                <NuxtLink to="/web/my-garage" class="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">My Garage</NuxtLink>
                <NuxtLink to="/web/my-searches" class="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">My Searches</NuxtLink>
                <NuxtLink to="/web/purchases" class="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">Purchases</NuxtLink>
                <NuxtLink to="/web/settings" class="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">Settings</NuxtLink>
                <div class="border-t border-gray-100 my-1"></div>
                <NuxtLink to="/web/about" class="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">About</NuxtLink>
                <NuxtLink to="/web/faqs" class="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">FAQs</NuxtLink>
                <div class="border-t border-gray-100 my-1"></div>
                <button @click="handleLogout" class="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition font-medium">Log out</button>
              </template>
              <!-- Logged-out menu -->
              <template v-else>
                <NuxtLink to="/web/about" class="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">About</NuxtLink>
                <NuxtLink to="/web/faqs" class="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">FAQs</NuxtLink>
                <div class="border-t border-gray-100 my-1"></div>
                <NuxtLink to="/login" class="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">Log in</NuxtLink>
                <NuxtLink to="/create-account" class="block px-4 py-2.5 text-sm text-primary font-medium hover:bg-gray-50 transition">Create Account</NuxtLink>
              </template>
            </div>
          </div>
        </div>
        <!-- Mobile hamburger -->
        <button class="md:hidden text-gray-600" @click="mobileMenuOpen = !mobileMenuOpen">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden pb-4 border-t border-gray-100 pt-2">
        <NuxtLink to="/landing" class="block py-2 text-sm text-gray-700 hover:text-primary" @click="mobileMenuOpen = false">Home</NuxtLink>
        <NuxtLink to="/pricing" class="block py-2 text-sm text-gray-700 hover:text-primary" @click="mobileMenuOpen = false">Pricing</NuxtLink>
        <NuxtLink to="/sample-report" class="block py-2 text-sm text-gray-700 hover:text-primary" @click="mobileMenuOpen = false">Sample Report</NuxtLink>
        <NuxtLink to="/download-app" class="block py-2 text-sm text-gray-700 hover:text-primary" @click="mobileMenuOpen = false">Download App</NuxtLink>
        <div class="border-t border-gray-100 my-2"></div>
        <template v-if="user">
          <NuxtLink to="/web/my-garage" class="block py-2 text-sm text-gray-700 hover:text-primary" @click="mobileMenuOpen = false">My Garage</NuxtLink>
          <NuxtLink to="/web/my-searches" class="block py-2 text-sm text-gray-700 hover:text-primary" @click="mobileMenuOpen = false">My Searches</NuxtLink>
          <NuxtLink to="/web/purchases" class="block py-2 text-sm text-gray-700 hover:text-primary" @click="mobileMenuOpen = false">Purchases</NuxtLink>
          <NuxtLink to="/web/settings" class="block py-2 text-sm text-gray-700 hover:text-primary" @click="mobileMenuOpen = false">Settings</NuxtLink>
        </template>
        <NuxtLink to="/web/about" class="block py-2 text-sm text-gray-700 hover:text-primary" @click="mobileMenuOpen = false">About</NuxtLink>
        <NuxtLink to="/web/faqs" class="block py-2 text-sm text-gray-700 hover:text-primary" @click="mobileMenuOpen = false">FAQs</NuxtLink>
        <div class="border-t border-gray-100 my-2"></div>
        <template v-if="user">
          <button @click="handleLogout(); mobileMenuOpen = false" class="block py-2 text-sm text-red-600 font-medium">Log out</button>
        </template>
        <template v-else>
          <NuxtLink to="/login" class="block py-2 text-sm text-gray-700 hover:text-primary" @click="mobileMenuOpen = false">Log in</NuxtLink>
          <NuxtLink to="/create-account" class="block py-2 text-sm text-primary font-medium" @click="mobileMenuOpen = false">Create Account</NuxtLink>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const router = useRouter();
const { user, signOut, checkAuth } = useAuth();
const userMenuOpen = ref(false);
const mobileMenuOpen = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);

onMounted(async () => {
  await checkAuth();
  document.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
});

const handleOutsideClick = (e: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target as Node)) {
    userMenuOpen.value = false;
  }
};

const handleLogout = async () => {
  await signOut();
  userMenuOpen.value = false;
  router.push('/landing');
};
</script>
