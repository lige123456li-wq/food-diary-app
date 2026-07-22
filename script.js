const STORAGE_KEY = "cuteFoodDiaryEntries";
const MIGRATION_KEY = "cuteFoodDiaryMigratedToSupabase";
const SUPABASE_URL = "https://hsjddyyjxvyhbszihwnp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzamRkeXlqeHZ5aGJzemlod25wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NTgxMTYsImV4cCI6MjEwMDEzNDExNn0.gT1ygLFTqyln7Jb1xkGK8dNSNf7OrkDZJ-RNEhYSmn0";

const mealOrder = ["早餐", "午餐", "晚餐", "加餐"];
const mealLabel = { 早餐: "早餐", 午餐: "午餐", 晚餐: "晚餐", 加餐: "加餐" };
const calorieDatabase = [
  ["番茄鸡蛋饭", ["番茄鸡蛋饭"], 130, { 份: 430, 碗: 330 }],
  ["燕麦酸奶", ["燕麦酸奶"], 120, { 碗: 220, 杯: 220, 份: 220 }],
  ["鸡胸肉", ["鸡胸肉", "鸡肉"], 165, { 份: 150, 个: 80 }],
  ["米饭", ["米饭", "白饭", "饭"], 116, { 碗: 150, 份: 220 }],
  ["面条", ["面条", "拉面", "拌面"], 137, { 碗: 280, 份: 300 }],
  ["馒头", ["馒头"], 223, { 个: 100, 份: 100 }],
  ["包子", ["包子"], 230, { 个: 90, 份: 180 }],
  ["饺子", ["饺子"], 220, { 个: 25, 份: 200 }],
  ["蛋糕", ["蛋糕"], 350, { 块: 100, 份: 100 }],
  ["鸡蛋", ["鸡蛋", "煎蛋", "水煮蛋"], 143, { 个: 55, 份: 55 }],
  ["牛奶", ["牛奶"], 54, { 杯: 250, 份: 250 }],
  ["酸奶", ["酸奶"], 72, { 杯: 200, 碗: 220, 份: 200 }],
  ["豆浆", ["豆浆"], 33, { 杯: 300, 份: 300 }],
  ["拿铁", ["拿铁"], 55, { 杯: 250, 份: 250 }],
  ["咖啡", ["咖啡"], 2, { 杯: 250, 份: 250 }],
  ["奶茶", ["奶茶"], 55, { 杯: 500, 份: 500 }],
  ["可乐", ["可乐"], 42, { 杯: 330, 份: 330 }],
  ["面包", ["面包", "吐司"], 265, { 个: 70, 片: 35, 份: 70 }],
  ["牛肉", ["牛肉"], 250, { 份: 150 }],
  ["猪肉", ["猪肉", "五花肉"], 395, { 份: 150 }],
  ["鱼肉", ["鱼肉", "鱼"], 120, { 份: 180 }],
  ["虾", ["虾"], 99, { 个: 20, 份: 150 }],
  ["豆腐", ["豆腐"], 81, { 块: 150, 份: 200 }],
  ["西兰花", ["西兰花"], 34, { 份: 180 }],
  ["青菜", ["青菜", "蔬菜", "生菜"], 22, { 份: 180, 碗: 150 }],
  ["番茄", ["番茄", "西红柿"], 18, { 个: 180, 份: 180 }],
  ["黄瓜", ["黄瓜"], 16, { 根: 180, 份: 180 }],
  ["土豆", ["土豆", "马铃薯"], 77, { 个: 170, 份: 200 }],
  ["红薯", ["红薯", "地瓜"], 86, { 个: 200, 份: 200 }],
  ["苹果", ["苹果"], 52, { 个: 180, 份: 180 }],
  ["香蕉", ["香蕉"], 89, { 根: 120, 份: 120 }],
  ["草莓", ["草莓"], 32, { 个: 18, 份: 150 }],
  ["橙子", ["橙子", "桔子"], 47, { 个: 150, 份: 150 }],
  ["粥", ["粥"], 46, { 碗: 300, 份: 300 }],
  ["汤", ["汤"], 35, { 碗: 300, 份: 300 }],
].map(([name, keywords, kcalPer100, units]) => ({ name, keywords, kcalPer100, units }));
const defaultUnitWeights = { 份: 200, 个: 100, 碗: 250, 杯: 250, 克: 1, 毫升: 1, 片: 35, 块: 100, 根: 180 };

