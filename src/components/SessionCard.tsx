'use client';

import { useState } from 'react';
import { addSession, leaveSession } from '@/lib/dbActions';
import { StudySession } from '@prisma/client';
import { Card, Button } from 'react-bootstrap';
import swal from 'sweetalert';
import SearchSessions from './SearchSessions';
import '../styles/sessionCard.style.css';

type ExtendedStudySession = StudySession & {
  owner: {
    id: number;
    profile?: {
      firstName: string;
      lastName: string;
    };
  };
  users: {
    id: number;
    profile?: {
      firstName: string;
      lastName: string;
    };
  }[];
};

const SessionCard = ({
  studySessions,
  currentUser,
}: {
  studySessions: ExtendedStudySession[];
  currentUser: number;
}) => {
  const [search, setSearch] = useState('');

  const addSessionBtn = async (studySession: ExtendedStudySession) => {
    console.log('Study Session ID:', studySession.id);
    console.log('Current User ID:', currentUser);
    await addSession(studySession.id, currentUser);
    swal('Success', 'Added Session', 'success', {
      timer: 1000,
    });
  };
  const leaveSessionBtn = async (studySession: ExtendedStudySession) => {
    console.log('Leaving Study Session ID:', studySession.id);
    console.log('Current User ID:', currentUser);
    await leaveSession(studySession.id, currentUser);
    swal('Success', 'Left Session', 'success', {
      timer: 1000,
    });
  };
  const studySessionsSearch = studySessions.filter((session) => {
    const firstName = session.owner.profile?.firstName ?? '';
    const lastName = session.owner.profile?.lastName ?? '';
    const combinedName = `${firstName} ${lastName}`.toLowerCase();
    const searchLower = search.toLowerCase();

    return (
      session.title.toLowerCase().includes(searchLower) ||
      session.description.toLowerCase().includes(searchLower) ||
      session.owner.profile?.firstName?.toLowerCase().includes(searchLower) ||
      session.owner.profile?.lastName?.toLowerCase().includes(searchLower) ||
      combinedName.includes(searchLower) ||
      session.class.toLowerCase().includes(searchLower) ||
      session.place.toLowerCase().includes(searchLower)
    );
  });
  return (
    <div>
      <div>
        <SearchSessions search={search} setSearch={setSearch} />
      </div>
      <div className="sessionCards">
        {studySessionsSearch.map((studySessionInfo) => (
          <div key={studySessionInfo.id} className="sessionCardBorder">
            <Card className="sessionCardCont">
              <Card.Img
                variant="top"
                src="/cardImgExample.jpg"
                className="cardImg"
                style={{ height: '150px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title className="fixOverflow">{studySessionInfo.title}</Card.Title>
                <div>
                  <p>{studySessionInfo.description}</p>
                  <p>
                    <strong>Organizer: </strong>
                    {studySessionInfo.owner?.profile
                      ? `${studySessionInfo.owner.profile.firstName} ${studySessionInfo.owner.profile.lastName}`
                      : 'Unknown'}
                  </p>
                  <p>
                    <strong>Buddies: </strong>
                    {studySessionInfo.users?.length > 0 &&
                      studySessionInfo.users
                        .map((buddy) => `${buddy.profile?.firstName || ''} ${buddy.profile?.lastName || ''}`.trim())
                        .join(', ')}
                    {(!studySessionInfo.users || studySessionInfo.users.length === 0) && 'No buddies yet'}
                  </p>
                  <p>
                    <strong>Class: </strong>
                    {studySessionInfo.class}
                  </p>
                  <p>
                    <strong>Where: </strong>
                    {studySessionInfo.place}
                  </p>
                  <p>
                    <strong>Date: </strong>
                    {new Date(studySessionInfo.sessionDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p>
                    <strong>Time: </strong>
                    {new Date(studySessionInfo.startTime).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                    -
                    {new Date(studySessionInfo.endTime).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </p>
                </div>
                <div className="py-1" />

                {currentUser == studySessionInfo.owner.id ? (
                  <Button className="requestBtn" href={`/editSession?id=${studySessionInfo.id}`}>
                    Edit
                  </Button>
                ) : studySessionInfo.users.some(user => user.id === currentUser) ? (
                  <Button
                    className="requestBtn"
                    onClick={() => leaveSessionBtn(studySessionInfo)}
                  >
                    Leave Session
                  </Button>
                ) : (
                  <Button className="requestBtn" onClick={() => addSessionBtn(studySessionInfo)}>
                    Add
                  </Button>
                )}
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionCard;
