'use client';

import React from 'react';
import { useDispatch } from 'react-redux';
import { clearState } from '../features/questionSlice.js';
import { getRandomIntInclusive } from '@the-discounters/util';

const TEST_LINKS_STUDY_ID = 'xxxxxxxxxxxxxxxxxxxxxxx'; // The prolificId of the study to lauch into from the test links.
const TEST_COMPARE_STUDY_IDS =
  '6685e0aae211360468e28eb4,xxxxxxxxxxxxxxxxxxxxxxxx'; // The prolific study ids to compare on the compare page.
const TEST_LINKS_COMPARE_STUDY_DESC =
  'Trial within experiment with extended 2x and 3x axis.'; // The description of the experiment above.
const TEST_COMPARE_TREATMENT_IDS = '3';
const QUESTION_ORDER_IDS = '1,2,3,4,5,6,7,8';

const DevHome = () => {
  const dispatch = useDispatch();
  return (
    <div id="home-text">
      <div key="testlinks-parent">
        <p>
          This page will not be available when deployed in production since the
          participants will be provided a link with the treatment id in the URL.
          The links below are provided for convience in testing in non
          production environments. Click a link below to launch one of the
          experiments
        </p>
        <div key="testlinks-list">
          <p>
            <b>Test Links</b>
          </p>
          <table style={{ border: '1px solid black' }}>
            <tbody>
              <tr style={{ border: '1px solid black' }}>
                <th style={{ border: '1px solid black' }}>Environment</th>
                <th style={{ border: '1px solid black' }}>Within Subject</th>
                <th style={{ border: '1px solid black' }}>Between Subject</th>
                <th style={{ border: '1px solid black' }}>Word</th>
                <th style={{ border: '1px solid black' }}>Barchart</th>
                <th style={{ border: '1px solid black' }}>Barchart Extended</th>
              </tr>
              <tr style={{ border: '1px solid black' }}>
                <td style={{ border: '1px solid black' }}>development</td>
                <td style={{ border: '1px solid black' }}>
                  <a
                    href={`https://main.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=testwithin&session_id=3`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                    id="1"
                  >
                    Within Subject.
                  </a>
                </td>
                <td style={{ border: '1px solid black' }}>
                  <a
                    id="2"
                    href={`https://main.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=testbetween&session_id=3`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Between Subject.
                  </a>
                </td>
                <td style={{ border: '1px solid black' }}>
                  <a
                    id="3"
                    href={`https://main.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=${TEST_LINKS_STUDY_ID}&session_id=3&treatment_ids=%5B1%5D`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Word
                  </a>
                </td>
                <td style={{ border: '1px solid black' }}>
                  <a
                    id="4"
                    href={`https://main.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=${TEST_LINKS_STUDY_ID}&session_id=3&treatment_ids=%5B2%5D`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Bar Chart
                  </a>
                </td>
                <td style={{ border: '1px solid black' }}>
                  <a
                    id="5"
                    href={`https://main.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=${TEST_LINKS_STUDY_ID}&session_id=3&treatment_ids=%5B3%5D`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Bar Chart Extended
                  </a>
                </td>
              </tr>
              <tr style={{ border: '1px solid black' }}>
                <td style={{ border: '1px solid black' }}>localhost</td>
                <td style={{ border: '1px solid black' }}>
                  <a
                    id="1"
                    href={`/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=${TEST_LINKS_STUDY_ID}&session_id=3`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Within Subject.
                  </a>
                </td>
                <td style={{ border: '1px solid black' }}>
                  <a
                    id="2"
                    href={`/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=testbetween&session_id=3`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Between Subject.
                  </a>
                </td>
                <td style={{ border: '1px solid black' }}>
                  <a
                    id="3"
                    href={`/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=${TEST_LINKS_STUDY_ID}&session_id=3&treatment_ids=%5B1%5D`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Word
                  </a>
                </td>
                <td style={{ border: '1px solid black' }}>
                  <a
                    id="4"
                    href={`/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=${TEST_LINKS_STUDY_ID}&session_id=3&treatment_ids=%5B2%5D`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Bar Chart
                  </a>
                </td>
                <td style={{ border: '1px solid black' }}>
                  <a
                    id="5"
                    href={`/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=${TEST_LINKS_STUDY_ID}&session_id=3&treatment_ids=%5B3%5D`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Bar Chart Extended
                  </a>
                </td>
              </tr>
              <tr style={{ border: '1px solid black' }}>
                <td style={{ border: '1px solid black' }}>staging</td>
                <td style={{ border: '1px solid black' }}>
                  <a
                    id="1"
                    href={`https://staging.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=testwithin&session_id=3`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Within Subject.
                  </a>
                </td>
                <td style={{ border: '1px solid black' }}>
                  <a
                    id="2"
                    href={`https://staging.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=testbetween&session_id=3`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Between Subject.
                  </a>
                </td>
                <td style={{ border: '1px solid black' }}>
                  <a
                    id="3"
                    href={`https://staging.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=${TEST_LINKS_STUDY_ID}&session_id=3&treatment_ids=%5B1%5D`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Word
                  </a>
                </td>
                <td style={{ border: '1px solid black' }}>
                  <a
                    id="4"
                    href={`https://staging.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=${TEST_LINKS_STUDY_ID}&session_id=3&treatment_ids=%5B2%5D`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Bar Chart
                  </a>
                </td>
                <td style={{ border: '1px solid black' }}>
                  <a
                    id="5"
                    href={`https://staging.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=${TEST_LINKS_STUDY_ID}&session_id=3&treatment_ids=%5B3%5D`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Bar Chart Extended
                  </a>
                </td>
              </tr>
              <tr style={{ border: '1px solid black' }}>
                <td style={{ border: '1px solid black' }}>production</td>
                <td style={{ border: '1px solid black' }}>
                  <a
                    id="1"
                    href={`https://release.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=testwithin&session_id=3`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Within Subject.
                  </a>
                </td>
                <td style={{ border: '1px solid black' }}>
                  <a
                    id="2"
                    href={`https://release.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=testbetween&session_id=3`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Between Subject.
                  </a>
                </td>
                <td style={{ border: '1px solid black' }}>
                  <a
                    id="3"
                    href={`https://release.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=${TEST_LINKS_STUDY_ID}&session_id=3&treatment_ids=%5B1%5D`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Word
                  </a>
                </td>
                <td style={{ border: '1px solid black' }}>
                  <a
                    id="4"
                    href={`https://release.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=${TEST_LINKS_STUDY_ID}&session_id=3&treatment_ids=%5B2%5D`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Bar Chart
                  </a>
                </td>
                <td style={{ border: '1px solid black' }}>
                  <a
                    id="5"
                    href={`https://release.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=${TEST_LINKS_STUDY_ID}&session_id=3&treatment_ids=%5B3%5D`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Bar Chart Extended
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <br></br>
        <div key="testlinks-list-experiment-compare">
          <p>
            <b>Test Links Comparing Experiment Configurations</b>
          </p>
          <table style={{ border: '1px solid black' }}>
            <tbody>
              <tr style={{ border: '1px solid black' }}>
                <th style={{ border: '1px solid black' }}>Environment</th>
                <th style={{ border: '1px solid black' }}>Barchart Extended</th>
              </tr>
              <tr style={{ border: '1px solid black' }}>
                <td style={{ border: '1px solid black' }}>development</td>
                <td style={{ border: '1px solid black' }}>
                  <a
                    id="1"
                    href={`https://main.d2ptxb5fbsc082.amplifyapp.com/comparesurveys?study_ids=${encodeURIComponent(
                      TEST_COMPARE_STUDY_IDS
                    )}&treatment_ids=${encodeURIComponent(
                      TEST_COMPARE_TREATMENT_IDS
                    )}&question_order_ids=${encodeURIComponent(
                      QUESTION_ORDER_IDS
                    )}`}
                  >
                    {TEST_LINKS_COMPARE_STUDY_DESC}
                  </a>
                </td>
              </tr>
              <tr style={{ border: '1px solid black' }}>
                <td style={{ border: '1px solid black' }}>localhost</td>
                <td style={{ border: '1px solid black' }}>
                  <a
                    id="1"
                    href={`/comparesurveys?study_ids=${encodeURIComponent(
                      TEST_COMPARE_STUDY_IDS
                    )}&treatment_ids=${encodeURIComponent(
                      TEST_COMPARE_TREATMENT_IDS
                    )}&question_order_ids=${encodeURIComponent(
                      QUESTION_ORDER_IDS
                    )}`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    {TEST_LINKS_COMPARE_STUDY_DESC}
                  </a>
                </td>
              </tr>
              <tr style={{ border: '1px solid black' }}>
                <td style={{ border: '1px solid black' }}>staging</td>
                <td style={{ border: '1px solid black' }}>
                  <a
                    id="1"
                    href={`https://staging.d2ptxb5fbsc082.amplifyapp.com/comparesurveys?study_ids=${encodeURIComponent(
                      TEST_COMPARE_STUDY_IDS
                    )}&treatment_ids=${encodeURIComponent(
                      TEST_COMPARE_TREATMENT_IDS
                    )}&question_order_ids=${encodeURIComponent(
                      QUESTION_ORDER_IDS
                    )}`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    {TEST_LINKS_COMPARE_STUDY_DESC}
                  </a>
                </td>
              </tr>
              <tr style={{ border: '1px solid black' }}>
                <td style={{ border: '1px solid black' }}>production</td>
                <td style={{ border: '1px solid black' }}>
                  <a
                    id="1"
                    href={`https://release.d2ptxb5fbsc082.amplifyapp.com/comparesurveys?study_ids=${encodeURIComponent(
                      TEST_COMPARE_STUDY_IDS
                    )}&treatment_ids=${encodeURIComponent(
                      TEST_COMPARE_TREATMENT_IDS
                    )}&question_order_ids=${encodeURIComponent(
                      QUESTION_ORDER_IDS
                    )}`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    {TEST_LINKS_COMPARE_STUDY_DESC}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          <br></br>
          <p>
            <b>Reference Information</b>
          </p>
          <a href="https://github.com/The-Discounters/vizsurvey">
            Github README.md
          </a>
          <br></br>
          <a href="https://github.com/The-Discounters">public website</a>
          <p></p>
          <p>
            The prolific production url is:
            https://release.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=&#123;&#123;%PROLIFIC_PID%&#125;&#125;&study_id=&#123;&#123;%STUDY_ID%&#125;&#125;&session_id=&#123;&#123;%session_id%&#125;&#125;
          </p>
        </div>
      </div>
    </div>
  );
};

export default DevHome;
