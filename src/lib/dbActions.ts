'use server';

import { Stuff, Condition, Profile, StudySession } from '@prisma/client';
import { hash } from 'bcrypt';
import { redirect } from 'next/navigation';
import { prisma } from './prisma';

/**
 * Adds a new stuff to the database.
 * @param stuff, an object with the following properties: name, quantity, owner, condition.
 */
export async function addStuff(stuff: { name: string; quantity: number; owner: string; condition: string }) {
  // console.log(`addStuff data: ${JSON.stringify(stuff, null, 2)}`);
  let condition: Condition = 'good';
  if (stuff.condition === 'poor') {
    condition = 'poor';
  } else if (stuff.condition === 'excellent') {
    condition = 'excellent';
  } else {
    condition = 'fair';
  }
  await prisma.stuff.create({
    data: {
      name: stuff.name,
      quantity: stuff.quantity,
      owner: stuff.owner,
      condition,
    },
  });
  // After adding, redirect to the list page
  redirect('/list');
}

/**
 * Edits an existing stuff in the database.
 * @param stuff, an object with the following properties: id, name, quantity, owner, condition.
 */
export async function editStuff(stuff: Stuff) {
  // console.log(`editStuff data: ${JSON.stringify(stuff, null, 2)}`);
  await prisma.stuff.update({
    where: { id: stuff.id },
    data: {
      name: stuff.name,
      quantity: stuff.quantity,
      owner: stuff.owner,
      condition: stuff.condition,
    },
  });
  // After updating, redirect to the list page
  redirect('/list');
}

export async function createProfile(profile: Profile) {
  // Check if a profile with the given userId exists
  const existingProfile = await prisma.profile.findUnique({
    where: { userId: profile.userId },
  });

  if (existingProfile) {
    // If profile exists, update it
    await prisma.profile.update({
      where: { userId: profile.userId },
      data: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        major: profile.major,
        social: profile.social,
        bio: profile.bio,
        collegeRole: profile.collegeRole,
        profilePicUrl: profile.profilePicUrl,
      },
    });
  } else {
    // If profile does not exist, create a new one
    await prisma.profile.create({
      data: {
        userId: profile.userId,
        firstName: profile.firstName,
        lastName: profile.lastName,
        major: profile.major,
        social: profile.social,
        bio: profile.bio,
        collegeRole: profile.collegeRole,
        profilePicUrl: profile.profilePicUrl,
      },
    });
  }
  // Redirect after operation (server-side redirect)
  return redirect('/myProfile'); // Ensure you're using the proper `redirect` function
}

export async function editProfile(profile: Profile) {
  // Check if a profile with the given userId exists
  const existingProfile = await prisma.profile.findUnique({
    where: { userId: profile.userId },
  });

  if (existingProfile) {
    // If profile exists, update it
    await prisma.profile.update({
      where: { userId: profile.userId },
      data: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        major: profile.major,
        social: profile.social,
        bio: profile.bio,
        collegeRole: profile.collegeRole,
        profilePicUrl: profile.profilePicUrl,
      },
    });
  } else {
    // If profile does not exist, create a new one
    await prisma.profile.create({
      data: {
        userId: profile.userId,
        firstName: profile.firstName,
        lastName: profile.lastName,
        major: profile.major,
        social: profile.social,
        bio: profile.bio,
        collegeRole: profile.collegeRole,
        profilePicUrl: profile.profilePicUrl,
      },
    });
  }
  // Redirect after operation (server-side redirect)
  return redirect('/myProfile'); // Ensure you're using the proper `redirect` function
}

