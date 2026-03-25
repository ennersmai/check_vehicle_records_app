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
    </div>

    <!-- Assign Vouchers Modal -->
    <div v-if="assignModal.show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="assignModal.show = false">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h3 class="text-lg font-bold text-gray-900 mb-1">Assign Credits</h3>
        <p class="text-sm text-gray-500 mb-6">Assign premium check credits to <span class="font-medium text-gray-900">{{ assignModal.user?.email }}</span></p>

        <div class="space-y-3 mb-6">
          <button
            v-for="opt in [1, 5, 10]"
            :key="opt"
            @click="assignModal.credits = opt"
            class="w-full flex items-center justify-between px-4 py-3 border-2 rounded-xl transition"
            :class="assignModal.credits === opt ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'"
          >
            <span class="font-medium text-gray-900">{{ opt }} Credit{{ opt > 1 ? 's' : '' }}</span>
            <span v-if="assignModal.credits === opt" class="text-primary font-bold text-sm">Selected</span>
          </button>
        </div>

        <div v-if="assignModal.error" class="bg-red-50 text-red-700 text-sm rounded-lg p-3 mb-4">{{ assignModal.error }}</div>
        <div v-if="assignModal.success" class="bg-green-50 text-green-700 text-sm rounded-lg p-3 mb-4">
          {{ assignModal.success }}
        </div>

        <div class="flex gap-3">
          <button @click="assignModal.show = false" class="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
            Cancel
          </button>
          <button
            @click="handleAssignVouchers"
            :disabled="assignModal.loading"
            class="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-link transition disabled:opacity-50"
          >
            {{ assignModal.loading ? 'Assigning...' : 'Assign' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm Delete Modal -->
    <div v-if="deleteModal.show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="deleteModal.show = false">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h3 class="text-lg font-bold text-red-600 mb-1">Delete User</h3>
        <p class="text-sm text-gray-600 mb-2">Are you sure you want to delete this user?</p>
        <p class="text-sm font-medium text-gray-900 mb-1">{{ deleteModal.user?.email }}</p>
        <p class="text-xs text-gray-400 font-mono mb-6">{{ deleteModal.user?.id }}</p>
        <p class="text-xs text-red-500 mb-6">This action cannot be undone. All user data including vouchers and lookups will be permanently deleted.</p>

        <div v-if="deleteModal.error" class="bg-red-50 text-red-700 text-sm rounded-lg p-3 mb-4">{{ deleteModal.error }}</div>

        <div class="flex gap-3">
          <button @click="deleteModal.show = false" class="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
            Cancel
          </button>
          <button
            @click="handleDeleteUser"
            :disabled="deleteModal.loading"
            class="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition disabled:opacity-50"
          >
            {{ deleteModal.loading ? 'Deleting...' : 'Delete User' }}
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
  if (!confirm(`Send password recovery email to ${u.email}?`)) return;
  try {
    await adminCall('send_recovery', { email: u.email });
    alert(`Recovery email sent to ${u.email}`);
  } catch (err: any) {
    alert(`Failed: ${err.message}`);
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

// ── Init ────────────────────────────────────────────────────────────────────
onMounted(async () => {
  if (!user.value || !ADMIN_UIDS.has(user.value.id)) {
    accessDenied.value = true;
    initialLoading.value = false;
    return;
  }

  initialLoading.value = false;
  await Promise.all([loadKpis(), loadUsers()]);
});
</script>
