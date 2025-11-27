'use client';

import { Container } from '@mui/material';
import MELSurvey from '../../components/MELSurvey.jsx';

export const dynamic = 'force-dynamic';

export default function SurveyPage() {
  return (
    <Container maxWidth={false} disableGutters>
      <MELSurvey />
    </Container>
  );
}
