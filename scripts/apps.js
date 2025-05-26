let showPreviousWeek = false;

function getWeekRange(isPreviousWeek) {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const startOfThisWeek = new Date(now);
  startOfThisWeek.setDate(now.getDate()-dayOfWeek);
  startOfThisWeek.setHours(0,0,0,0)

  if (isPreviousWeek) {
    const startOfPrevWeek = new Date(startOfThisWeek);
    startOfPrevWeek.setDate(startOfThisWeek.getDate()-7);
    const endOfPrevWeek = new Date(startOfThisWeek);
    endOfPrevWeek.setMilliseconds(-1);
    return {start:startOfThisWeek,end:endOfPrevWeek};
    }
}

function renderWeeklyBarGraph(isPreviousWeek = false) {
  const {start,end} = getWeekRange(isPreviousWeek);

  const weekData = {Mon:0,Tue:0,Wed:0,Thu:0,Fri:0,Sat:0,Sun:0},
  const dayMap = ["Sun","Mon","Tue","Wed","Thur","Fri","Sat"];


  taskList.forEach(task=> {
    if (!task.startDate || !task.totalDuration) return;

    const taskDate = new Date(task.startDate);
    if (taskDate >= start && taskDate <= end) {
      const dayIndex = taskDate.getDay();
      const hours = parseDurationToHours(task.totalDuration);
      if (!isNaN(hours)) {
        weekData[dayMap[dayIndex]] += hours;
      }
    }
  });
  const durations = Object.values(weekData);
  const maxDuration = Math.max(...durations,1);

  const yAxisLabels = document.getElementById("yAxisLabels");
  const barsContainer = document.getElementById("barsContainer");
  const xAxisLabels = document.getElementById("xAxislabels");

  if (!yAxisLabels || !barsContainer || !xAxisLabels)
    return;
  yAxisLabels.innerHTML = "";
  barsContainer.innerHTML = "";
  xAxisLabels.innerHTML = "";

  const yFragment = document.createDocumentFragment();
  for (let i=5;i >= 0;i--) {
    const label = document.createElement("div");
    label.textContent = `${}`
  }
}