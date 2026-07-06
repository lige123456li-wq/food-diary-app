const STORAGE_KEY = "cuteFoodDiaryEntries";
const mealOrder = ["早餐", "午餐", "晚餐", "加餐"];
const mealLabel = { 早餐: "早餐", 午餐: "午餐", 晚餐: "晚餐", 加餐: "加餐" };

const calorieDatabase = [
  { name: "番茄鸡蛋饭", keywords: ["番茄鸡蛋饭"], kcalPer100: 130, units: { 份: 430, 碗: 330 } },
  { name: "燕麦酸奶", keywords: ["燕麦酸奶"], kcalPer100: 120, units: { 碗: 220, 杯: 220, 份: 220 } },
  { name: "鸡胸肉", keywords: ["鸡胸肉", "鸡肉"], kcalPer100: 165, units: { 份: 150, 个: 80 } },
  { name: "米饭", keywords: ["米饭", "白饭", "饭"], kcalPer100: 116, units: { 碗: 150, 份: 220 } },
  { name: "面条", keywords: ["面条", "拉面", "拌面"], kcalPer100: 137, units: { 碗: 280, 份: 300 } },
  { name: "馒头", keywords: ["馒头"], kcalPer100: 223, units: { 个: 100, 份: 100 } },
  { name: "包子", keywords: ["包子"], kcalPer100: 230, units: { 个: 90, 份: 180 } },
  { name: "饺子", keywords: ["饺子"], kcalPer100: 220, units: { 个: 25, 份: 200 } },
  { name: "蛋糕", keywords: ["蛋糕"], kcalPer100: 350, units: { 块: 100, 份: 100 } },
  { name: "鸡蛋", keywords: ["鸡蛋", "煎蛋", "水煮蛋"], kcalPer100: 143, units: { 个: 55, 份: 55 } },
  { name: "牛奶", keywords: ["牛奶"], kcalPer100: 54, units: { 杯: 250, 份: 250 } },
  { name: "酸奶", keywords: ["酸奶"], kcalPer100: 72, units: { 杯: 200, 碗: 220, 份: 200 } },
  { name: "豆浆", keywords: ["豆浆"], kcalPer100: 33, units: { 杯: 300, 份: 300 } },
  { name: "拿铁", keywords: ["拿铁"], kcalPer100: 55, units: { 杯: 250, 份: 250 } },
  { name: "咖啡", keywords: ["咖啡"], kcalPer100: 2, units: { 杯: 250, 份: 250 } },
  { name: "奶茶", keywords: ["奶茶"], kcalPer100: 55, units: { 杯: 500, 份: 500 } },
  { name: "可乐", keywords: ["可乐"], kcalPer100: 42, units: { 杯: 330, 份: 330 } },
  { name: "面包", keywords: ["面包", "吐司"], kcalPer100: 265, units: { 个: 70, 片: 35, 份: 70 } },
  { name: "牛肉", keywords: ["牛肉"], kcalPer100: 250, units: { 份: 150 } },
  { name: "猪肉", keywords: ["猪肉", "五花肉"], kcalPer100: 395, units: { 份: 150 } },
  { name: "鱼肉", keywords: ["鱼肉", "鱼"], kcalPer100: 120, units: { 份: 180 } },
  { name: "虾", keywords: ["虾"], kcalPer100: 99, units: { 个: 20, 份: 150 } },
  { name: "豆腐", keywords: ["豆腐"], kcalPer100: 81, units: { 块: 150, 份: 200 } },
  { name: "西兰花", keywords: ["西兰花"], kcalPer100: 34, units: { 份: 180 } },
  { name: "青菜", keywords: ["青菜", "蔬菜", "生菜"], kcalPer100: 22, units: { 份: 180, 碗: 150 } },
  { name: "番茄", keywords: ["番茄", "西红柿"], kcalPer100: 18, units: { 个: 180, 份: 180 } },
  { name: "黄瓜", keywords: ["黄瓜"], kcalPer100: 16, units: { 根: 180, 份: 180 } },
  { name: "土豆", keywords: ["土豆", "马铃薯"], kcalPer100: 77, units: { 个: 170, 份: 200 } },
  { name: "红薯", keywords: ["红薯", "地瓜"], kcalPer100: 86, units: { 个: 200, 份: 200 } },
  { name: "苹果", keywords: ["苹果"], kcalPer100: 52, units: { 个: 180, 份: 180 } },
  { name: "香蕉", keywords: ["香蕉"], kcalPer100: 89, units: { 根: 120, 份: 120 } },
  { name: "草莓", keywords: ["草莓"], kcalPer100: 32, units: { 个: 18, 份: 150 } },
  { name: "橙子", keywords: ["橙子", "桔子"], kcalPer100: 47, units: { 个: 150, 份: 150 } },
  { name: "粥", keywords: ["粥"], kcalPer100: 46, units: { 碗: 300, 份: 300 } },
  { name: "汤", keywords: ["汤"], kcalPer100: 35, units: { 碗: 300, 份: 300 } },
];

