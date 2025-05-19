const socketIO = require("socket.io");
const http = require("http");

const app = require("./src/app");

const notificationModel = require("./src/models/notification.model");
const { studentModel, teacherModel } = require("./src/models/user.model");

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

app.use("/", (req, res, next) => {
  return res.status(200).json({
    message: "Welcome to the server",
  });
});

const FILTER_LENGTH = -7;
const io = socketIO(server, {
  cors: {
    origin: [
      "https://frontend-quizz-deploy.vercel.app",
      "https://frontend-quizz-deploy-rbhronm81-tungphos-projects.vercel.app",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

const rooms = {};
const teachersID = {};
const joinedStudentID = {};

io.on("connection", (socket) => {
  console.log("A new user connected or re-connect");
  const { userId, role } = socket.handshake.query;

  // get teacher's user id
  if (role === "teacher" && userId) {
    teachersID[userId] = socket.id;
  }
  // get student's user id

  if (role === "student" && userId) {
    joinedStudentID[userId] = socket.id;
  }
  //create room event
  socket.on(
    "createRoom",
    (room, teacherID, testID, classId, testName, duration) => {
      if (rooms[room]) {
        console.log("Room has exist");
        return;
      }
      const className = room.slice(0, FILTER_LENGTH);
      rooms[room] = [];
      rooms[room].push({
        teacher_id: teacherID,
        is_test_started: false,
        className: className,
        test_id: testID,
        test_name: testName,
        classId,
        duration,
      });
      const filteredRooms = Object.entries(rooms).filter(
        (r) => r[0].slice(0, FILTER_LENGTH) === className
      );
      io.to(socket.id).emit("roomList", filteredRooms);
    }
  );

  socket.on("requestStartExam", (room) => {
    rooms[room][0].is_test_started = true;
    rooms[room].forEach((s) => {
      if (s.student_id_db) {
        console.log(joinedStudentID[s.student_id_db]);
        io.to(joinedStudentID[s.student_id_db]).emit(
          "startExamForStudent",
          true
        );
      }
    });
  });

  socket.on("checkIfTestStarted", (room) => {
    io.to(socket.id).emit("returnTestState", rooms[room][0].is_test_started);
  });
  socket.on("deleteRoom", (room) => {
    const className = room.slice(0, FILTER_LENGTH);
    delete rooms[room];
    const filteredRooms = Object.entries(rooms).filter(
      (r) => r[0].slice(0, FILTER_LENGTH) === className
    );
    io.to(socket.id).emit("roomList", filteredRooms);
  });

  socket.on("getRoomList", (className) => {
    const filteredRooms = Object.entries(rooms).filter(
      (r) => r[0].slice(0, FILTER_LENGTH) === className
    );
    io.to(socket.id).emit("roomList", filteredRooms);
  });

  socket.on("notificationResponse", (notifitcation, accepted) => {
    // join room request
    if (notifitcation.action === "requestJoinRoom") {
      console.log(joinedStudentID[notifitcation.sendTo]);

      if (!accepted) {
        io.to(joinedStudentID[notifitcation.sendTo]).emit("permit", {
          permit: false,
          message: "You have been rejected to join the room",
        });
        return;
      }
      // send to student_id_db in sockets
      io.to(joinedStudentID[notifitcation.sendTo]).emit("permit", {
        permit: true,
        message: "You have been accepted to join the room",
      });
    }
    // join class request
    if (notifitcation.action === "joinClassRequest") {
      if (accepted) {
        console.log(notifitcation.userId);
        io.to(teachersID[notifitcation.sendTo]).emit(
          "aceptedStudentJoinClass",
          { studentId: notifitcation.userId }
        );
      }
    }
  });

  // 1. request to join room
  socket.on("requestToJoinRoom", async (room, testId = "", student = {}) => {
    const teacher = rooms[room].find((user) => user.teacher_id);
    const data = {
      content: `${student.studentName} has requested to join room ${room}`,
      userId: teacher.teacher_id,
      sendTo: student.student_id_db,
      action: "requestJoinRoom",
      typeNotifi: "request",
      isAccepted: null,
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      expireAt: new Date(Date.now() + 172800000), // expires in 48 hours
    };
    const newNotification = await notificationModel.create(data);
    io.to(teachersID[teacher.teacher_id]).emit(
      "newNotification",
      newNotification
    );
  });

  // 2. request to join class:
  socket.on("requestToJoinClass", async (classInfo, studentId) => {
    const student = await studentModel.findOne({
      student_id: studentId,
    });
    const teacher = await teacherModel.findById(classInfo.teacherId);
    const data = {
      content: `The Teacher has invited you to join class ${classInfo.name}`,
      userId: student._id,
      sendTo: teacher._id,
      typeNotifi: "request",
      action: "joinClassRequest",
      isAccepted: null,
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      expireAt: new Date(Date.now() + 172800000), // expires in 48 hours
    };
    const newNotification = await notificationModel.create(data);
    io.to(joinedStudentID[student._id]).emit(
      "newNotification",
      newNotification
    );
  });

  socket.on("joinRoom", (room, student) => {
    if (!rooms[room]) {
      console.log("Room not found");
      return;
    }
    // testid truyền vào, check nếu trùng thì cho vào, không thì thôi
    const foundStudent = rooms[room].find(
      (user) => user.student_id_db === student.student_id_db
    );
    if (foundStudent) {
      console.log("You are already joined");
      return;
      //TODO: remember to emit an event to show that you're alread
    }
    // const studentSocketID = joinedStudentID[student.student_id_db];
    // 1.  find the teacher
    const teacher = rooms[room].find((user) => user.teacher_id);
    // 2.  push the student to the room array
    const testID = teacher.test_id;

    rooms[room].push({
      examID: testID,
      testName: teacher.test_name,
      state: "joined",
      current_question: 0,
      number_of_violates: 0,
      status: "Not Submitted",
      ...student,
    });

    // 3.  send student data to the teacher's room
    io.to(teachersID[teacher.teacher_id]).emit("studentData", rooms[room]);

    const filteredRooms = Object.entries(rooms).filter(
      (r) => r[0].slice(0, FILTER_LENGTH) === teacher.className
    );
    //4.  gửi cho teacher room của class teacher đó dạy
    io.to(teachersID[teacher.teacher_id]).emit("roomList", filteredRooms);

    // gửi id bài test cho student's socket.id
    // io.to(studentSocketID).emit("sentTestID", testID);
    console.log(`Student ${student.name} joined room ${room}`);
  });

  //////
  socket.on("getRoomById", (room) => {
    console.log(rooms[room]);
    io.to(socket.id).emit("studentData", rooms[room]);
  });
  socket.on("studentInfo", (userID, room) => {
    const currentRoom = rooms[room];
    if (!currentRoom) {
      console.log("error");
      return;
    }
    let foundStudent;
    for (let student of currentRoom) {
      if (student.student_id_db === userID) {
        foundStudent = student;
      }
    }
    // sent data to students
    io.to(joinedStudentID[foundStudent.student_id_db]).emit(
      "sentStudentInfo",
      foundStudent
    );
  });

  socket.on(
    "studentInteraction",
    (room, studentId, { type, current_question, violateNums }) => {
      // if (!room || !studentId || !type || !current_question) return;
      if (!rooms[room]) {
        console.log("Room not found 1");
        return;
      }

      const teacher = rooms[room].find((user) => user.teacher_id);

      for (let i = 0; i < rooms[room].length; i++) {
        if (rooms[room][i].student_id === studentId && type === "violates") {
          rooms[room][i].state = "left";
          rooms[room][i].number_of_violates = violateNums + 1;
        } else if (
          rooms[room][i].student_id === studentId &&
          type === "re-joined"
        ) {
          rooms[room][i].state = "joined";
        } else if (
          rooms[room][i].student_id === studentId &&
          type === "change_question"
        ) {
          rooms[room][i].current_question = current_question;
        } else if (
          rooms[room][i].student_id === studentId &&
          type === "submit"
        ) {
          console.log(rooms[room][i]);
          rooms[room][i].status = "Submitted";
        }
      }
      io.to(teachersID[teacher.teacher_id]).emit("studentData", rooms[room]);
    }
  );

  // check room exist
  socket.on("checkRoomExist", (room) => {
    if (!rooms[room]) io.to(socket.id).emit("isRoomExist", false);
  });

  socket.on("requestForceSubmit", (studentId, roomID) => {
    console.log("socket", joinedStudentID[studentId]);
    const student = rooms[roomID];
    console.log("STI", student);
    io.to(joinedStudentID[studentId]).emit("forceSubmit");
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
});
server.listen(PORT, () => {
  console.log(`Server is listening to ${PORT}`);
});
