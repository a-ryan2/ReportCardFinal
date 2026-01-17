import React, { useEffect, useState, useRef } from 'react';
import {
  fetchClasses,
  fetchSections,
  fetchStudents,
  fetchAttendance,
  saveAttendance,
  fetchHolidays,
  fetchClassAdminByUserId
} from './Api';
import Dropdown from './Dropdown';
import './style.css';

export default function Attendance() {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [holidays, setHolidays] = useState({});
  const [currentStart, setCurrentStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay());
    return d;
  });
  const [loading, setLoading] = useState(false);
  const [studentSummary, setStudentSummary] = useState({});
  const [assignedClasses, setAssignedClasses] = useState([]);

  const scrollRef = useRef(0);
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
  const role = currentUser.role?.name ? currentUser.role.name.toUpperCase() : '';

  useEffect(() => {
    fetchClasses().then(setClasses);
    fetchSections().then(setSections);

    if (role === 'ADMIN') {
      fetchClassAdminByUserId(currentUser.id).then(data => {
        setAssignedClasses(
          data.map(a => ({ classId: a.classEntity.id, sectionId: a.section.id }))
        );
      });
    }
  }, [role, currentUser.id]);

  // 🧠 FIXED: load only holidays that belong to selected class
  useEffect(() => {
    if (!currentStart || !classId) return;

    const startISO = currentStart.toISOString().slice(0, 10);
    const end = new Date(currentStart);
    end.setDate(end.getDate() + 6);
    const endISO = end.toISOString().slice(0, 10);

    fetchHolidays(startISO, endISO).then((data) => {
      const map = {};

      data.forEach((h) => {
        // ✅ Skip holidays that don't include the selected class
        if (h.classes && h.classes.length > 0) {
          const appliesToClass = h.classes.some(c => c.id === parseInt(classId));
          if (!appliesToClass) return; // skip if this class isn't part of it
        }

        if (h.date) {
          map[h.date] = h.description;
        } else if (h.fromDate && h.toDate) {
          const start = new Date(h.fromDate);
          const end = new Date(h.toDate);
          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            map[d.toISOString().slice(0, 10)] = h.description;
          }
        }
      });

      setHolidays(map);
    });
  }, [currentStart, classId]);

  useEffect(() => {
    if (classId && sectionId) {
      setLoading(true);
      fetchStudents(classId, sectionId)
        .then(setStudents)
        .finally(() => setLoading(false));
      fetchWeekAttendance();
    } else {
      setStudents([]);
    }
  }, [classId, sectionId, currentStart]);

  useEffect(() => {
    window.scrollTo(0, scrollRef.current);
  }, [students]);

  async function fetchWeekAttendance() {
    const startISO = currentStart.toISOString().slice(0, 10);
    const end = new Date(currentStart);
    end.setDate(end.getDate() + 6);
    const endISO = end.toISOString().slice(0, 10);
    const data = await fetchAttendance(startISO, endISO, classId, sectionId);
    const map = {};
    data.forEach((a) => (map[`${a.student.id}_${a.date}`] = a.status || 'PRESENT'));
    setAttendance(map);
  }

  const editable = (() => {
    if (role === 'MASTER ADMIN') return true;
    if (role === 'ADMIN') {
      const canEdit = assignedClasses.some(
        a => a.classId === parseInt(classId) && a.sectionId === parseInt(sectionId)
      );
      return canEdit;
    }
    return false;
  })();

  function toggleAttendance(studentId, date) {
    if (!editable) return;
    const key = `${studentId}_${date}`;
    const current = attendance[key] || 'PRESENT';
    const next =
      current === 'PRESENT'
        ? 'ABSENT'
        : current === 'ABSENT'
        ? 'HALF_DAY'
        : 'PRESENT';
    setAttendance({ ...attendance, [key]: next });
  }

  async function save() {
    if (!editable) {
      alert('You do not have permission to update attendance for this class/section.');
      return;
    }

    const promises = Object.entries(attendance).map(([key, status]) => {
      const [studentId, date] = key.split('_');
      return saveAttendance({ student: { id: parseInt(studentId) }, date, status });
    });
    await Promise.all(promises);
    alert('Attendance saved!');
  }

  function handleDateSelect(e) {
    const selectedDate = new Date(e.target.value);
    selectedDate.setDate(selectedDate.getDate() - selectedDate.getDay());
    scrollRef.current = window.scrollY;
    setCurrentStart(selectedDate);
  }

  function changeWeek(offset) {
    const newStart = new Date(currentStart);
    newStart.setDate(newStart.getDate() + offset * 7);
    scrollRef.current = window.scrollY;
    setCurrentStart(newStart);
  }

  function getWeekDates() {
    const arr = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentStart);
      d.setDate(d.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      arr.push({
        date: `${yyyy}-${mm}-${dd}`,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayIndex: d.getDay()
      });
    }
    return arr;
  }

  async function calculateAttendanceSummary(studentId) {
    const studentData = studentSummary[studentId];
    if (!studentData || !studentData.startDate || !studentData.endDate) return;

    const start = new Date(studentData.startDate);
    const end = new Date(studentData.endDate);

    const allDates = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      allDates.push(new Date(d));
    }

    const sundaysSet = new Set(
      allDates.filter(d => d.getDay() === 0).map(d => d.toISOString().slice(0, 10))
    );

    const startISO = studentData.startDate;
    const endISO = studentData.endDate;
    const holidayRecords = await fetchHolidays(startISO, endISO);
    const holidaysSet = new Set(holidayRecords.map(h => h.date));

    const totalWorking = allDates.filter(d => {
      const iso = d.toISOString().slice(0, 10);
      return !sundaysSet.has(iso) && !holidaysSet.has(iso);
    }).length;

    const records = await fetchAttendance(startISO, endISO, classId, sectionId);
    const studentRecords = records.filter(r => r.student.id === studentId);
    const totalAbsent = studentRecords.filter(r => r.status === 'ABSENT').length;
    const totalHalfDays = studentRecords.filter(r => r.status === 'HALF_DAY').length;

    const totalPresent = totalWorking - totalAbsent - 0.5 * totalHalfDays;
    const percentage = totalWorking ? ((totalPresent / totalWorking) * 100).toFixed(2) : 0;

    setStudentSummary(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        summary: { totalPresent, totalWorking, totalAbsent, totalHalfDays, percentage }
      }
    }));
  }

  const dates = getWeekDates();

  return (
    <>
      <nav className="navbar">My School App</nav>
      <div className="container">
        <h2>Attendance</h2>
        <Dropdown label="Class" options={classes} value={classId} onChange={setClassId} />
        <Dropdown label="Section" options={sections} value={sectionId} onChange={setSectionId} />

        <div className="week-navigation">
          <button type="button" onClick={() => changeWeek(-1)}>Previous Week</button>
          <div title="Select a date to jump to that week">
          <input type="date" onChange={handleDateSelect}
          style={{ marginLeft: '10px',  width: '140px', padding: '2px 5px', fontSize: '0.9rem' }}/>
          </div>
          <span className="date-range">{dates[0].date} to {dates[6].date}</span>
          <button type="button" onClick={() => changeWeek(1)}>Next Week</button>
        </div>

        {loading ? (
          <p>Loading students and attendance...</p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  {dates.map((d) => (
                    <th key={d.date}>
                      {d.dayName}
                      <br />
                      {d.date}
                    </th>
                  ))}
                  <th>From Date</th>
                  <th>To Date</th>
                  <th>Summary</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((s) => {
                    const studentData = studentSummary[s.id] || {};
                    return (
                      <tr key={s.id}>
                        <td>{s.firstName + ' ' + s.lastName}</td>
                        {dates.map((d) => {
                          const key = `${s.id}_${d.date}`;
                          const holidayDesc = holidays[d.date];
                          const isSunday = d.dayIndex === 0;
                          const isHoliday = Boolean(holidayDesc);
                          const status = attendance[key] || 'PRESENT';
                          let display = '', className = '';

                          if (isSunday) {
                            display = 'Sunday';
                            className = 'sunday';
                          } else if (isHoliday) {
                            display = holidayDesc;
                            className = 'holiday';
                          } else {
                            display = status;
                            className = status.toLowerCase();
                          }

                          return (
                            <td
                              key={key}
                              className={className}
                              onClick={
                                !isHoliday && !isSunday && editable
                                  ? () => toggleAttendance(s.id, d.date)
                                  : undefined
                              }
                              title={isHoliday ? holidayDesc : ''}
                            >
                              {display}
                            </td>
                          );
                        })}
                        <td>
                          <input
                            type="date"
                            value={studentData.startDate || ''}
                            disabled={!editable}
                            onChange={(e) =>
                              setStudentSummary((prev) => ({
                                ...prev,
                                [s.id]: { ...prev[s.id], startDate: e.target.value },
                              }))
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            value={studentData.endDate || ''}
                            disabled={!editable}
                            onChange={(e) =>
                              setStudentSummary((prev) => ({
                                ...prev,
                                [s.id]: { ...prev[s.id], endDate: e.target.value },
                              }))
                            }
                          />
                        </td>
                        <td>
                          <button disabled={!editable} onClick={() => calculateAttendanceSummary(s.id)}>
                            Summary
                          </button>
                          {studentData.summary && (
                            <div>
                              <div>Present: {studentData.summary.totalPresent}</div>
                              <div>Total: {studentData.summary.totalWorking}</div>
                              <div>Attendance: {studentData.summary.percentage}%</div>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={dates.length + 3}>No students to display</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <button onClick={save} disabled={!editable} className="save-button">
          Save Attendance
        </button>
      </div>
      <footer className="footer">© 2025 My School App</footer>
    </>
  );
}
