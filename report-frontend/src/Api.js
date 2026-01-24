import axios from 'axios';

const API_BASE = "http://localhost:8080/api";

/* -------------------- AUTH -------------------- */
export async function login(username, password) {
  try {
    const res = await axios.post(`${API_BASE}/auth/login`, { username, password });
    const data = res.data;
    debugger;
    if (data) {
      // Save user details in local storage
      localStorage.setItem("currentUser", JSON.stringify({
        username: data.username,
        role: typeof data.role === "string" ? data.role : data.role?.name, // <--- FIX
        id: data.id
      }));
    }

    return data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Invalid username or password");
    } else {
      throw new Error("Server unreachable. Please try again later.");
    }
  }
}


/* -------------------- CLASSES -------------------- */
export async function fetchClasses() {
  try {
    const res = await axios.get(`${API_BASE}/classes`);
    return res.data;
  } catch (error) {
    console.error("Error fetching classes:", error);
    throw error;
  }
}

export async function saveClass(cls) {
  try {
    const res = await axios.post(`${API_BASE}/classes`, cls);
    return res.data;
  } catch (error) {
    console.error("Error saving class:", error);
    throw error;
  }
}

export async function deleteClass(id) {
  try {
    await axios.delete(`${API_BASE}/classes/${id}`);
  } catch (error) {
    console.error("Error deleting class:", error);
    throw error;
  }
}

/* -------------------- SECTIONS -------------------- */
export async function fetchSections() {
  try {
    const res = await axios.get(`${API_BASE}/sections`);
    return res.data;
  } catch (error) {
    console.error("Error fetching sections:", error);
    throw error;
  }
}


export async function saveSection(section) {
  try {
    const res = await axios.post(`${API_BASE}/sections`, section);
    return res.data;
  } catch (error) {
    console.error("Error saving section:", error);
    throw error;
  }
}

export async function deleteSection(id) {
  try {
    await axios.delete(`${API_BASE}/sections/${id}`);
  } catch (error) {
    console.error("Error deleting section:", error);
    throw error;
  }
}

/* -------------------- STUDENTS -------------------- */
export async function fetchStudents(classId, sectionId) {
  const res = await axios.get(`${API_BASE}/students`, { params: { classId, sectionId } });
  return res.data;
}

export async function saveStudent(student) {
  const res = await axios.post(`${API_BASE}/students`, student);
  return res.data;
}

export async function deleteStudent(id) {
  await axios.delete(`${API_BASE}/students/${id}`);
}

/* -------------------- ATTENDANCE -------------------- */
export async function fetchAttendance(start, end, classId, sectionId) {
  const res = await axios.get(`${API_BASE}/attendance`, {
    params: { start, end, classId, sectionId },
  });
  return res.data;
}

export async function saveAttendance(attendance) {
  const res = await axios.post(`${API_BASE}/attendance`, attendance);
  return res.data;
}

/* -------------------- MARKS -------------------- */
export async function fetchMarksByStudent(studentId) {
  const res = await axios.get(`${API_BASE}/marks/student/${studentId}`);
  return res.data;
}

export async function saveMark(mark) {
  const res = await axios.post(`${API_BASE}/marks`, mark);
  return res.data;
}

/* -------------------- EXAM TYPES -------------------- */
export async function fetchExamTypes() {
  try {
    const res = await axios.get(`${API_BASE}/exam_types`);
    return res.data;
  } catch (error) {
    console.error("Error fetching exam types:", error);
    throw error;
  }
}
/* -------------------- TERMS -------------------- */
export async function fetchTerms() {
  try {
    const res = await axios.get(`${API_BASE}/terms`);
    return res.data;
  } catch (error) {
    console.error("Error fetching terms:", error);
    throw error;
  }
}

/* -------------------- SUBJECTS -------------------- */
export async function fetchSubjects() {
  try {
    const res = await axios.get(`${API_BASE}/subjects`);
    return res.data;
  } catch (error) {
       console.error("Error fetching subjects:", error);
       throw error;
     }
}

