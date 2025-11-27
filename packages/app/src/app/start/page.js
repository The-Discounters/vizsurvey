'use client';

import { Suspense } from 'react';
import { Container } from '@mui/material';
import GenTreatmentId from '../../components/GenTreatmentId.jsx';

export default function StartPage() {
  return (
    <Container maxWidth={false} disableGutters>
      <Suspense fallback={<div>Loading...</div>}>
        <GenTreatmentId />
      </Suspense>
    </Container>
  );
}