const defaultUnitWeights = { 份: 200, 个: 100, 碗: 250, 杯: 250, 克: 1, 毫升: 1, 片: 35, 块: 100, 根: 180 };
let entries = loadEntries();
let activeMeal = "早餐";
let calendarCursor = startOfMonth(new Date());
let selectedDate = toDateInputValue(new Date());
let statsMode = "week";
let latestCalorieEstimate = null;
let caloriesTouched = false;
let lastAutoCalories = "";

const dom = {
  todayLabel: document.querySelector("#todayLabel"),
  dailySummary: document.querySelector("#dailySummary"),
  dailyHint: document.querySelector("#dailyHint"),
  todayMealGroups: document.querySelector("#todayMealGroups"),
  entryForm: document.querySelector("#entryForm"),
  foodName: document.querySelector("#foodName"),
  amount: document.querySelector("#amount"),
  calories: document.querySelector("#calories"),
  calorieEstimateText: document.querySelector("#calorieEstimateText"),
  applyCalorieEstimate: document.querySelector("#applyCalorieEstimate"),
  unit: document.querySelector("#unit"),
  date: document.querySelector("#date"),
  time: document.querySelector("#time"),
  tag: document.querySelector("#tag"),
  note: document.querySelector("#note"),
  mealChips: document.querySelector("#mealChips"),
  tabs: document.querySelectorAll(".tab"),
  views: document.querySelectorAll(".view"),
  openAddFromToday: document.querySelector("#openAddFromToday"),
  toast: document.querySelector("#toast"),
  calendarTitle: document.querySelector("#calendarTitle"),
  calendarGrid: document.querySelector("#calendarGrid"),
  prevMonth: document.querySelector("#prevMonth"),
  nextMonth: document.querySelector("#nextMonth"),
  selectedDateTitle: document.querySelector("#selectedDateTitle"),
  selectedDayList: document.querySelector("#selectedDayList"),
  statsButtons: document.querySelectorAll(".pill"),
  statDays: document.querySelector("#statDays"),
  statEntries: document.querySelector("#statEntries"),
  statCalories: document.querySelector("#statCalories"),
  statTopFood: document.querySelector("#statTopFood"),
  chartTitle: document.querySelector("#chartTitle"),
  rangeLabel: document.querySelector("#rangeLabel"),
  barChart: document.querySelector("#barChart"),
  topFoodsList: document.querySelector("#topFoodsList"),
  seedDemoButton: document.querySelector("#seedDemoButton"),
};

initialize();

function initialize() {
  const now = new Date();
  dom.todayLabel.textContent = formatLongDate(now);
  dom.date.value = toDateInputValue(now);
  dom.time.value = toTimeInputValue(now);
  dom.tabs.forEach((tab) => tab.addEventListener("click", () => switchView(tab.dataset.view)));
  dom.openAddFromToday.addEventListener("click", () => switchView("add"));
  dom.entryForm.addEventListener("submit", saveEntry);
  dom.mealChips.addEventListener("click", selectMeal);
  dom.prevMonth.addEventListener("click", () => moveMonth(-1));
  dom.nextMonth.addEventListener("click", () => moveMonth(1));
  dom.seedDemoButton.addEventListener("click", addDemoEntries);
  dom.applyCalorieEstimate.addEventListener("click", applyCalorieEstimate);
  [dom.foodName, dom.amount].forEach((input) => input.addEventListener("input", updateCalorieEstimate));
  dom.unit.addEventListener("change", updateCalorieEstimate);
  dom.calories.addEventListener("input", () => { caloriesTouched = dom.calories.value !== ""; });
  dom.statsButtons.forEach((button) => {
    button.addEventListener("click", () => {
      statsMode = button.dataset.mode;
      dom.statsButtons.forEach((item) => item.classList.toggle("active", item === button));
      renderStats();
    });
  });
  renderAll();
  updateCalorieEstimate();
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

function saveEntry(event) {
  event.preventDefault();
  const entry = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    foodName: dom.foodName.value.trim(),
    amount: Number(dom.amount.value),
    calories: dom.calories.value ? Number(dom.calories.value) : null,
    unit: dom.unit.value,
    meal: activeMeal,
    date: dom.date.value,
    time: dom.time.value,
    tag: dom.tag.value,
    note: dom.note.value.trim(),
    createdAt: new Date().toISOString(),
  };
  if (!entry.foodName || !entry.amount || !entry.date || !entry.time) {
    showToast("还有信息没填完整");
    return;
  }
  entries.unshift(entry);
  persistEntries();
  dom.entryForm.reset();
  dom.date.value = entry.date;
  dom.time.value = toTimeInputValue(new Date());
  setActiveMeal("早餐");
  caloriesTouched = false;
  lastAutoCalories = "";
  updateCalorieEstimate();
  renderAll();
  showToast("记好了，今天也认真吃饭了");
  switchView("today");
}

