<template>
  <div class="min-h-screen bg-gray-50 font-sans">
    <WebNav />

    <!-- Access denied -->
    <div v-if="accessDenied" class="max-w-lg mx-auto px-4 py-32 text-center">
      <svg class="w-16 h-16 mx-auto text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
      <p class="text-gray-500">You don't have permission to view this page.</p>
      <NuxtLink to="/landing" class="text-primary font-medium hover:underline mt-4 inline-block">Go Home</NuxtLink>
    </div>

    <!-- Loading -->
    <div v-else-if="initialLoading" class="flex items-center justify-center py-32">
      <svg class="animate-spin h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
      </svg>
    </div>

    <!-- Admin Panel -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p class="text-gray-500 text-sm mt-1">Manage users, view KPIs, and assign vouchers</p>
        </div>
        <button @click="refreshAll" :disabled="refreshing" class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center gap-2">
          <svg :class="{ 'animate-spin': refreshing }" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-gray-200 mb-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-5 py-3 text-sm font-medium border-b-2 transition -mb-px"
          :class="activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- KPI Dashboard -->
      <div v-if="activeTab === 'kpis'">
        <div v-if="kpiLoading" class="flex justify-center py-16">
          <svg class="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
        </div>
        <div v-else-if="kpis">
          <!-- Revenue Cards -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div class="bg-white rounded-xl border border-gray-200 p-5">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total Revenue</p>
              <p class="text-2xl font-bold text-gray-900">£{{ kpis.total_revenue.toFixed(2) }}</p>
            </div>
            <div class="bg-white rounded-xl border border-gray-200 p-5">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Stripe (Web)</p>
              <p class="text-2xl font-bold text-purple-600">£{{ kpis.stripe_revenue.toFixed(2) }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ kpis.stripe_purchases }} purchases</p>
            </div>
            <div class="bg-white rounded-xl border border-gray-200 p-5">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Mobile (RevenueCat)</p>
              <p class="text-2xl font-bold text-green-600">£{{ kpis.mobile_revenue.toFixed(2) }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ kpis.mobile_purchases }} purchases</p>
            </div>
            <div class="bg-white rounded-xl border border-gray-200 p-5">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Admin Gifted</p>
              <p class="text-2xl font-bold text-orange-500">{{ kpis.admin_vouchers_given }}</p>
              <p class="text-xs text-gray-400 mt-1">vouchers assigned</p>
            </div>
          </div>

          <!-- Stats Cards -->
          <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div class="bg-white rounded-xl border border-gray-200 p-5">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total Users</p>
              <p class="text-xl font-bold text-gray-900">{{ kpis.total_users }}</p>
            </div>
            <div class="bg-white rounded-xl border border-gray-200 p-5">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total Vouchers</p>
              <p class="text-xl font-bold text-gray-900">{{ kpis.total_vouchers }}</p>
            </div>
            <div class="bg-white rounded-xl border border-gray-200 p-5">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Redeemed</p>
              <p class="text-xl font-bold text-green-600">{{ kpis.redeemed_vouchers }}</p>
            </div>
            <div class="bg-white rounded-xl border border-gray-200 p-5">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Available</p>
              <p class="text-xl font-bold text-blue-600">{{ kpis.available_vouchers }}</p>
            </div>
            <div class="bg-white rounded-xl border border-gray-200 p-5">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Unique VRMs</p>
              <p class="text-xl font-bold text-gray-900">{{ kpis.unique_vrms_checked }}</p>
            </div>
          </div>

          <!-- Monthly Revenue Chart (simple bar) -->
          <div class="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h3 class="font-semibold text-gray-900 mb-4">Monthly Revenue (Last 12 Months)</h3>
            <div class="flex items-end gap-2 h-48">
              <div
                v-for="m in kpis.monthly_revenue"
                :key="m.month"
                class="flex-1 flex flex-col items-center gap-1"
              >
                <div class="w-full flex flex-col items-center gap-0.5" :style="{ height: '160px' }">
                  <div class="w-full flex flex-col justify-end h-full gap-0.5">
                    <div
                      v-if="m.stripe > 0"
                      class="bg-purple-500 rounded-t w-full min-h-[2px]"
                      :style="{ height: getBarHeight(m.stripe) }"
                    ></div>
                    <div
                      v-if="m.mobile > 0"
                      class="bg-green-500 w-full min-h-[2px]"
                      :class="{ 'rounded-t': m.stripe === 0 }"
                      :style="{ height: getBarHeight(m.mobile) }"
                    ></div>
                    <div v-if="m.stripe === 0 && m.mobile === 0" class="bg-gray-100 rounded-t w-full" style="height: 2px"></div>
                  </div>
                </div>
                <span class="text-[10px] text-gray-400">{{ m.month }}</span>
              </div>
            </div>
            <div class="flex items-center gap-4 mt-4 text-xs text-gray-500">
              <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded bg-purple-500"></div> Stripe</div>
              <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded bg-green-500"></div> Mobile</div>
            </div>
          </div>

          <!-- 30-day activity -->
          <div class="bg-white rounded-xl border border-gray-200 p-6">
            <h3 class="font-semibold text-gray-900 mb-2">Last 30 Days</h3>
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">Vouchers created</p>
                <p class="text-lg font-bold text-gray-900">{{ kpis.recent_vouchers_30d }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Vouchers redeemed</p>
                <p class="text-lg font-bold text-gray-900">{{ kpis.recent_redeemed_30d }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Management -->
      <div v-if="activeTab === 'users'">
        <div class="flex items-center gap-4 mb-6">
          <div class="flex-1 relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="userSearch"
              type="text"
              placeholder="Search by email or UID..."
              class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm"
              @input="debouncedSearchUsers"
            />
          </div>
        </div>

        <div v-if="usersLoading" class="flex justify-center py-16">
          <svg class="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
        </div>

        <div v-else class="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th class="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                <th class="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">UID</th>
                <th class="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Created</th>
                <th class="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Last Sign In</th>
                <th class="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="u in filteredUsers"
                :key="u.id"
                class="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td class="px-4 py-3">
                  <div class="font-medium text-gray-900">{{ u.email }}</div>
                  <div class="text-xs text-gray-400 md:hidden">{{ u.id.slice(0, 8) }}...</div>
                </td>
                <td class="px-4 py-3 hidden md:table-cell">
                  <span class="font-mono text-xs text-gray-500">{{ u.id.slice(0, 8) }}...</span>
                  <button @click="copyToClipboard(u.id)" class="ml-1 text-gray-400 hover:text-primary text-xs">copy</button>
                </td>
                <td class="px-4 py-3 text-gray-600 hidden sm:table-cell">{{ formatDate(u.created_at) }}</td>
                <td class="px-4 py-3 text-gray-600 hidden lg:table-cell">{{ u.last_sign_in_at ? formatDate(u.last_sign_in_at) : 'Never' }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center justify-end gap-1">
                    <button
                      @click="openAssignModal(u)"
                      class="px-2.5 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition"
                      title="Assign vouchers"
                    >
                      + Credits
                    </button>
                    <button
                      @click="handleSendRecovery(u)"
                      class="px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                      title="Send password recovery"
                    >
                      Recovery
                    </button>
                    <button
                      @click="confirmDeleteUser(u)"
                      :disabled="ADMIN_UIDS.has(u.id)"
                      class="px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Delete user"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredUsers.length === 0">
                <td colspan="5" class="text-center py-12 text-gray-500">No users found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Voucher Management -->
      <div v-if="activeTab === 'vouchers'">
        <div class="flex items-center gap-4 mb-6">
          <div class="flex-1 relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="voucherUserSearch"
              type="text"
              placeholder="Search user by email to view their vouchers..."
              class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm"
            />
          </div>
        </div>

        <div v-if="voucherSearchResults.length > 0" class="space-y-4">
          <div
            v-for="u in voucherSearchResults"
            :key="u.id"
            class="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:border-primary/40 transition"
            @click="loadUserVouchers(u)"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900">{{ u.email }}</p>
                <p class="text-xs text-gray-400 font-mono">{{ u.id }}</p>
              </div>
              <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Selected user vouchers -->
        <div v-if="selectedVoucherUser" class="mt-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-semibold text-gray-900">{{ selectedVoucherUser.email }}</h3>
              <p class="text-xs text-gray-400 font-mono">{{ selectedVoucherUser.id }}</p>
            </div>
            <button
              @click="openAssignModal(selectedVoucherUser)"
              class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-link transition"
            >
              + Assign Credits
            </button>
          </div>

          <div v-if="userVouchersLoading" class="flex justify-center py-8">
            <svg class="animate-spin h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
          </div>

          <div v-else-if="userVouchers.length > 0" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-200">
                  <th class="text-left px-4 py-3 font-medium text-gray-600">Voucher Code</th>
                  <th class="text-left px-4 py-3 font-medium text-gray-600">Source</th>
                  <th class="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th class="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Created</th>
                  <th class="text-left px-4 py-3 font-medium text-gray-600">VRM</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="v in userVouchers" :key="v.id" class="border-b border-gray-100">
                  <td class="px-4 py-3 font-mono text-xs">{{ v.voucher_code }}</td>
                  <td class="px-4 py-3">
                    <span class="text-xs px-2 py-0.5 rounded-full"
                      :class="getSourceBadgeClass(v.purchase_package)">
                      {{ getSourceLabel(v.purchase_package) }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <span v-if="v.is_redeemed" class="text-xs text-green-600 font-medium">Redeemed</span>
                    <span v-else class="text-xs text-blue-600 font-medium">Available</span>
                  </td>
                  <td class="px-4 py-3 text-gray-500 hidden sm:table-cell">{{ formatDate(v.created_at) }}</td>
                  <td class="px-4 py-3 font-mono text-xs text-gray-600">{{ v.vehicle_vrm || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="text-center py-8 text-gray-500 bg-white rounded-xl border border-gray-200">
            No vouchers found for this user
          </div>
        </div>
      </div>

      <!-- Blog Management -->
      <div v-if="activeTab === 'blog'">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900">Blog Posts</h2>
          <button
            @click="openBlogEditor()"
            class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-link transition"
          >
            + New Post
          </button>
        </div>

        <div v-if="blogLoading" class="flex justify-center py-16">
          <svg class="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
        </div>

        <div v-else class="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th class="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                <th class="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Slug</th>
                <th class="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Status</th>
                <th class="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Created</th>
                <th class="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="post in blogPosts" :key="post.id" class="border-b border-gray-100 hover:bg-gray-50 transition">
                <td class="px-4 py-3">
                  <div class="font-medium text-gray-900">{{ post.title }}</div>
                </td>
                <td class="px-4 py-3 hidden md:table-cell">
                  <span class="font-mono text-xs text-gray-500">{{ post.slug }}</span>
                </td>
                <td class="px-4 py-3 hidden sm:table-cell">
                  <span :class="post.published ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50'" class="text-xs px-2 py-0.5 rounded-full font-medium">
                    {{ post.published ? 'Published' : 'Draft' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-gray-500 hidden lg:table-cell">{{ formatDate(post.created_at) }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center justify-end gap-1">
                    <button
                      @click="toggleBlogPublish(post)"
                      :class="post.published ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100' : 'text-green-600 bg-green-50 hover:bg-green-100'"
                      class="px-2.5 py-1.5 text-xs font-medium rounded-lg transition"
                    >
                      {{ post.published ? 'Unpublish' : 'Publish' }}
                    </button>
                    <button
                      @click="openBlogEditor(post)"
                      class="px-2.5 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteBlogPost(post)"
                      class="px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="blogPosts.length === 0">
                <td colspan="5" class="text-center py-12 text-gray-500">No blog posts yet. Create your first post!</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- FAQ Management -->
      <div v-if="activeTab === 'faqs'">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900">Frequently Asked Questions</h2>
          <button
            @click="openFaqEditor()"
            class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-link transition"
          >
            + New FAQ
          </button>
        </div>

        <div v-if="faqLoading" class="flex justify-center py-16">
          <svg class="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="faq in faqs"
            :key="faq.id"
            class="bg-white rounded-xl border border-gray-200 p-5"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <h3 class="font-medium text-gray-900 mb-2">{{ faq.question }}</h3>
                <p class="text-sm text-gray-600 line-clamp-2">{{ faq.answer }}</p>
                <div class="flex items-center gap-3 mt-3">
                  <span :class="faq.published ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50'" class="text-xs px-2 py-0.5 rounded-full font-medium">
                    {{ faq.published ? 'Published' : 'Draft' }}
                  </span>
                  <span class="text-xs text-gray-400">Order: {{ faq.sort_order }}</span>
                </div>
              </div>
              <div class="flex items-center gap-1 flex-shrink-0">
                <button
                  @click="moveFaq(faq, -1)"
                  class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition"
                  title="Move up"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                  </svg>
                </button>
                <button
                  @click="moveFaq(faq, 1)"
                  class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition"
                  title="Move down"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                <button
                  @click="toggleFaqPublish(faq)"
                  :class="faq.published ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100' : 'text-green-600 bg-green-50 hover:bg-green-100'"
                  class="px-2.5 py-1.5 text-xs font-medium rounded-lg transition"
                >
                  {{ faq.published ? 'Unpublish' : 'Publish' }}
                </button>
                <button
                  @click="openFaqEditor(faq)"
                  class="px-2.5 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition"
                >
                  Edit
                </button>
                <button
                  @click="deleteFaq(faq)"
                  class="px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          <div v-if="faqs.length === 0" class="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
            No FAQs yet. Create your first FAQ!
          </div>
        </div>
      </div>
    </div>

    <!-- Assign Vouchers Modal -->
    <div v-if="assignModal.show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="assignModal.show = false">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border-2 border-cyan-500">
        <h3 class="text-lg font-bold text-gray-900 mb-1">Assign Credits</h3>
        <p class="text-sm text-gray-500 mb-6">Assign premium check credits to <span class="font-medium text-gray-900">{{ assignModal.user?.email }}</span></p>

        <div class="space-y-3 mb-6">
          <button
            v-for="opt in [1, 5, 10]"
            :key="opt"
            @click="assignModal.credits = opt"
            class="w-full flex items-center justify-between px-4 py-3 border-2 rounded-xl transition"
            :class="assignModal.credits === opt ? 'border-cyan-500 bg-cyan-50 shadow-lg shadow-cyan-500/25' : 'border-cyan-300 hover:border-cyan-400 hover:shadow-md hover:shadow-cyan-400/20'"
          >
            <span class="font-medium text-gray-900">{{ opt }} Credit{{ opt > 1 ? 's' : '' }}</span>
            <span v-if="assignModal.credits === opt" class="text-cyan-600 font-bold text-sm">Selected</span>
          </button>
        </div>

        <div v-if="assignModal.error" class="bg-red-50 text-red-700 text-sm rounded-lg p-3 mb-4">{{ assignModal.error }}</div>
        <div v-if="assignModal.success" class="bg-green-50 text-green-700 text-sm rounded-lg p-3 mb-4">
          {{ assignModal.success }}
        </div>

        <div class="flex gap-3">
          <button @click="assignModal.show = false" class="flex-1 px-4 py-2.5 border-2 border-cyan-300 rounded-lg text-sm font-medium hover:bg-cyan-50 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/25 transition">
            Cancel
          </button>
          <button
            @click="handleAssignVouchers"
            :disabled="assignModal.loading"
            class="flex-1 px-4 py-2.5 bg-cyan-500 text-white rounded-lg text-sm font-medium hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-500/25 transition disabled:opacity-50"
          >
            {{ assignModal.loading ? 'Assigning...' : 'Assign' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm Delete Modal -->
    <div v-if="deleteModal.show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="deleteModal.show = false">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border-2 border-cyan-500">
        <h3 class="text-lg font-bold text-red-600 mb-1">Delete User</h3>
        <p class="text-sm text-gray-600 mb-2">Are you sure you want to delete this user?</p>
        <p class="text-sm font-medium text-gray-900 mb-1">{{ deleteModal.user?.email }}</p>
        <p class="text-xs text-gray-400 font-mono mb-6">{{ deleteModal.user?.id }}</p>
        <p class="text-xs text-red-500 mb-6">This action cannot be undone. All user data including vouchers and lookups will be permanently deleted.</p>

        <div v-if="deleteModal.error" class="bg-red-50 text-red-700 text-sm rounded-lg p-3 mb-4">{{ deleteModal.error }}</div>

        <div class="flex gap-3">
          <button @click="deleteModal.show = false" class="flex-1 px-4 py-2.5 border-2 border-cyan-300 rounded-lg text-sm font-medium hover:bg-cyan-50 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/25 transition">
            Cancel
          </button>
          <button
            @click="handleDeleteUser"
            :disabled="deleteModal.loading"
            class="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/25 transition disabled:opacity-50"
          >
            {{ deleteModal.loading ? 'Deleting...' : 'Delete User' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Blog Editor Modal -->
    <div v-if="blogModal.show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="blogModal.show = false">
      <div class="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto border-2 border-cyan-500">
        <h3 class="text-lg font-bold text-gray-900 mb-4">{{ blogModal.editing ? 'Edit Post' : 'New Blog Post' }}</h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              v-model="blogModal.title"
              type="text"
              class="w-full px-4 py-2.5 border-2 border-cyan-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:shadow-lg focus:shadow-cyan-500/20"
              placeholder="Enter post title"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
            <input
              v-model="blogModal.slug"
              type="text"
              class="w-full px-4 py-2.5 border-2 border-cyan-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:shadow-lg focus:shadow-cyan-500/20 font-mono text-sm"
              placeholder="url-friendly-slug"
            />
            <p class="text-xs text-gray-400 mt-1">URL: /web/blog/{{ blogModal.slug || 'slug' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea
              v-model="blogModal.excerpt"
              rows="2"
              class="w-full px-4 py-2.5 border-2 border-cyan-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:shadow-lg focus:shadow-cyan-500/20"
              placeholder="Brief description for SEO and previews"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Content *</label>
            <RichTextEditor 
              v-model="blogModal.content"
              placeholder="Write your blog post content here..."
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
            <div class="flex gap-2">
              <input
                v-model="blogModal.featured_image"
                type="text"
                class="flex-1 px-4 py-2.5 border-2 border-cyan-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:shadow-lg focus:shadow-cyan-500/20"
                placeholder="https://example.com/image.jpg or upload below"
              />
              <input
                type="file"
                ref="fileInput"
                accept="image/*"
                class="hidden"
                @change="handleFileSelect"
              />
              <button
                type="button"
                @click="triggerFileInput"
                :disabled="uploadingImage"
                class="px-4 py-2.5 border-2 border-cyan-300 rounded-lg text-sm font-medium hover:bg-cyan-50 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/25 transition disabled:opacity-50"
              >
                {{ uploadingImage ? 'Uploading...' : 'Upload' }}
              </button>
            </div>
            <p class="text-xs text-gray-400 mt-1">Upload to Supabase storage (max 5MB, JPG/PNG/WEBP/GIF)</p>
            <div v-if="uploadedImageUrl" class="mt-2">
              <p class="text-xs text-green-600">Uploaded! URL: {{ uploadedImageUrl }}</p>
              <img :src="uploadedImageUrl" class="mt-1 max-h-32 rounded border" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
            <input
              v-model="blogModal.meta_title"
              type="text"
              class="w-full px-4 py-2.5 border-2 border-cyan-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:shadow-lg focus:shadow-cyan-500/20"
              placeholder="SEO title (optional)"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <textarea
              v-model="blogModal.meta_description"
              rows="2"
              class="w-full px-4 py-2.5 border-2 border-cyan-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:shadow-lg focus:shadow-cyan-500/20"
              placeholder="SEO description (optional)"
            ></textarea>
          </div>
          <div class="flex items-center gap-2">
            <input
              v-model="blogModal.published"
              type="checkbox"
              id="blog-published"
              class="w-4 h-4 text-cyan-500 border-cyan-300 rounded focus:ring-cyan-500"
            />
            <label for="blog-published" class="text-sm text-gray-700">Publish immediately</label>
          </div>
        </div>

        <div v-if="blogModal.error" class="bg-red-50 text-red-700 text-sm rounded-lg p-3 mt-4">{{ blogModal.error }}</div>

        <div class="flex gap-3 mt-6">
          <button @click="blogModal.show = false" class="flex-1 px-4 py-2.5 border-2 border-cyan-300 rounded-lg text-sm font-medium hover:bg-cyan-50 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/25 transition">
            Cancel
          </button>
          <button
            @click="handleSaveBlog"
            :disabled="blogModal.loading"
            class="flex-1 px-4 py-2.5 bg-cyan-500 text-white rounded-lg text-sm font-medium hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-500/25 transition disabled:opacity-50"
          >
            {{ blogModal.loading ? 'Saving...' : 'Save Post' }}
          </button>
        </div>
      </div>
    </div>

    <!-- FAQ Editor Modal -->
    <div v-if="faqModal.show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="faqModal.show = false">
      <div class="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl border-2 border-cyan-500">
        <h3 class="text-lg font-bold text-gray-900 mb-4">{{ faqModal.editing ? 'Edit FAQ' : 'New FAQ' }}</h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Question *</label>
            <input
              v-model="faqModal.question"
              type="text"
              class="w-full px-4 py-2.5 border-2 border-cyan-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:shadow-lg focus:shadow-cyan-500/20"
              placeholder="Enter the question"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Answer *</label>
            <textarea
              v-model="faqModal.answer"
              rows="5"
              class="w-full px-4 py-2.5 border-2 border-cyan-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:shadow-lg focus:shadow-cyan-500/20"
              placeholder="Enter the answer"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
            <input
              v-model.number="faqModal.sort_order"
              type="number"
              min="0"
              class="w-full px-4 py-2.5 border-2 border-cyan-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:shadow-lg focus:shadow-cyan-500/20"
              placeholder="0"
            />
            <p class="text-xs text-gray-400 mt-1">Lower numbers appear first</p>
          </div>
          <div class="flex items-center gap-2">
            <input
              v-model="faqModal.published"
              type="checkbox"
              id="faq-published"
              class="w-4 h-4 text-cyan-500 border-cyan-300 rounded focus:ring-cyan-500"
            />
            <label for="faq-published" class="text-sm text-gray-700">Publish immediately</label>
          </div>
        </div>

        <div v-if="faqModal.error" class="bg-red-50 text-red-700 text-sm rounded-lg p-3 mt-4">{{ faqModal.error }}</div>

        <div class="flex gap-3 mt-6">
          <button @click="faqModal.show = false" class="flex-1 px-4 py-2.5 border-2 border-cyan-300 rounded-lg text-sm font-medium hover:bg-cyan-50 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/25 transition">
            Cancel
          </button>
          <button
            @click="handleSaveFaq"
            :disabled="faqModal.loading"
            class="flex-1 px-4 py-2.5 bg-cyan-500 text-white rounded-lg text-sm font-medium hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-500/25 transition disabled:opacity-50"
          >
            {{ faqModal.loading ? 'Saving...' : 'Save FAQ' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Recovery Email Modal -->
    <div v-if="recoveryModal.show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="recoveryModal.show = false">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border-2 border-cyan-500">
        <h3 class="text-lg font-bold text-gray-900 mb-1">Send Recovery Email</h3>
        <p class="text-sm text-gray-600 mb-2">Send password recovery email to this user?</p>
        <p class="text-sm font-medium text-gray-900 mb-1">{{ recoveryModal.user?.email }}</p>
        <p class="text-xs text-gray-400 font-mono mb-6">{{ recoveryModal.user?.id }}</p>

        <div v-if="recoveryModal.error" class="bg-red-50 text-red-700 text-sm rounded-lg p-3 mb-4">{{ recoveryModal.error }}</div>

        <div class="flex gap-3">
          <button @click="recoveryModal.show = false" class="flex-1 px-4 py-2.5 border-2 border-cyan-300 rounded-lg text-sm font-medium hover:bg-cyan-50 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/25 transition">
            Cancel
          </button>
          <button
            @click="handleSendRecoveryConfirm"
            :disabled="recoveryModal.loading"
            class="flex-1 px-4 py-2.5 bg-cyan-500 text-white rounded-lg text-sm font-medium hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-500/25 transition disabled:opacity-50"
          >
            {{ recoveryModal.loading ? 'Sending...' : 'Send Email' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Blog Post Modal -->
    <div v-if="deleteBlogModal.show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="deleteBlogModal.show = false">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border-2 border-cyan-500">
        <h3 class="text-lg font-bold text-red-600 mb-1">Delete Blog Post</h3>
        <p class="text-sm text-gray-600 mb-2">Are you sure you want to delete this blog post?</p>
        <p class="text-sm font-medium text-gray-900 mb-1">{{ deleteBlogModal.post?.title }}</p>
        <p class="text-xs text-gray-400 font-mono mb-6">{{ deleteBlogModal.post?.slug }}</p>
        <p class="text-xs text-red-500 mb-6">This action cannot be undone.</p>

        <div v-if="deleteBlogModal.error" class="bg-red-50 text-red-700 text-sm rounded-lg p-3 mb-4">{{ deleteBlogModal.error }}</div>

        <div class="flex gap-3">
          <button @click="deleteBlogModal.show = false" class="flex-1 px-4 py-2.5 border-2 border-cyan-300 rounded-lg text-sm font-medium hover:bg-cyan-50 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/25 transition">
            Cancel
          </button>
          <button
            @click="handleDeleteBlogPost"
            :disabled="deleteBlogModal.loading"
            class="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/25 transition disabled:opacity-50"
          >
            {{ deleteBlogModal.loading ? 'Deleting...' : 'Delete Post' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete FAQ Modal -->
    <div v-if="deleteFaqModal.show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="deleteFaqModal.show = false">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border-2 border-cyan-500">
        <h3 class="text-lg font-bold text-red-600 mb-1">Delete FAQ</h3>
        <p class="text-sm text-gray-600 mb-2">Are you sure you want to delete this FAQ?</p>
        <p class="text-sm font-medium text-gray-900 mb-1">{{ deleteFaqModal.faq?.question }}</p>
        <p class="text-xs text-red-500 mb-6">This action cannot be undone.</p>

        <div v-if="deleteFaqModal.error" class="bg-red-50 text-red-700 text-sm rounded-lg p-3 mb-4">{{ deleteFaqModal.error }}</div>

        <div class="flex gap-3">
          <button @click="deleteFaqModal.show = false" class="flex-1 px-4 py-2.5 border-2 border-cyan-300 rounded-lg text-sm font-medium hover:bg-cyan-50 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/25 transition">
            Cancel
          </button>
          <button
            @click="handleDeleteFaq"
            :disabled="deleteFaqModal.loading"
            class="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/25 transition disabled:opacity-50"
          >
            {{ deleteFaqModal.loading ? 'Deleting...' : 'Delete FAQ' }}
          </button>
        </div>
      </div>
    </div>

    <WebFooter />
  </div>
</template>

<script setup lang="ts">
const { user } = useAuth();
const supabase = useSupabaseClient();
const router = useRouter();

const ADMIN_UIDS = new Set([
  'd99958fe-f7cb-439a-a42b-43663e5f39a2', // Ahmed
  '01f951f1-597e-4419-80d2-00753f6cf210', // Mai
]);

const initialLoading = ref(true);
const accessDenied = ref(false);
const refreshing = ref(false);
const activeTab = ref('kpis');

const tabs = [
  { id: 'kpis', label: 'Dashboard' },
  { id: 'users', label: 'Users' },
  { id: 'vouchers', label: 'Vouchers' },
  { id: 'blog', label: 'Blog' },
  { id: 'faqs', label: 'FAQs' },
];

// ── KPIs ────────────────────────────────────────────────────────────────────
const kpis = ref<any>(null);
const kpiLoading = ref(false);

// ── Users ───────────────────────────────────────────────────────────────────
const users = ref<any[]>([]);
const userSearch = ref('');
const usersLoading = ref(false);

const filteredUsers = computed(() => {
  if (!userSearch.value) return users.value;
  const q = userSearch.value.toLowerCase();
  return users.value.filter(
    (u: any) => (u.email || '').toLowerCase().includes(q) || (u.id || '').toLowerCase().includes(q)
  );
});

// ── Voucher Tab ─────────────────────────────────────────────────────────────
const voucherUserSearch = ref('');
const selectedVoucherUser = ref<any>(null);
const userVouchers = ref<any[]>([]);
const userVouchersLoading = ref(false);

const voucherSearchResults = computed(() => {
  if (!voucherUserSearch.value || voucherUserSearch.value.length < 2) return [];
  const q = voucherUserSearch.value.toLowerCase();
  return users.value.filter(
    (u: any) => (u.email || '').toLowerCase().includes(q) || (u.id || '').toLowerCase().includes(q)
  );
});

// ── Modals ──────────────────────────────────────────────────────────────────
const assignModal = ref({
  show: false,
  user: null as any,
  credits: 1,
  loading: false,
  error: '',
  success: '',
});

const deleteModal = ref({
  show: false,
  user: null as any,
  loading: false,
  error: '',
});

const recoveryModal = ref({
  show: false,
  user: null as any,
  loading: false,
  error: '',
});

const deleteBlogModal = ref({
  show: false,
  post: null as any,
  loading: false,
  error: '',
});

const deleteFaqModal = ref({
  show: false,
  faq: null as any,
  loading: false,
  error: '',
});

// ── Blog Management ──────────────────────────────────────────────────────────
const blogPosts = ref<any[]>([]);
const blogLoading = ref(false);

const blogModal = ref({
  show: false,
  editing: false,
  id: null as string | null,
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featured_image: '',
  meta_title: '',
  meta_description: '',
  published: false,
  loading: false,
  error: '',
});

// Image upload for blog featured images
const uploadingImage = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const uploadedImageUrl = computed(() => blogModal.value.featured_image);

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  // Validate file type and size
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    alert('Invalid file type. Please upload JPG, PNG, WEBP, or GIF.');
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    alert('File size exceeds 5MB limit.');
    return;
  }

  uploadingImage.value = true;
  try {
    // Debug: Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('User not authenticated: ' + (authError?.message || 'No user found'));
    }
    
    console.log('Uploading image for user:', user.id);

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `blog/${fileName}`;

    console.log('Uploading to path:', filePath);

    // Upload to Supabase storage bucket 'blog-images'
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file, { 
        upsert: true,
        cacheControl: '3600'
      });

    if (error) {
      console.error('Storage upload error:', error);
      throw error;
    }

    console.log('Upload successful:', data);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    console.log('Public URL:', publicUrl);

    // Set the featured image URL
    blogModal.value.featured_image = publicUrl;
  } catch (err: any) {
    console.error('Upload failed:', err);
    alert('Failed to upload image: ' + err.message);
  } finally {
    uploadingImage.value = false;
    // Clear file input
    if (fileInput.value) fileInput.value.value = '';
  }
};

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

// ── FAQ Management ───────────────────────────────────────────────────────────
const faqs = ref<any[]>([]);
const faqLoading = ref(false);

const faqModal = ref({
  show: false,
  editing: false,
  id: null as string | null,
  question: '',
  answer: '',
  sort_order: 0,
  published: false,
  loading: false,
  error: '',
});

// ── API Helper ──────────────────────────────────────────────────────────────
const adminCall = async (action: string, params: any = {}) => {
  const { data, error } = await (supabase as any).functions.invoke('admin', {
    body: { action, ...params },
  });
  if (error) throw new Error(error.message || 'Admin request failed');
  if (data?.error) throw new Error(data.error);
  return data;
};

// ── Load Functions ──────────────────────────────────────────────────────────
const loadKpis = async () => {
  kpiLoading.value = true;
  try {
    kpis.value = await adminCall('get_kpis');
  } catch (err: any) {
    console.error('Failed to load KPIs:', err);
  } finally {
    kpiLoading.value = false;
  }
};

const loadUsers = async () => {
  usersLoading.value = true;
  try {
    const data = await adminCall('list_users', { per_page: 1000 });
    users.value = data.users || [];
  } catch (err: any) {
    console.error('Failed to load users:', err);
  } finally {
    usersLoading.value = false;
  }
};

const loadUserVouchers = async (u: any) => {
  selectedVoucherUser.value = u;
  userVouchersLoading.value = true;
  try {
    const data = await adminCall('get_user_vouchers', { user_id: u.id });
    userVouchers.value = data.vouchers || [];
  } catch (err: any) {
    console.error('Failed to load vouchers:', err);
  } finally {
    userVouchersLoading.value = false;
  }
};

const refreshAll = async () => {
  refreshing.value = true;
  await Promise.all([loadKpis(), loadUsers()]);
  refreshing.value = false;
};

// ── Actions ─────────────────────────────────────────────────────────────────
const openAssignModal = (u: any) => {
  assignModal.value = { show: true, user: u, credits: 1, loading: false, error: '', success: '' };
};

const handleAssignVouchers = async () => {
  assignModal.value.loading = true;
  assignModal.value.error = '';
  assignModal.value.success = '';
  try {
    const data = await adminCall('assign_vouchers', {
      user_id: assignModal.value.user.id,
      num_credits: assignModal.value.credits,
    });
    assignModal.value.success = `Assigned ${data.num_credits} credit(s). Codes: ${data.voucher_codes.join(', ')}`;
    // Refresh vouchers if viewing same user
    if (selectedVoucherUser.value?.id === assignModal.value.user.id) {
      await loadUserVouchers(selectedVoucherUser.value);
    }
    await loadKpis();
  } catch (err: any) {
    assignModal.value.error = err.message;
  } finally {
    assignModal.value.loading = false;
  }
};

const confirmDeleteUser = (u: any) => {
  deleteModal.value = { show: true, user: u, loading: false, error: '' };
};

const handleDeleteUser = async () => {
  deleteModal.value.loading = true;
  deleteModal.value.error = '';
  try {
    await adminCall('delete_user', { user_id: deleteModal.value.user.id });
    deleteModal.value.show = false;
    users.value = users.value.filter((u: any) => u.id !== deleteModal.value.user.id);
    await loadKpis();
  } catch (err: any) {
    deleteModal.value.error = err.message;
  } finally {
    deleteModal.value.loading = false;
  }
};

const handleSendRecovery = async (u: any) => {
  recoveryModal.value = { show: true, user: u, loading: false, error: '' };
};

const handleSendRecoveryConfirm = async () => {
  recoveryModal.value.loading = true;
  recoveryModal.value.error = '';
  try {
    await adminCall('send_recovery', { email: recoveryModal.value.user.email });
    recoveryModal.value.show = false;
    alert(`Recovery email sent to ${recoveryModal.value.user.email}`);
  } catch (err: any) {
    recoveryModal.value.error = err.message;
  } finally {
    recoveryModal.value.loading = false;
  }
};

// ── Helpers ─────────────────────────────────────────────────────────────────
let searchTimeout: any = null;
const debouncedSearchUsers = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {}, 300);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {}
};

const getBarHeight = (value: number) => {
  if (!kpis.value?.monthly_revenue) return '0px';
  const max = Math.max(...kpis.value.monthly_revenue.map((m: any) => m.stripe + m.mobile), 1);
  return `${Math.max((value / max) * 140, 2)}px`;
};

const getSourceLabel = (pkg: string | null) => {
  if (!pkg) return 'Legacy';
  if (pkg.startsWith('stripe:')) return 'Stripe';
  if (pkg.startsWith('admin:')) return 'Admin';
  return 'Mobile';
};

const getSourceBadgeClass = (pkg: string | null) => {
  if (!pkg) return 'bg-gray-100 text-gray-600';
  if (pkg.startsWith('stripe:')) return 'bg-purple-100 text-purple-700';
  if (pkg.startsWith('admin:')) return 'bg-orange-100 text-orange-700';
  return 'bg-green-100 text-green-700';
};

// ── Blog Management Functions ────────────────────────────────────────────────
const loadBlogPosts = async () => {
  blogLoading.value = true;
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    blogPosts.value = data || [];
  } catch (err: any) {
    console.error('Failed to load blog posts:', err);
  } finally {
    blogLoading.value = false;
  }
};

const openBlogEditor = (post?: any) => {
  if (post) {
    blogModal.value = {
      show: true,
      editing: true,
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content,
      featured_image: post.featured_image || '',
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || '',
      published: post.published,
      loading: false,
      error: '',
    };
  } else {
    blogModal.value = {
      show: true,
      editing: false,
      id: null,
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featured_image: '',
      meta_title: '',
      meta_description: '',
      published: false,
      loading: false,
      error: '',
    };
  }
};

const handleSaveBlog = async () => {
  blogModal.value.loading = true;
  blogModal.value.error = '';

  if (!blogModal.value.title || !blogModal.value.slug || !blogModal.value.content) {
    blogModal.value.error = 'Title, slug, and content are required';
    blogModal.value.loading = false;
    return;
  }

  try {
    const postData = {
      title: blogModal.value.title,
      slug: blogModal.value.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'),
      excerpt: blogModal.value.excerpt,
      content: blogModal.value.content,
      featured_image: blogModal.value.featured_image || null,
      meta_title: blogModal.value.meta_title || null,
      meta_description: blogModal.value.meta_description || null,
      published: blogModal.value.published,
      author_id: user.value?.id,
    };

    if (blogModal.value.editing && blogModal.value.id) {
      // @ts-ignore
      // @ts-ignore
      const { error } = await supabase
        .from('blog_posts')
        // @ts-ignore
        .update(postData)
        .eq('id', blogModal.value.id);
      if (error) throw error;
    } else {
      // @ts-ignore
      const { error } = await supabase
        .from('blog_posts')
        // @ts-ignore
        .insert([postData]);
      if (error) throw error;
    }

    blogModal.value.show = false;
    await loadBlogPosts();
  } catch (err: any) {
    blogModal.value.error = err.message || 'Failed to save post';
  } finally {
    blogModal.value.loading = false;
  }
};

const toggleBlogPublish = async (post: any) => {
  try {
    // @ts-ignore
    const { error } = await supabase
      .from('blog_posts')
      // @ts-ignore
      .update({ published: !post.published })
      .eq('id', post.id);
    if (error) throw error;
    await loadBlogPosts();
  } catch (err: any) {
    alert('Failed to update post: ' + err.message);
  }
};

const deleteBlogPost = async (post: any) => {
  deleteBlogModal.value = { show: true, post, loading: false, error: '' };
};

const handleDeleteBlogPost = async () => {
  deleteBlogModal.value.loading = true;
  deleteBlogModal.value.error = '';
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', deleteBlogModal.value.post.id);
    if (error) throw error;
    deleteBlogModal.value.show = false;
    await loadBlogPosts();
  } catch (err: any) {
    deleteBlogModal.value.error = err.message;
  } finally {
    deleteBlogModal.value.loading = false;
  }
};

// ── FAQ Management Functions ─────────────────────────────────────────────────
const loadFaqs = async () => {
  faqLoading.value = true;
  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    faqs.value = data || [];
  } catch (err: any) {
    console.error('Failed to load FAQs:', err);
  } finally {
    faqLoading.value = false;
  }
};

const openFaqEditor = (faq?: any) => {
  if (faq) {
    faqModal.value = {
      show: true,
      editing: true,
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      sort_order: faq.sort_order,
      published: faq.published,
      loading: false,
      error: '',
    };
  } else {
    faqModal.value = {
      show: true,
      editing: false,
      id: null,
      question: '',
      answer: '',
      sort_order: faqs.value.length,
      published: false,
      loading: false,
      error: '',
    };
  }
};

const handleSaveFaq = async () => {
  faqModal.value.loading = true;
  faqModal.value.error = '';

  if (!faqModal.value.question || !faqModal.value.answer) {
    faqModal.value.error = 'Question and answer are required';
    faqModal.value.loading = false;
    return;
  }

  try {
    const faqData = {
      question: faqModal.value.question,
      answer: faqModal.value.answer,
      sort_order: faqModal.value.sort_order,
      published: faqModal.value.published,
    };

    if (faqModal.value.editing && faqModal.value.id) {
      // @ts-ignore
      const { error } = await supabase
        .from('faqs')
        // @ts-ignore
        .update(faqData)
        .eq('id', faqModal.value.id);
      if (error) throw error;
    } else {
      // @ts-ignore
      const { error } = await supabase
        .from('faqs')
        // @ts-ignore
        .insert([faqData]);
      if (error) throw error;
    }

    faqModal.value.show = false;
    await loadFaqs();
  } catch (err: any) {
    faqModal.value.error = err.message || 'Failed to save FAQ';
  } finally {
    faqModal.value.loading = false;
  }
};

const toggleFaqPublish = async (faq: any) => {
  try {
    // @ts-ignore
    const { error } = await supabase
      .from('faqs')
      // @ts-ignore
      .update({ published: !faq.published })
      .eq('id', faq.id);
    if (error) throw error;
    await loadFaqs();
  } catch (err: any) {
    alert('Failed to update FAQ: ' + err.message);
  }
};

const moveFaq = async (faq: any, direction: number) => {
  const currentIndex = faqs.value.findIndex(f => f.id === faq.id);
  const newIndex = currentIndex + direction;
  if (newIndex < 0 || newIndex >= faqs.value.length) return;

  const otherFaq = faqs.value[newIndex];
  
  try {
    // Swap sort orders
    // @ts-ignore
    await supabase
      .from('faqs')
      // @ts-ignore
      .update({ sort_order: faq.sort_order })
      .eq('id', otherFaq.id);
    // @ts-ignore
    await supabase
      .from('faqs')
      // @ts-ignore
      .update({ sort_order: otherFaq.sort_order })
      .eq('id', faq.id);
    await loadFaqs();
  } catch (err: any) {
    alert('Failed to reorder FAQ: ' + err.message);
  }
};

const deleteFaq = async (faq: any) => {
  deleteFaqModal.value = { show: true, faq, loading: false, error: '' };
};

const handleDeleteFaq = async () => {
  deleteFaqModal.value.loading = true;
  deleteFaqModal.value.error = '';
  try {
    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', deleteFaqModal.value.faq.id);
    if (error) throw error;
    deleteFaqModal.value.show = false;
    await loadFaqs();
  } catch (err: any) {
    deleteFaqModal.value.error = err.message;
  } finally {
    deleteFaqModal.value.loading = false;
  }
};

// ── Init ────────────────────────────────────────────────────────────────────
onMounted(async () => {
  if (!user.value || !ADMIN_UIDS.has(user.value.id)) {
    accessDenied.value = true;
    initialLoading.value = false;
    return;
  }

  initialLoading.value = false;
  await Promise.all([loadKpis(), loadUsers(), loadBlogPosts(), loadFaqs()]);
});
</script>
