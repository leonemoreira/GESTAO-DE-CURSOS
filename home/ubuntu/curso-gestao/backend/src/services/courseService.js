const prisma = require("../config/prismaClient");

const getAllCourses = async () => {
  const courses = await prisma.course.findMany({
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      _count: {
        select: { enrollments: true }
      }
    }
  });
  
  return courses.map(course => ({
    ...course,
    enrollmentCount: course._count.enrollments,
    _count: undefined
  }));
};

const getCourseById = async (id) => {
  const course = await prisma.course.findUnique({
    where: { id: Number(id) },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      enrollments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    }
  });
  
  return course;
};

const createCourse = async (courseData, instructorId) => {
  const course = await prisma.course.create({
    data: {
      ...courseData,
      instructor: {
        connect: { id: Number(instructorId) }
      }
    },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
  
  return course;
};

const updateCourse = async (id, courseData) => {
  const course = await prisma.course.update({
    where: { id: Number(id) },
    data: courseData,
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
  
  return course;
};

const deleteCourse = async (id) => {
  await prisma.course.delete({
    where: { id: Number(id) }
  });
  
  return true;
};

const enrollUserInCourse = async (userId, courseId) => {
  const enrollment = await prisma.enrollment.create({
    data: {
      user: {
        connect: { id: Number(userId) }
      },
      course: {
        connect: { id: Number(courseId) }
      }
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      course: true
    }
  });
  
  return enrollment;
};

const unenrollUserFromCourse = async (userId, courseId) => {
  await prisma.enrollment.delete({
    where: {
      userId_courseId: {
        userId: Number(userId),
        courseId: Number(courseId)
      }
    }
  });
  
  return true;
};

const getEnrollmentsByUserId = async (userId) => {
  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId: Number(userId)
    },
    include: {
      course: {
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    }
  });
  
  return enrollments;
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollUserInCourse,
  unenrollUserFromCourse,
  getEnrollmentsByUserId
};
