let showPreviousWeek = false;

function getWeekRange(isPreviousWeek) {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const startOfThisWeek = new Date(now);
  startOfThisWeek.setDate(now.getDate()-dayOfWeek);
  startOfThisWeek.setHours(0,0,0,0)
}