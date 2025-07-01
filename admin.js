// Admin Functions
async function loadAdminPage() {
  try {
    // Show admin loading screen
    showAdminLoading();
    
    const user = auth.currentUser;
    if (!user) {
      showPage('home');
      hideAdminLoading();
      return;
    }
    
    // Verify admin status
    const userData = await database.ref(`users/${user.uid}`).once('value');
    if (!userData.exists() || !userData.val().isAdmin) {
      showPage('home');
      hideAdminLoading();
      return;
    }
    
    // Create admin page content
    const adminPage = document.getElementById('admin-page');
    if (!adminPage) return;
    
    adminPage.innerHTML = `
      <div class="admin-content">
        <div class="admin-header">
          <h2><i class="fas fa-user-shield"></i> لوحة التحكم الإدارية</h2>
          <div class="admin-stats-summary" id="admin-stats-summary">
            <!-- Will be filled dynamically -->
          </div>
        </div>
        
        <div class="admin-section">
          <div class="section-header">
            <h3><i class="fas fa-users"></i> إدارة المستخدمين</h3>
            <div class="section-actions">
              <div class="search-container">
                <i class="fas fa-search"></i>
                <input type="text" id="user-search" placeholder="ابحث بالاسم أو البريد">
              </div>
              <select id="user-filter" class="form-input">
                <option value="all">الكل</option>
                <option value="active">نشط (5+ أيام)</option>
                <option value="very-active">نشط جداً (15+ أيام)</option>
                <option value="inactive">غير نشط</option>
                <option value="new">جديد (هذا الشهر)</option>
              </select>
            </div>
          </div>
          
          <div class="table-responsive">
            <table class="users-table">
              <thead>
                <tr>
                  <th>المستخدم</th>
                  <th class="text-center">الأيام المكتملة</th>
                  <th class="text-center">الصلوات</th>
                  <th class="text-center">النسبة</th>
                  <th class="text-center">آخر نشاط</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody id="users-table-body">
                <!-- سيتم ملؤه ديناميكيًا -->
              </tbody>
            </table>
            <div class="table-loading" id="users-table-loading">
              <div class="spinner"></div>
              <p>جاري تحميل بيانات المستخدمين...</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- User Profile Modal -->
      <div id="user-profile-modal" class="modal-overlay">
        <div class="modal-content large">
          <div class="modal-header">
            <h3 id="modal-user-name">ملف المستخدم</h3>
            <button class="close-modal-btn" onclick="closeUserProfileModal()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body" id="user-profile-modal-content">
            <div class="loading-spinner">
              <div class="spinner"></div>
              <p>جاري تحميل بيانات المستخدم...</p>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Load initial data
    await loadAdminSummary();
    await loadUsersTable();
    
    // Setup event listeners
    setupAdminEventListeners();
    
    hideAdminLoading();
    
  } catch (error) {
    console.error('Error loading admin page:', error);
    showAdminError('حدث خطأ في تحميل لوحة التحكم', error);
    hideAdminLoading();
  }
}

function setupAdminEventListeners() {
  // Search and filter events
  document.getElementById('user-filter')?.addEventListener('change', loadUsersTable);
  
  const searchInput = document.getElementById('user-search');
  if (searchInput) {
    let searchTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(loadUsersTable, 500);
    });
  }
}

function showAdminLoading() {
  const adminPage = document.getElementById('admin-page');
  if (adminPage) {
    adminPage.innerHTML = `
      <div class="admin-loading-screen">
        <div class="loading-content">
          <div class="spinner"></div>
          <p>جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    `;
  }
}

function hideAdminLoading() {
  const loadingElement = document.querySelector('.admin-loading-screen');
  if (loadingElement) {
    loadingElement.style.opacity = '0';
    setTimeout(() => loadingElement.remove(), 300);
  }
}

function showAdminError(message, error) {
  const adminPage = document.getElementById('admin-page');
  if (adminPage) {
    adminPage.innerHTML = `
      <div class="admin-error-screen">
        <div class="error-content">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>${message}</h3>
          <p>${error.message || 'تفاصيل الخطأ غير متوفرة'}</p>
          <button onclick="loadAdminPage()" class="btn-retry">
            <i class="fas fa-redo"></i> إعادة المحاولة
          </button>
        </div>
      </div>
    `;
  }
}

function closeUserProfileModal() {
  const modal = document.getElementById('user-profile-modal');
  if (modal) modal.style.display = 'none';
}

function getProgressClass(days) {
  if (days >= 15) return 'excellent';
  if (days >= 10) return 'very-good';
  if (days >= 5) return 'good';
  if (days >= 1) return 'fair';
  return 'poor';
}

async function loadAdminSummary() {
  try {
    const summaryElement = document.getElementById('admin-stats-summary');
    if (!summaryElement) return;
    
    summaryElement.innerHTML = `
      <div class="loading-spinner small">
        <div class="spinner"></div>
      </div>
    `;
    
    const usersSnapshot = await database.ref('users').once('value');
    const users = usersSnapshot.val() || {};
    
    let stats = {
      totalUsers: 0,
      activeUsers: 0,
      veryActiveUsers: 0,
      newUsers: 0,
      totalPrayers: 0
    };
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Calculate basic stats
    for (const [uid, user] of Object.entries(users)) {
      if (user.isAdmin) continue;
      
      stats.totalUsers++;
      
      // Check if user is new
      if (user.joinDate) {
        const joinDate = new Date(user.joinDate);
        if (joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear) {
          stats.newUsers++;
        }
      }
    }
    
    // Update summary UI
    summaryElement.innerHTML = `
      <div class="summary-item">
        <div class="summary-value">${stats.totalUsers}</div>
        <div class="summary-label">إجمالي المستخدمين</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">${stats.activeUsers}</div>
        <div class="summary-label">نشطون</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">${stats.veryActiveUsers}</div>
        <div class="summary-label">نشطون جداً</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">${stats.newUsers}</div>
        <div class="summary-label">جدد</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">${stats.totalPrayers}</div>
        <div class="summary-label">صلاة</div>
      </div>
    `;
    
  } catch (error) {
    console.error('Error loading admin summary:', error);
    document.getElementById('admin-stats-summary').innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        <span>تعذر تحميل الإحصائيات</span>
      </div>
    `;
  }
}

