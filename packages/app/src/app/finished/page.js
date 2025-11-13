'use client';

export const dynamic = 'force-dynamic';

import { Container } from '@mui/material';
import Finished from '../../components/Finished.jsx';

export default function FinishedPage() {
  return (
    <Container maxWidth={false} disableGutters>
      <Finished />
    </Container>
  );
}