let entries = [];
let activeMeal = "早餐";
let calendarCursor = startOfMonth(new Date());
let selectedDate = toDateInputValue(new Date());
let statsMode = "week";
let latestCalorieEstimate = null;
let caloriesTouched = false;
let lastAutoCalories = "";
let photoDataUrl = "";

const dom = {
  todayLabel: document.querySelector("#todayLabel"), dailySummary: document.querySelector("#dailySummary"), dailyHint: document.querySelector("#dailyHint"),
  todayMealGroups: document.querySelector("#todayMealGroups"), entryForm: document.querySelector("#entryForm"), foodName: document.querySelector("#foodName"),
  amount: document.querySelector("#amount"), calories: document.querySelector("#calories"), calorieEstimateText: document.querySelector("#calorieEstimateText"),
  applyCalorieEstimate: document.querySelector("#applyCalorieEstimate"), unit: document.querySelector("#unit"), date: document.querySelector("#date"),
  time: document.querySelector("#time"), tag: document.querySelector("#tag"), note: document.querySelector("#note"), mealPhoto: document.querySelector("#mealPhoto"),
  photoPreview: document.querySelector("#photoPreview"), photoPreviewImage: document.querySelector("#photoPreviewImage"), clearPhoto: document.querySelector("#clearPhoto"),
  mealChips: document.querySelector("#mealChips"), tabs: document.querySelectorAll(".tab"), views: document.querySelectorAll(".view"),
  openAddFromToday: document.querySelector("#openAddFromToday"), toast: document.querySelector("#toast"), calendarTitle: document.querySelector("#calendarTitle"),
  calendarGrid: document.querySelector("#calendarGrid"), prevMonth: document.querySelector("#prevMonth"), nextMonth: document.querySelector("#nextMonth"),
  selectedDateTitle: document.querySelector("#selectedDateTitle"), selectedDayList: document.querySelector("#selectedDayList"), statsButtons: document.querySelectorAll(".pill"),
  statDays: document.querySelector("#statDays"), statEntries: document.querySelector("#statEntries"), statCalories: document.querySelector("#statCalories"),
  statTopFood: document.querySelector("#statTopFood"), chartTitle: document.querySelector("#chartTitle"), rangeLabel: document.querySelector("#rangeLabel"),
  barChart: document.querySelector("#barChart"), topFoodsList: document.querySelector("#topFoodsList"), seedDemoButton: document.querySelector("#seedDemoButton"),
};

initialize();

async function initialize() {
  const now = new Date();
  dom.todayLabel.textContent = formatLongDate(now);
  dom.date.value = toDateInputValue(now);
  dom.time.value = toTimeInputValue(now);
  bindEvents();
  entries = loadLocalBackup();
  renderAll();
  updateCalorieEstimate();
  showToast("正在同步云端记录...");
  await migrateLocalEntriesOnce();
  await loadEntriesFromCloud();
}

function bindEvents() {
  dom.tabs.forEach((tab) => tab.addEventListener("click", () => switchView(tab.dataset.view)));
  dom.openAddFromToday.addEventListener("click", () => switchView("add"));
  dom.entryForm.addEventListener("submit", saveEntry);
  dom.mealChips.addEventListener("click", selectMeal);
  dom.prevMonth.addEventListener("click", () => moveMonth(-1));
  dom.nextMonth.addEventListener("click", () => moveMonth(1));
  dom.seedDemoButton.addEventListener("click", addDemoEntries);
  dom.applyCalorieEstimate.addEventListener("click", applyCalorieEstimate);
  dom.mealPhoto.addEventListener("change", handlePhotoSelect);
  dom.clearPhoto.addEventListener("click", clearPhoto);
  [dom.foodName, dom.amount].forEach((input) => input.addEventListener("input", updateCalorieEstimate));
  dom.unit.addEventListener("change", updateCalorieEstimate);
  dom.calories.addEventListener("input", () => { caloriesTouched = dom.calories.value !== ""; });
  dom.statsButtons.forEach((button) => button.addEventListener("click", () => {
    statsMode = button.dataset.mode;
    dom.statsButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderStats();
  }));
}