function deleteEntry(id) {
  entries = entries.filter((entry) => entry.id !== id);
  persistEntries();
  renderAll();
  showToast("已经删除这条记录");
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
  const firstDay = new Date(year, month, 1);
  const firstWeekday = (firstDay.getDay() + 6) % 7;
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
  dom.calendarGrid.querySelectorAll("[data-date]").forEach((button) => {
    button.addEventListener("click", () => { selectedDate = button.dataset.date; renderCalendar(); });
  });
  renderSelectedDay();
}

function renderSelectedDay() {
  const date = parseDate(selectedDate);
  const dayEntries = sortEntries(entries.filter((entry) => entry.date === selectedDate));
  dom.selectedDateTitle.textContent = `${formatLongDate(date)} 的记录`;
  dom.selectedDayList.innerHTML = dayEntries.length ? renderMealGroups(dayEntries) : `<p class="empty">这天还没有记录，留给下一顿饭吧。</p>`;
  bindDeleteButtons(dom.selectedDayList);
}

function renderStats() {
  const now = new Date();
  const range = statsMode === "week" ? getWeekRange(now) : getMonthRange(now);
  const filtered = entries.filter((entry) => entry.date >= range.start && entry.date <= range.end);
  const activeDays = new Set(filtered.map((entry) => entry.date));
  const topFoods = getTopFoods(filtered);
  const totalCalories = filtered.reduce((sum, entry) => sum + (Number(entry.calories) || 0), 0);
  dom.statDays.textContent = activeDays.size;
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
  const detail = [`${entry.amount}${entry.unit}`, entry.calories ? `${entry.calories} kcal` : "", entry.time, entry.tag ? `#${entry.tag}` : "", entry.note].filter(Boolean).join(" | ");
  return `<div class="entry-row"><div><div class="entry-name">${escapeHtml(entry.foodName)}</div><p class="entry-meta">${escapeHtml(detail)}</p></div><button class="delete-button" data-delete="${entry.id}" title="删除" type="button">x</button></div>`;
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
  const shouldAutoFill = !caloriesTouched || dom.calories.value === "" || currentCalories === Number(lastAutoCalories);
  if (shouldAutoFill) {
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
  const calories = Math.max(1, Math.round((grams * matchedFood.kcalPer100) / 100));
  return { calories, foodName: matchedFood.name, grams, kcalPer100: matchedFood.kcalPer100 };
}

function bindDeleteButtons(container) {
  container.querySelectorAll("[data-delete]").forEach((button) => button.addEventListener("click", () => deleteEntry(button.dataset.delete)));
}

function addDemoEntries() {
  const today = toDateInputValue(new Date());
  const demo = [
    ["燕麦酸奶", 1, "碗", "早餐", "08:20", "健康"],
    ["拿铁", 1, "杯", "早餐", "09:30", ""],
    ["番茄鸡蛋饭", 1, "份", "午餐", "12:35", "清淡"],
    ["草莓", 8, "个", "加餐", "16:10", "甜"],
    ["蔬菜汤", 1, "碗", "晚餐", "19:00", "清淡"],
  ].map(([foodName, amount, unit, meal, time, tag], index) => ({
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${foodName}`,
    foodName,
    amount,
    calories: [260, 120, 560, 40, 180][index],
    unit,
    meal,
    date: today,
    time,
    tag,
    note: "",
    createdAt: new Date().toISOString(),
  }));
  entries = [...demo, ...entries];
  persistEntries();
  renderAll();
  showToast("已添加一组今天的示例记录");
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

function loadEntries() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}
function persistEntries() { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); }
function showToast(message) { dom.toast.textContent = message; dom.toast.classList.add("show"); window.setTimeout(() => dom.toast.classList.remove("show"), 1800); }
function sortEntries(list) { return [...list].sort((a, b) => a.time.localeCompare(b.time)); }
function getTopFoods(list) {
  const counts = list.reduce((result, entry) => { const key = entry.foodName.trim(); result[key] = (result[key] || 0) + 1; return result; }, {});
  return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "zh-CN"));
}
function getWeekRange(date) {
  const start = new Date(date);
  const weekday = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - weekday);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start: toDateInputValue(start), end: toDateInputValue(end) };
}
function getMonthRange(date) { return { start: toDateInputValue(new Date(date.getFullYear(), date.getMonth(), 1)), end: toDateInputValue(new Date(date.getFullYear(), date.getMonth() + 1, 0)) }; }
function eachDay(startValue, endValue) {
  const days = [];
  const cursor = parseDate(startValue);
  const end = parseDate(endValue);
  while (cursor <= end) { days.push(toDateInputValue(cursor)); cursor.setDate(cursor.getDate() + 1); }
  return days;
}
function startOfMonth(date) { return new Date(date.getFullYear(), date.getMonth(), 1); }
function parseDate(value) { const [year, month, day] = value.split("-").map(Number); return new Date(year, month - 1, day); }
function toDateInputValue(date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
function toTimeInputValue(date) { return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`; }
function formatLongDate(date) { return new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "long" }).format(date); }
function escapeHtml(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
