'use client';

import React from 'react';
import { Container } from '@mui/material';
import InvalidSurveyLink from '../components/InvalidSurveyLink.jsx';
import DevHome from '../components/DevHome.jsx';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    // You can also log error messages to an error reporting service here
  }

  render() {
    if (this.state.errorInfo) {
      // Error path
      return <InvalidSurveyLink />;
    }
    // Normally, just render children
    return this.props.children;
  }
}

export default function Home() {
  return (
    <Container maxWidth={false} disableGutters>
      <ErrorBoundary>
        {process.env.NEXT_PUBLIC_ENV !== 'production' ? (
          <DevHome />
        ) : (
          <InvalidSurveyLink />
        )}
      </ErrorBoundary>
    </Container>
  );
}
