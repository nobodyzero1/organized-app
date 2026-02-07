// services/app/assignments_schedule_export.ts
import { PersonType } from '@definition/person';
import { SourceWeekType } from '@definition/sources';
import { ASSIGNMENT_PATH } from '@constants/index';
import { store } from '@states/index';
import { personsByViewState } from '@states/persons';
import { schedulesState } from '@states/schedules';
import { sourcesState } from '@states/sources';
import { ApplyMinistryType } from '@definition/sources';
import { AssignmentCongregation, SchedWeekType } from '@definition/schedules';
import { AssignmentCode } from '@definition/assignment';

const ASSIGNMENT_PATHS_SECTIONS = {
  MM_CHAIRMAN: {
    MM_Chairman_A: {
      path: 'midweek_meeting.chairman.main_hall',
      config: { code: AssignmentCode.MM_Chairman },
    },
    MM_Chairman_B: {
      path: 'midweek_meeting.chairman.aux_class_1',
      config: { code: AssignmentCode.MM_AuxiliaryCounselor },
    },
  },
  MM_PRAYER: {
    MM_OpeningPrayer: {
      path: 'midweek_meeting.opening_prayer',
      config: { code: AssignmentCode.MM_Prayer },
    },
    MM_ClosingPrayer: {
      path: 'midweek_meeting.closing_prayer',
      config: { code: AssignmentCode.MM_Prayer },
    },
  },
  MM_TGW: {
    MM_TGWTalk: {
      path: 'midweek_meeting.tgw_talk',
      config: { code: AssignmentCode.MM_TGWTalk },
    },
    MM_TGWGems: {
      path: 'midweek_meeting.tgw_gems',
      config: { code: AssignmentCode.MM_TGWGems },
    },
    MM_TGWBibleReading_A: {
      path: 'midweek_meeting.tgw_bible_reading.main_hall',
      config: { code: AssignmentCode.MM_BibleReading },
    },
    MM_TGWBibleReading_B: {
      path: 'midweek_meeting.tgw_bible_reading.aux_class_1',
      config: { code: AssignmentCode.MM_BibleReading },
    },
  },
  MM_AYF_PART: {
    MM_AYFPart1_Student_A: {
      path: 'midweek_meeting.ayf_part1.main_hall.student',
      config: {},
    },
    MM_AYFPart1_Assistant_A: {
      path: 'midweek_meeting.ayf_part1.main_hall.assistant',
      config: { code: AssignmentCode.MM_AssistantOnly },
    },
    MM_AYFPart1_Student_B: {
      path: 'midweek_meeting.ayf_part1.aux_class_1.student',
      config: {},
    },
    MM_AYFPart1_Assistant_B: {
      path: 'midweek_meeting.ayf_part1.aux_class_1.assistant',
      config: { code: AssignmentCode.MM_AssistantOnly },
    },

    MM_AYFPart2_Student_A: {
      path: 'midweek_meeting.ayf_part2.main_hall.student',
      config: {},
    },
    MM_AYFPart2_Assistant_A: {
      path: 'midweek_meeting.ayf_part2.main_hall.assistant',
      config: { code: AssignmentCode.MM_AssistantOnly },
    },
    MM_AYFPart2_Student_B: {
      path: 'midweek_meeting.ayf_part2.aux_class_1.student',
      config: {},
    },
    MM_AYFPart2_Assistant_B: {
      path: 'midweek_meeting.ayf_part2.aux_class_1.assistant',
      config: { code: AssignmentCode.MM_AssistantOnly },
    },

    MM_AYFPart3_Student_A: {
      path: 'midweek_meeting.ayf_part3.main_hall.student',
      config: {},
    },
    MM_AYFPart3_Assistant_A: {
      path: 'midweek_meeting.ayf_part3.main_hall.assistant',
      config: { code: AssignmentCode.MM_AssistantOnly },
    },
    MM_AYFPart3_Student_B: {
      path: 'midweek_meeting.ayf_part3.aux_class_1.student',
      config: {},
    },
    MM_AYFPart3_Assistant_B: {
      path: 'midweek_meeting.ayf_part3.aux_class_1.assistant',
      config: { code: AssignmentCode.MM_AssistantOnly },
    },

    MM_AYFPart4_Student_A: {
      path: 'midweek_meeting.ayf_part4.main_hall.student',
      config: {},
    },
    MM_AYFPart4_Assistant_A: {
      path: 'midweek_meeting.ayf_part4.main_hall.assistant',
      config: { code: AssignmentCode.MM_AssistantOnly },
    },
    MM_AYFPart4_Student_B: {
      path: 'midweek_meeting.ayf_part4.aux_class_1.student',
      config: {},
    },
    MM_AYFPart4_Assistant_B: {
      path: 'midweek_meeting.ayf_part4.aux_class_1.assistant',
      config: { code: AssignmentCode.MM_AssistantOnly },
    },
  },
  MM_LC: {
    MM_LCPart1: {
      path: 'midweek_meeting.lc_part1',
      config: { code: AssignmentCode.MM_LCPart },
    },
    MM_LCPart2: {
      path: 'midweek_meeting.lc_part2',
      config: { code: AssignmentCode.MM_LCPart },
    },
    MM_LCPart3: {
      path: 'midweek_meeting.lc_part3',
      config: { code: AssignmentCode.MM_LCPart },
    },
  },
  MM_CBS: {
    MM_LCCBSConductor: {
      path: 'midweek_meeting.lc_cbs.conductor',
      config: { code: AssignmentCode.MM_CBSConductor },
    },
    MM_LCCBSReader: {
      path: 'midweek_meeting.lc_cbs.reader',
      config: { code: AssignmentCode.MM_CBSReader },
    },
  },
  CO: {
    MM_CircuitOverseer: {
      path: 'midweek_meeting.circuit_overseer',
      config: {},
    },
    WM_CircuitOverseer: {
      path: 'weekend_meeting.circuit_overseer',
      config: {},
    },
  },
  WM_OPENING: {
    WM_Chairman: {
      path: 'weekend_meeting.chairman',
      config: { code: AssignmentCode.WM_Chairman },
    },
  },
  WM_TALK: {
    WM_Speaker_Part1: {
      path: 'weekend_meeting.speaker.part_1',
      config: { code: AssignmentCode.WM_Speaker },
    },
    WM_Speaker_Part2: {
      path: 'weekend_meeting.speaker.part_2',
      config: { code: AssignmentCode.WM_Speaker },
    },
    WM_SubstituteSpeaker: {
      path: 'weekend_meeting.speaker.substitute',
      config: { code: AssignmentCode.WM_Speaker },
    },
    WM_Speaker_Outgoing: {
      path: 'weekend_meeting.outgoing_talks',
      config: { code: AssignmentCode.WM_Speaker },
    },
  },
  WM_WT_STUDY: {
    WM_WTStudy_Conductor: {
      path: 'weekend_meeting.wt_study.conductor',
      config: { code: AssignmentCode.WM_WTStudyConductor },
    },
    WM_WTStudy_Reader: {
      path: 'weekend_meeting.wt_study.reader',
      config: { code: AssignmentCode.WM_WTStudyReader },
    },
  },
  WM_PRAYER: {
    WM_ClosingPrayer: {
      path: 'weekend_meeting.closing_prayer',
      config: { code: AssignmentCode.WM_Prayer },
    },
    WM_OpeningPrayer: {
      path: 'weekend_meeting.opening_prayer',
      config: { code: AssignmentCode.WM_Prayer },
    },
  },
} as const;
export const ASSIGNMENT_DEFAULTS = extractConfigs(ASSIGNMENT_PATHS_SECTIONS);

