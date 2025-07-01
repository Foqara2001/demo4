  // Initialize Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyAu_GIcdkekULGpgdi3PJU05e8LdaLC2JM",
    authDomain: "prayertracker-db2f2.firebaseapp.com",
    databaseURL: "https://prayertracker-db2f2-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "prayertracker-db2f2",
    storageBucket: "prayertracker-db2f2.appspot.com",
    messagingSenderId: "152895762913",
    appId: "1:152895762913:web:61abae5e6d687b411262a0",
    measurementId: "G-1T0ZZDPLQ1",
     performance: {
    dataCollectionEnabled: true,
    instrumentationEnabled: true
  }
  };

  
  // Initialize Firebase
  // Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
  const auth = firebase.auth();
  const database = firebase.database();
  
  // DOM Elements
  const calendar = document.getElementById("calendar");
  const trackerContainer = document.getElementById("tracker-container");
  const trackerTitle = document.getElementById("tracker-title");
  const trackerContent = document.getElementById("tracker-content");
  const dayProgressBar = document.getElementById("day-progress-bar");
  const navbar = document.querySelector(".navbar");
  
  // Initialize the app
  async function initializeApp() {
    try {
      // 1. Set current year in footer
      const yearElement = document.getElementById('current-year');
      if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
      }
      
    if (!firebase.apps.length) {
      await firebase.initializeApp(firebaseConfig);
    }

     showInitialContent();

    // 2. انتظر حتى يكتمل تحميل DOM
    await new Promise(resolve => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('DOMContentLoaded', resolve);
      }
    });

    // 3. تحميل البيانات الأساسية
    await Promise.all([
      checkAuthStatus(),
      loadResources(),
      setRamadanDate()
    ]);

    // 4. إخفاء شاشة التحميل بعد 1 ثانية (ضمان تجربة سلسة)
    setTimeout(() => {
      document.getElementById('splash-screen').classList.add('hidden');
    } , 1000);
      
      // 6. Load initial page based on auth status
      const initialPage = auth.currentUser ? 'profile' : 'home';
      showPage(initialPage);
      
      // 7. Add scroll event for navbar
      window.addEventListener('scroll', handleScroll);
      
      // 8. Hamburger menu toggle
      const hamburger = document.querySelector('.hamburger');
      if (hamburger) {
        hamburger.addEventListener('click', () => {
          const navLinks = document.querySelector('.nav-links');
          navLinks.classList.toggle('active');
        });
      }
      
      // 9. Close mobile menu when clicking outside
      document.addEventListener('click', (e) => {
        const navLinks = document.querySelector('.nav-links');
        const hamburger = document.querySelector('.hamburger');
        
        if (navLinks.classList.contains('active') && 
            !e.target.closest('.nav-links') && 
            !e.target.closest('.hamburger')) {
          navLinks.classList.remove('active');
        }
      });
      
      // 10. Load admin page if user is admin
      if (auth.currentUser) {
        const userData = await database.ref(`users/${auth.currentUser.uid}`).once('value');
        if (userData.exists() && userData.val().isAdmin) {
          document.getElementById('admin-link').style.display = 'block';
        }
      }
      if (auth.currentUser) {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // عرض التقويم الحالي
  generateCalendar(currentYear, currentMonth);
  
  
  // فتح متابعة اليوم الحالي (اختياري)
   openTracker(currentYear, currentMonth, currentDay);
}
    
    // 12. تهيئة أزرار التنقل بين الأشهر
    setupMonthNavigation();
      console.log('Application initialized successfully');

    updateAfterFullLoad();

    // ربط زر إضافة مورد
    document.getElementById('add-resource-btn')?.addEventListener('click', showAddResourceModal);

    // ربط زر حفظ المورد
    document.getElementById('save-resource-btn')?.addEventListener('click', saveResource);  


      
    } catch (error) {
      console.error('Error initializing app:', error);
      showMessage('حدث خطأ في تهيئة التطبيق', 'error');
    }

  }
  
  // Make sure DOM is loaded before initializing
 document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  
});

  
  // Handle scroll for navbar effect
  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  // أسماء الأشهر بالعربية
const monthNames = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

  // Set Ramadan date display
 function setRamadanDate() {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-11
  const currentYear = now.getFullYear();
  
  // أسماء الأشهر بالعربية
  const monthNames = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];
  
  // حساب الأيام المتبقية في الشهر الحالي
  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
  const remainingDays = lastDay - now.getDate();
  
  // تحديث العناصر في الواجهة
  const ramadanDateElement = document.getElementById('ramadan-date');
  if (ramadanDateElement) {
    ramadanDateElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
  }
  
  const remainingDaysElement = document.getElementById('remaining-days');
  if (remainingDaysElement) {
    remainingDaysElement.textContent = remainingDays;
  }
}
  
  // Page Navigation
 /**
 * عرض الصفحة المطلوبة مع التحكم الكامل في التنقل
 * @param {string} pageId - معرف الصفحة المطلوبة (home, tracker, resources, profile, admin)
 */
function showPage(pageId) {
  // 1. منع الفتح التلقائي لصفحة الملف الشخصي
  if (pageId === 'profile' && !userRequestedProfile) {
    return;
  }

  // 2. إخفاء جميع الصفحات
  document.querySelectorAll('[id$="-page"]').forEach(page => {
    if (page) page.style.display = 'none';
  });

  // 3. إخفاء نافذة المتابعة إذا كانت مفتوحة
  if (trackerContainer) {
    trackerContainer.style.display = "none";
  }

  // 4. إغلاق القائمة المتنقلة إذا كانت مفتوحة (للموبايل)
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    navLinks.classList.remove('active');
  }

  // 5. عرض الصفحة المطلوبة
  const page = document.getElementById(`${pageId}-page`);
  if (page) {
    page.style.display = 'block';
    window.scrollTo(0, 0); // الانتقال لأعلى الصفحة

    // 6. تحديث حالة الروابط النشطة في شريط التنقل
    updateActiveNavLinks(pageId);
    
    // 7. معالجات خاصة لكل صفحة
    handlePageSpecificActions(pageId);
  }
   if (pageId === 'resources') {
    loadResources();  
  }
}

/**
 * تحديث حالة الروابط النشطة في شريط التنقل
 */
function updateActiveNavLinks(activePageId) {
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
    const linkPageId = link.getAttribute('data-page') || 
                      link.getAttribute('onclick')?.match(/showPage\('(\w+)'\)/)?.[1];
    
    if (linkPageId === activePageId) {
      link.classList.add('active');
    }
  });
}

/**
 * معالجات خاصة لكل صفحة
 */
function handlePageSpecificActions(pageId) {
  switch (pageId) {
    case 'tracker':
      // تهيئة التقويم عند عرض صفحة المتابعة
      const currentDate = new Date();
      currentYear = currentDate.getFullYear();
      currentMonth = currentDate.getMonth();
      generateCalendar(currentYear, currentMonth);
      updateMonthYearTitle();
      break;
      
    case 'profile':
      // تحميل بيانات الملف الشخصي فقط عند طلبها يدوياً
      if (userRequestedProfile) {
        loadProfilePage();
      }
      break;
      
    case 'resources':
      // تحميل الموارد إذا لم تكن محملة مسبقاً
      if (document.getElementById('prayers-resources').children.length === 0) {
        loadResources();
      }
      break;
      
    case 'admin':
      // تحميل لوحة التحكم فقط إذا كانت الصفحة مطلوبة يدوياً
      loadAdminPage();
      break;
  }
}

// متغير للتحكم في طلب صفحة الملف الشخصي
let userRequestedProfile = false;

// تعديل أحداث النقر على روابط الملف الشخصي
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('profile-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    userRequestedProfile = true;
    showPage('profile');
  });
});

// Helper function to update month/year title
function updateMonthYearTitle() {
    const monthYearElement = document.getElementById('current-month-year');
    if (monthYearElement) {
        monthYearElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }
}
  
  // Calendar and Tracker Functions
  function generateCalendar(year, month) {
    if (!calendar) return;
    
    calendar.innerHTML = '';
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const currentDay = new Date().getDate();
    
    // إضافة عنوان الشهر
    const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
                      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const monthHeader = document.createElement('div');
    monthHeader.className = 'month-header';
    monthHeader.innerHTML = `
      
    `;
    calendar.appendChild(monthHeader);
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement("div");
        dayElement.className = "day";
        dayElement.setAttribute("data-day", day);
        dayElement.setAttribute("data-month", month);
        dayElement.setAttribute("data-year", year);
        dayElement.innerHTML = `
            <div class="day-number">${day}</div>
            <div class="day-label">اليوم</div>
        `;
        
        if (day === currentDay && new Date().getMonth() === month && new Date().getFullYear() === year) {
            dayElement.classList.add("current-day");
        }
        
        dayElement.addEventListener('click', () => {
    const year = parseInt(dayElement.getAttribute('data-year'));
    const month = parseInt(dayElement.getAttribute('data-month'));
    const day = parseInt(dayElement.getAttribute('data-day'));
    openTracker(year, month, day);
});
        calendar.appendChild(dayElement);
        
        updateDayStyle(dayElement, year, month, day);
    }
} 
  
  function getCurrentRamadanDay() {
    return 10; // Example day
  }
  
  async function loadBasicTasks(year, month, day) {
    const user = auth.currentUser;
    if (!user) return;

    const tasksSnapshot = await database.ref(`users/${user.uid}/basicTasks`).once('value');
    const basicTasks = tasksSnapshot.val() || {};
    
    Object.entries(basicTasks).forEach(([taskId, task]) => {
        const group = document.getElementById(`${task.section}-group`);
        if (group) {
            const taskElement = document.createElement('label');
            taskElement.className = 'checkbox-item';
            taskElement.innerHTML = `
                <span>${task.name}</span>
                <input type="checkbox" data-task="${taskId}">
            `;
            group.appendChild(taskElement);
        }
    });
}
  async function loadDayCustomTasks(day) {
    const user = auth.currentUser;
    if (!user) return;
  
    const snapshot = await database.ref(`users/${user.uid}/dayTasks/${day}`).once('value');
    const tasks = snapshot.val() || {};
    
    Object.entries(tasks).forEach(([taskId, task]) => {
        const group = document.getElementById(`${task.category}-group`);
        if (group) {
            const taskElement = document.createElement('label');
            taskElement.className = 'checkbox-item';
            taskElement.innerHTML = `
                <span>${task.name}</span>
                <input type="checkbox" data-task="${taskId}" ${task.completed ? 'checked' : ''}>
            `;
            group.appendChild(taskElement);
        }
    });
  }
  
  async function loadSavedTasks(year, month, day) {
    const user = auth.currentUser;
    if (!user) return;

    const snapshot = await database.ref(`users/${user.uid}/tracker/${year}/${month}/day${day}`).once('value');
    const dayData = snapshot.val() || {};
    
    document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
        const taskId = checkbox.getAttribute("data-task");
        checkbox.checked = dayData[taskId] || false;
    });
}
 async function loadDayCustomCategories(day) {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.warn('User not logged in');
            return;
        }
        
        const trackerContainer = document.getElementById('tracker-container');
        if (!trackerContainer || trackerContainer.style.display !== 'block') {
            console.warn("نافذة المتابعة غير مفتوحة!");
            return;
        }
        
        const container = trackerContainer.querySelector('#custom-categories-container');
        if (!container) {
            console.error("العنصر 'custom-categories-container' غير موجود في DOM!");
            return;
        }
        
        // مسح المحتوى الحالي مع الاحتفاظ بزر الإضافة فقط
        container.innerHTML = '';
        
        // تحميل الفئات من قاعدة البيانات
        const snapshot = await database.ref(`users/${user.uid}/dayCategories/${day}`).once('value');
        const categories = snapshot.val() || {};
        
        // إضافة الفئات إلى الواجهة
        Object.entries(categories).forEach(([categoryId, category]) => {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'custom-category';
            categoryElement.setAttribute('data-category-id', categoryId);
            
            categoryElement.innerHTML = `
                <div class="custom-category-header" onclick="toggleCategoryContent(this)">
                    <i class="fas ${category.icon}"></i>
                    <h4>${category.name}</h4>
                    <button class="delete-category-btn" onclick="event.stopPropagation(); deleteCustomCategory('${day}', '${categoryId}')">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
                <div class="custom-category-content" style="display:none">
                    <div class="tasks-group" id="${categoryId}-day${day}-group"></div>
                    <button class="add-task-btn" onclick="addCustomTaskToDay('${category.name.replace(/'/g, "\\'")}', '${categoryId}', ${day})">
                        <i class="fas fa-plus"></i> إضافة نشاط
                    </button>
                </div>
            `;
            
            container.appendChild(categoryElement);
            loadCategoryTasksForDay(categoryId, day);
        });
        
        // إضافة زر "إضافة فئة" إذا لم يكن موجوداً
        const addCategoryBtn = document.createElement('button');
        addCategoryBtn.className = 'add-category-btn';
        addCategoryBtn.innerHTML = '<i class="fas fa-plus-circle"></i> إضافة فئة جديدة';
        addCategoryBtn.onclick = () => showAddCategoryModal(day);
        container.appendChild(addCategoryBtn);
        
    } catch (error) {
        console.error('Error loading custom categories:', error);
        showMessage('حدث خطأ في تحميل الفئات المخصصة', 'error');
    }
}
  
  
async function openTracker(year, month, day) {
    const user = auth.currentUser;
    if (!user) {
        alert('الرجاء تسجيل الدخول لتسجيل متابعتك');
        toggleAuthModal();
        return;
    }

    // إعداد واجهة التحميل المؤقت
    trackerContent.innerHTML = `
        <div class="loading-overlay">
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <p>جاري تحميل بيانات اليوم...</p>
            </div>
        </div>
    `;

    // إظهار نافذة المتابعة فوراً
    trackerContainer.style.display = "block";
    trackerTitle.innerText = `المتابعة اليومية - اليوم ${day} - ${monthNames[month]} ${year}`;

    try {
        // تحميل البيانات المتوازي
        const [dayDataSnapshot, customTasksSnapshot, basicTasksSnapshot] = await Promise.all([
            database.ref(`users/${user.uid}/tracker/${year}/${month}/day${day}`).once('value'),
            database.ref(`users/${user.uid}/customTasks`).once('value'),
            database.ref(`users/${user.uid}/basicTasks`).once('value')
        ]);

        // تحميل القالب بعد جلب البيانات
        const template = document.getElementById("template-content");
        trackerContent.innerHTML = template.innerHTML;
        await loadDayCustomCategories(day);
        // معالجة البيانات
        const dayData = dayDataSnapshot.val() || {};
        const customTasks = customTasksSnapshot.val() || {};
        const basicTasks = basicTasksSnapshot.val() || {};

        // تحديث جميع المهام
        updateAllTasks(dayData, customTasks, basicTasks, year, month, day);

        // إعداد مستمعات الأحداث
        setupEventListeners(year, month, day);

        // تحديث التقدم والنمط
        updateDayProgressBar(year, month, day);
        updateCurrentDayStyle(year, month, day);

    } catch (error) {
        console.error('Error loading tracker data:', error);
        trackerContent.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>حدث خطأ في تحميل البيانات</p>
                <button onclick="openTracker(${year}, ${month}, ${day})" class="retry-btn">
                    <i class="fas fa-redo"></i> إعادة المحاولة
                </button>
            </div>
        `;
    }
}

// الدوال المساعدة
function updateAllTasks(dayData, customTasks, basicTasks, year, month, day) {
    // تحديث الصلوات الأساسية
    ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].forEach(prayer => {
        const checkbox = document.querySelector(`input[data-task="${prayer}"]`);
        if (checkbox) {
            checkbox.checked = dayData[prayer] || false;
            checkbox.setAttribute('data-year', year);
            checkbox.setAttribute('data-month', month);
            checkbox.setAttribute('data-day', day);
        }
    });

    // تحديث المهام الأساسية
    Object.entries(basicTasks).forEach(([taskId, task]) => {
        const checkbox = document.querySelector(`input[data-task="${taskId}"]`);
        if (checkbox) {
            checkbox.checked = dayData[taskId] || false;
            checkbox.setAttribute('data-year', year);
            checkbox.setAttribute('data-month', month);
            checkbox.setAttribute('data-day', day);
        }
    });

    // تحديث المهام المخصصة
    Object.entries(customTasks).forEach(([taskId, task]) => {
        const group = document.getElementById(`${task.section}-group`);
        if (group) {
            const existingTask = group.querySelector(`input[data-task="${taskId}"]`);
            if (!existingTask) {
                const taskElement = document.createElement('div');
                taskElement.className = 'custom-task-container';
                taskElement.innerHTML = `
                    <div class="task-content">
                        <label class="checkbox-item">
                            <span>${task.name}</span>
                            <input type="checkbox" data-task="${taskId}" 
                                   data-year="${year}" data-month="${month}" data-day="${day}">
                        </label>
                    </div>
                    <button class="delete-task-btn" onclick="removeTask(this, '${taskId}')">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;
                group.appendChild(taskElement);
            }
            const checkbox = group.querySelector(`input[data-task="${taskId}"]`);
            if (checkbox) checkbox.checked = dayData[taskId] || false;
        }
    });
}

function setupEventListeners(year, month, day) {
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.onchange = async function() {
            this.disabled = true;
            await saveTaskState(
                parseInt(this.getAttribute('data-year')),
                parseInt(this.getAttribute('data-month')), 
                parseInt(this.getAttribute('data-day')),
                this
            );
            this.disabled = false;
        };
    });
}

function updateCurrentDayStyle(year, month, day) {
    const dayElement = document.querySelector(`.day[data-day="${day}"][data-month="${month}"][data-year="${year}"]`);
    if (dayElement) updateDayStyle(dayElement, year, month, day);
}

