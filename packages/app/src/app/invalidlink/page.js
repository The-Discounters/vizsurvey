'use client';

import { Container } from '@mui/material';
import InvalidSurveyLink from '../../components/InvalidSurveyLink.jsx';

export const dynamic = 'force-dynamic';

export default function InvalidLinkPage() {
  return (
    <Container maxWidth={false} disableGutters>
      <InvalidSurveyLink />
    </Container>
  );
}