async function supabaseFetch(path, options = {}) {
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      ...(options.body && !(options.body instanceof Blob) ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    let detail = await response.text();
    try { detail = JSON.parse(detail).message || detail; } catch {}
    throw new Error(detail || `HTTP ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

async function loadEntriesFromCloud() {
  try {
    const data = await supabaseFetch("/rest/v1/food_entries?select=*&order=entry_date.desc,entry_time.desc");
    const localPending = loadLocalBackup().filter((entry) => entry.cloudPending);
    entries = [...localPending, ...data.map(fromCloudEntry)];
    saveLocalBackup(entries);
    showToast(localPending.length ? "云端已同步，仍有本地待同步记录" : "云端记录已同步");
  } catch (error) {
    console.error(error);
    entries = loadLocalBackup();
    showToast(`云端读取失败：${friendlyError(error)}`);
  }
  renderAll();
}

async function migrateLocalEntriesOnce() {
  if (localStorage.getItem(MIGRATION_KEY)) return;
  const localEntries = loadLocalBackup();
  if (!localEntries.length) {
    localStorage.setItem(MIGRATION_KEY, "done");
    return;
  }
  try {
    for (const entry of localEntries) {
      if (entry.cloudPending === false) continue;
      const photoUrl = entry.photo?.startsWith("data:image/") ? await uploadPhoto(entry.photo) : entry.photo || "";
      await insertCloudEntry({ ...entry, photo: photoUrl });
    }
    localStorage.setItem(MIGRATION_KEY, "done");
    showToast("本地旧记录已迁移到云端");
  } catch (error) {
    console.error(error);
    showToast(`旧记录迁移失败：${friendlyError(error)}`);
  }
}

function switchView(name) {
  dom.views.forEach((view) => view.classList.toggle("active", view.id === `view-${name}`));
  dom.tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.view === name));
  if (name === "calendar") renderCalendar();
  if (name === "stats") renderStats();
}

function selectMeal(event) {
  const button = event.target.closest(".chip");
  if (button) setActiveMeal(button.dataset.value);
}

async function saveEntry(event) {
  event.preventDefault();
  const entry = {
    foodName: dom.foodName.value.trim(), amount: Number(dom.amount.value), calories: dom.calories.value ? Number(dom.calories.value) : null,
    unit: dom.unit.value, meal: activeMeal, date: dom.date.value, time: dom.time.value, tag: dom.tag.value, note: dom.note.value.trim(),
    photo: "", createdAt: new Date().toISOString(),
  };
  if (!entry.foodName || !entry.amount || !entry.date || !entry.time) {
    showToast("还有信息没填完整");
    return;
  }
  const submitButton = dom.entryForm.querySelector("button[type='submit']");
  try {
    submitButton.disabled = true;
    showToast("正在保存到云端...");
    entry.photo = photoDataUrl ? await uploadPhoto(photoDataUrl) : "";
    const savedEntry = await insertCloudEntry(entry);
    entries.unshift(savedEntry);
    saveLocalBackup(entries);
    resetFormAfterSave(entry.date);
    renderAll();
    showToast("已保存到云端");
    switchView("today");
  } catch (error) {
    console.error(error);
    const localEntry = { ...entry, id: `local-${Date.now()}`, photo: photoDataUrl || entry.photo, cloudPending: true };
    entries.unshift(localEntry);
    saveLocalBackup(entries);
    resetFormAfterSave(entry.date);
    renderAll();
    switchView("today");
    showToast(`云端失败，已先保存在本机：${friendlyError(error)}`);
  } finally {
    submitButton.disabled = false;
  }
}

async function insertCloudEntry(entry) {
  const data = await supabaseFetch("/rest/v1/food_entries", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(toCloudEntry(entry)),
  });
  return fromCloudEntry(data[0]);
}

async function deleteEntry(id) {
  const entry = entries.find((item) => item.id === id);
  if (entry?.cloudPending) {
    entries = entries.filter((item) => item.id !== id);
    saveLocalBackup(entries);
    renderAll();
    showToast("已经删除本机待同步记录");
    return;
  }
  try {
    await supabaseFetch(`/rest/v1/food_entries?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
    if (entry?.photo) await deletePhoto(entry.photo);
    entries = entries.filter((item) => item.id !== id);
    saveLocalBackup(entries);
    renderAll();
    showToast("已经从云端删除这条记录");
  } catch (error) {
    console.error(error);
    showToast(`云端删除失败：${friendlyError(error)}`);
  }
}

async function uploadPhoto(dataUrl) {
  const blob = await fetch(dataUrl).then((response) => response.blob());
  const filePath = `meals/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
  await supabaseFetch(`/storage/v1/object/meal-photos/${filePath}`, {
    method: "POST",
    headers: { "Content-Type": "image/jpeg", "x-upsert": "false" },
    body: blob,
  });
  return `${SUPABASE_URL}/storage/v1/object/public/meal-photos/${filePath}`;
}

async function deletePhoto(photoUrl) {
  const marker = "/storage/v1/object/public/meal-photos/";
  const index = photoUrl.indexOf(marker);
  if (index === -1) return;
  const path = decodeURIComponent(photoUrl.slice(index + marker.length));
  try {
    await supabaseFetch("/storage/v1/object/meal-photos", {
      method: "DELETE",
      body: JSON.stringify({ prefixes: [path] }),
    });
  } catch (error) {
    console.warn("Photo delete failed", error);
  }
}

async function handlePhotoSelect(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    showToast("请选择图片文件");
    clearPhoto();
    return;
  }
  try {
    photoDataUrl = await resizeImage(file, 900, 0.78);
    dom.photoPreviewImage.src = photoDataUrl;
    dom.photoPreview.hidden = false;
    showToast("照片已添加");
  } catch {
    showToast("照片读取失败，换一张试试");
    clearPhoto();
  }
}

function clearPhoto() {
  photoDataUrl = "";
  dom.mealPhoto.value = "";
  dom.photoPreviewImage.removeAttribute("src");
  dom.photoPreview.hidden = true;
}

function resizeImage(file, maxSize, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const image = new Image();
      image.onerror = reject;
      image.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function resetFormAfterSave(dateValue) {
  dom.entryForm.reset();
  dom.date.value = dateValue;
  dom.time.value = toTimeInputValue(new Date());
  setActiveMeal("早餐");
  clearPhoto();
  caloriesTouched = false;
  lastAutoCalories = "";
  updateCalorieEstimate();
}

function renderAll() { renderToday(); renderCalendar(); renderStats(); }

function renderToday() {
  const today = toDateInputValue(new Date());
  const todayEntries = sortEntries(entries.filter((entry) => entry.date === today));
  dom.dailySummary.textContent = todayEntries.length ? `今天记录了 ${todayEntries.length} 样食物` : "今天还没有记录吃了什么";
  dom.dailyHint.textContent = todayEntries.length ? "一点点记录下来，月底回看会很有意思。" : "按下面的按钮，把第一餐记下来。";
  dom.todayMealGroups.innerHTML = renderMealGroups(todayEntries);
  bindDeleteButtons(dom.todayMealGroups);
}

function renderCalendar() {
  const year = calendarCursor.getFullYear();
  const month = calendarCursor.getMonth();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  dom.calendarTitle.textContent = `${year}年${month + 1}月`;
  for (let i = 0; i < firstWeekday; i += 1) cells.push(`<button class="calendar-day muted" type="button" disabled></button>`);
  for (let day = 1; day <= daysInMonth; day += 1) {
    const dateValue = toDateInputValue(new Date(year, month, day));
    const hasEntry = entries.some((entry) => entry.date === dateValue);
    const classes = ["calendar-day", hasEntry ? "has-entry" : "", selectedDate === dateValue ? "selected" : ""].join(" ");
    cells.push(`<button class="${classes}" data-date="${dateValue}" type="button">${day}</button>`);
  }
  dom.calendarGrid.innerHTML = cells.join("");
  dom.calendarGrid.querySelectorAll("[data-date]").forEach((button) => button.addEventListener("click", () => { selectedDate = button.dataset.date; renderCalendar(); }));
  renderSelectedDay();
}

function renderSelectedDay() {
  const dayEntries = sortEntries(entries.filter((entry) => entry.date === selectedDate));
  dom.selectedDateTitle.textContent = `${formatLongDate(parseDate(selectedDate))} 的记录`;
  dom.selectedDayList.innerHTML = dayEntries.length ? renderMealGroups(dayEntries) : `<p class="empty">这天还没有记录，留给下一顿饭吧。</p>`;
  bindDeleteButtons(dom.selectedDayList);
}

function renderStats() {
  const range = statsMode === "week" ? getWeekRange(new Date()) : getMonthRange(new Date());
  const filtered = entries.filter((entry) => entry.date >= range.start && entry.date <= range.end);
  const topFoods = getTopFoods(filtered);
  const totalCalories = filtered.reduce((sum, entry) => sum + (Number(entry.calories) || 0), 0);
  dom.statDays.textContent = new Set(filtered.map((entry) => entry.date)).size;
  dom.statEntries.textContent = filtered.length;
  dom.statCalories.textContent = totalCalories ? `${totalCalories}` : "未填";
  dom.statTopFood.textContent = topFoods[0]?.name || "暂无";
  dom.chartTitle.textContent = statsMode === "week" ? "一周记录" : "本月记录";
  dom.rangeLabel.textContent = `${range.start.slice(5)} - ${range.end.slice(5)}`;
  renderBarChart(range, filtered);
  renderTopFoods(topFoods);
}

function renderBarChart(range, filtered) {
  const days = eachDay(range.start, range.end);
  const maxCount = Math.max(1, ...days.map((day) => filtered.filter((entry) => entry.date === day).length));
  dom.barChart.innerHTML = days.map((day) => {
    const count = filtered.filter((entry) => entry.date === day).length;
    const percent = Math.max(4, Math.round((count / maxCount) * 100));
    return `<div class="bar-item"><span class="chart-label">${day.slice(5)}</span><div class="bar-track"><div class="bar-fill" style="width: ${percent}%"></div></div><strong>${count}</strong></div>`;
  }).join("");
}

function renderTopFoods(topFoods) {
  dom.topFoodsList.innerHTML = topFoods.length ? topFoods.slice(0, 8).map((food, index) => `<div class="top-food-row"><strong>${index + 1}. ${escapeHtml(food.name)}</strong><span>${food.count} 次</span></div>`).join("") : `<p class="empty">多记几餐，这里就会出现你的常吃榜。</p>`;
}

function renderMealGroups(list) {
  if (!list.length) return `<p class="empty">还没有记录。</p>`;
  return mealOrder.map((meal) => {
    const group = list.filter((entry) => entry.meal === meal);
    if (!group.length) return "";
    return `<article class="meal-card"><div class="meal-title"><span>${mealLabel[meal]}</span><span>${group.length} 条</span></div>${group.map(renderEntry).join("")}</article>`;
  }).join("");
}

function renderEntry(entry) {
  const detail = [`${entry.amount}${entry.unit}`, entry.calories ? `${entry.calories} kcal` : "", entry.time, entry.tag ? `#${entry.tag}` : "", entry.note, entry.cloudPending ? "待同步" : ""].filter(Boolean).join(" | ");
  const photo = entry.photo ? `<img class="entry-photo" src="${entry.photo}" alt="${escapeHtml(entry.foodName)}照片" loading="lazy" />` : "";
  return `<div class="entry-row"><div class="entry-main">${photo}<div><div class="entry-name">${escapeHtml(entry.foodName)}</div><p class="entry-meta">${escapeHtml(detail)}</p></div></div><button class="delete-button" data-delete="${entry.id}" title="删除" type="button">x</button></div>`;
}

function updateCalorieEstimate() {
  latestCalorieEstimate = estimateCalories(dom.foodName.value, Number(dom.amount.value), dom.unit.value);
  if (!latestCalorieEstimate) {
    dom.calorieEstimateText.textContent = "输入常见食物和数量后，我会自动估算热量。也可以手动填写。";
    dom.applyCalorieEstimate.disabled = true;
    return;
  }
  const { calories, foodName, grams, kcalPer100 } = latestCalorieEstimate;
  dom.calorieEstimateText.textContent = `估算：${calories} kcal。按「${foodName}」约 ${kcalPer100} kcal/100g，折算约 ${Math.round(grams)}g。`;
  dom.applyCalorieEstimate.disabled = false;
  const currentCalories = Number(dom.calories.value);
  if (!caloriesTouched || dom.calories.value === "" || currentCalories === Number(lastAutoCalories)) {
    dom.calories.value = calories;
    lastAutoCalories = String(calories);
    caloriesTouched = false;
  }
}

function applyCalorieEstimate() {
  if (!latestCalorieEstimate) return;
  dom.calories.value = latestCalorieEstimate.calories;
  lastAutoCalories = String(latestCalorieEstimate.calories);
  caloriesTouched = false;
  showToast("已填入估算热量");
}

function estimateCalories(foodName, amount, unit) {
  const name = foodName.trim().toLowerCase();
  if (!name || !amount || amount <= 0) return null;
  const matchedFood = calorieDatabase.find((food) => food.keywords.some((keyword) => name.includes(keyword.toLowerCase())));
  if (!matchedFood) return null;
  const gramsPerUnit = matchedFood.units[unit] || defaultUnitWeights[unit];
  if (!gramsPerUnit) return null;
  const grams = amount * gramsPerUnit;
  return { calories: Math.max(1, Math.round((grams * matchedFood.kcalPer100) / 100)), foodName: matchedFood.name, grams, kcalPer100: matchedFood.kcalPer100 };
}

function bindDeleteButtons(container) {
  container.querySelectorAll("[data-delete]").forEach((button) => button.addEventListener("click", () => deleteEntry(button.dataset.delete)));
}

async function addDemoEntries() {
  const today = toDateInputValue(new Date());
  const demo = [["燕麦酸奶", 1, "碗", "早餐", "08:20", "健康"], ["拿铁", 1, "杯", "早餐", "09:30", ""], ["番茄鸡蛋饭", 1, "份", "午餐", "12:35", "清淡"], ["草莓", 8, "个", "加餐", "16:10", "甜"], ["蔬菜汤", 1, "碗", "晚餐", "19:00", "清淡"]];
  try {
    showToast("正在添加云端示例记录...");
    for (const [foodName, amount, unit, meal, time, tag] of demo) await insertCloudEntry({ foodName, amount, unit, meal, date: today, time, tag, note: "", photo: "", calories: estimateCalories(foodName, amount, unit)?.calories || null });
    await loadEntriesFromCloud();
    showToast("已添加一组今天的示例记录");
  } catch (error) {
    console.error(error);
    showToast(`示例记录添加失败：${friendlyError(error)}`);
  }
}

function setActiveMeal(meal) {
  activeMeal = meal;
  dom.mealChips.querySelectorAll(".chip").forEach((chip) => chip.classList.toggle("active", chip.dataset.value === meal));
}

function moveMonth(offset) {
  calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() + offset, 1);
  selectedDate = toDateInputValue(calendarCursor);
  renderCalendar();
}

