import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const EMOTIONS = ['happiness', 'sadness', 'anger', 'calm', 'excitement', 'anxiety', 'tired', 'hopeful'];
const EMOTION_DATA = {
  happiness:  { color: '#FFD700', valence:  0.8, arousal: 0.5 },
  sadness:    { color: '#4169E1', valence: -0.7, arousal: 0.2 },
  anger:      { color: '#DC143C', valence: -0.8, arousal: 0.9 },
  calm:       { color: '#2E8B57', valence:  0.5, arousal: 0.1 },
  excitement: { color: '#FF8C00', valence:  0.9, arousal: 0.9 },
  anxiety:    { color: '#8B008B', valence: -0.5, arousal: 0.8 },
  tired:      { color: '#708090', valence: -0.2, arousal: 0.1 },
  hopeful:    { color: '#FF69B4', valence:  0.6, arousal: 0.4 },
};

const randomEmotion = () => EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
const randomIntensity = () => Math.floor(Math.random() * 10) + 1;

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.reaction.deleteMany();
  await prisma.message.deleteMany();
  await prisma.musicShare.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.group.deleteMany();
  await prisma.timeCapsule.deleteMany();
  await prisma.moodLog.deleteMany();
  await prisma.streak.deleteMany();
  await prisma.friendship.deleteMany();
  await prisma.userPreferences.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 12);

  // Create test users
  const user1 = await prisma.user.create({
    data: {
      email: 'alex@mooday.app',
      username: 'alex',
      displayName: 'Alex',
      passwordHash,
      bio: 'Mood tracking enthusiast',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'jordan@mooday.app',
      username: 'jordan',
      displayName: 'Jordan',
      passwordHash,
      bio: 'Living in the moment',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'sam@mooday.app',
      username: 'sam',
      displayName: 'Sam',
      passwordHash,
      bio: 'Emotional explorer',
    },
  });

  const users = [user1, user2, user3];

  // Create preferences for each user
  for (const user of users) {
    await prisma.userPreferences.create({
      data: { userId: user.id },
    });
  }

  // Create streaks for each user
  for (const user of users) {
    await prisma.streak.create({
      data: {
        userId: user.id,
        currentCount: Math.floor(Math.random() * 15) + 1,
        longestCount: Math.floor(Math.random() * 30) + 5,
        lastLogDate: new Date(),
      },
    });
  }

  // Create 30 days of mood logs for each user
  const now = new Date();
  for (const user of users) {
    for (let day = 29; day >= 0; day--) {
      const date = new Date(now);
      date.setDate(date.getDate() - day);
      date.setHours(Math.floor(Math.random() * 14) + 8, Math.floor(Math.random() * 60), 0, 0);

      const emotion = randomEmotion();
      const data = EMOTION_DATA[emotion];

      await prisma.moodLog.create({
        data: {
          userId: user.id,
          emotion,
          valence: data.valence,
          arousal: data.arousal,
          intensity: randomIntensity(),
          colorHex: data.color,
          journal: day % 5 === 0 ? `Day ${30 - day} journal entry — feeling ${emotion}` : null,
          createdAt: date,
        },
      });
    }
  }

  // Create friendships (all 3 are friends with each other)
  const sortedPairs = [
    [user1.id, user2.id].sort(),
    [user1.id, user3.id].sort(),
    [user2.id, user3.id].sort(),
  ];

  for (const [userAId, userBId] of sortedPairs) {
    await prisma.friendship.create({
      data: {
        userAId,
        userBId,
        status: 'accepted',
      },
    });
  }

  // Create a group
  const group = await prisma.group.create({
    data: {
      name: 'Close Friends',
      ownerId: user1.id,
      emoji: '💫',
    },
  });

  // Add all 3 users to the group
  for (const user of users) {
    await prisma.groupMember.create({
      data: {
        groupId: group.id,
        userId: user.id,
      },
    });
  }

  // Create some reactions
  const reactionTypes = ['hug', 'cheer', 'high-five', 'heart', 'laugh'];
  const recentMoodLogs = await prisma.moodLog.findMany({
    where: { userId: user1.id },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });

  for (const moodLog of recentMoodLogs) {
    await prisma.reaction.create({
      data: {
        senderId: user2.id,
        receiverId: user1.id,
        moodLogId: moodLog.id,
        type: reactionTypes[Math.floor(Math.random() * reactionTypes.length)],
      },
    });
  }

  await prisma.reaction.create({
    data: {
      senderId: user3.id,
      receiverId: user1.id,
      type: 'heart',
    },
  });

  // Create some messages
  const messages = [
    { senderId: user1.id, receiverId: user2.id, content: 'Hey! How are you feeling today?' },
    { senderId: user2.id, receiverId: user1.id, content: 'Pretty good! Had a great morning.' },
    { senderId: user1.id, receiverId: user2.id, content: 'Your sphere looks so vibrant today!' },
    { senderId: user2.id, receiverId: user1.id, content: 'Thanks! I noticed yours has been calmer lately.' },
    { senderId: user3.id, receiverId: user1.id, content: 'Hey Alex, check out the group mood board!' },
    { senderId: user1.id, receiverId: user3.id, content: 'Just saw it! Love the collective vibe.' },
  ];

  for (const msg of messages) {
    await prisma.message.create({
      data: {
        ...msg,
        read: true,
        createdAt: new Date(now.getTime() - Math.random() * 86400000 * 3),
      },
    });
  }

  console.log('Seed completed successfully!');
  console.log(`Created ${users.length} users`);
  console.log(`Created ${30 * users.length} mood logs`);
  console.log(`Created ${sortedPairs.length} friendships`);
  console.log(`Created 1 group with ${users.length} members`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
