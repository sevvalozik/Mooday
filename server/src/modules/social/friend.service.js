import prisma from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';

const FRIEND_SELECT = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
};

export const listFriends = async (userId) => {
  const friendships = await prisma.friendship.findMany({
    where: {
      status: 'accepted',
      OR: [{ userAId: userId }, { userBId: userId }],
    },
    include: {
      userA: {
        select: {
          ...FRIEND_SELECT,
          moodLogs: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      },
      userB: {
        select: {
          ...FRIEND_SELECT,
          moodLogs: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      },
    },
  });

  return friendships.map((f) => {
    const friend = f.userAId === userId ? f.userB : f.userA;
    const latestMood = friend.moodLogs[0] || null;
    const { moodLogs, ...friendInfo } = friend;
    return {
      friendshipId: f.id,
      ...friendInfo,
      latestMood,
    };
  });
};

export const sendRequest = async (userId, targetId) => {
  if (userId === targetId) {
    throw new AppError('Cannot send friend request to yourself', 400, 'SELF_REQUEST');
  }

  const targetUser = await prisma.user.findUnique({ where: { id: targetId } });
  if (!targetUser) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  const [userAId, userBId] = userId < targetId ? [userId, targetId] : [targetId, userId];

  const existing = await prisma.friendship.findUnique({
    where: { userAId_userBId: { userAId, userBId } },
  });

  if (existing) {
    throw new AppError('Friendship already exists', 409, 'FRIENDSHIP_EXISTS');
  }

  const sendingUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { displayName: true },
  });

  const friendship = await prisma.friendship.create({
    data: {
      userAId,
      userBId,
      status: 'pending',
    },
  });

  await prisma.notification.create({
    data: {
      userId: targetId,
      type: 'friend_request',
      title: 'New Friend Request',
      body: `${sendingUser.displayName} sent you a friend request`,
      data: { friendshipId: friendship.id, senderId: userId },
    },
  });

  return friendship;
};

export const acceptRequest = async (userId, friendshipId) => {
  const friendship = await prisma.friendship.findUnique({
    where: { id: friendshipId },
  });

  if (!friendship) {
    throw new AppError('Friend request not found', 404, 'NOT_FOUND');
  }

  if (friendship.status !== 'pending') {
    throw new AppError('Friend request is not pending', 400, 'NOT_PENDING');
  }

  // The receiver is the one who did NOT initiate. The sender stored
  // the smaller UUID as userAId. So:
  //   if sender === userAId  -> receiver === userBId
  //   if sender === userBId  -> receiver === userAId
  // We don't store "senderId" explicitly, but the convention from sendRequest
  // is: sender is the userId that called sendRequest. We can't know for sure
  // which side is the receiver purely from the row, so we just verify the
  // accepting user is part of the friendship (either side) and is NOT the
  // person who created the request. We use the notification's data to
  // check, but a simpler rule: the receiver (the one who should accept)
  // is the target of the notification. We verify the user is part of it.
  const isPartOfFriendship = friendship.userAId === userId || friendship.userBId === userId;
  if (!isPartOfFriendship) {
    throw new AppError('Not authorized to accept this request', 403, 'FORBIDDEN');
  }

  // Find the notification to determine who the receiver is
  const notification = await prisma.notification.findFirst({
    where: {
      userId,
      type: 'friend_request',
      data: { path: ['friendshipId'], equals: friendshipId },
    },
  });

  if (!notification) {
    throw new AppError('You are not the receiver of this request', 403, 'FORBIDDEN');
  }

  const updated = await prisma.friendship.update({
    where: { id: friendshipId },
    data: { status: 'accepted' },
  });

  const otherUserId = friendship.userAId === userId ? friendship.userBId : friendship.userAId;
  const acceptingUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { displayName: true },
  });

  await prisma.notification.create({
    data: {
      userId: otherUserId,
      type: 'friend_accepted',
      title: 'Friend Request Accepted',
      body: `${acceptingUser.displayName} accepted your friend request`,
      data: { friendshipId },
    },
  });

  return updated;
};

export const getPendingRequests = async (userId) => {
  // Find all pending friendships where this user is part of the friendship
  const pendingFriendships = await prisma.friendship.findMany({
    where: {
      status: 'pending',
      OR: [{ userAId: userId }, { userBId: userId }],
    },
    include: {
      userA: { select: FRIEND_SELECT },
      userB: { select: FRIEND_SELECT },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Filter to only those where userId is the receiver (has a notification)
  const notifications = await prisma.notification.findMany({
    where: {
      userId,
      type: 'friend_request',
      data: {
        path: ['friendshipId'],
        string_contains: '', // We will filter in code
      },
    },
  });

  const notifiedFriendshipIds = new Set(
    notifications
      .map((n) => {
        const data = typeof n.data === 'string' ? JSON.parse(n.data) : n.data;
        return data?.friendshipId;
      })
      .filter(Boolean)
  );

  return pendingFriendships
    .filter((f) => notifiedFriendshipIds.has(f.id))
    .map((f) => {
      const sender = f.userAId === userId ? f.userB : f.userA;
      return {
        friendshipId: f.id,
        sender,
        createdAt: f.createdAt,
      };
    });
};

export const removeFriend = async (userId, friendshipId) => {
  const friendship = await prisma.friendship.findUnique({
    where: { id: friendshipId },
  });

  if (!friendship) {
    throw new AppError('Friendship not found', 404, 'NOT_FOUND');
  }

  const isPartOfFriendship = friendship.userAId === userId || friendship.userBId === userId;
  if (!isPartOfFriendship) {
    throw new AppError('Not authorized', 403, 'FORBIDDEN');
  }

  await prisma.friendship.delete({ where: { id: friendshipId } });

  return { success: true };
};