function toCloudEntry(entry) {
  return { food_name: entry.foodName, amount: entry.amount, unit: entry.unit, calories: entry.calories, meal: entry.meal, entry_date: entry.date, entry_time: entry.time, tag: entry.tag || null, note: entry.note || null, photo_url: entry.photo?.startsWith("data:image/") ? null : entry.photo || null };
}
function fromCloudEntry(row) {
  return { id: row.id, foodName: row.food_name, amount: Number(row.amount), calories: row.calories == null ? null : Number(row.calories), unit: row.unit, meal: row.meal, date: row.entry_date, time: String(row.entry_time).slice(0, 5), tag: row.tag || "", note: row.note || "", photo: row.photo_url || "", createdAt: row.created_at, cloudPending: false };
}
function loadLocalBackup() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } }
function saveLocalBackup(list) { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }
function showToast(message) { dom.toast.textContent = message; dom.toast.classList.add("show"); window.setTimeout(() => dom.toast.classList.remove("show"), 3200); }
function friendlyError(error) { return error?.message?.includes("Failed to fetch") ? "网络连不上 Supabase" : error?.message || "未知错误"; }
function sortEntries(list) { return [...list].sort((a, b) => a.time.localeCompare(b.time)); }
function getTopFoods(list) {
  const counts = list.reduce((result, entry) => { const key = entry.foodName.trim(); result[key] = (result[key] || 0) + 1; return result; }, {});
  return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "zh-CN"));
}
function getWeekRange(date) { const start = new Date(date); const weekday = (start.getDay() + 6) % 7; start.setDate(start.getDate() - weekday); const end = new Date(start); end.setDate(start.getDate() + 6); return { start: toDateInputValue(start), end: toDateInputValue(end) }; }
function getMonthRange(date) { return { start: toDateInputValue(new Date(date.getFullYear(), date.getMonth(), 1)), end: toDateInputValue(new Date(date.getFullYear(), date.getMonth() + 1, 0)) }; }
function eachDay(startValue, endValue) { const days = []; const cursor = parseDate(startValue); const end = parseDate(endValue); while (cursor <= end) { days.push(toDateInputValue(cursor)); cursor.setDate(cursor.getDate() + 1); } return days; }
function startOfMonth(date) { return new Date(date.getFullYear(), date.getMonth(), 1); }
function parseDate(value) { const [year, month, day] = value.split("-").map(Number); return new Date(year, month - 1, day); }
function toDateInputValue(date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
function toTimeInputValue(date) { return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`; }
function formatLongDate(date) { return new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "long" }).format(date); }
function escapeHtml(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }