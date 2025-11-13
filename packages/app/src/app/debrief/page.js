'use client';

export const dynamic = 'force-dynamic';

import { Container } from '@mui/material';
import Debrief from '../../components/Debrief.jsx';

export default function DebriefPage() {
  return (
    <Container maxWidth={false} disableGutters>
      <Debrief />
    </Container>
  );
}
