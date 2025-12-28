<template>
  <div class="min-h-screen bg-white pb-20">
    <div class="px-10 py-4">
      <button @click="$router.back()" class="flex items-center text-gray-900 hover:text-gray-700">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
    </div>

    <div class="px-10 mt-8">
      <h1 class="text-3xl font-bold text-primary mb-8">My Account</h1>

      <!-- Profile Section -->
      <div class="flex items-center gap-4 mb-8">
        <div class="relative">
          <div class="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            <img v-if="profilePhoto" :src="profilePhoto" alt="Profile" class="w-full h-full object-cover" />
            <svg v-else class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <button 
            @click="uploadPhoto"
            class="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
        
        <div>
          <h2 class="text-xl font-semibold text-gray-900">{{ userName }}</h2>
          <p class="text-gray-600">{{ userEmail }}</p>
        </div>
      </div>

      <!-- Activity Section -->
      <div class="mb-6">
        <h3 class="text-sm font-semibold text-gray-900 mb-3">Activity</h3>
        
        <button 
          @click="$router.push('/my-searches')"
          class="w-full flex items-center justify-between py-4 border-b border-gray-200"
        >
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span class="text-gray-900">My Searches</span>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button 
          @click="$router.push('/garage')"
          class="w-full flex items-center justify-between py-4 border-b border-gray-200"
        >
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.28 5.42 5.08 6.01L3 12V20C3 20.55 3.45 21 4 21H5C5.55 21 6 20.55 6 20V19H18V20C18 20.55 18.45 21 19 21H20C20.55 21 21 20.55 21 20V12L18.92 6.01M6.5 16C5.67 16 5 15.33 5 14.5S5.67 13 6.5 13 8 13.67 8 14.5 7.33 16 6.5 16M17.5 16C16.67 16 16 15.33 16 14.5S16.67 13 17.5 13 19 13.67 19 14.5 18.33 16 17.5 16M5 11L6.5 6.5H17.5L19 11H5Z" />
            </svg>
            <span class="text-gray-900">My Garage</span>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Account Section -->
      <div class="mb-6">
        <h3 class="text-sm font-semibold text-gray-900 mb-3">Account</h3>
        
        <button 
          @click="$router.push('/purchases')"
          class="w-full flex items-center justify-between py-4 border-b border-gray-200"
        >
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span class="text-gray-900">Purchases</span>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button 
          @click="handleSettings"
          class="w-full flex items-center justify-between py-4 border-b border-gray-200"
        >
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="text-gray-900">Settings</span>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Log Out -->
      <button 
        @click="handleLogout"
        class="w-full text-red-600 font-medium py-4"
      >
        Log Out
      </button>
    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const { user, signOut } = useAuth();

const userName = computed(() => user.value?.user_metadata?.name || 'John Smith');
const userEmail = computed(() => user.value?.email || 'johnsmith@email.com');
const profilePhoto = ref<string | null>(null);

const uploadPhoto = async () => {
  // Photo upload using Capacitor Camera API
  // Note: Requires native app context to function
  try {
    const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');
    
    const photo = await Camera.getPhoto({
      quality: 80,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });
    
    if (photo.dataUrl) {
      profilePhoto.value = photo.dataUrl;
      // In production, upload to Supabase Storage
      console.log('Photo captured successfully');
    }
  } catch (err: any) {
    // Camera not available (web browser) - fallback to file input
    if (err.message?.includes('not implemented')) {
      console.log('Camera not available in web browser');
    } else {
      console.error('Photo upload error:', err);
    }
  }
};

const handleSettings = () => {
  router.push('/settings');
};

const handleLogout = async () => {
  await signOut();
  router.push('/login');
};
</script>
