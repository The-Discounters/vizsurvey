'use client';

import { Container } from '@mui/material';
import Break from '../../components/Break.jsx';

export const dynamic = 'force-dynamic';

export default function BreakPage() {
  return (
    <Container maxWidth={false} disableGutters>
      <Break />
    </Container>
  );
}
