export class StatusError extends Error {
  constructor({
    message,
    httpstatus,
    reason,
    participantId,
    studyId,
    sessionId,
    request,
  }) {
    super(message);
    this._reason = reason;
    this._httpstatus = httpstatus;
    this._message = message;
    this._participantId = participantId;
    this._studyId = studyId;
    this._sessionId = sessionId;
    this._request = request;
  }

  get reason() {
    return this._reason;
  }

  get message() {
    return this._message;
  }

  get httpstatus() {
    return this._httpstatus;
  }

  get participantId() {
    return this._participantId;
  }

  get studyId() {
    return this._studyId;
  }

  get sessionId() {
    return this._sessionId;
  }

  get request() {
    return this._request;
  }
}
