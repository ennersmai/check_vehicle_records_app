<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
    <div class="flex items-center justify-around h-16 px-2">
      <NuxtLink 
        v-for="item in navItems" 
        :key="item.name"
        :to="item.path"
        class="flex items-center justify-center flex-1 h-full transition-colors"
        :class="isActive(item.name) ? 'text-primary' : 'text-gray-600'"
      >
        <component :is="getIconComponent(item.icon)" class="w-7 h-7" />
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
const router = useRouter();
const currentPath = computed(() => router.currentRoute.value.path);

const navItems = [
  {
    path: '/home',
    label: '',
    icon: 'search',
    name: 'search'
  },
  {
    path: '/my-searches',
    label: '',
    icon: 'car-search',
    name: 'vehicle-check'
  },
  {
    path: '/home',
    label: '',
    icon: 'home',
    name: 'home'
  },
  {
    path: '/garage',
    label: '',
    icon: 'car-garage',
    name: 'garage'
  },
  {
    path: '/purchases',
    label: '',
    icon: 'tag',
    name: 'vouchers'
  },
  {
    path: '/account',
    label: '',
    icon: 'user',
    name: 'account'
  }
];

const getIconComponent = (iconName: string) => {
  const currentColor = computed(() => {
    if (iconName === 'car-search') {
      const item = navItems.find(i => i.icon === 'car-search');
      return item && isActive(item.name) ? '#007ea7' : '#6b7280';
    }
    if (iconName === 'car-garage') {
      const item = navItems.find(i => i.icon === 'car-garage');
      return item && isActive(item.name) ? '#007ea7' : '#6b7280';
    }
    return 'currentColor';
  });

  if (iconName === 'car-search') {
    return h('svg', { viewBox: '0 0 24 24', fill: currentColor.value }, [
      h('path', { d: 'M9.61 16.11C9.61 14.03 10.59 12.19 12.1 11H5L6.5 6.5H17.5L18.72 10.16C19.56 10.53 20.3 11.07 20.91 11.74L18.92 6C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.28 5.42 5.08 6L3 12V20C3 20.55 3.45 21 4 21H5C5.55 21 6 20.55 6 20V19H10.29C9.86 18.13 9.61 17.15 9.61 16.11M6.5 16C5.67 16 5 15.33 5 14.5S5.67 13 6.5 13 8 13.67 8 14.5 7.33 16 6.5 16M20.71 20.7L20.7 20.71L20.71 20.7M16.11 11.61C18.61 11.61 20.61 13.61 20.61 16.11C20.61 17 20.36 17.82 19.92 18.5L23 21.61L21.61 23L18.5 19.93C17.8 20.36 17 20.61 16.11 20.61C13.61 20.61 11.61 18.61 11.61 16.11S13.61 11.61 16.11 11.61M16.11 13.61C14.73 13.61 13.61 14.73 13.61 16.11S14.73 18.61 16.11 18.61 18.61 17.5 18.61 16.11 17.5 13.61 16.11 13.61' })
    ]);
  }
  
  if (iconName === 'car-garage') {
    return h('svg', { viewBox: '0 0 24 24', fill: currentColor.value }, [
      h('path', { d: 'M22 9V20H20V11H4V20H2V9L12 5L22 9M19 12H5V14H19V12M19 18H5V20H19V18M19 15H5V17H19V15Z' })
    ]);
  }

  // Fallback to inline SVG paths for other icons
  const icons: Record<string, string> = {
    search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    tag: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
    user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
  };
  
  return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: icons[iconName] || '' })
  ]);
};

const isActive = (itemName: string) => {
  if (itemName === 'search') {
    return currentPath.value === '/home';
  }
  const item = navItems.find(i => i.name === itemName);
  return item ? currentPath.value === item.path || currentPath.value.startsWith(item.path + '/') : false;
};
</script>