/* -------------------- HOLIDAYS -------------------- */
export async function fetchHolidays(start, end) {
  try {
    const res = await axios.get(`${API_BASE}/holidays/range`, {
      params: { start, end },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching holidays:", error);
    throw error;
  }
}

// ✅ Fix holiday save/update
export async function saveHoliday(holiday) {
  const url = holiday.id
    ? `${API_BASE}/holidays/${holiday.id}` // PUT (update)
    : `${API_BASE}/holidays`;              // POST (create)

  const method = holiday.id ? "PUT" : "POST";

  try {
    const res = await axios({
      method,
      url,
      data: holiday,
    });
    return res.data;
  } catch (error) {
    console.error("Error saving holiday:", error);
    throw error;
  }
}



export async function deleteHoliday(id) {
  try {
    await axios.delete(`${API_BASE}/holidays/${id}`);
  } catch (error) {
    console.error("Error deleting holiday:", error);
    throw error;
  }
}


/* -------------------- USERS -------------------- */
export async function fetchUsers() {
  const res = await axios.get(`${API_BASE}/users`);
  return res.data;
}

export async function saveUser(user) {
  if (user.id) {
    const res = await axios.put(`${API_BASE}/users/${user.id}`, user);
    return res.data;
  } else {
    const res = await axios.post(`${API_BASE}/users`, user);
    return res.data;
  }
}

export async function deleteUser(id) {
  await axios.delete(`${API_BASE}/users/${id}`);
}

export async function fetchRoles() {
  try {
    const res = await axios.get(`${API_BASE}/users/roles`);
    return res.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
}

// Class admin
// Fetch all class-admin assignments
export async function fetchClassAdmins() {
  try {
    const res = await axios.get(`${API_BASE}/class-admin`);
    return res.data;
  } catch (error) {
    console.error("Error fetching class admins:", error);
    return [];
  }
}

// Fetch class-admin by ID
export async function fetchClassAdminById(id) {
  try {
    const res = await axios.get(`${API_BASE}/class-admin/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching class admin ${id}:`, error);
    return [];
  }
}

// Fetch class-admin by User ID
export async function fetchClassAdminByUserId(id) {
  try {
    const res = await axios.get(`${API_BASE}/class-admin/user/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching class admin ${id}:`, error);
    return [];;
  }
}

// Save or update class-admin assignment
export async function saveClassAdmin(payload) {
  try {
    if (payload.id) {
      // Update
      const res = await axios.put(`${API_BASE}/class-admin/${payload.id}`, payload);
      return { success: true, data: res.data };
    } else {
      // Create
      const res = await axios.post(`${API_BASE}/class-admin`, payload);
      return { success: true, data: res.data };
    }
  } catch (error) {
    console.error("Error saving class admin:", error);
    return { success: false, message: error.message };
  }
}

// Delete class-admin assignment
export async function deleteClassAdmin(id) {
  try {
    await axios.delete(`${API_BASE}/class-admin/${id}`);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting class admin ${id}:`, error);
    return { success: false, message: error.message };
  }
}

// Assign class-admin (shortcut for creating)
export async function assignClassAdmin(payload) {
  try {
    const res = await axios.post(`${API_BASE}/class-admin`, payload);
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error assigning class admin:", error);
    return { success: false, message: error.message };
  }
}

/* -------------------- CO-SCHOLASTIC MARKS -------------------- */

export async function fetchCoScholasticMarksByStudentTerm(studentId, termId) {
  try {
    const res = await axios.get(`${API_BASE}/co-scholastic/student/${studentId}/term/${termId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching co-scholastic marks:", error);
    throw error;
  }
}

// Fetch co-scholastic marks for a student and term for report crad
export async function fetchCoScholasticMarksByStudentTermForReportCard(studentId, termId) {
  try {
    const res = await axios.get(`${API_BASE}/co-scholastic/student/${studentId}/term/${termId}`);
    const coMarks = (res.data && res.data[0]) || {};
    return {
      artEducation: coMarks.artEducation || '',
      workEducation: coMarks.workEducation || '',
      healthPhysicalEducation: coMarks.healthPhysicalEducation || '',
      discipline: {
        regularityPunctuality: coMarks.regularityPunctuality || '',
        sincerity: coMarks.sincerity || '',
        behaviourValues: coMarks.behaviourValues || '',
        respectfulnessRules: coMarks.respectfulnessRules || '',
        attitudeTeachers: coMarks.attitudeTeachers || '',
        attitudeClassmates: coMarks.attitudeClassmates || ''
      },
      remarks: coMarks.classTeacherRemarks || ''
    };
  } catch (error) {
    console.error("Error fetching co-scholastic marks:", error);
    throw error;
  }
}



// Fetch all co-scholastic marks for a class, section, and term
export async function fetchCoScholasticMarksByClassSectionTerm(classId, sectionId, termId) {
  try {
    const res = await axios.get(`${API_BASE}/co-scholastic/class/${classId}/section/${sectionId}/term/${termId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching co-scholastic marks for class/section:", error);
    throw error;
  }
}

// Save a co-scholastic mark
export async function saveCoScholasticMarks(mark) {
  try {
    const res = await axios.post(`${API_BASE}/co-scholastic`, mark);
    return res.data;
  } catch (error) {
    console.error("Error saving co-scholastic mark:", error);
    throw error;
  }
}

// Fetch scholastic marks by student and format for Template1 with correct calculations
export async function fetchMarksByStudentForReportCard(studentId) {
  try {
    const res = await axios.get(`${API_BASE}/marks/student/${studentId}`);
    const marksData = res.data || [];

    const subjectMap = {};

    marksData.forEach((m) => {
      const subjectName = m.subject?.name?.toUpperCase() || "UNKNOWN";
      const termName = m.term?.name?.toLowerCase() || "";
      const termNumber = termName.includes("2") ? "2" : "1";
      const examType = m.examType?.name?.toUpperCase() || ""; // e.g. PT1, NOTEBOOK, TERM
      const marksObtained = Number(m.marksObtained) || 0;
      const totalMarks = Number(m.totalMarks) || 0;

      // Create if doesn't exist
      if (!subjectMap[subjectName]) {
        subjectMap[subjectName] = {
          subjectName,
          // Term 1
          pt1: 0,
          noteBookT1: 0,
          subEnrichmentT1: 0,
          term1Marks: 0,
          marksObtainedT1: 0,
          gradeT1: "",
          // Term 2
          pt2: 0,
          noteBookT2: 0,
          subEnrichmentT2: 0,
          term2Marks: 0,
          marksObtainedT2: 0,
          gradeT2: "",
          // Final total
          total: 0,
          overallGrade: ""
        };
      }

      // Scale marks to standard weightage
      const scaleMarks = (obt, total, weight) => {
        if (total <= 0) return 0;
        const scaled = (obt / total) * weight;
        return parseFloat(scaled.toFixed(2));
      };

      // Assign marks to correct term/component
      if (termNumber === "1") {
        if (examType.includes("PT")) {
          subjectMap[subjectName].pt1 = scaleMarks(marksObtained, totalMarks, 10);
        } else if (examType.includes("NOTEBOOK")) {
          subjectMap[subjectName].noteBookT1 = scaleMarks(marksObtained, totalMarks, 5);
        } else if (examType.includes("SUB ENRICHMENT")) {
          subjectMap[subjectName].subEnrichmentT1 = scaleMarks(marksObtained, totalMarks, 5);
        } else if (examType.includes("Half Yearly / Annual")) {
          subjectMap[subjectName].term1Marks = scaleMarks(marksObtained, totalMarks, 30);
        }
      } else if (termNumber === "2") {
        if (examType.includes("PT")) {
          subjectMap[subjectName].pt2 = scaleMarks(marksObtained, totalMarks, 10);
        } else if (examType.includes("NOTEBOOK")) {
          subjectMap[subjectName].noteBookT2 = scaleMarks(marksObtained, totalMarks, 5);
        } else if (examType.includes("SUB ENRICHMENT")) {
          subjectMap[subjectName].subEnrichmentT2 = scaleMarks(marksObtained, totalMarks, 5);
        } else if (examType.includes("Half Yearly / Annual")) {
          subjectMap[subjectName].term2Marks = scaleMarks(marksObtained, totalMarks, 30);
        }
      }
    });

    // Compute totals and grades
    Object.values(subjectMap).forEach((sub) => {
      // Term 1 out of 50
      const t1Score = sub.pt1 + sub.noteBookT1 + sub.subEnrichmentT1 + sub.term1Marks;
      sub.marksObtainedT1 = parseFloat(t1Score.toFixed(2));
      sub.gradeT1 = calculateGradeFromPercent((t1Score / 50) * 100);

      // Term 2 out of 50
      const t2Score = sub.pt2 + sub.noteBookT2 + sub.subEnrichmentT2 + sub.term2Marks;
      sub.marksObtainedT2 = parseFloat(t2Score.toFixed(2));
      sub.gradeT2 = calculateGradeFromPercent((t2Score / 50) * 100);

      // Total (out of 100)
      const total = t1Score + t2Score;
      sub.total = parseFloat(total.toFixed(2));
      sub.overallGrade = calculateGradeFromPercent(total);
    });

    return Object.values(subjectMap);
  } catch (error) {
    console.error("Error fetching marks:", error);
    return [];
  }
}

// Grade calculation based on your scale
function calculateGradeFromPercent(percent) {
  const p = parseFloat(percent.toFixed(2));
  if (p >= 91) return "A1";
  if (p >= 81) return "A2";
  if (p >= 71) return "B1";
  if (p >= 61) return "B2";
  if (p >= 51) return "C1";
  if (p >= 41) return "C2";
  if (p >= 33) return "D";
  return "E";
}


/* -------------------- REPORT CARD Table Record generation to calculate rank -------------------- */
export async function generateReportCardForClassSection(classId, sectionId, students) {
  try {
  debugger;
    for (const student of students) {
      const res = await axios.get(`${API_BASE}/marks/student/${student.id}`);
      debugger;
      const marksData = res.data || [];

      // Always assume both terms exist (each out of 50)
      let term1Obt = 0;
      let term2Obt = 0;

      const calculateScaled = (obt, total, weight) => (total > 0 ? (obt / total) * weight : 0);

      // Loop through available marks
      marksData.forEach((m) => {
        const examType = m.examType?.name?.toUpperCase() || '';
        const termName = m.term?.name?.toLowerCase() || '';
        const termNum = termName.includes('2') ? '2' : '1';
        const obt = Number(m.marksObtained) || 0;
        const max = Number(m.totalMarks) || 0;

        let scaled = 0;
        if (examType.includes('PT')) scaled = calculateScaled(obt, max, 10);
        else if (examType.includes('NOTEBOOK')) scaled = calculateScaled(obt, max, 5);
        else if (examType.includes('SUB ENRICHMENT')) scaled = calculateScaled(obt, max, 5);
        else if (examType.includes('Half Yearly / Annual')) scaled = calculateScaled(obt, max, 30);

        if (termNum === '1') term1Obt += scaled;
        else term2Obt += scaled;
      });

      // ✅ Each term is out of 50, even if some marks are missing
      const totalObtained = term1Obt + term2Obt;
      const totalMax = 100; // Always fixed (Term 1 + Term 2)
      const percentage = (totalObtained / totalMax) * 100;

      const reportCard = {
        studentId: student.id,
        classId: parseInt(classId),
        sectionId: parseInt(sectionId),
        totalMarks: Math.round(totalObtained),
        maxMarks: totalMax,
        percentage: parseFloat(percentage.toFixed(2)),
        totalAttendance: 0
      };

      // ✅ Create or update report card
      await axios.post(`${API_BASE}/report-cards`, reportCard);
    }

    console.log("✅ Report cards generated/updated successfully.");
  } catch (error) {
    console.error("❌ Error generating report cards:", error);
    throw error;
  }

}


// Fetch report card for a student (includes rank, total marks, percentage, etc.)
export const fetchReportCardByStudent = async (studentId) => {
  try {
    const response = await axios.get(`${API_BASE}/report-cards/student/${studentId}`);
    return response.data; // returns the report card object
  } catch (error) {
    console.error('Error fetching report card:', error);
    return null;
  }
};

export async function fetchStreams() {
  const res = await fetch(`${API_BASE}/streams`);
  if (!res.ok) throw new Error('Failed to fetch streams');
  return res.json();
}


