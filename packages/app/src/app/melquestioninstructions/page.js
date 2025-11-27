'use client';

export const dynamic = 'force-dynamic';

import { Container } from '@mui/material';
import MELQuestionInstructions from '../../components/MELQuestionInstructions.jsx';

export default function MELQuestionInstructionsPage() {
  return (
    <Container maxWidth={false} disableGutters>
      <MELQuestionInstructions />
    </Container>
  );
}
