# Calendar Application

**A simple calendar application built using the MERN stack and Bootstrap or Tailwind CSS.**  
This application allows users to manage appointments through an intuitive calendar interface, supporting features like adding, deleting, and moving appointments.

## Table of Contents

1. [Introduction](#introduction)
2. [Technologies Used](#technologies-used)
3. [Features](#features)
4. [Installation](#installation)
5. [Usage](#usage)

---

## Introduction

The **Calendar Application** is a full-stack project that enables users to manage their appointments efficiently. The application provides the ability to add, delete, and reschedule appointments, which are displayed in a user-friendly calendar view. Users can view their appointments in monthly, weekly, or daily views.

## Technologies Used

- **MongoDB**: Database for storing appointments.
- **Express.js**: Back-end framework for handling API requests.
- **React**: Front-end library for building user interfaces.
- **Node.js**: JavaScript runtime for building server-side logic.
- **Bootstrap** or **Tailwind CSS**: CSS frameworks for styling and responsiveness.
- **Drag-and-Drop API**: For moving appointments across different dates.

## Features

- **Add Appointment Form**: Allows users to add new appointments with a specific date and description.
- **Delete Appointment**: Provides the ability to delete existing appointments from the calendar.
- **Move Appointment**: Implements drag-and-drop functionality to reschedule appointments by moving them between dates.
- **Calendar View**: Supports monthly, weekly, and daily calendar views with highlighted dates that contain appointments.
- **Form Validation**: Uses form validators to ensure that appointments are added with correct and valid data.

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Herik25/calendar-app.git
   ```

2. **Navigate to the project folder**:

   ```bash
   cd calendar-app
   ```

3. **Install server and client dependencies**:

   ```bash
   npm install
   ```

4. **Run the server**:

   ```bash
   npm run server
   ```

5. **Run the front-end in development mode**:
   ```bash
   npm run dev
   ```

## Usage

### Adding an Appointment:

1. Click on a date in the calendar.
2. Fill out the appointment form with the date and description.
3. Submit the form to save the appointment.

### Deleting an Appointment:

1. Locate the appointment on the calendar.
2. Click the delete icon next to the appointment to remove it.

### Moving an Appointment:

1. Drag an appointment to a different date on the calendar to reschedule it.
