## Database for Office of Veteran Success

The **Database for Office of Veteran Success** is a comprehensive system designed to manage users, departments, courses, classes, scheduling, and student academic workflows. It provides role-based access and permissions to ensure structured and secure management across the organization.

This is the **client-side** of the application, built using **React** to offer a smooth, responsive interface with real-time updates and intuitive controls for administrators, department heads, and instructors.

- Developed using **Tailwind CSS** for a fully responsive, modern UI with a utility-first design approach.
- Used **Firebase Firestore** for database storage and **Firebase Backend Services** to manage user data, department structures, courses, enrollments, and academic records.
- Implemented **Firebase Authentication** for secure login and role-based access control across different user types.

These technologies combine to create an interactive and seamless interface for effective project collaboration.

---

[![Open Source Love svg1](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](#)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat&label=Contributions&colorA=red&colorB=black)](#)

## Project Overview

The **Database for Office of Veteran Success** is a comprehensive academic management platform designed to manage users, departments, courses, classes, enrollments, attendance, assessments, and student results. It features role-based access control for Admins, Department Heads, and Instructors, ensuring secure and efficient academic operations across the organization.

- Role-based access system with distinct permissions for Admins, Department Heads, and Instructors.
- Admins can register new instructors to the system.
- Admins can create, edit, and delete university departments.
- Admins can create, edit, and delete courses, including setting course names, descriptions, and prerequisites.
- Department Heads can create and manage classes within their assigned departments.
- Department Heads can assign courses to classes and allocate instructors to specific courses.
- Department Heads can approve or reject student course enrollment requests.
- Enrollment requests are automatically blocked if students do not meet the required course prerequisites.
- Department Heads can automatically calculate GPAs based on the grades submitted by instructors.
- Department Heads can compile and save final student results.
- Instructors can view courses and classes assigned to them by the department.
- Instructors can view lists of students enrolled in their classes.
- Instructors can mark and update student attendance for specific dates.
- Instructors can create assessments and define grading criteria for each course.
- Instructors can assign marks to students for each assessment.
- All submitted grades are automatically forwarded to the department for GPA calculation and final result compilation.
- Data storage and management are handled using Firebase Firestore and Firebase Backend Services.
- Secure login and role-based access control are implemented using Firebase Authentication.

With real updates, a responsive interface, and intuitive navigation, users can efficiently track their academic progress and directly communicate with their departments through the system.

---

### 🤖 Tech Stack
<a href="#">
   <img alt="HTML5" src="https://img.shields.io/badge/html5-%23E34F26.svg?&style=for-the-badge&logo=html5&logoColor=white"/>
   <img alt="JavaScript" src="https://img.shields.io/badge/javascript%20-%23323330.svg?&style=for-the-badge&logo=javascript&logoColor=%23F7DF1E"/>
   <img alt="CSS3" src="https://img.shields.io/badge/css3-%231572B6.svg?&style=for-the-badge&logo=css3&logoColor=white"/>
   <img alt="React" src="https://img.shields.io/badge/React-%2361DAFB.svg?&style=for-the-badge&logo=react&logoColor=white"/>
   <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind%20CSS-%2306B6D4.svg?&style=for-the-badge&logo=tailwindcss&logoColor=white"/>
   <img alt="Firebase" src="https://img.shields.io/badge/firebase-%23039BE5.svg?&style=for-the-badge&logo=firebase&logoColor=white"/>
</a>

---

### Run Locally
Clone the project using the following command:
```bash
   git clone https://github.com/srikaanthh/Database-for-Office-of-Veteran-Success.git
```
Go to the project directory:
```bash
   cd Database-for-Office-of-Veteran-Success
```
Install dependencies:
```bash
   npm install
```
Run the application:
```bash
   npm start
```
The app will run in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

---

## System Roles and Features

### Admin Features

#### User Management
- Register new instructors and grant system access.
- Ensure that only authorized teaching staff can access the system.

#### Department Management
- Create, edit, and delete departments.
- Manage the organization’s departmental structure efficiently.

#### Course Management
- Create, edit, and delete courses with specific names, descriptions, and prerequisites.
- Maintain complete control over course offerings within the system.

---

### Department Head Features

#### Class Management
- Create new classes within their own department.
- Organize students into specific classes to manage course enrollments and attendance.

#### Scheduling
- Assign courses to particular classes.
- Allocate instructors to specific courses and classes.
- Manage academic timetabling and ensure proper instructor assignments.

#### Enrollment Approval
- Approve or reject student course enrollment requests.
- Ensure that course progression is correctly followed.

#### Result Compilation
- Automatically calculate GPAs based on marks provided by instructors.
- Compile and save final results for all students within the department.

---

### Instructor Features

#### Assigned Courses
- View the list of courses and classes assigned to them by the department head.
- Gain clarity on teaching responsibilities and schedules.

#### Student Management
- View the list of students enrolled in each assigned class.
- Mark and update student attendance records for specific dates.

#### Assessments & Grading
- Create assessments such as quizzes, exams, and assignments.
- Define detailed grading criteria for each assessment.
- Assign marks to students for each assessment.
- Streamline the grading process and ensure timely result submissions.

---

## Summary
The **Database for Office of Veteran Success** provides complete academic workflow management with role-based permissions for Admins, Department Heads, and Instructors, ensuring seamless coordination across departments, classes, and student records.
