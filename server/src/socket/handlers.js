import prisma from '../config/database.js';

export const setupSocketHandlers = (io) => {
  io.on('connection', async (socket) => {
    const { userId } = socket;
    console.log(`User connected: ${userId}`);

    // Join personal room
    socket.join(`user:${userId}`);

    // Join group rooms
    try {
      const groupMembers = await prisma.groupMember.findMany({
        where: { userId },
        select: { groupId: true },
      });
      for (const { groupId } of groupMembers) {
        socket.join(`group:${groupId}`);
      }
    } catch (err) {
      console.error('Error joining group rooms:', err.message);
    }

    // Listen for mood updates and broadcast to friends
    socket.on('mood:update', async (moodData) => {
      try {
        // Get all accepted friendships
        const friendships = await prisma.friendship.findMany({
          where: {
            status: 'accepted',
            OR: [{ userAId: userId }, { userBId: userId }],
          },
        });

        const friendIds = friendships.map((f) =>
          f.userAId === userId ? f.userBId : f.userAId
        );

        // Broadcast to each friend's room
        for (const friendId of friendIds) {
          io.to(`user:${friendId}`).emit('friend:mood:update', {
            userId,
            ...moodData,
          });
        }

        // Broadcast to groups
        const groupMembers = await prisma.groupMember.findMany({
          where: { userId },
          select: { groupId: true },
        });
        for (const { groupId } of groupMembers) {
          socket.to(`group:${groupId}`).emit('group:mood:update', {
            userId,
            groupId,
            ...moodData,
          });
        }
      } catch (err) {
        console.error('Error broadcasting mood update:', err.message);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${userId}`);
    });
  });
};