function updateCheckboxes(dayData, customTasks) {
    // الصلوات الأساسية
    ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].forEach(prayer => {
        const checkbox = document.querySelector(`input[data-task="${prayer}"]`);
        if (checkbox) checkbox.checked = dayData[prayer] || false;
    });

    // المهام المخصصة
    Object.keys(customTasks).forEach(taskId => {
        const checkbox = document.querySelector(`input[data-task="${taskId}"]`);
        if (checkbox) checkbox.checked = dayData[taskId] || false;
    });
}
 // مثال على تعديل دالة حفظ المهمة
async function saveTaskState(year, month, day, checkbox) {
    const user = auth.currentUser;
    if (!user) return;

    const taskId = checkbox.dataset.task;
    const isChecked = checkbox.checked;

    // حفظ الحالة فوراً بدون تأخير
    await database.ref(`users/${user.uid}/tracker/${year}/${month}/day${day}/${taskId}`).set(isChecked);

    // تحديث واجهة المستخدم مباشرة
    const dayElement = document.querySelector(`.day[data-day="${day}"][data-month="${month}"][data-year="${year}"]`);
    if (dayElement) {
        updateDayStyle(dayElement, year, month, day);
    }
    updateDayProgressBar(year, month, day);
}
  
  
  
  
  
  
  async function addCustomTaskToDay(categoryName, categoryId, day) {
    const taskName = prompt(`أدخل اسم النشاط الجديد لـ ${categoryName}:`);
    if (!taskName) return;
  
    const taskId = `task_${Date.now()}`;
    const user = auth.currentUser;
    
    try {
      await database.ref(`users/${user.uid}/dayTasks/${day}/${categoryId}/${taskId}`).set({
        name: taskName,
        completed: false,
        createdAt: new Date().toISOString()
      });
  
      // إضافة المهمة إلى الواجهة
      const group = document.getElementById(`${categoryId}-day${day}-group`);
      if (group) {
        const taskElement = document.createElement('div');
        taskElement.className = 'custom-task-container';
        taskElement.innerHTML = `
          <div class="task-content">
            <label class="checkbox-item">
              <span>${taskName}</span>
              <input type="checkbox" data-task="${taskId}" data-category="${categoryId}">
            </label>
          </div>
          <button class="delete-task-btn" onclick="removeDayTask('${day}', '${categoryId}', '${taskId}')">
            <i class="fas fa-trash-alt"></i>
          </button>
        `;
        group.appendChild(taskElement);
      }
    } catch (error) {
      console.error('Error adding task:', error);
      showMessage('حدث خطأ أثناء إضافة النشاط', 'error');
    }
  }
 async function updateDayProgressBar(year, month, day) {
    const user = auth.currentUser;
    if (!user || !dayProgressBar) return;
    
    const checkboxes = document.querySelectorAll(`#tracker-container input[type="checkbox"]`);
    const totalTasks = checkboxes.length;
    
    if (totalTasks === 0) {
        dayProgressBar.style.width = '0%';
        document.querySelector('.progress-text').textContent = '0% مكتمل (لا توجد مهام)';
        return;
    }

    let completedTasks = 0;
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) completedTasks++;
    });

    const progress = Math.round((completedTasks / totalTasks) * 100);
    dayProgressBar.style.width = `${progress}%`;
    
    document.querySelector('.progress-text').textContent = 
        `${progress}% مكتمل (${completedTasks}/${totalTasks} مهام)`;
}
 async function updateDayStyle(dayElement, year, month, day) {
    const user = auth.currentUser;
    if (!user || !dayElement) return;

    // جلب بيانات اليوم
    const snapshot = await database.ref(`users/${user.uid}/tracker/${year}/${month}/day${day}`).once('value');
    const dayData = snapshot.val() || {};

    // حساب المهام الكلية والمكتملة
    const allTasks = [...['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'], ...Object.keys(dayData).filter(k => k.startsWith('custom_'))];
    const completedTasks = allTasks.filter(task => dayData[task]);
    const completionPercentage = allTasks.length > 0 ? (completedTasks.length / allTasks.length) * 100 : 0;

    // إزالة جميع classes السابقة
    dayElement.classList.remove(
        'no-progress',
        'low-progress',
        'medium-progress',
        'high-progress',
        'complete-day'
    );

    // تحديد لون البطاقة حسب نسبة الإنجاز
    if (completionPercentage === 0) {
        dayElement.classList.add('no-progress');
    } else if (completionPercentage < 30) {
        dayElement.classList.add('low-progress');
    } else if (completionPercentage < 70) {
        dayElement.classList.add('medium-progress');
    } else if (completionPercentage < 100) {
        dayElement.classList.add('high-progress');
    } else {
        dayElement.classList.add('complete-day');
    }

    // إضافة title لتوضيح النسبة عند التحويم
    dayElement.title = `إنجاز ${Math.round(completionPercentage)}% (${completedTasks.length}/${allTasks.length} مهمة)`;
}
  
  function goBack() {
    if (trackerContainer) trackerContainer.style.display = "none";
  }
  
 
  
  
  
  
  function loadDefaultResources() {
    const defaultResources = {
      prayers: {
        1: { title: "الأذكار الموسمية", url: "https://d1.islamhouse.com/data/ar/ih_books/single/ar_athkar_almushafiah.pdf" },
        2: { title: "أدعية رمضان", url: "https://ar.islamway.net/collection/4746/%D8%A3%D8%AF%D8%B9%D9%8A%D8%A9-%D8%B1%D9%85%D8%B6%D8%A7%D9%86" }
      },
      quran: {
        1: { title: "القرآن الكريم بقراءات متعددة", url: "https://quran.ksu.edu.sa/" },
        2: { title: "تلاوات للقراء المشهورين", url: "https://server.mp3quran.net/" }
      },
      lessons: {
        1: { title: "دروس رمضانية", url: "https://ar.islamway.net/lessons?month=9" },
        2: { title: "سلسلة دروس رمضان", url: "https://www.youtube.com/playlist?list=PLxI8Ct9zH7e8jQ1uFQJiV1J3T1T1Z1Z1Z" }
      }
    };
    
    displayResources(defaultResources.prayers, 'prayers-resources');
    displayResources(defaultResources.quran, 'quran-resources');
    displayResources(defaultResources.lessons, 'lessons-resources');
  }
  
  // Tab functionality for resources
  function openTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
      tab.classList.remove('active');
    });
    
    // Deactivate all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Show selected tab content
    const tabContent = document.getElementById(tabId);
    if (tabContent) tabContent.classList.add('active');
    
    // Activate selected tab button
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
      if (btn.getAttribute('onclick').includes(tabId)) {
        btn.classList.add('active');
      }
    });
  }
  
  // Authentication Functions
  async function checkAuthStatus() {
    return new Promise((resolve) => {
      auth.onAuthStateChanged(async (user) => {
        try {
          const authLink = document.getElementById('auth-link');
          const profileLink = document.getElementById('profile-link');
          const adminLink = document.getElementById('admin-link');
          const trackerLink = document.getElementById('tracker-link');
          
          if (user) {
            // 1. تحديث واجهة المستخدم للمستخدم المسجل
            if (authLink) {
              authLink.textContent = 'تسجيل الخروج';
              authLink.onclick = logout;
            }
            
            if (profileLink) profileLink.style.display = 'block';
            if (trackerLink) trackerLink.style.display = 'block';
  
            // 2. تحميل بيانات المستخدم
            const userSnapshot = await database.ref(`users/${user.uid}`).once('value');
            const userData = userSnapshot.val() || {};
  
            // 3. تحديث الصورة الرمزية
            updateUserAvatar(user, userData);
  
            // 4. التحقق من صلاحيات المشرف
            if (adminLink) {
              adminLink.style.display = userData.isAdmin ? 'block' : 'none';
            }
  
            // 5. تحميل البيانات الإضافية
            await Promise.all([
              loadCustomCategories(),
              loadUserProgress(),
              loadGlobalStats()
            ]);
  
            // 6. تحديث حالة اليوم الحالي
            updateCurrentDayStatus();
  
          } else {
            // حالة الزائر غير المسجل
            if (authLink) {
              authLink.textContent = 'تسجيل الدخول';
              authLink.onclick = toggleAuthModal;
            }
            
            if (profileLink) profileLink.style.display = 'none';
            if (adminLink) adminLink.style.display = 'none';
            if (trackerLink) trackerLink.style.display = 'none';
          }
  
          resolve();
        } catch (error) {
          console.error('Error in auth state change:', error);
          showMessage('حدث خطأ في تحميل بيانات المستخدم', 'error');
          resolve();
        }
      });
    });
  }
  let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function setupMonthNavigation() {
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const currentMonthYear = document.getElementById('current-month-year');

    if (!prevMonthBtn || !nextMonthBtn || !currentMonthYear) return;

    // تحديث عنوان الشهر والسنة
    function updateMonthYearTitle() {
        currentMonthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }

    // حدث زر الشهر السابق
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentYear, currentMonth);
        updateMonthYearTitle();
    });

    // حدث زر الشهر التالي
    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentYear, currentMonth);
        updateMonthYearTitle();
    });

    // التحميل الأولي
    updateMonthYearTitle();
}

  
  // الدوال المساعدة
  
  // ✅ دالة تحميل الفئات العامة (placeholder)
  async function loadCustomCategories() {
    const user = auth.currentUser;
    if (!user) return;
  
    try {
      const snapshot = await database.ref(`users/${user.uid}/customCategories`).once('value');
      const categories = snapshot.val() || {};
      window.console.log("Custom categories loaded:", categories);
    } catch (error) {
      window.console.error("Error loading custom categories:", error);
    }
  }
  
  
  function updateUserAvatar(user, userData) {
    const avatar = document.getElementById('profile-avatar');
    const largeAvatar = document.getElementById('profile-avatar-large');
    const avatarText = userData.username 
      ? userData.username.charAt(0).toUpperCase() 
      : user.email.charAt(0).toUpperCase();
  
    if (avatar) avatar.textContent = avatarText;
    if (largeAvatar) largeAvatar.textContent = avatarText;
  }
  
  async function updateCurrentDayStatus() {
    const currentDayElement = document.getElementById('current-day');
    if (currentDayElement) {
      const currentDay = getCurrentRamadanDay();
      currentDayElement.textContent = `اليوم ${currentDay}`;
    }
  }
  
  function toggleAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    
    if (modal.style.display === 'block') {
      modal.style.display = 'none';
    } else {
      modal.style.display = 'block';
      showLoginForm();
    }
  }
  
  function showLoginForm() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const emailField = document.getElementById('email');
    
    if (!loginForm || !registerForm) return;
    
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    
    if (emailField) emailField.focus();
  }
  
  function showRegisterForm() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const usernameField = document.getElementById('reg-username');
    
    if (!loginForm || !registerForm) return;
    
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    
    if (usernameField) usernameField.focus();
  }
  
  function closeModal() {
    const authModal = document.getElementById('auth-modal');
    const resetModal = document.getElementById('reset-modal');
    
    if (authModal) authModal.style.display = 'none';
    if (resetModal) resetModal.style.display = 'none';
  }
  
  function register() {
    const username = document.getElementById('reg-username')?.value.trim();
    const email = document.getElementById('reg-email')?.value.trim();
    const password = document.getElementById('reg-password')?.value;
    const confirmPassword = document.getElementById('reg-confirm-password')?.value;
    const message = document.getElementById('register-message');
    
    // Validation
    if (!username || !email || !password || !confirmPassword) {
      if (message) {
        message.textContent = 'الرجاء ملء جميع الحقول';
        message.className = 'message error';
      }
      return;
    }
    
    if (password !== confirmPassword) {
      if (message) {
        message.textContent = 'كلمة المرور غير متطابقة';
        message.className = 'message error';
      }
      return;
    }
    
    if (password.length < 6) {
      if (message) {
        message.textContent = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
        message.className = 'message error';
      }
      return;
    }
    
    // Create user with email and password
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        
        // Save additional user data to database
        return database.ref(`users/${user.uid}`).set({
          username: username,
          email: email,
          joinDate: new Date().toLocaleDateString('ar-EG'),
          isAdmin: false
        });
      })
      .then(() => {
        if (message) {
          message.textContent = 'تم إنشاء الحساب بنجاح!';
          message.className = 'message success';
        }
        
        setTimeout(() => {
          closeModal();
          checkAuthStatus();
          showPage('profile');
        }, 1000);
      })
      .catch((error) => {
        if (message) {
          const errorCode = error.code;
          let errorMessage = error.message;
          
          if (errorCode === 'auth/email-already-in-use') {
            errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
          } else if (errorCode === 'auth/invalid-email') {
            errorMessage = 'البريد الإلكتروني غير صالح';
          } else if (errorCode === 'auth/weak-password') {
            errorMessage = 'كلمة المرور ضعيفة';
          }
          
          message.textContent = errorMessage;
          message.className = 'message error';
        }
      });
  }
  
  function login() {
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');
    const message = document.getElementById('login-message');
    
    if (!emailField || !passwordField || !message) {
      console.error("Login form missing required fields");
      return;
    }
  
    const email = emailField.value.trim();
    const password = passwordField.value;
    
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        message.textContent = 'تم تسجيل الدخول بنجاح!';
        message.className = 'message success';
        
        setTimeout(() => {
          closeModal();
          checkAuthStatus();
          
          database.ref(`users/${userCredential.user.uid}/isAdmin`).once('value').then((snapshot) => {
            if (snapshot.exists() && snapshot.val()) {
              showPage('admin');
            } else {
              showPage('profile');
            }
          });
        }, 1000);
      })
      .catch((error) => {
        const errorCode = error.code;
        let errorMessage = error.message;
        
        if (errorCode === 'auth/user-not-found') {
          errorMessage = 'المستخدم غير موجود';
        } else if (errorCode === 'auth/wrong-password') {
          errorMessage = 'كلمة المرور غير صحيحة';
        } else if (errorCode === 'auth/invalid-email') {
          errorMessage = 'البريد الإلكتروني غير صالح';
        }
        
        message.textContent = errorMessage;
        message.className = 'message error';
      });
  }
  
  function logout() {
    auth.signOut()
      .then(() => {
        checkAuthStatus();
        showPage('home');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  }
  
  // Profile Page Functions
async function loadProfilePage(userId = null) {
  try {
    const profileUserId = userId || auth.currentUser?.uid;
    if (!profileUserId) {
      showPage('home');
      return;
    }

    // إعداد واجهة التحميل
    const loadingOverlay = document.getElementById('profile-loading-overlay');
    const progressBar = loadingOverlay.querySelector('.progress-bar');
    const loadingText = loadingOverlay.querySelector('.loading-text');
    
    loadingOverlay.style.display = 'flex';
    loadingText.textContent = 'جاري تحميل بيانات الملف...';
    progressBar.style.width = '10%';

    // تحميل بيانات المستخدم
    const userSnapshot = await database.ref(`users/${profileUserId}`).once('value');
    const userData = userSnapshot.val() || {};
    
    // التحقق من صلاحيات المشاهدة
    const currentUser = auth.currentUser;
    const isAdmin = currentUser && (await checkAdminStatus(currentUser.uid));
    
    if (!currentUser || (currentUser.uid !== profileUserId && !isAdmin)) {
      showMessage('ليس لديك صلاحيات لعرض هذا الملف الشخصي', 'error');
      showPage('home');
      return;
    }

    // تعبئة البيانات
    document.getElementById('profile-username').textContent = userData.username || userData.email;
    document.getElementById('profile-email').textContent = userData.email;
    document.getElementById('profile-join-date').textContent = userData.joinDate || 'غير معروف';
    
    // تحديث الصورة الرمزية
    const avatar = document.getElementById('profile-avatar-large');
    if (avatar) {
      avatar.textContent = (userData.username || userData.email).charAt(0).toUpperCase();
    }

    // تحميل الإحصائيات
    progressBar.style.width = '50%';
    loadingText.textContent = 'جاري حساب الإحصائيات...';
    const stats = await calculateUserStats(profileUserId);
    
    // عرض الإحصائيات
    document.getElementById('completed-days').textContent = `${stats.perfectDays} يوم`;
    document.getElementById('full-prayer-days').textContent = `${stats.fullPrayerDays} يوم`;
    document.getElementById('completion-rate').textContent = `${stats.completionRate}%`;

    // توليد التقويم
    progressBar.style.width = '90%';
    loadingText.textContent = 'جاري تحميل التقويم...';
    await generateProfileCalendar(profileUserId);

    // إخفاء شاشة التحميل
    progressBar.style.width = '100%';
    loadingText.textContent = 'تم التحميل بنجاح!';
    
    setTimeout(() => {
      loadingOverlay.style.opacity = '0';
      setTimeout(() => {
        loadingOverlay.style.display = 'none';
        loadingOverlay.style.opacity = '1';
        progressBar.style.width = '0%';
      }, 500);
    }, 1000);

  } catch (error) {
    console.error('خطأ في تحميل الصفحة:', error);
    showMessage(error.message || 'حدث خطأ في تحميل الملف الشخصي', 'error');
    showPage('home');
  }
}

async function calculateUserStats(userId) {
    try {
        const [trackerSnapshot, customTasksSnapshot] = await Promise.all([
            database.ref(`users/${userId}/tracker`).once('value'),
            database.ref(`users/${userId}/customTasks`).once('value')
        ]);

        const trackerData = trackerSnapshot.val() || {};
        const customTasks = customTasksSnapshot.val() || {};
        
        let stats = {
            perfectDays: 0,          // أيام إنجاز 100% (كل المهام)
            fullPrayerDays: 0,       // أيام صلاة كاملة
            completionRate: 0,
            totalTrackedDays: 0,
            totalTasksCompleted: 0,
            totalPossibleTasks: 0
        };

        const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
        const customTaskIds = Object.keys(customTasks);

        // حساب الإحصائيات لجميع الأشهر
        for (const year in trackerData) {
            for (const month in trackerData[year]) {
                const days = trackerData[year][month];
                
                for (const dayKey in days) {
                    const dayData = days[dayKey];
                    stats.totalTrackedDays++;
                    
                    let allTasksCompleted = true;
                    let allPrayersCompleted = true;
                    let dayTasksCompleted = 0;
                    let dayTotalTasks = prayers.length + customTaskIds.length;

                    // حساب الصلوات
                    prayers.forEach(prayer => {
                        if (dayData[prayer]) {
                            dayTasksCompleted++;
                            stats.totalTasksCompleted++;
                        } else {
                            allPrayersCompleted = false;
                            allTasksCompleted = false;
                        }
                    });

                    // حساب المهام المخصصة
                    customTaskIds.forEach(taskId => {
                        if (dayData[taskId]) {
                            dayTasksCompleted++;
                            stats.totalTasksCompleted++;
                        } else {
                            allTasksCompleted = false;
                        }
                    });

                    // تحديث الإحصائيات
                    if (allTasksCompleted) {
                        stats.perfectDays++;
                    }
                    if (allPrayersCompleted) {
                        stats.fullPrayerDays++;
                    }
                    
                    stats.totalPossibleTasks += dayTotalTasks;
                }
            }
        }

        // حساب نسبة الإنجاز الكلية
        if (stats.totalPossibleTasks > 0) {
            stats.completionRate = Math.round((stats.totalTasksCompleted / stats.totalPossibleTasks) * 100);
        }
        
        return stats;
    } catch (error) {
        console.error('Error calculating user stats:', error);
        return {
            perfectDays: 0,
            fullPrayerDays: 0,
            completionRate: 0,
            totalTrackedDays: 0,
            totalTasksCompleted: 0,
            totalPossibleTasks: 0
        };
    }
}
  
async function generateProfileCalendar(userId) {
    const calendarContainer = document.getElementById('profile-calendar');
    if (!calendarContainer) return;

    // إنشاء عناصر التحكم بالشهر والسنة
    calendarContainer.innerHTML = `
        <div class="profile-calendar-controls">
            <select id="profile-month-select" class="form-input">
                ${[...Array(12).keys()].map(m => 
                    `<option value="${m}" ${m === new Date().getMonth() ? 'selected' : ''}>
                        ${monthNames[m]}
                    </option>`
                ).join('')}
            </select>
            <select id="profile-year-select" class="form-input">
                ${[...Array(5).keys()].map(i => {
                    const year = new Date().getFullYear() - 2 + i;
                    return `<option value="${year}" ${year === new Date().getFullYear() ? 'selected' : ''}>
                        ${year}
                    </option>`;
                }).join('')}
            </select>
        </div>
        <div class="profile-calendar-grid"></div>
    `;

    // تحميل البيانات الأولية
    await loadAndDisplayProfileMonth(userId, new Date().getFullYear(), new Date().getMonth());

    // إضافة مستمعات الأحداث
    document.getElementById('profile-month-select').addEventListener('change', async () => {
        const year = parseInt(document.getElementById('profile-year-select').value);
        const month = parseInt(document.getElementById('profile-month-select').value);
        await loadAndDisplayProfileMonth(userId, year, month);
    });

    document.getElementById('profile-year-select').addEventListener('change', async () => {
        const year = parseInt(document.getElementById('profile-year-select').value);
        const month = parseInt(document.getElementById('profile-month-select').value);
        await loadAndDisplayProfileMonth(userId, year, month);
    });
}
  
  function showResetConfirm() {
    const resetModal = document.getElementById('reset-modal');
    if (resetModal) resetModal.style.display = 'block';
  }
  
  function resetUserData() {
    const user = auth.currentUser;
    if (!user) return;
    
    // Delete all user tracker data
    database.ref(`users/${user.uid}/tracker`).remove()
      .then(() => {
        closeModal();
        alert('تم إعادة تعيين بياناتك بنجاح');
        loadProfilePage();
        generateCalendar();
      })
      .catch((error) => {
        console.error("Error resetting user data:", error);
        alert('حدث خطأ أثناء إعادة تعيين البيانات');
      });
  }
  
  // Custom Tasks Functions
  async function addCustomTask(sectionName, sectionId) {
    const taskName = prompt(`أدخل اسم العبادة الجديدة لقسم ${sectionName}:`);
    if (!taskName) return;
  
    const taskId = `custom_${Date.now()}`;
    
    const group = document.getElementById(`${sectionId}-group`);
    if (!group) return;
  
    const newTask = document.createElement('div');
    newTask.className = 'custom-task-container';
    newTask.innerHTML = `
      <div class="task-content">
        <label class="checkbox-item">
          <span>${taskName}</span>
          <input type="checkbox" data-task="${taskId}">
        </label>
      </div>
      <button class="delete-task-btn" onclick="removeTask(this, '${taskId}')">
        <i class="fas fa-trash-alt"></i>
      </button>
    `;
    
    group.appendChild(newTask);
    
    const user = auth.currentUser;
    if (user) {
      await database.ref(`users/${user.uid}/customTasks/${taskId}`).set({
        name: taskName,
        section: sectionId,
        createdAt: new Date().toISOString()
      });
    }
  }
  
  
  function showAddCategoryModal(day) {
    const modal = document.getElementById('category-modal');
    if (!modal) return;
  
    // إعادة تعيين الحقول والرسائل
    document.getElementById('category-name').value = '';
    document.getElementById('category-message').style.display = 'none';
    
    // إزالة أي مستمع أحداث سابق
    const createBtn = document.getElementById('create-category-btn');
    createBtn.onclick = null; // إزالة جميع المستمعات السابقة
    
    // إضافة مستمع الأحداث الجديد
    createBtn.onclick = function() {
      createNewCategory(day);
    };
  
    modal.style.display = 'flex';
    document.getElementById('category-name').focus();
  }
  
  function closeCategoryModal() {
    const modal = document.getElementById('category-modal');
    if (modal) modal.style.display = 'none';
  }
  
  
 async function createNewCategory(day) {
    const name = document.getElementById('category-name').value.trim();
    const icon = document.getElementById('category-icon').value;
    const messageEl = document.getElementById('category-message');
    const user = auth.currentUser;
    
    if (!name) {
        showMessage('الرجاء إدخال اسم الفئة', 'error', messageEl);
        return;
    }
    
    // تعطيل الزر أثناء المعالجة لمنع النقرات المتعددة
    const createBtn = document.getElementById('create-category-btn');
    createBtn.disabled = true;
    createBtn.textContent = 'جاري الإنشاء...';
    
    try {
        const categoryId = `cat_${Date.now()}`;
        await database.ref(`users/${user.uid}/dayCategories/${day}/${categoryId}`).set({
            name,
            icon,
            createdAt: new Date().toISOString()
        });
        
        showMessage('تم إنشاء الفئة بنجاح', 'success', messageEl);
        
        // إغلاق النافذة بعد تأخير بسيط
        setTimeout(() => {
            closeCategoryModal();
        }, 1000);
        
        // إعادة تحميل الفئات
        await loadDayCustomCategories(day);
        
    } catch (error) {
        console.error('Error creating category:', error);
        showMessage('حدث خطأ أثناء إنشاء الفئة', 'error', messageEl);
    } finally {
        // إعادة تمكين الزر
        createBtn.disabled = false;
        createBtn.textContent = 'إنشاء الفئة';
    }
}
  function toggleCategoryContent(header) {
    // إيقاف انتشار الحدث لمنع التداخل مع الأزرار الأخرى
    event.stopPropagation();
    
    const content = header.nextElementSibling;
    if (content) {
      content.style.display = content.style.display === 'none' ? 'block' : 'none';
    }
  }
  
  async function loadCustomTasks(day) {
    const user = auth.currentUser;
    if (!user) return;
  
    try {
      // 1. تحميل العبادات المخصصة الأساسية
      const snapshot = await database.ref(`users/${user.uid}/customTasks`).once('value');
      const customTasks = snapshot.val() || {};
      
      Object.entries(customTasks).forEach(([taskId, task]) => {
        const group = document.getElementById(`${task.section}-group`);
        if (group) {
          const exists = group.querySelector(`input[data-task="${taskId}"]`);
          if (!exists) {
            const newTask = document.createElement('div');
            newTask.className = 'custom-task-container';
            newTask.innerHTML = `
              <div class="task-content">
                <label class="checkbox-item">
                  <span>${task.name}</span>
                  <input type="checkbox" data-task="${taskId}">
                </label>
              </div>
              <button class="delete-task-btn" onclick="removeTask(this, '${taskId}')">
                <i class="fas fa-trash-alt"></i>
              </button>
            `;
            group.appendChild(newTask);
          }
        }
      });
  
      // 2. تحميل مهام الفئات المخصصة
      const categoriesSnapshot = await database.ref(`users/${user.uid}/customCategories`).once('value');
      const categories = categoriesSnapshot.val() || {};
      
      Object.entries(categories).forEach(([categoryId, category]) => {
        const group = document.getElementById(`${categoryId}-group`);
        if (group) {
          // تحميل المهام الخاصة بهذه الفئة
          database.ref(`users/${user.uid}/categoryTasks/${categoryId}`).once('value').then((tasksSnapshot) => {
            const tasks = tasksSnapshot.val() || {};
            
            Object.entries(tasks).forEach(([taskId, task]) => {
              const exists = group.querySelector(`input[data-task="${taskId}"]`);
              if (!exists) {
                const newTask = document.createElement('div');
                newTask.className = 'custom-task-container';
                newTask.innerHTML = `
                  <div class="task-content">
                    <label class="checkbox-item">
                      <span>${task.name}</span>
                      <input type="checkbox" data-task="${taskId}">
                    </label>
                  </div>
                  <button class="delete-task-btn" onclick="removeCategoryTask('${categoryId}', '${taskId}')">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                `;
                group.appendChild(newTask);
              }
            });
          });
        }
      });
  
      // 3. تحميل حالة المهام لهذا اليوم
      const daySnapshot = await database.ref(`users/${user.uid}/tracker/day${day}`).once('value');
      const dayData = daySnapshot.val() || {};
      
      // تحديث جميع صناديق الاختيار (العبادات الأساسية والفئات المخصصة)
      document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
        const task = checkbox.getAttribute("data-task");
        checkbox.checked = dayData[task] || false;
        
        checkbox.onchange = () => {
          const updates = {};
          updates[`users/${user.uid}/tracker/day${day}/${task}`] = checkbox.checked;
          database.ref().update(updates)
            .then(() => {
              const dayElement = document.querySelector(`.day:nth-child(${day})`);
              if (dayElement) updateDayStyle(dayElement, day);
              updateDayProgressBar(day);
            });
        };
      });
      
    } catch (error) {
      console.error("حدث خطأ أثناء تحميل العبادات المخصصة:", error);
      showMessage('حدث خطأ في تحميل المهام', 'error');
    }
  }
  
  
  // دالة مساعدة لحذف مهام الفئات المخصصة
  async function removeCategoryTask(categoryId, taskId) {
    if (!confirm('هل أنت متأكد من حذف هذه العبادة؟')) return;
    
    const user = auth.currentUser;
    if (!user) return;
  
    try {
      await database.ref(`users/${user.uid}/categoryTasks/${categoryId}/${taskId}`).remove();
      
      // إزالة العنصر من الواجهة
      const checkbox = document.querySelector(`input[data-task="${taskId}"]`);
      if (checkbox) {
        checkbox.closest('.custom-task-container').remove();
      }
      
      showMessage('تم حذف العبادة بنجاح', 'success');
    } catch (error) {
      console.error("حدث خطأ أثناء حذف العبادة:", error);
      showMessage('حدث خطأ أثناء حذف العبادة', 'error');
    }
  }
  
  function removeTask(button, taskId) {
    if (!confirm('هل أنت متأكد من حذف هذه العبادة؟')) return;
    
    const taskItem = button.parentElement;
    taskItem.remove();
    
    if (taskId.startsWith('custom_')) {
      const user = auth.currentUser;
      if (user) {
        database.ref(`users/${user.uid}/customTasks/${taskId}`).remove()
          .then(() => {
            console.log("تم حذف العبادة بنجاح");
          })
          .catch((error) => {
            console.error("حدث خطأ أثناء حذف العبادة:", error);
          });
      }
    }
  }
  async function loadCategoryTasksForDay(categoryId, day) {
    const user = auth.currentUser;
    if (!user) return;
  
    try {
      const snapshot = await database.ref(`users/${user.uid}/dayTasks/${day}/${categoryId}`).once('value');
      const tasks = snapshot.val() || {};
      
      const group = document.getElementById(`${categoryId}-day${day}-group`);
      if (!group) return;
  
      group.innerHTML = ''; // مسح المهام الحالية
  
      Object.entries(tasks).forEach(([taskId, task]) => {
        const taskElement = document.createElement('div');
        taskElement.className = 'custom-task-container';
        taskElement.innerHTML = `
          <div class="task-content">
            <label class="checkbox-item">
              <span>${task.name}</span>
              <input type="checkbox" data-task="${taskId}" data-category="${categoryId}" ${task.completed ? 'checked' : ''}>
            </label>
          </div>
          <button class="delete-task-btn" onclick="removeDayTask('${day}', '${categoryId}', '${taskId}')">
            <i class="fas fa-trash-alt"></i>
          </button>
        `;
        group.appendChild(taskElement);
      });
    } catch (error) {
      console.error('Error loading tasks:', error);
      showMessage('حدث خطأ في تحميل المهام', 'error');
    }
  }
  
  async function removeDayTask(day, categoryId, taskId) {
    if (!confirm('هل أنت متأكد من حذف هذا النشاط؟')) return;
    
    const user = auth.currentUser;
    if (!user) return;
  
    try {
      // حذف المهمة من قاعدة البيانات
      await database.ref(`users/${user.uid}/dayTasks/${day}/${categoryId}/${taskId}`).remove();
      
      // إزالة العنصر من الواجهة بسلاسة
      const taskElement = document.querySelector(`input[data-task="${taskId}"]`)?.closest('.custom-task-container');
      if (taskElement) {
        taskElement.style.transition = 'all 0.3s ease';
        taskElement.style.opacity = '0';
        taskElement.style.height = '0';
        taskElement.style.margin = '0';
        taskElement.style.padding = '0';
        taskElement.style.overflow = 'hidden';
        
        setTimeout(() => {
          taskElement.remove();
        }, 300);
      }
      
      showMessage('تم حذف النشاط بنجاح', 'success');
    } catch (error) {
      console.error('Error deleting task:', error);
      showMessage('حدث خطأ أثناء حذف النشاط', 'error');
    }
  }
  
  
  
  // دالة جديدة لإنشاء فئة ليوم معين
  document.getElementById('create-category-btn').addEventListener('click', async () => {
    const nameInput = document.getElementById('category-name');
    const iconSelect = document.getElementById('category-icon');
    const message = document.getElementById('category-message');
  
    const name = nameInput.value.trim();
    const icon = iconSelect.value;
  
    if (!name) {
      message.textContent = 'يرجى إدخال اسم الفئة';
      message.className = 'message error';
      message.style.display = 'block';
      return;
    }
  
    const user = auth.currentUser;
    if (!user) {
      message.textContent = 'يجب تسجيل الدخول';
      message.className = 'message error';
      message.style.display = 'block';
      return;
    }
  
    const day = getCurrentDayFromTracker(); // تحديد اليوم الحالي من المتتبع
    const categoryId = `cat_${Date.now()}`;
  
    try {
      await database.ref(`users/${user.uid}/dayCategories/${day}/${categoryId}`).set({
        name,
        icon,
        createdAt: new Date().toISOString()
      });
  
      message.textContent = 'تم إنشاء الفئة بنجاح';
      message.className = 'message success';
      message.style.display = 'block';
  
      nameInput.value = '';
      iconSelect.value = 'fa-book';
  
      // ✅ تحميل الفئات من جديد لتظهر مباشرة
      
      await loadDayCustomCategories(day);
  
      // ✅ إغلاق النافذة
      closeCategoryModal();
  
    } catch (error) {
      console.error('Error creating category:', error);
      message.textContent = 'حدث خطأ أثناء إنشاء الفئة';
      message.className = 'message error';
      message.style.display = 'block';
    }
  });



  
  
  
  // دالة محسنة لعرض النافذة
  function showAddCategoryModal(day) {
    const modal = document.getElementById('category-modal');
    if (!modal) return;
    
    // إعادة تعيين الحقول والرسائل
    document.getElementById('category-name').value = '';
    document.getElementById('category-message').textContent = '';
    document.getElementById('category-message').className = 'message';
    document.getElementById('category-message').style.display = 'none';
    
    // إزالة أي مستمع أحداث سابق لمنع التكرار
    const createBtn = document.getElementById('create-category-btn');
    createBtn.replaceWith(createBtn.cloneNode(true)); // هذا يزيل جميع المستمعات السابقة
    
    // الحصول على الزر الجديد بعد الاستبدال
    const newCreateBtn = document.getElementById('create-category-btn');
    
    // إضافة مستمع الأحداث الجديد مرة واحدة فقط
    newCreateBtn.onclick = async () => {
        await createNewCategory(day);
    };
    
    modal.style.display = 'flex';
    document.getElementById('category-name').focus();
}
  
  // دالة محسنة لإغلاق النافذة
  function closeCategoryModal() {
    const modal = document.getElementById('category-modal');
    if (modal) modal.style.display = 'none';
  }
  
  
  
  // دالة مساعدة لعرض الرسائل
  function showMessage(text, type, element) {
    if (!element) return;
    
    element.textContent = text;
    element.className = `message ${type}`;
    element.style.display = 'block';
    
    setTimeout(() => {
      element.style.display = 'none';
    }, 3000);
  }
  async function deleteCustomCategory(day, categoryId) {
    if (!confirm("هل أنت متأكد من حذف هذه الفئة وجميع المهام المرتبطة بها؟")) return;
  
    const user = auth.currentUser;
    if (!user) return;
  
    try {
      const updates = {};
      updates[`users/${user.uid}/dayCategories/${day}/${categoryId}`] = null;
      updates[`users/${user.uid}/dayTasks/${day}/${categoryId}`] = null;
      
      await database.ref().update(updates);
  
      // إعادة تحميل الفئات بعد الحذف
      await loadDayCustomCategories(day);
  
      showMessage("تم حذف الفئة بنجاح", "success");
    } catch (error) {
      console.error("خطأ أثناء الحذف:", error);
      showMessage("حدث خطأ أثناء حذف الفئة", "error");
    }
  }
  function getCurrentDayFromTracker() {
    const trackerTitle = document.getElementById('tracker-title');
    if (trackerTitle) {
        const match = trackerTitle.textContent.match(/اليوم (\d+)/);
        if (match && match[1]) {
            return parseInt(match[1]);
        }
    }
    return new Date().getDate(); // افتراضيًا يرجع اليوم الحالي
}
  async function loadAndDisplayProfileMonth(userId, year, month) {
    try {
        const calendarGrid = document.querySelector('.profile-calendar-grid');
        if (!calendarGrid) return;

        // جلب بيانات المستخدم لهذا الشهر
        const snapshot = await database.ref(`users/${userId}/tracker/${year}/${month}`).once('value');
        const monthData = snapshot.val() || {};

        // إنشاء تقويم الملف الشخصي
        calendarGrid.innerHTML = '';
        
        // الحصول على عدد أيام الشهر
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // الحصول على يوم الأسبوع الأول من الشهر (0-6 حيث 0 هو الأحد)
        const firstDayOfWeek = new Date(year, month, 1).getDay();
        
        // إضافة أيام فارغة لبدء التقويم من اليوم الصحيح
        for (let i = 0; i < firstDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'profile-calendar-day empty';
            calendarGrid.appendChild(emptyDay);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayKey = `day${day}`;
            const dayData = monthData[dayKey] || {};
            
            // حساب نسبة الإنجاز لهذا اليوم
            const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
            const completedPrayers = prayers.filter(p => dayData[p]).length;
            const progress = (completedPrayers / prayers.length) * 100;
            
            const dayElement = document.createElement('div');
            dayElement.className = 'profile-calendar-day';
            dayElement.innerHTML = day;
            
            // تحديد حالة اليوم
            if (progress === 100) {
                dayElement.classList.add('completed');
            } else if (progress >= 50) {
                dayElement.classList.add('partial');
            } else if (progress > 0) {
                dayElement.classList.add('some-progress');
            }
            
            // إضافة عنوان يظهر عند التحويم
            dayElement.title = `اليوم ${day}: ${progress.toFixed(0)}% مكتمل`;
            
            calendarGrid.appendChild(dayElement);
        }
    } catch (error) {
        console.error('Error loading profile month:', error);
        showMessage('حدث خطأ في تحميل بيانات الشهر', 'error');
    }
}
function showInitialContent() {
  // إخفاء شاشة التحميل
  const splashScreen = document.getElementById('splash-screen');
  if (splashScreen) splashScreen.classList.add('hidden');
  
  // إظهار المحتوى الأساسي
  document.getElementById('home-page').style.display = 'block';
  
  // إظهار شريط التنقل
  const navbar = document.querySelector('.navbar');
  if (navbar) navbar.style.visibility = 'visible';
  
  // تحديث السنة في التذييل
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

function updateAfterFullLoad() {
  // تحديثات إضافية بعد اكتمال التحميل
  const currentDayElement = document.getElementById('current-day');
  if (currentDayElement) {
    currentDayElement.textContent = `اليوم ${getCurrentRamadanDay()}`;
  }
}

function showErrorState() {
  const splashScreen = document.getElementById('splash-screen');
  if (splashScreen) {
    splashScreen.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>حدث خطأ في التحميل</p>
        <button onclick="window.location.reload()">إعادة المحاولة</button>
      </div>
    `;
  }
}
// تحديث دالة showAddResourceModal لإظهار حقل المؤلف للكتب فقط
function showAddResourceModal() {
    const modal = document.getElementById('resource-modal');
    if (!modal) return;
    
    // إعادة تعيين الحقول
    document.getElementById('resource-modal-title').value = '';
    document.getElementById('resource-modal-url').value = '';
    document.getElementById('resource-modal-author').value = '';
    document.getElementById('resource-modal-message').style.display = 'none';
    
    // إضافة مستمع لتغيير نوع المورد
    document.getElementById('resource-modal-type').addEventListener('change', function() {
        const authorField = document.getElementById('author-field');
        authorField.style.display = this.value === 'books' ? 'block' : 'none';
    });
    
    modal.style.display = 'flex';
    document.getElementById('resource-modal-title').focus();
}

async function saveResource() {
    const type = document.getElementById('resource-modal-type').value;
    const title = document.getElementById('resource-modal-title').value.trim();
    const url = document.getElementById('resource-modal-url').value.trim();
    const author = type === 'books' ? document.getElementById('resource-modal-author').value.trim() : '';
    const messageEl = document.getElementById('resource-modal-message');
    
    // التحقق من الصحة
    if (!title || !url) {
        showMessage('الرجاء إدخال العنوان والرابط', 'error', messageEl);
        return;
    }
    
    if (!isValidUrl(url)) {
        showMessage('الرجاء إدخال رابط صحيح', 'error', messageEl);
        return;
    }
    
    const user = auth.currentUser;
    if (!user) {
        showMessage('يجب تسجيل الدخول', 'error', messageEl);
        return;
    }
    
    try {
      const isAdmin = await checkAdminStatus(user.uid);
        if (!isAdmin) {
            showMessage('ليس لديك صلاحيات لإضافة موارد', 'error', messageEl);
            return;
        }
        const resourceData = {
            title,
            url,
            createdAt: new Date().toISOString(),
            addedBy: user.uid
        };
        
        if (type === 'books' && author) {
            resourceData.author = author;
        }
        
        // إضافة المورد إلى قاعدة البيانات
        const newResourceRef = database.ref(`resources/${type}`).push();
        await newResourceRef.set(resourceData);
        
        showMessage('تم حفظ المورد بنجاح', 'success', messageEl);
        
        setTimeout(() => {
            closeResourceModal();
            loadResources(); // إعادة تحميل القائمة
        }, 1000);
        
    } catch (error) {
        console.error('Error saving resource:', error);
        showMessage('حدث خطأ أثناء حفظ المورد: ' + error.message, 'error', messageEl);
    }
}

// تحديث دالة loadResources لعرض الكتب
async function loadResources() {
  try {
    const user = auth.currentUser;
    if (!user) {
      loadDefaultResources();
      return;
    }

    const isAdmin = await checkAdminStatus(user.uid);
    console.log("Is user admin?", isAdmin); // Debug

    // عرض زر الإضافة للمشرفين
    const addBtnContainer = document.getElementById('add-resource-btn-container');
    if (addBtnContainer) {
      addBtnContainer.style.display = isAdmin ? 'block' : 'none';
    }

    const snapshot = await database.ref('resources').once('value');
    if (snapshot.exists()) {
      const data = snapshot.val();
      displayResources(data.prayers, 'prayers-resources', isAdmin);
      displayResources(data.quran, 'quran-resources', isAdmin);
      displayResources(data.lessons, 'lessons-resources', isAdmin);
      displayResources(data.books, 'books-resources', isAdmin);
    } else {
      loadDefaultResources();
    }
  } catch (error) {
    console.error("Error loading resources:", error);
    loadDefaultResources();
  }
}

// تحديث دالة displayResources لعرض معلومات الكتب
function displayResources(resources, elementId, showDeleteButtons = false) {
  const container = document.getElementById(elementId);
  if (!container) return;

  container.innerHTML = '';

  if (!resources) return;

  Object.entries(resources).forEach(([resourceId, resource]) => {
    if (resource && resource.url && resource.title) {
      const li = document.createElement('li');
      li.className = 'resource-item';

      // رابط المورد
      const link = document.createElement('a');
      link.href = resource.url;
      link.target = "_blank";
      link.textContent = resource.title;
      li.appendChild(link);

      // معلومات إضافية للكتب (المؤلف)
      if (resource.author) {
        const authorSpan = document.createElement('span');
        authorSpan.className = 'resource-author';
        authorSpan.textContent = ` - ${resource.author}`;
        li.appendChild(authorSpan);
      }

      // زر الحذف (للمشرفين فقط)
      if (showDeleteButtons) {
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-resource-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.onclick = (e) => {
          e.preventDefault();
          deleteResource(elementId.replace('-resources', ''), resourceId);
        };
        li.appendChild(deleteBtn);
      }

      container.appendChild(li);
    }
  });
}

// تحديث دالة loadDefaultResources لإضافة كتب افتراضية
function loadDefaultResources() {
   
  
    displayResources( 'prayers-resources');
    displayResources('quran-resources');
    displayResources( 'lessons-resources');
    displayResources( 'books-resources');
}

async function checkAdminStatus(userId) {
  try {
    const snapshot = await database.ref(`users/${userId}/isAdmin`).once('value');
    return (snapshot.val() == true);
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

function closeResourceModal() {
  const modal = document.getElementById('resource-modal');
  if (modal) modal.style.display = 'none';
}

async function deleteResource(type, resourceId) {
  if (!confirm('هل أنت متأكد من حذف هذا المورد؟')) return;
  
  try {
    await database.ref(`resources/${type}/${resourceId}`).remove();
    showMessage('تم حذف المورد بنجاح', 'success');
    loadResources(); // إعادة تحميل الموارد
  } catch (error) {
    console.error('Error deleting resource:', error);
    showMessage('حدث خطأ أثناء الحذف', 'error');
  }
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

async function loadUserProgress() {
    try {
        const filter = document.getElementById('progress-filter')?.value || 'all';
        const usersSnapshot = await database.ref('users').once('value');
        const users = usersSnapshot.val() || {};
        const container = document.getElementById('user-progress-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="progress-header">
                <span>المستخدم</span>
                <span>الأيام المكتملة</span>
                <span>الصلوات</span>
                <span>آخر نشاط</span>
                <span>التفاصيل</span>
            </div>
        `;
        
        for (const [uid, user] of Object.entries(users)) {
            if (user.isAdmin) continue;
            
            let userCompletedDays = 0;
            let userTotalPrayers = 0;
            let lastActiveDate = 'غير نشط';
            
            const trackerSnap = await database.ref(`users/${uid}/tracker`).once('value');
            const trackerData = trackerSnap.val() || {};
            
            for (const year in trackerData) {
                for (const month in trackerData[year]) {
                    const days = trackerData[year][month];
                    
                    for (const dayKey in days) {
                        const dayData = days[dayKey];
                        const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
                        
                        const dayPrayers = prayers.filter(p => dayData[p]).length;
                        userTotalPrayers += dayPrayers;
                        
                        if (prayers.every(p => dayData[p])) {
                            userCompletedDays++;
                            const activityDate = new Date(year, month, dayKey.replace('day', ''));
                            lastActiveDate = activityDate.toLocaleDateString('ar-EG');
                        }
                    }
                }
            }
            
            if (filter === 'active' && userCompletedDays === 0) continue;
            if (filter === 'inactive' && userCompletedDays > 0) continue;
            
            const progressRow = document.createElement('div');
            progressRow.className = 'progress-row';
            progressRow.innerHTML = `
                <span>${user.username || user.email}</span>
                <span>${userCompletedDays}</span>
                <span>${userTotalPrayers}</span>
                <span>${lastActiveDate}</span>
                <button onclick="viewUserDetails('${uid}')" class="details-btn">عرض</button>
            `;
            container.appendChild(progressRow);
        }
    } catch (error) {
        console.error('Error loading user progress:', error);
        showMessage('حدث خطأ في تحميل تقدم المستخدمين', 'error');
    }
}

// دالة searchUsers
async function searchUsers() {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('يجب تسجيل الدخول أولاً');
    
    const adminSnapshot = await database.ref(`users/${user.uid}/isAdmin`).once('value');
    if (!adminSnapshot.exists() || !adminSnapshot.val()) {
      throw new Error('ليس لديك صلاحيات المشرف');
    }

    const query = document.getElementById('user-search').value.toLowerCase();
    if (!query) return;
    
    const usersSnapshot = await database.ref('users').once('value');
    const users = usersSnapshot.val() || {};
    const container = document.getElementById('users-list');
    
    container.innerHTML = '';
    
    for (const [uid, userData] of Object.entries(users)) {
      if (userData.isAdmin) continue;
      
      const username = userData.username?.toLowerCase() || '';
      const email = userData.email?.toLowerCase() || '';
      
      if (username.includes(query) || email.includes(query)) {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.innerHTML = `
          <div class="user-info">
            <h4>${userData.username || userData.email}</h4>
            <p>${userData.email} - ${userData.joinDate || 'غير معروف'}</p>
          </div>
          <button onclick="viewUserDetails('${uid}')" class="primary-btn">التفاصيل</button>
        `;
        container.appendChild(userCard);
      }
    }
  } catch (error) {
    console.error('Error searching users:', error);
    showMessage(`حدث خطأ: ${error.message}`, 'error');
  }
}

