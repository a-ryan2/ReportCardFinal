import React, { useState } from 'react';
import Login from './Login';
import Attendance from './Attendance';
import Marks from './Marks';
import CoScholasticGrades from './CoScholasticGrades'; // New component
import Students from './Student';
import ClassesSections from './ClassesSections';
import Holidays from './Holidays';
import ReportCard from './ReportCard';
import Users from './Users'
import ClassAdmin from './ClassAdmin'

import './style.css';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('attendance');

  if (!loggedIn) {
    return (
      <Login
        onLogin={(user) => {
          setUser(user);
          setLoggedIn(true);
        }}
      />
    );
  }

  return (
    <div>
      <nav style={{ marginBottom: 20 }}>
        <button onClick={() => setTab('attendance')}>Attendance</button>
        <button onClick={() => setTab('marks')}>Marks</button>
        <button onClick={() => setTab('coScholastic')}>Co-Scholastic</button> {/* New tab */}
        <button onClick={() => setTab('students')}>Students</button>
        <button onClick={() => setTab('classes')}>Classes & Sections</button>
        <button onClick={() => setTab('holidays')}>Holidays</button>
        <button onClick={() => setTab('reportCard')}>Report Card</button>
        <button onClick={() => setTab('users')}>Users</button>
        <button onClick={() => setTab('classAdmin')}>ClassAdmin</button>
        <button style={{ float: 'right' }} onClick={() => setLoggedIn(false)}>Logout</button>
      </nav>

      {tab === 'attendance' && <Attendance />}
      {tab === 'marks' && <Marks />}
      {tab === 'coScholastic' && <CoScholasticGrades />} {/* Render Co-Scholastic component */}
      {tab === 'students' && <Students />}
      {tab === 'classes' && <ClassesSections />}
      {tab === 'holidays' && <Holidays />}
      {tab === 'reportCard' && <ReportCard />}
      {tab == 'users' && <Users />}
      {tab == 'classAdmin' && <ClassAdmin />}
    </div>
  );
}
