'use client';

import { Container } from '@mui/material';
import PostSurveyFinancialLit from '../../components/PostSurveyFinancialLit.jsx';

export const dynamic = 'force-dynamic';

export default function FinancialQuestionairePage() {
  return (
    <Container maxWidth={false} disableGutters>
      <PostSurveyFinancialLit />
    </Container>
  );
}
