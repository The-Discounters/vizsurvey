'use client';

import { Container } from '@mui/material';
import { Consent } from '../../components/Consent.jsx';

export const dynamic = 'force-dynamic';

export default function ConsentPage() {
  return (
    <Container maxWidth={false} disableGutters>
      <Consent />
    </Container>
  );
}