export async function getProfile(userId: number | string) {
  // Ensure userId is converted to a number
  const parsedUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;

  try {
    // Fetch the profile from the database
    const profile = await prisma.profile.findUnique({
      where: {
        userId: parsedUserId,
      },
      select: {
        // Select only the fields you want to return
        firstName: true,
        lastName: true,
        major: true,
        social: true,
        bio: true,
        collegeRole: true,
        userId: true,
        profilePicUrl: true,
      },
    });

    // Return the profile or null if not found
    return profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

export async function createSession(studySession: StudySession) {
  // Check if a study session with the given userId exists
  // If profile does not exist, create a new one

  await prisma.studySession.create({
    data: {
      title: studySession.title,
      added: studySession.added,
      userId: studySession.userId,
      description: studySession.description,
      class: studySession.class,
      place: studySession.place,
      sessionDate: studySession.sessionDate,
      startTime: studySession.startTime,
      endTime: studySession.endTime,
      image: studySession.image,
      users: {
        connect: { id: studySession.userId },
      },
    },
  });
  // After adding, redirect to the sessions page
  redirect('/sessions');
}

export async function addSession(studySessionId: number, userId: number) {
  // Check if the study session exists
  const sessionExists = await prisma.studySession.findUnique({
    where: { id: studySessionId },
  });

  if (!sessionExists) {
    throw new Error(`Study session with ID ${studySessionId} does not exist.`);
  }

  // Update the session to include the current user
  await prisma.studySession.update({
    where: { id: studySessionId },
    data: {
      users: {
        connect: { id: userId }, // Ensure userId is defined
      },
    },
  });
  redirect('/mySessions');
}

export async function addBuddy(buddyId: number, userId: number) {
  // Check if the buddy exists
  const buddyExists = await prisma.buddy.findUnique({
    where: { id: buddyId },
  });

  if (!buddyExists) {
    throw new Error(`Buddy with ID ${buddyId} does not exist.`);
  }

  // Update the buddy to include the current user
  await prisma.buddy.update({
    where: { id: buddyId },
    data: {
      users: {
        connect: { id: userId },
      },
    },
  });
  redirect('/myBuddies');
}

export async function removeBuddy(buddyId: number, userId: number) {
  await prisma.buddy.update({
    where: { id: buddyId },
    data: {
      users: {
        disconnect: { id: userId },
      },
    },
  });
  redirect('/myBuddy');
}

export async function leaveSession(studySessionId: number, userId: number) {
  await prisma.studySession.update({
    where: { id: studySessionId },
    data: {
      users: {
        disconnect: { id: userId },
      },
    },
  });
  redirect('/mySessions');
}

export async function updateSession(studySessionId: number, studySession: Partial<StudySession>) {
  await prisma.studySession.update({
    where: { id: studySessionId },
    data: {
      title: studySession.title,
      description: studySession.description,
      class: studySession.class,
      place: studySession.place,
      sessionDate: studySession.sessionDate,
      startTime: studySession.startTime,
      endTime: studySession.endTime,
      image: studySession.image,
      users: {
        connect: { id: studySession.userId },
      },
    },
  });

  return redirect('/sessions');
}

export async function getSessionById(id: number) {
  return prisma.studySession.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
          id: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });
}

export async function deleteSession(id: number) {
  await prisma.studySession.delete({
    where: { id },
  });
  redirect('/sessions');
}
/**
 * Deletes an existing stuff from the database.
 * @param id, the id of the stuff to delete.
 */
export async function deleteStuff(id: number) {
  // console.log(`deleteStuff id: ${id}`);
  await prisma.stuff.delete({
    where: { id },
  });
  // After deleting, redirect to the list page
  redirect('/list');
}

/**
 * Creates a new user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function createUser(credentials: { email: string; password: string }) {
  // console.log(`createUser data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password, 10);

  const user = await prisma.user.create({
    data: {
      email: credentials.email,
      password,
    },
    select: {
      id: true,
    },
  });
  return user;
}

export async function createBuddy(user: { id: number }) {
  await prisma.buddy.create({
    data: {
      userDupe: {
        connect: { id: user.id },
      },
    },
  });
}

/**
 * Changes the password of an existing user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function changePassword(credentials: { email: string; password: string }) {
  // console.log(`changePassword data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password, 10);
  await prisma.user.update({
    where: { email: credentials.email },
    data: {
      password,
    },
  });
}
