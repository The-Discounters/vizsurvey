'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { getStatus, initializeSurvey } from '../features/questionSlice.js';
import { StatusType } from '@the-discounters/types';
import { navigateFromStatus } from './Navigate.js';
import Spinner from './Spinner.js';

const GenTreatmentId = () => {
  const status = useSelector(getStatus);
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(
      initializeSurvey({
        treatmentId: searchParams.get('treatment_id'),
        sessionId: searchParams.get('session_id'),
        participantId: searchParams.get('participant_id'),
        studyId: searchParams.get('study_id'),
        userAgent: navigator.userAgent,
        treatmentIds: searchParams.get('treatment_ids'),
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status !== StatusType.Unitialized && status !== StatusType.Fetching) {
      const path = navigateFromStatus(status);
      router.push(path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return <Spinner text="The application is initializing..." />;
};

export default GenTreatmentId;
