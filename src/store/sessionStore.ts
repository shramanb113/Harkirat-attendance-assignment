
export interface ActiveSession {
  classId: string;
  startedAt: string;
  attendance: {
    [studentId: string]: string;
  };
}

export let activeSession: ActiveSession | null = null;

export const setActiveSession = (newSession: ActiveSession) => {
  activeSession = newSession;
};

export const resetSession = () => {
  activeSession = null;
};