async function loadUsersTable() {
  try {
    const tableBody = document.getElementById('users-table-body');
    const loadingElement = document.getElementById('users-table-loading');
    if (!tableBody || !loadingElement) return;
    
    // Show loading state
    tableBody.innerHTML = '';
    loadingElement.style.display = 'flex';
    
    const filter = document.getElementById('user-filter')?.value || 'all';
    const searchQuery = document.getElementById('user-search')?.value.toLowerCase() || '';
    const usersSnapshot = await database.ref('users').once('value');
    
    const users = usersSnapshot.val() || {};
    const currentUser = auth.currentUser;
    
    // Prepare user data with progress
    const usersWithProgress = [];
    
    for (const [uid, user] of Object.entries(users)) {
      if (user.isAdmin || uid === currentUser?.uid) continue;
      
      // Apply search filter
      const username = user.username?.toLowerCase() || '';
      const email = user.email?.toLowerCase() || '';
      if (searchQuery && !username.includes(searchQuery) && !email.includes(searchQuery)) {
        continue;
      }
      
      usersWithProgress.push({
        uid,
        user,
        progress: await getUserProgressData(uid)
      });
    }
    
    // Apply additional filters
    const filteredUsers = usersWithProgress.filter(({progress}) => {
      if (filter === 'active') return progress.completedDays >= 5;
      if (filter === 'very-active') return progress.completedDays >= 15;
      if (filter === 'inactive') return progress.completedDays < 2;
      if (filter === 'new') return progress.isNewUser;
      return true;
    });
    
    // Sort by most active first
    filteredUsers.sort((a, b) => b.progress.completedDays - a.progress.completedDays);
    
    // Render table rows
    tableBody.innerHTML = filteredUsers.map(({uid, user, progress}) => `
      <tr>
        <td>
          <div class="user-info-cell">
            <div class="user-avatar">${(user.username || user.email).charAt(0).toUpperCase()}</div>
            <div>
              <div class="user-name">${user.username || 'بدون اسم'}</div>
              <div class="user-email">${user.email}</div>
            </div>
          </div>
        </td>
        <td class="text-center">
          <div class="progress-badge ${getProgressClass(progress.completedDays)}">
            ${progress.completedDays}
          </div>
        </td>
        <td class="text-center">${progress.totalPrayers}</td>
        <td class="text-center">
          <div class="completion-rate">${progress.completionRate}%</div>
        </td>
        <td class="text-center">
          ${progress.lastActiveDate || 'لا يوجد'}
        </td>
        <td>
          <button onclick="viewUserDetails('${uid}')" class="btn btn-view">
            <i class="fas fa-user-circle"></i> عرض الملف
          </button>
        </td>
      </tr>
    `).join('');
    
    loadingElement.style.display = 'none';
    
    // Show empty state if no users found
    if (filteredUsers.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="empty-state">
            <i class="fas fa-user-slash"></i>
            <p>لا يوجد مستخدمون متطابقون مع بحثك</p>
          </td>
        </tr>
      `;
    }
    
  } catch (error) {
    console.error('Error loading users table:', error);
    document.getElementById('users-table-body').innerHTML = `
      <tr>
        <td colspan="6" class="error-state">
          <i class="fas fa-exclamation-triangle"></i>
          <p>حدث خطأ في تحميل البيانات</p>
          <button onclick="loadUsersTable()" class="btn-retry">
            <i class="fas fa-redo"></i> إعادة المحاولة
          </button>
        </td>
      </tr>
    `;
    document.getElementById('users-table-loading').style.display = 'none';
  }
}

async function getUserProgressData(userId) {
  const trackerSnap = await database.ref(`users/${userId}/tracker`).once('value');
  const trackerData = trackerSnap.val() || {};
  
  let stats = {
    completedDays: 0,
    totalPrayers: 0,
    lastActiveDate: null,
    completionRate: 0
  };

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // حساب الإحصائيات
  for (const year in trackerData) {
    for (const month in trackerData[year]) {
      const days = trackerData[year][month];
      
      for (const dayKey in days) {
        const dayData = days[dayKey];
        const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
        const dayPrayers = prayers.filter(p => dayData[p]).length;
        
        stats.totalPrayers += dayPrayers;
        
        if (dayPrayers > 0) {
          const activityDate = new Date(year, month, dayKey.replace('day', ''));
          if (!stats.lastActiveDate || activityDate > stats.lastActiveDate) {
            stats.lastActiveDate = activityDate;
          }
        }
        
        if (prayers.every(p => dayData[p])) {
          stats.completedDays++;
        }
      }
    }
  }

  // حساب نسبة الإنجاز (بالنسبة للشهر الحالي)
  const currentMonthDays = new Date(currentYear, currentMonth + 1, 0).getDate();
  const currentMonthData = trackerData[currentYear]?.[currentMonth] || {};
  let currentMonthCompleted = 0;

  for (const dayKey in currentMonthData) {
    const dayData = currentMonthData[dayKey];
    const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    if (prayers.every(p => dayData[p])) {
      currentMonthCompleted++;
    }
  }

  stats.completionRate = Math.round((currentMonthCompleted / currentMonthDays) * 100) || 0;
  stats.lastActiveDate = stats.lastActiveDate ? stats.lastActiveDate.toLocaleDateString('ar-EG') : null;

  return stats;
}

async function viewUserDetails(userId) {
  try {
    const modal = document.getElementById('user-profile-modal');
    const modalContent = document.getElementById('user-profile-modal-content');
    if (!modal || !modalContent) return;

    // عرض النافذة مع حالة التحميل
    modal.style.display = 'flex';
    modalContent.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>جاري تحميل بيانات المستخدم...</p>
      </div>
    `;

    // تحميل بيانات المستخدم والتقدم
    const [userSnapshot, progressData] = await Promise.all([
      database.ref(`users/${userId}`).once('value'),
      getUserProgressData(userId)
    ]);

    const user = userSnapshot.val() || {};
    
    // تنسيق تاريخ الانضمام
    let joinDate = 'غير معروف';
    if (user.joinDate) {
      const date = new Date(user.joinDate);
      joinDate = date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    // إنشاء محتوى الملف الشخصي
    modalContent.innerHTML = `
      <div class="user-profile-header">
        <div class="user-avatar large">${(user.username || user.email).charAt(0).toUpperCase()}</div>
        <div class="user-info">
          <h2>${user.username || 'بدون اسم'}</h2>
          <p class="user-email">${user.email}</p>
          <p class="join-date">مسجل منذ: ${joinDate}</p>
        </div>
      </div>
      
      <div class="user-stats-grid">
        <div class="stat-card">
          <div class="stat-value">${progressData.completedDays}</div>
          <div class="stat-label">أيام مكتملة</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${progressData.totalPrayers}</div>
          <div class="stat-label">صلاة مسجلة</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${progressData.completionRate}%</div>
          <div class="stat-label">نسبة الإنجاز</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${progressData.lastActiveDate || 'لا يوجد'}</div>
          <div class="stat-label">آخر نشاط</div>
        </div>
      </div>
      
      <div class="monthly-calendar">
        <h3><i class="fas fa-calendar-alt"></i> متابعة الشهر الحالي</h3>
        <div class="calendar-grid" id="user-calendar-grid">
          ${await generateUserCalendarForCurrentMonth(userId)}
        </div>
      </div>
    `;
    
  } catch (error) {
    console.error('Error viewing user details:', error);
    document.getElementById('user-profile-modal-content').innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>حدث خطأ في تحميل بيانات المستخدم</p>
        <button onclick="viewUserDetails('${userId}')" class="btn-retry">
          <i class="fas fa-redo"></i> إعادة المحاولة
        </button>
      </div>
    `;
  }
}

function generateUserCalendar(calendarDays) {
  if (!calendarDays || calendarDays.length === 0) {
    return '<div class="empty-calendar">لا يوجد بيانات متاحة لهذا الشهر</div>';
  }
  
  return calendarDays.map(day => `
    <div class="calendar-day ${day.completed ? 'completed' : day.prayers > 0 ? 'partial' : ''}">
      <div class="day-number">${day.day}</div>
      <div class="day-status">
        ${day.completed ? '<i class="fas fa-check-circle"></i>' : 
         day.prayers > 0 ? `${day.prayers}/5` : ''}
      </div>
    </div>
  `).join('');
}
function viewUserProfile(userId) {
    viewUserDetails(userId);
}

async function generateUserCalendarForCurrentMonth(userId) {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // جلب بيانات التتبع للشهر الحالي
    const snapshot = await database.ref(`users/${userId}/tracker/${currentYear}/${currentMonth}`).once('value');
    const monthData = snapshot.val() || {};

    let calendarHTML = '';
    const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

    for (let day = 1; day <= daysInMonth; day++) {
      const dayKey = `day${day}`;
      const dayData = monthData[dayKey] || {};
      
      // حساب عدد الصلوات المكتملة لهذا اليوم
      const completedPrayers = prayers.filter(prayer => dayData[prayer]).length;
      const progressPercentage = Math.round((completedPrayers / prayers.length) * 100);

      // تحديد فئة التقدم
      let progressClass = 'no-progress';
      if (progressPercentage === 100) {
        progressClass = 'complete-day';
      } else if (progressPercentage >= 70) {
        progressClass = 'high-progress';
      } else if (progressPercentage >= 30) {
        progressClass = 'medium-progress';
      } else if (progressPercentage > 0) {
        progressClass = 'low-progress';
      }

      // إضافة يوم التقويم
      calendarHTML += `
        <div class="calendar-day ${progressClass}" title="اليوم ${day}: ${progressPercentage}% مكتمل">
          <div class="day-number">${day}</div>
          <div class="day-progress">
            ${progressPercentage > 0 ? `${progressPercentage}%` : ''}
          </div>
        </div>
      `;
    }

    return calendarHTML;

  } catch (error) {
    console.error('Error generating calendar:', error);
    return '<div class="error-message">حدث خطأ في تحميل التقويم</div>';
  }
}

// Make functions available globally
window.loadAdminPage = loadAdminPage;
window.loadUserProgress = loadUserProgress;
window.searchUsers = searchUsers;
window.viewUserDetails = viewUserDetails;



window.closeUserProfileModal = closeUserProfileModal;
window.loadUsersTable = loadUsersTable;
window.viewUserProfile = viewUserProfile;