// دالة loadGlobalStats
async function loadGlobalStats() {
  try {
    const usersSnapshot = await database.ref('users').once('value');
    const users = usersSnapshot.val() || {};
    
    let stats = {
      totalUsers: 0,
      activeUsers: 0,
      newUsers: 0,
      totalPrayers: 0,
      totalCompletedDays: 0,
      monthlyTrend: []
    };
    
    const currentDate = new Date();
    
    for (const [uid, user] of Object.entries(users)) {
      if (user.isAdmin) continue;
      
      stats.totalUsers++;
      
      if (user.joinDate) {
        const joinDate = new Date(user.joinDate);
        if (joinDate.getMonth() === currentDate.getMonth() && 
            joinDate.getFullYear() === currentDate.getFullYear()) {
          stats.newUsers++;
        }
      }

      const trackerSnap = await database.ref(`users/${uid}/tracker`).once('value');
      const trackerData = trackerSnap.val() || {};
      
      for (const year in trackerData) {
        for (const month in trackerData[year]) {
          const monthKey = `${year}-${month.padStart(2, '0')}`;
          let monthStats = stats.monthlyTrend.find(m => m.month === monthKey);
          
          if (!monthStats) {
            monthStats = {
              month: monthKey,
              name: new Date(year, month, 1).toLocaleString('ar-EG', {month: 'long', year: 'numeric'}),
              prayers: 0,
              completedDays: 0,
              users: 0
            };
            stats.monthlyTrend.push(monthStats);
          }
          
          const days = trackerData[year][month];
          let hasActivity = false;
          
          for (const day in days) {
            const dayData = days[day];
            const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
            const dayPrayers = prayers.filter(p => dayData[p]).length;
            
            stats.totalPrayers += dayPrayers;
            monthStats.prayers += dayPrayers;
            
            if (dayPrayers > 0) hasActivity = true;
            if (prayers.every(p => dayData[p])) {
              stats.totalCompletedDays++;
              monthStats.completedDays++;
            }
          }
          
          if (hasActivity) {
            monthStats.users++;
            stats.activeUsers++;
          }
        }
      }
    }
    
    stats.monthlyTrend.sort((a, b) => b.month.localeCompare(a.month));
    const recentMonths = stats.monthlyTrend.slice(0, 6);
    
    const globalStats = document.getElementById('global-stats');
    if (globalStats) {
      globalStats.innerHTML = `
        <div class="stat-card">
          <h4>إجمالي المستخدمين</h4>
          <p>${stats.totalUsers}</p>
        </div>
        <div class="stat-card">
          <h4>المستخدمون النشطون</h4>
          <p>${stats.activeUsers}</p>
        </div>
        <div class="stat-card">
          <h4>المستخدمون الجدد</h4>
          <p>${stats.newUsers}</p>
        </div>
        <div class="stat-card">
          <h4>إجمالي الأيام المكتملة</h4>
          <p>${stats.totalCompletedDays}</p>
        </div>
        <div class="stat-card">
          <h4>إجمالي الصلوات</h4>
          <p>${stats.totalPrayers}</p>
        </div>
        <div class="stat-card chart-container">
          <h4>اتجاه النشاط</h4>
          <div class="stats-chart">
            ${recentMonths.map(m => `
              <div class="chart-bar" style="height: ${Math.min(100, (m.users / stats.totalUsers) * 200)}%">
                <span>${m.name}</span>
                <small>${m.users} مستخدم</small>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error loading global stats:', error);
    showMessage('حدث خطأ في تحميل الإحصائيات العامة', 'error');
  }
}

// اجعل الدوال متاحة عالمياً
window.searchUsers = searchUsers;
window.loadGlobalStats = loadGlobalStats;


// جعل الدالة متاحة عالمياً
  window.loadUserProgress = loadUserProgress;
  window.showPage = showPage;
  window.toggleAuthModal = toggleAuthModal;
  window.showLoginForm = showLoginForm;
  window.showRegisterForm = showRegisterForm;
  window.closeModal = closeModal;
  window.register = register;
  window.login = login;
  window.logout = logout;
  window.goBack = goBack;
  window.showResetConfirm = showResetConfirm;
  window.resetUserData = resetUserData;
  window.addCustomTask = addCustomTask;
  window.removeTask = removeTask;
  window.openTab = openTab;
  window.loadDayCustomCategories = loadDayCustomCategories;
  window.addCustomTaskToDay = addCustomTaskToDay;
  window.showAddCategoryModal = showAddCategoryModal;
  window.createNewCategory = createNewCategory;
  window.closeCategoryModal = closeCategoryModal;
  window.toggleCategoryContent = toggleCategoryContent;
  window.deleteCustomCategory = deleteCustomCategory;
  window.getCurrentDayFromTracker = getCurrentDayFromTracker;