export function getPropertyByPath<T = unknown>(
  obj: unknown,
  path: string
): T | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return path.split('.').reduce((acc: any, part) => acc && acc[part], obj) as T;
}

const getPersonName = (uid: string, persons: PersonType[]): string => {
  if (!uid) return '';
  const person = persons.find((p) => p.person_uid === uid);
  if (!person) return 'Unbekannt';
  return `${person.person_data.person_firstname.value} ${person.person_data.person_lastname.value}`;
};

const getSourceTitle = (key: string, source: SourceWeekType): string => {
  if (!source) return '';
  const mm = source.midweek_meeting;

  if (key.includes('TGWTalk')) return mm.tgw_talk.src['X'];
  if (key.includes('TGWGems')) return mm.tgw_gems.title['X'];
  if (key.includes('TGWBibleReading')) return mm.tgw_bible_reading.title['X'];

  if (key.includes('LCPart1')) return mm.lc_part1.title['X'];
  if (key.includes('LCPart2')) return mm.lc_part2.title['X'];
  if (key.includes('LCPart3')) return mm.lc_part3.title[0]?.value;
  if (key.includes('CBS'))
    return mm.lc_cbs.title[0]?.value || 'Versammlungsbibelstudium';

  const ayfMatch = key.match(/AYFPart(\d+)/);
  if (ayfMatch) {
    const idx = ayfMatch[1];
    const partKey = `ayf_part${idx}` as keyof typeof mm;
    const part = mm[partKey] as ApplyMinistryType;
    return part?.src['X'] || part?.title['X'] || '';
  }
  return '';
};

