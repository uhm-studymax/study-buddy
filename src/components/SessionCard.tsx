'use client';

import { addSession } from '@/lib/dbActions';
import { StudySession } from '@prisma/client';
import { Card, Col, Row, Button } from 'react-bootstrap';
import swal from 'sweetalert';
import ListGroup from 'react-bootstrap/ListGroup';
import '../styles/sessionCard.style.css';

type ExtendedStudySession = StudySession & {
  owner: {
    profile?: {
      firstName: string;
      lastName: string;
    };
  };
};

// const addSessionBtn = async (studySession: ExtendedStudySession) => {
//   await addSession({ id: currentUser, title: studySession.title, userId: currentUser, added: true });
//   return <div>Session Added</div>;
// };

// Remove the async and change to a regular functional component
const SessionCard = ({
  studySessions,
  currentUser,
}: {
  studySessions: ExtendedStudySession[];
  currentUser: number;
}) => {
  const addSessionBtn = async (studySession: ExtendedStudySession) => {
    console.log('Study Session ID:', studySession.id);
    console.log('Current User ID:', currentUser);
    await addSession(studySession.id, currentUser);
    swal('Success', 'Added Session', 'success', {
      timer: 1000,
    });
  };

  return (
    <div className="sessionCards">
      {studySessions.map((studySessionInfo) => (
        <div key={studySessionInfo.id} className="sessionCardBorder">
          <Card className="sessionCardCont">
            <Card.Img
              variant="top"
              src="/cardImgExample.jpg"
              className="cardImg"
              style={{ height: '150px', objectFit: 'cover' }}
            />
            <Card.Body>
              <Card.Title>{studySessionInfo.title}</Card.Title>
              <Card.Text>Come Study for ICS311 Final</Card.Text>
              <Card.Text>
                <strong>Buddies: </strong>
                Ralph, Wilson, Lukas, Reo
              </Card.Text>
              <ListGroup className="list-group-flush no-gap py-1">
                <Row>
                  <Col xs={6}>
                    <ListGroup.Item className="p-1">
                      <strong>Class:</strong>
                      <br />
                      ICS311
                    </ListGroup.Item>
                  </Col>
                  <Col xs={6}>
                    <ListGroup.Item className="p-1">
                      <strong>Organizer:</strong>
                      <br />
                      {studySessionInfo.owner?.profile
                        ? `${studySessionInfo.owner.profile.firstName} ${studySessionInfo.owner.profile.lastName}`
                        : 'Unknown'}
                    </ListGroup.Item>
                  </Col>
                </Row>
                <Row>
                  <Col xs={6}>
                    <ListGroup.Item className="p-1">
                      <strong>Time:</strong>
                      <br />
                      3:00PM-5:00PM
                    </ListGroup.Item>
                  </Col>
                  <Col xs={6}>
                    <ListGroup.Item className="p-1">
                      <strong>Place:</strong>
                      <br />
                      Hamilton Library
                    </ListGroup.Item>
                  </Col>
                </Row>
              </ListGroup>
              <Button className="requestBtn" onClick={() => addSessionBtn(studySessionInfo)}>
                Add
              </Button>
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default SessionCard;
