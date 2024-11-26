'use client';

import { useSession } from 'next-auth/react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import swal from 'sweetalert';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { redirect } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { createProfile } from '@/lib/dbActions';
import { CreateProfileSchema } from '@/lib/validationSchemas';
import '../../styles/editProfile.style.css';

const onSubmit = async (data: { firstName: string; lastName: string; major: string }, session: any) => {
  // console.log(`onSubmit data: ${JSON.stringify(data, null, 2)}`);
  const userId = parseInt(session?.user?.id, 10); // Assuming userId is available in session
  await createProfile({ ...data, userId, id: userId });

  swal('Success', 'created profile', 'success', {
    timer: 1000,
  });
};

const EditProfile: React.FC = () => {
  const { data: session, status } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CreateProfileSchema),
  });
  if (status === 'loading') {
    return <LoadingSpinner />;
  }
  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  return (
    <div className="p-5">
      <h1 className="createSessionTitle text-center">
        <strong>Edit Profile</strong>
      </h1>
      <Container className="py-3">
        <Row className="justify-content-center">
          <Col xs={10}>
            <Card className="thebox">
              <Card.Body>
                {/* Profile Image Section */}
                <div className="profile-image-container">
                  <div className="profile-image">
                    <div className="add-icon-circle">
                      <span className="add-icon">+</span>
                    </div>
                  </div>
                </div>
                {/* Form Section */}
                <Form onSubmit={handleSubmit((data) => onSubmit(data, session))}>
                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label />
                        <input
                          type="text"
                          {...register('firstName')}
                          className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                          placeholder="First Name"
                        />
                        <div className="invalid-feedback" />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label />
                        <input
                          type="text"
                          {...register('lastName')}
                          className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                          placeholder="Last Name"
                        />
                        <div className="invalid-feedback" />
                      </Form.Group>
                    </Col>
                  </Row>
                  {/* <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label />
                      <input type="text" className="form-control" placeholder="Username" />
                      <div className="invalid-feedback" />
                    </Form.Group>
                  </Col>
                </Row> */}
                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label />
                        <input
                          type="text"
                          {...register('major')}
                          className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                          placeholder="Major"
                        />
                        <div className="invalid-feedback" />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label />
                        <input type="text" className="form-control" placeholder="Socials" />
                        <div className="invalid-feedback" />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group>
                    <Form.Label />
                    <textarea className="form-control" placeholder="Bio: Tell us about yourself!" />
                    <div className="invalid-feedback" />
                  </Form.Group>
                  <input type="hidden" />
                  <Form.Group className="form-group">
                    <Row className="pt-3">
                      <Col />
                      <Col />
                      <Col />
                      <Col>
                        <Button className="cSbutton" type="submit" variant="primary">
                          Save Profile
                        </Button>
                      </Col>
                      <Col />
                      <Col />
                      <Col />
                    </Row>
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EditProfile;
