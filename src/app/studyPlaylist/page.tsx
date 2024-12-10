// 'use client';

// import { useState } from 'react';
import authOptions from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { Buddy } from '@prisma/client';
// import SearchBuddies from '../../components/SearchBuddies';
import { Card } from 'react-bootstrap';
import BuddyCard from '../../components/BuddyCard';
import '../../styles/studyPlaylist.style.css';

type ExtendedBuddy = Buddy & {
  userDupe: {
    id: number;
    profile?: {
      firstName: string;
      lastName: string;
      bio: string;
      major: string;
      collegeRole: string;
      social: string;
      profilePicUrl: string;
    };
  };
};

const studyPlaylist = async () => {
  // const [search, setSearch] = useState('');

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    return <div>Session not found</div>;
  }
  const userSession = session as unknown as { user: { email: string; id: string; randomKey: string } };
  const currentUser = parseInt(userSession.user.id, 10);

  // Fetch buddies on the server

  const buddyList: ExtendedBuddy[] = (await prisma.buddy.findMany({
    include: {
      userDupe: {
        include: {
          profile: true,
        },
      },
    },
  })) as ExtendedBuddy[];

  return (
    <div className="playlist">
      {/* Page Title */}
      <h1 className="studyPlaylistTitle">
        <strong>Study Playlist</strong>
      </h1>

      {/* Playlist Container */}
      <div className="playlistListDiv">
        <div className="playlistList">
          {/* Playlist 1 */}
          <Card className="playlistCard">
            <h3>Playlist 1</h3>
            <input
              type="text"
              value="https://spotify/playlist1"
              readOnly
            />
          </Card>

          {/* Playlist 2 */}
          <Card className="playlistCard">
            <h3>Playlist 2</h3>
            <input
              type="text"
              value="https://spotify/playlist2"
              readOnly
            />
          </Card>

          {/* Playlist 3 */}
          <Card className="playlistCard">
            <h3>Playlist 3</h3>
            <input
              type="text"
              value="https://spotify/playlist3"
              readOnly
            />
          </Card>
        </div>
      </div>
    </div>
  );
};
export default studyPlaylist;