export const exportScheduleToCSV = (
  weeksList: SchedWeekType[],
  sources: SourceWeekType[],
  persons: PersonType[]
): string => {
  const headers = [
    'Dataview',
    'Date',
    'Code',
    'Key',
    'Description',
    'Room',
    'Name(s)',
  ];
  const rows: string[] = [headers.join(';')];

  const assignmentKeys = Object.keys(ASSIGNMENT_PATH).filter(
    (key) => !key.includes('_Assistant_')
  );

  weeksList.forEach((schedule) => {
    const source = sources.find((s) => s.weekOf === schedule.weekOf);

    assignmentKeys.forEach((key) => {
      const path = ASSIGNMENT_PATH[key as keyof typeof ASSIGNMENT_PATH];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rawData = getPropertyByPath<any>(schedule, path);

      if (!rawData) return;

      const assignmentData = (
        Array.isArray(rawData) ? rawData : [rawData]
      ) as AssignmentCongregation[];

      let code = 0;

      if (ASSIGNMENT_DEFAULTS[key]) {
        code = ASSIGNMENT_DEFAULTS[key].code;
      }

      if (key.includes('AYFPart') && source) {
        const match = key.match(/AYFPart(\d+)/);
        if (match) {
          const idx = match[1];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const part = (source.midweek_meeting as any)[`ayf_part${idx}`];

          if (part && part.type) {
            const typeVal = part.type['X'] || Object.values(part.type)[0];
            if (typeVal) code = Number(typeVal);
          }
        }
      }
      const sourceTitle = source ? getSourceTitle(key, source) : '';

      let classroom = '1';
      if (key.includes('_B') || path.includes('aux_class_1')) classroom = '2';
      if (path.includes('aux_class_2')) classroom = '3';

      const isStudentKey = key.includes('_Student_');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let assistantData: any[] = [];

      if (isStudentKey) {
        const assistantPath = path.replace('.student', '.assistant');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawAssistantData = getPropertyByPath<any>(
          schedule,
          assistantPath
        );
        if (rawAssistantData) {
          assistantData = Array.isArray(rawAssistantData)
            ? rawAssistantData
            : [rawAssistantData];
        }
      }

      assignmentData.forEach((entry: AssignmentCongregation) => {
        if (!entry.value) return;

        let nameString = getPersonName(entry.value, persons);

        if (isStudentKey) {
          const partnerEntry = assistantData.find(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (a: any) => a.type === entry.type
          );

          if (partnerEntry && partnerEntry.value) {
            const partnerName = getPersonName(partnerEntry.value, persons);
            nameString = `${nameString} / ${partnerName}`;
          }
        }

        const row = [
          entry.type,
          schedule.weekOf,
          code,
          key,
          `"${sourceTitle}"`,
          classroom,
          `"${nameString}"`,
        ];
        rows.push(row.join(';'));
      });
    });
  });

  return rows.join('\n');
};

export const handleDownloadDebugCSV = () => {
  const weeks = store.get(schedulesState);
  const sources = store.get(sourcesState);
  const persons = store.get(personsByViewState);

  const csvContent = exportScheduleToCSV(weeks, sources, persons);

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `autofill_debug_${new Date().toISOString().slice(0, 10)}.csv`
  );
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
