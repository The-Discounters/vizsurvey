'use client';

import { Suspense } from 'react';
import { Container } from '@mui/material';
import MELSurveyCompare from '../../components/MELSurveyCompare.jsx';

export const dynamic = 'force-dynamic';

export default function CompareSurveysPage() {
  return (
    <Container maxWidth={false} disableGutters>
      <Suspense fallback={<div>Loading...</div>}>
        <MELSurveyCompare />
      </Suspense>
    </Container>
  );
}
