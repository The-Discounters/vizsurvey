'use client';

import { Container } from '@mui/material';
import Demographic from '../../components/Demographic.jsx';

export const dynamic = 'force-dynamic';

export default function DemographicPage() {
  return (
    <Container maxWidth={false} disableGutters>
      <Demographic />
    </Container>
  );
}
