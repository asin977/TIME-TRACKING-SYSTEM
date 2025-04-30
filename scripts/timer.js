
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const resetBtn = document.getElementById('reset');
const startEl = document.getElementById('startTime');
const endEl = document.getElementById('endTime');
const elapsedEl = document.getElementById('elapsedTime');
const recordsList = document.getElementById('recordsList');

let startTime;
let endTime;
let timerId;
let elapsedSeconds = 0;
let resumeIndex = null;

function startTimer(date) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

function timeFormatting(sec) {
    const hours = String(Math.floor(sec / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const seconds = String(sec % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

function saveRecord(start, end, startDate, endDate, elapsed, index = null) {
    const records = JSON.parse(localStorage.getItem("timerRecords") || '[]');

    if (index !== null) {
        if (!records[index].sessions) {
            records[index].sessions = [{
                start: records[index].start,
                end: records[index].end,
                startDate: records[index].startDate,
                endDate: records[index].endDate,
                elapsed: records[index].elapsed
            }];
            delete records[index].start;
            delete records[index].end;
            delete records[index].startDate;
            delete records[index].endDate;
            delete records[index].elapsed;
        }
        records[index].sessions.push({ start, end, startDate, endDate, elapsed });
    } else {
        const record = { sessions: [{ start, end, startDate, endDate, elapsed }] };
        records.push(record);
    }

    localStorage.setItem("timerRecords", JSON.stringify(records));
    recordTimerList();
}

function deleteRecord(index) {
    const records = JSON.parse(localStorage.getItem("timerRecords") || '[]');
    records.splice(index, 1);
    localStorage.setItem("timerRecords", JSON.stringify(records));
    recordTimerList();
}

function recordTimerList() {
    let records = JSON.parse(localStorage.getItem("timerRecords") || "[]");
    recordsList.innerHTML = '';

    if (records.length === 0) {
        recordsList.innerHTML = '<p>No timer records yet.</p>';
        return;
    }

    records = records.map(record => {
        if (!record.sessions) {
            return {
                sessions: [{
                    start: record.start,
                    end: record.end,
                    startDate: record.startDate,
                    endDate: record.endDate,
                    elapsed: record.elapsed
                }]
            };
        }
        return record;
    });

    localStorage.setItem('timerRecords', JSON.stringify(records));

    records.forEach((record, index) => {
        let totalSeconds = 0;
        let sessionHtml = '';

        record.sessions.forEach((session, idx) => {
            const [h, m, s] = session.elapsed.split(':').map(Number);
            totalSeconds += h * 3600 + m * 60 + s;

            sessionHtml += `
                <div class="session">
                    <strong class="one">Session ${idx + 1}</strong><br>
                    Start: ${session.start} (${session.startDate})<br>
                    End: ${session.end} (${session.endDate})<br>
                    Duration: ${session.elapsed}<br><br>
                </div>
            `;
        });

        const totalDuration = timeFormatting(totalSeconds);

        recordsList.innerHTML += `
            <div class="record">
                <div class="head"><strong class="strong">📓 TIMER ${index + 1}</strong></div>
                ${sessionHtml}
                <div><strong>Total Duration: ${totalDuration}</strong></div>
                <button class="clear" onclick="deleteRecord(${index})">Delete</button>
                <button class="dashboard" onclick="goToDashboard()">⬅️ Dashboard</button>
            </div>
        `;
    });
}

function resumeTimer(index) {
    const records = JSON.parse(localStorage.getItem('timerRecords') || '[]');
    const record = records[index];
    const lastSession = record.sessions[record.sessions.length - 1];

    const [endHour, endMinute, endSecond] = lastSession.end.split(':').map(Number);
    const now = new Date();
    startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, endMinute, endSecond);

    const [h, m, s] = lastSession.elapsed.split(':').map(Number);
    elapsedSeconds = h * 3600 + m * 60 + s;

    resumeIndex = index;

    startEl.textContent = lastSession.start;
    endEl.textContent = '--:--:--';
    elapsedEl.textContent = timeFormatting(elapsedSeconds);

    startBtn.disabled = true;
    stopBtn.disabled = false;
    resetBtn.disabled = false;

    clearInterval(timerId);
    timerId = setInterval(() => {
        elapsedSeconds++;
        elapsedEl.textContent = timeFormatting(elapsedSeconds);
    }, 1000);
}

startBtn.addEventListener("click", () => {
    startTime = new Date();
    elapsedSeconds = 0;
    resumeIndex = null;

    startEl.textContent = startTimer(startTime);
    endEl.textContent = '--:--:--';
    elapsedEl.textContent = timeFormatting(0);

    startBtn.disabled = true;
    stopBtn.disabled = false;
    resetBtn.disabled = false;

    clearInterval(timerId);
    timerId = setInterval(() => {
        elapsedSeconds++;
        elapsedEl.textContent = timeFormatting(elapsedSeconds);
    }, 1000);
});

stopBtn.addEventListener("click", () => {
    endTime = new Date();
    clearInterval(timerId);
    endEl.textContent = startTimer(endTime);

    stopBtn.disabled = true;
    startBtn.disabled = false;

    const formattedElapsed = timeFormatting(elapsedSeconds);
    const formattedStart = startTimer(startTime);
    const formattedEnd = startTimer(endTime);
    const formattedStartDate = new Date(startTime).toLocaleDateString();
    const formattedEndDate = new Date(endTime).toLocaleDateString();

    if (resumeIndex !== null) {
        saveRecord(
            formattedStart,
            formattedEnd,
            formattedStartDate,
            formattedEndDate,
            formattedElapsed,
            resumeIndex
        );
    } else {
        saveRecord(
            formattedStart,
            formattedEnd,
            formattedStartDate,
            formattedEndDate,
            formattedElapsed
        );
    }

    resumeIndex = null;
});

function clearAllRecords() {
    if (confirm("Are you sure you want to delete all timer records?")) {
        localStorage.removeItem("timerRecords");
        recordTimerList();
    }
}

resetBtn.addEventListener('click', () => {
    clearInterval(timerId);

    startEl.textContent = '--:--:--';
    endEl.textContent = '--:--:--';
    elapsedEl.textContent = '00:00:00';

    startBtn.disabled = false;
    stopBtn.disabled = true;
    resetBtn.disabled = true;
    resumeIndex = null;
});

function goToDashboard() {
    window.location.href = 'track.html';
}

recordTimerList();

document.getElementById('clearAll').addEventListener('click', () => {
    clearAllRecords();
});
