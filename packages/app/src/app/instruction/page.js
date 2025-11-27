'use client';

import { Container } from '@mui/material';
import Instructions from '../../components/Instructions.jsx';

export const dynamic = 'force-dynamic';

export default function InstructionPage() {
  return (
    <Container maxWidth={false} disableGutters>
      <Instructions />
    </Container>
  );
}
