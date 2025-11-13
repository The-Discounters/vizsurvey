'use client';

import { Container } from '@mui/material';
import PostSurveyExperience from '../../components/PostSurveyExperience.jsx';

export const dynamic = 'force-dynamic';

export default function ExperienceQuestionairePage() {
  return (
    <Container maxWidth={false} disableGutters>
      <PostSurveyExperience />
    </Container>
  );
}
