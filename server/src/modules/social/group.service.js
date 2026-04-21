import prisma from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';

export const createGroup = async (userId, { name, emoji }) => {
  const group = await prisma.group.create({
    data: {
      name,
      ownerId: userId,
      emoji: emoji || undefined,
      members: {
        create: { userId },
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, username: true, displayName: true, avatarUrl: true },
          },
        },
      },
    },
  });

  return group;
};

export const getGroups = async (userId) => {
  const groups = await prisma.group.findMany({
    where: {
      members: { some: { userId } },
    },
    include: {
      owner: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
              moodLogs: {
                orderBy: { createdAt: 'desc' },
                take: 1,
              },
            },
          },
        },
      },
      _count: { select: { members: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return groups;
};

export const getGroup = async (userId, groupId) => {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      owner: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
              moodLogs: {
                orderBy: { createdAt: 'desc' },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  if (!group) {
    throw new AppError('Group not found', 404, 'NOT_FOUND');
  }

  const isMember = group.members.some((m) => m.userId === userId);
  if (!isMember) {
    throw new AppError('Not a member of this group', 403, 'FORBIDDEN');
  }

  return group;
};

export const addMember = async (userId, groupId, targetUserId) => {
  const group = await prisma.group.findUnique({ where: { id: groupId } });
  if (!group) {
    throw new AppError('Group not found', 404, 'NOT_FOUND');
  }
  if (group.ownerId !== userId) {
    throw new AppError('Only the group owner can add members', 403, 'FORBIDDEN');
  }

  const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!targetUser) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  const existing = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: targetUserId } },
  });
  if (existing) {
    throw new AppError('User is already a member', 409, 'ALREADY_MEMBER');
  }

  const member = await prisma.groupMember.create({
    data: { groupId, userId: targetUserId },
    include: {
      user: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
    },
  });

  await prisma.notification.create({
    data: {
      userId: targetUserId,
      type: 'group_invite',
      title: 'Gruba Eklendi',
      body: `"${group.name}" grubuna eklendin`,
      data: { groupId },
    },
  });

  return member;
};

export const removeMember = async (userId, groupId, targetUserId) => {
  const group = await prisma.group.findUnique({ where: { id: groupId } });
  if (!group) {
    throw new AppError('Group not found', 404, 'NOT_FOUND');
  }

  const isSelfRemoval = userId === targetUserId;
  if (!isSelfRemoval && group.ownerId !== userId) {
    throw new AppError('Only the group owner can remove members', 403, 'FORBIDDEN');
  }

  if (targetUserId === group.ownerId) {
    throw new AppError('Cannot remove the group owner', 400, 'CANNOT_REMOVE_OWNER');
  }

  const member = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: targetUserId } },
  });
  if (!member) {
    throw new AppError('User is not a member', 404, 'NOT_MEMBER');
  }

  await prisma.groupMember.delete({
    where: { groupId_userId: { groupId, userId: targetUserId } },
  });

  return { success: true };
};
