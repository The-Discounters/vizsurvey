export class StatusError extends Error {
  constructor({
    message,
    httpcode,
    reason,
    participantId,
    studyId,
    sessionId,
    msg,
    request,
  }) {
    super(message);
    this._reason = reason;
    this._httpcode = httpcode;
    this._msg = msg;
    this._participantId = participantId;
    this._studyId = studyId;
    this._sessionId = sessionId;
    this._request = request;
  }

  get reason() {
    return this._reason;
  }

  get msg() {
    return this._msg;
  }

  get httpcode() {
    return this._httpcode;
  }

  get participantId() {
    this._participantId;
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
